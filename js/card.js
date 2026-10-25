// Draws the summoner card onto a canvas. Everything happens in the browser.
import { CDRAGON, CDRAGON_GAME, DDRAGON, ROLES, THEMES, TIERS } from './data.js';

export const CARD_W = 1200;
export const CARD_H = 675;

const FONT_JP = '"M PLUS 1p", "Hiragino Sans", "Yu Gothic", sans-serif';
const FONT_EN = '"Cinzel", "M PLUS 1p", serif';

const imageCache = new Map();

export function loadImage(src) {
  if (!imageCache.has(src)) {
    imageCache.set(src, new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => {
        imageCache.delete(src);
        resolve(null);
      };
      img.src = src;
    }));
  }
  return imageCache.get(src);
}

// Position icons are SVGs with hard-coded colors, so recolor them before drawing.
const svgTextCache = new Map();
async function loadRoleIcon(role, color) {
  const key = `role:${role}:${color}`;
  if (imageCache.has(key)) return imageCache.get(key);
  const url = `${CDRAGON}/svg/position-${role}.svg`;
  if (!svgTextCache.has(url)) {
    svgTextCache.set(url, fetch(url).then((r) => (r.ok ? r.text() : '')).catch(() => ''));
  }
  const promise = svgTextCache.get(url).then((text) => {
    if (!text) return null;
    const svg = text
      .replace(/<\?xml-stylesheet[^>]*\?>/, '')
      .replace(/fill="#[0-9a-fA-F]{3,6}"/g, `fill="${color}"`);
    return loadImage(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`);
  });
  imageCache.set(key, promise);
  return promise;
}

export const champSquareUrl = (version, id) => `${DDRAGON}/cdn/${version}/img/champion/${id}.png`;
// Community Dragon has every icon, including ones Data Dragon hasn't picked up yet.
export const profileIconUrl = (id) => `${CDRAGON_GAME}/default/v1/profile-icons/${id}.jpg`;
export const splashUrl = (id, num) => `${DDRAGON}/cdn/img/champion/splash/${id}_${num}.jpg`;
const emblemUrl = (tier) => `${CDRAGON}/images/ranked-emblem/emblem-${tier.toLowerCase()}.png`;

function hexToRgba(hex, alpha) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Shrinks the font until the text fits, then truncates with an ellipsis as a last resort.
function fitText(ctx, text, maxWidth, weight, size, minSize, family = FONT_JP) {
  let s = size;
  ctx.font = `${weight} ${s}px ${family}`;
  while (ctx.measureText(text).width > maxWidth && s > minSize) {
    s -= 2;
    ctx.font = `${weight} ${s}px ${family}`;
  }
  let t = text;
  if (ctx.measureText(t).width > maxWidth) {
    while (t.length > 1 && ctx.measureText(`${t}…`).width > maxWidth) t = t.slice(0, -1);
    t = `${t}…`;
  }
  return t;
}

function wrapLines(ctx, text, maxWidth, maxLines) {
  const lines = [];
  for (const para of text.split('\n')) {
    let line = '';
    for (const ch of para) {
      if (ctx.measureText(line + ch).width > maxWidth && line) {
        lines.push(line);
        line = ch;
      } else {
        line += ch;
      }
    }
    lines.push(line);
  }
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    let last = kept[maxLines - 1];
    while (last.length > 1 && ctx.measureText(`${last}…`).width > maxWidth) last = last.slice(0, -1);
    kept[maxLines - 1] = `${last}…`;
    return kept;
  }
  return lines;
}

function drawCover(ctx, img, x, y, w, h, focusY) {
  const scale = Math.max(w / img.width, h / img.height);
  const sw = w / scale;
  const sh = h / scale;
  const sx = (img.width - sw) / 2;
  const sy = (img.height - sh) * focusY;
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

function sectionLabel(ctx, text, x, y, theme) {
  ctx.font = `700 18px ${FONT_EN}`;
  ctx.fillStyle = theme.accent;
  ctx.textAlign = 'left';
  ctx.letterSpacing = '4px';
  ctx.fillText(text, x, y);
  ctx.letterSpacing = '0px';
  const w = ctx.measureText(text).width + 4 * text.length;
  ctx.fillStyle = hexToRgba(theme.accent, 0.35);
  ctx.fillRect(x + w + 8, y - 6, 60, 1.5);
}

// Make sure the web fonts (and the unicode-range subsets for the actual text) are ready.
async function ensureFonts(state) {
  if (!document.fonts) return;
  const text = [state.name, state.tag, state.hours, state.discord, state.x, state.comment, ...state.tags, ...(state._names || [])].join('');
  const sample = `${text}0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ#.・〜`;
  await Promise.all([
    document.fonts.load(`500 24px "M PLUS 1p"`, sample),
    document.fonts.load(`700 24px "M PLUS 1p"`, sample),
    document.fonts.load(`800 24px "M PLUS 1p"`, sample),
    document.fonts.load(`700 24px "Cinzel"`, 'ROLECHAMPIONSUNRANKEDLv0123456789'),
  ]).catch(() => {});
}

export async function renderCard(canvas, state, ctxData) {
  const { version, champions } = ctxData;
  const theme = THEMES.find((t) => t.id === state.theme) || THEMES[0];
  const tier = TIERS.find((t) => t.id === state.tier) || TIERS[0];
  const champName = (id) => champions[id]?.name || id;
  state = { ...state, _names: state.champs.map(champName) };

  const iconSrc = state.iconId
    ? profileIconUrl(state.iconId)
    : state.iconChamp ? champSquareUrl(version, state.iconChamp) : null;

  const [splash, icon, emblem, champImgs, roleImgs] = await Promise.all([
    state.splashChamp ? loadImage(splashUrl(state.splashChamp, state.splashSkin)) : null,
    iconSrc ? loadImage(iconSrc) : null,
    tier.id !== 'UNRANKED' ? loadImage(emblemUrl(tier.id)) : null,
    Promise.all(state.champs.map((id) => loadImage(champSquareUrl(version, id)))),
    Promise.all(ROLES.map((r) => {
      const active = r.id === state.mainRole || state.subRoles.includes(r.id);
      return loadRoleIcon(r.id, active ? theme.accent : theme.sub);
    })),
    ensureFonts(state),
  ]);

  // Draw into an offscreen canvas first so the preview never shows a half-drawn card.
  const off = document.createElement('canvas');
  off.width = CARD_W;
  off.height = CARD_H;
  const ctx = off.getContext('2d');
  ctx.textBaseline = 'alphabetic';

  // Background
  const bgGrad = ctx.createLinearGradient(0, 0, CARD_W, CARD_H);
  bgGrad.addColorStop(0, theme.bg1);
  bgGrad.addColorStop(1, theme.bg2);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, CARD_W, CARD_H);
  if (splash) {
    drawCover(ctx, splash, 0, 0, CARD_W, CARD_H, state.splashY);
    const d = Number(state.dim);
    const shade = ctx.createLinearGradient(0, 0, CARD_W, 0);
    shade.addColorStop(0, hexToRgba(theme.bg1, Math.min(1, d + 0.3)));
    shade.addColorStop(0.55, hexToRgba(theme.bg1, d));
    shade.addColorStop(1, hexToRgba(theme.bg1, Math.max(0, d - 0.25)));
    ctx.fillStyle = shade;
    ctx.fillRect(0, 0, CARD_W, CARD_H);
    const bottom = ctx.createLinearGradient(0, CARD_H * 0.45, 0, CARD_H);
    bottom.addColorStop(0, hexToRgba(theme.bg1, 0));
    bottom.addColorStop(1, hexToRgba(theme.bg1, Math.min(1, d + 0.2)));
    ctx.fillStyle = bottom;
    ctx.fillRect(0, 0, CARD_W, CARD_H);
  } else {
    // Faint hex grid so the plain background isn't flat.
    ctx.strokeStyle = hexToRgba(theme.accent, 0.06);
    ctx.lineWidth = 1;
    const r = 34;
    for (let row = 0; row * r * 1.5 < CARD_H + r; row++) {
      for (let col = 0; col * r * Math.sqrt(3) < CARD_W + r * 2; col++) {
        const cx = col * r * Math.sqrt(3) + (row % 2 ? (r * Math.sqrt(3)) / 2 : 0);
        const cy = row * r * 1.5;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = (Math.PI / 3) * i + Math.PI / 6;
          ctx[i ? 'lineTo' : 'moveTo'](cx + r * Math.cos(a), cy + r * Math.sin(a));
        }
        ctx.closePath();
        ctx.stroke();
      }
    }
  }

  // Frame with corner diamonds
  ctx.strokeStyle = hexToRgba(theme.accent, 0.8);
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 20, CARD_W - 40, CARD_H - 40);
  ctx.fillStyle = theme.accent;
  for (const [cx, cy] of [[20, 20], [CARD_W - 20, 20], [20, CARD_H - 20], [CARD_W - 20, CARD_H - 20]]) {
    ctx.beginPath();
    ctx.moveTo(cx, cy - 8);
    ctx.lineTo(cx + 8, cy);
    ctx.lineTo(cx, cy + 8);
    ctx.lineTo(cx - 8, cy);
    ctx.closePath();
    ctx.fill();
  }

  // Icon
  const ix = 60, iy = 56, is = 150;
  ctx.save();
  if (state.iconShape === 'circle') {
    ctx.beginPath();
    ctx.arc(ix + is / 2, iy + is / 2, is / 2, 0, Math.PI * 2);
  } else {
    roundRect(ctx, ix, iy, is, is, 18);
  }
  ctx.fillStyle = theme.panel;
  ctx.fill();
  ctx.clip();
  if (icon) {
    ctx.drawImage(icon, ix, iy, is, is);
  } else {
    ctx.fillStyle = theme.accent;
    ctx.font = `800 64px ${FONT_JP}`;
    ctx.textAlign = 'center';
    ctx.fillText((state.name || '?').slice(0, 1), ix + is / 2, iy + is / 2 + 22);
  }
  ctx.restore();
  ctx.strokeStyle = theme.accent;
  ctx.lineWidth = 4;
  if (state.iconShape === 'circle') {
    ctx.beginPath();
    ctx.arc(ix + is / 2, iy + is / 2, is / 2, 0, Math.PI * 2);
  } else {
    roundRect(ctx, ix, iy, is, is, 18);
  }
  ctx.stroke();

  if (state.level) {
    const label = `Lv.${state.level}`;
    ctx.font = `700 20px ${FONT_EN}`;
    const lw = ctx.measureText(label).width + 28;
    const lx = ix + is / 2 - lw / 2, ly = iy + is - 14;
    roundRect(ctx, lx, ly, lw, 30, 15);
    ctx.fillStyle = theme.bg1;
    ctx.fill();
    ctx.strokeStyle = theme.accent;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = theme.text;
    ctx.textAlign = 'center';
    ctx.fillText(label, ix + is / 2, ly + 22);
  }

  // Name + tag
  const nx = 240;
  const nameMax = 600;
  ctx.textAlign = 'left';
  ctx.fillStyle = theme.text;
  ctx.shadowColor = theme.light ? 'transparent' : 'rgba(0,0,0,0.6)';
  ctx.shadowBlur = 8;
  const tagText = state.tag ? ` #${state.tag}` : '';
  ctx.font = `700 30px ${FONT_JP}`;
  const tagW = tagText ? ctx.measureText(tagText).width : 0;
  const nameText = fitText(ctx, state.name || 'サモナーネーム', nameMax - tagW, 800, 56, 32);
  const nameW = ctx.measureText(nameText).width;
  ctx.fillText(nameText, nx, 118);
  if (tagText) {
    ctx.font = `700 30px ${FONT_JP}`;
    ctx.fillStyle = theme.sub;
    ctx.fillText(tagText, nx + nameW, 118);
  }
  ctx.shadowBlur = 0;
  ctx.shadowColor = 'transparent';

  const line = ctx.createLinearGradient(nx, 0, nx + nameMax, 0);
  line.addColorStop(0, theme.accent);
  line.addColorStop(1, hexToRgba(theme.accent, 0));
  ctx.fillStyle = line;
  ctx.fillRect(nx, 138, nameMax, 2);

  // Info rows under the name
  const info = [];
  if (state.hours) info.push(['TIME', state.hours]);
  if (state.discord) info.push(['DISCORD', state.discord]);
  if (state.x) info.push(['X', `@${state.x.replace(/^@/, '')}`]);
  let infoY = 180;
  for (const [label, value] of info.slice(0, 3)) {
    ctx.font = `700 15px ${FONT_EN}`;
    ctx.fillStyle = theme.accent;
    ctx.fillText(label, nx, infoY);
    ctx.fillStyle = theme.text;
    const v = fitText(ctx, value, nameMax - 110, 700, 22, 16);
    ctx.fillText(v, nx + 100, infoY + 1);
    infoY += 32;
  }

  // Rank
  const rcx = 1010;
  if (emblem) {
    // The emblem PNG is 1280x720 with lots of transparent padding; crop tightly around the crest.
    const src = Math.min(emblem.width, emblem.height) * 0.5;
    ctx.drawImage(emblem, (emblem.width - src) / 2, (emblem.height - src) / 2, src, src, rcx - 100, 30, 200, 200);
  } else {
    ctx.strokeStyle = hexToRgba(theme.accent, 0.4);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(rcx, 70);
    ctx.lineTo(rcx + 60, 135);
    ctx.lineTo(rcx, 200);
    ctx.lineTo(rcx - 60, 135);
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = hexToRgba(theme.accent, 0.5);
    ctx.font = `700 40px ${FONT_EN}`;
    ctx.textAlign = 'center';
    ctx.fillText('?', rcx, 150);
  }
  ctx.textAlign = 'center';
  ctx.fillStyle = theme.text;
  const tierLabel = tier.divisions ? `${tier.label} ${state.division}` : tier.label;
  ctx.shadowColor = theme.light ? 'transparent' : 'rgba(0,0,0,0.7)';
  ctx.shadowBlur = 6;
  ctx.fillText(fitText(ctx, tierLabel, 260, 800, 30, 20), rcx, 238);
  ctx.shadowBlur = 0;
  ctx.shadowColor = 'transparent';

  // Roles
  const ry = 300;
  sectionLabel(ctx, 'ROLE', 60, 276, theme);
  ROLES.forEach((r, i) => {
    const x = 60 + i * 74;
    const isMain = r.id === state.mainRole;
    const isSub = state.subRoles.includes(r.id);
    ctx.globalAlpha = isMain || isSub ? 1 : 0.35;
    roundRect(ctx, x, ry, 62, 62, 12);
    ctx.fillStyle = isMain ? hexToRgba(theme.accent, 0.22) : theme.panel;
    ctx.fill();
    ctx.strokeStyle = isMain ? theme.accent : hexToRgba(theme.accent, isSub ? 0.6 : 0.3);
    ctx.lineWidth = isMain ? 2.5 : 1.5;
    ctx.stroke();
    if (roleImgs[i]) ctx.drawImage(roleImgs[i], x + 11, ry + 11, 40, 40);
    ctx.font = `700 15px ${FONT_EN}`;
    ctx.fillStyle = isMain || isSub ? theme.text : theme.sub;
    ctx.textAlign = 'center';
    ctx.fillText(r.label, x + 31, ry + 86);
    if (isMain) {
      ctx.font = `800 12px ${FONT_JP}`;
      const bw = 40;
      roundRect(ctx, x + 31 - bw / 2, ry - 9, bw, 18, 9);
      ctx.fillStyle = theme.accent;
      ctx.fill();
      ctx.fillStyle = theme.bg1;
      ctx.fillText('MAIN', x + 31, ry + 4);
    }
    ctx.globalAlpha = 1;
  });

  // Champions
  const cx0 = 480;
  sectionLabel(ctx, 'CHAMPIONS', cx0, 276, theme);
  const cs = 104, cgap = 20;
  for (let i = 0; i < 5; i++) {
    const x = cx0 + i * (cs + cgap);
    const id = state.champs[i];
    roundRect(ctx, x, ry - 6, cs, cs, 14);
    ctx.fillStyle = theme.panel;
    ctx.fill();
    if (id && champImgs[i]) {
      ctx.save();
      roundRect(ctx, x, ry - 6, cs, cs, 14);
      ctx.clip();
      ctx.drawImage(champImgs[i], x - 4, ry - 10, cs + 8, cs + 8);
      ctx.restore();
    }
    roundRect(ctx, x, ry - 6, cs, cs, 14);
    ctx.strokeStyle = id ? theme.accent : hexToRgba(theme.accent, 0.25);
    ctx.lineWidth = id ? 2 : 1.5;
    ctx.stroke();
    if (id) {
      ctx.fillStyle = theme.text;
      ctx.textAlign = 'center';
      ctx.fillText(fitText(ctx, champName(id), cs + 14, 700, 17, 12), x + cs / 2, ry + 124);
    }
  }

  // Tags
  ctx.textAlign = 'left';
  let tx = 60;
  const ty = 452;
  ctx.font = `700 19px ${FONT_JP}`;
  const tagsShown = [];
  for (const tag of state.tags) {
    const w = ctx.measureText(tag).width + 32;
    if (tx + w > CARD_W - 60) break;
    tagsShown.push([tag, tx, w]);
    tx += w + 10;
  }
  for (const [tag, x, w] of tagsShown) {
    roundRect(ctx, x, ty, w, 38, 19);
    ctx.fillStyle = hexToRgba(theme.accent, 0.16);
    ctx.fill();
    ctx.strokeStyle = hexToRgba(theme.accent, 0.7);
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = theme.text;
    ctx.font = `700 19px ${FONT_JP}`;
    ctx.fillText(tag, x + 16, ty + 26);
  }

  // Comment
  if (state.comment) {
    const bx = 60, by = 512, bw = CARD_W - 120, bh = 112;
    roundRect(ctx, bx, by, bw, bh, 14);
    ctx.fillStyle = theme.panel;
    ctx.fill();
    ctx.strokeStyle = hexToRgba(theme.accent, 0.35);
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = theme.accent;
    ctx.fillRect(bx, by + 16, 4, bh - 32);
    ctx.font = `500 25px ${FONT_JP}`;
    ctx.fillStyle = theme.text;
    const lines = wrapLines(ctx, state.comment, bw - 56, 2);
    const lh = 38;
    const startY = by + bh / 2 - ((lines.length - 1) * lh) / 2 + 9;
    lines.forEach((l, i) => ctx.fillText(l, bx + 30, startY + i * lh));
  }

  // Watermark
  ctx.font = `700 13px ${FONT_EN}`;
  ctx.fillStyle = hexToRgba(theme.text, 0.45);
  ctx.textAlign = 'right';
  ctx.fillText('SUMMONER CARD', CARD_W - 32, CARD_H - 30);

  canvas.width = CARD_W;
  canvas.height = CARD_H;
  canvas.getContext('2d').drawImage(off, 0, 0);
}
