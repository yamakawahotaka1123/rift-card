// Draws the summoner card onto a canvas. Everything happens in the browser.
import { CDRAGON, CDRAGON_GAME, DDRAGON, ROLE_LEVELS, ROLES, THEMES, TIERS } from './data.js';
import { DECOS } from './decos.js';
import { CJK_FAMILY, levelBadge, t, tagName, tierName, withCjk } from './i18n.js';

export const CARD_W = 1200;
export const CARD_H = 675;
export const SITE_URL = 'https://summonercard.com/';
const SITE_URL_SHORT = 'summonercard.com';

// Default fonts; a theme's decoration set (decos.js) can replace them.
// FONT_EN is for small labels, FONT_TITLE for section titles.
const DEFAULT_FONTS = {
  jp: '"M PLUS 1p", "Hiragino Sans", "Yu Gothic", sans-serif',
  en: '"Cinzel", "M PLUS 1p", serif',
  title: '"Cinzel", "M PLUS 1p", serif',
};
// Set once per render, right before the synchronous drawing pass.
let FONT_JP = DEFAULT_FONTS.jp;
let FONT_EN = DEFAULT_FONTS.en;
let FONT_TITLE = DEFAULT_FONTS.title;

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

// A few Data Dragon splashes live under a different file name (e.g. "FiddleSticks_27"),
// so fall back to the path Community Dragon lists for that skin.
const cdragonChampCache = new Map();
export async function loadSplash(id, key, num) {
  const img = await loadImage(splashUrl(id, num));
  if (img || !key) return img;
  if (!cdragonChampCache.has(key)) {
    cdragonChampCache.set(key, fetch(`${CDRAGON_GAME}/default/v1/champions/${key}.json`)
      .then((r) => r.json())
      .catch(() => null));
  }
  const data = await cdragonChampCache.get(key);
  const skin = data?.skins?.find((s) => s.id === Number(key) * 1000 + Number(num));
  const path = skin?.uncenteredSplashPath || skin?.splashPath;
  if (!path) return null;
  return loadImage(`${CDRAGON_GAME}/default/${path.replace('/lol-game-data/assets/', '').toLowerCase()}`);
}
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

// Draws the image at "cover" size times `zoom`, centered and then shifted by
// offX/offY (fractions of the card's width/height). The image may move past the
// card edges, leaving the theme background visible.
function drawPlaced(ctx, img, w, h, offX, offY, zoom = 1) {
  const scale = Math.max(w / img.width, h / img.height) * zoom;
  const dw = img.width * scale;
  const dh = img.height * scale;
  ctx.drawImage(img, (w - dw) / 2 + offX * w, (h - dh) / 2 + offY * h, dw, dh);
}

function sectionLabel(ctx, text, x, y, theme) {
  ctx.textAlign = 'left';
  const deco = DECOS[theme.deco];
  if (deco?.label) {
    deco.label(ctx, text, x, y, theme, { jp: FONT_JP, en: FONT_EN, title: FONT_TITLE });
    return;
  }
  ctx.font = `700 18px ${FONT_TITLE}`;
  ctx.fillStyle = theme.accent;
  ctx.letterSpacing = '4px';
  ctx.fillText(text, x, y);
  ctx.letterSpacing = '0px';
  const w = ctx.measureText(text).width + 4 * text.length;
  ctx.fillStyle = hexToRgba(theme.accent, 0.35);
  ctx.fillRect(x + w + 8, y - 6, 60, 1.5);
}

// Make sure the web fonts (and the unicode-range subsets for the actual text) are ready.
async function ensureFonts(state, theme) {
  if (!document.fonts) return;
  const extra = DECOS[theme.deco]?.fonts?.load || [];
  const text = [state.name, state.tag, state.hours, state.discord, state.x, state.twitch, state.youtube, state.comment, ...state.tags.map(tagName), tierName(TIERS.find((x) => x.id === state.tier) || TIERS[0]), ...(state._names || [])].join('');
  const sample = `${text}0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ#.・〜`;
  // Don't let a slow font download block the preview; the app redraws when fonts finish loading.
  await Promise.race([
    Promise.all([
      document.fonts.load(`500 24px "M PLUS 1p"`, sample),
      document.fonts.load(`700 24px "M PLUS 1p"`, sample),
      document.fonts.load(`800 24px "M PLUS 1p"`, sample),
      document.fonts.load(`700 24px "Cinzel"`, 'ROLECHAMPIONSUNRANKEDLv0123456789'),
      ...(CJK_FAMILY ? [500, 700, 800].map((w) => document.fonts.load(`${w} 24px ${CJK_FAMILY}`, sample)) : []),
      ...extra.map((f) => document.fonts.load(f, `${sample}Role Main Favorite Champions Summoner Card`)),
    ]).catch(() => {}),
    new Promise((resolve) => setTimeout(resolve, 1500)),
  ]);
}

export async function renderCard(canvas, state, ctxData) {
  const { version, champions } = ctxData;
  const theme = THEMES.find((t) => t.id === state.theme) || THEMES[0];
  const tier = TIERS.find((t) => t.id === state.tier) || TIERS[0];
  const champName = (id) => champions[id]?.name || id;
  state = { ...state, _names: state.champs.map((c) => champName(c.id)) };

  const iconSrc = state.iconUpload
    || (state.iconId ? profileIconUrl(state.iconId) : null)
    || (state.iconChamp ? champSquareUrl(version, state.iconChamp) : null);

  const [splash, icon, emblem, champImgs, roleImgs, badgeImgs] = await Promise.all([
    state.bgUpload ? loadImage(state.bgUpload)
      : state.splashChamp ? loadSplash(state.splashChamp, champions[state.splashChamp]?.key, state.splashSkin) : null,
    iconSrc ? loadImage(iconSrc) : null,
    tier.id !== 'UNRANKED' ? loadImage(emblemUrl(tier.id)) : null,
    Promise.all(state.champs.map((c) => loadImage(c.img || champSquareUrl(version, c.id)))),
    Promise.all(ROLES.map((r) => {
      const level = state.roleLevels?.[r.id];
      const active = level === 'main' || level === 'sub' || level === 'normal';
      return loadRoleIcon(r.id, active ? theme.accent : theme.sub);
    })),
    Promise.all(state.champs.map((c) => (c.role ? loadRoleIcon(c.role, theme.accent) : null))),
    ensureFonts(state, theme),
  ]);

  const deco = DECOS[theme.deco] || {};
  const fonts = deco.fonts || DEFAULT_FONTS;
  FONT_JP = withCjk(fonts.jp);
  FONT_EN = withCjk(fonts.en);
  FONT_TITLE = withCjk(fonts.title);

  // Draw into an offscreen canvas first so the preview never shows a half-drawn card.
  const off = document.createElement('canvas');
  off.width = CARD_W;
  off.height = CARD_H;
  const ctx = off.getContext('2d');
  ctx.textBaseline = 'alphabetic';

  // Background
  const bgGrad = deco.vertical ? ctx.createLinearGradient(0, 0, 0, CARD_H) : ctx.createLinearGradient(0, 0, CARD_W, CARD_H);
  const stops = theme.bgStops || [theme.bg1, theme.bg2];
  stops.forEach((c, i) => bgGrad.addColorStop(i / (stops.length - 1), c));
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, CARD_W, CARD_H);
  if (splash) {
    drawPlaced(ctx, splash, CARD_W, CARD_H, Number(state.bgOffX || 0), Number(state.bgOffY || 0), Number(state.bgZoom || 1));
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
  }
  if (deco.backdrop) {
    deco.backdrop(ctx, CARD_W, CARD_H, theme, Boolean(splash));
  } else if (!splash) {
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

  if (deco.frame) {
    // Drawn under the content, so corner art never covers text or images.
    deco.frame(ctx, CARD_W, CARD_H, theme);
  } else {
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
  deco.iconDeco?.(ctx, ix + is / 2, iy + is / 2, is / 2, theme);

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
  ctx.shadowColor = deco.nameGlow || (theme.light ? 'transparent' : 'rgba(0,0,0,0.6)');
  ctx.shadowBlur = deco.nameGlow ? 18 : 8;
  const tagText = state.tag ? ` #${state.tag}` : '';
  ctx.font = `700 30px ${FONT_JP}`;
  const tagW = tagText ? ctx.measureText(tagText).width : 0;
  const nameText = fitText(ctx, state.name || t('card.name'), nameMax - tagW, 800, 56, 32);
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
  const contacts = [];
  if (state.discord) contacts.push(['DISCORD', state.discord]);
  if (state.x) contacts.push(['X', `@${state.x.replace(/^@/, '')}`]);
  if (state.twitch) contacts.push(['TWITCH', state.twitch]);
  if (state.youtube) contacts.push(['YOUTUBE', `@${state.youtube.replace(/^@/, '')}`]);
  const drawInfo = (label, value, x, y, width) => {
    ctx.font = `700 15px ${FONT_EN}`;
    ctx.fillStyle = theme.accent;
    ctx.fillText(label, x, y);
    const labelW = Math.max(100, ctx.measureText(label).width + 14);
    ctx.fillStyle = theme.text;
    ctx.fillText(fitText(ctx, value, width - labelW - 10, 700, 22, 14), x + labelW, y + 1);
  };
  // Up to 3 rows fit here: one item per row when there's room, otherwise
  // the time gets its own row and contacts go two per row.
  const rows = [];
  if (state.hours) rows.push([['TIME', state.hours]]);
  if (rows.length + contacts.length <= 3) {
    for (const c of contacts) rows.push([c]);
  } else {
    for (let i = 0; i < contacts.length; i += 2) rows.push(contacts.slice(i, i + 2));
  }
  rows.slice(0, 3).forEach((row, r) => {
    const y = 180 + r * 32;
    const colW = nameMax / row.length;
    row.forEach(([label, value], c) => drawInfo(label, value, nx + c * colW, y, colW));
  });

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
  const tierLabel = tier.divisions ? `${tierName(tier)} ${state.division}` : tierName(tier);
  ctx.shadowColor = theme.light ? 'transparent' : 'rgba(0,0,0,0.7)';
  ctx.shadowBlur = 6;
  ctx.fillText(fitText(ctx, tierLabel, 260, 800, 30, 20), rcx, 238);
  ctx.shadowBlur = 0;
  ctx.shadowColor = 'transparent';

  // Roles
  const ry = 300;
  sectionLabel(ctx, 'ROLE', 60, 276, theme);
  const NG_COLOR = '#d9605a';
  // Box opacity, fill, border and badge style for each willingness level.
  const ROLE_STYLE = {
    main: { alpha: 1, fill: hexToRgba(theme.accent, 0.22), stroke: theme.accent, width: 2.5 },
    sub: { alpha: 1, fill: theme.panel, stroke: hexToRgba(theme.accent, 0.65), width: 1.8 },
    normal: { alpha: 0.8, fill: theme.panel, stroke: hexToRgba(theme.accent, 0.35), width: 1.5 },
    ng: { alpha: 0.6, fill: theme.panel, stroke: hexToRgba(NG_COLOR, 0.5), width: 1.5 },
    none: { alpha: 0.3, fill: theme.panel, stroke: hexToRgba(theme.accent, 0.3), width: 1.5 },
  };
  ROLES.forEach((r, i) => {
    const x = 60 + i * 74;
    const levelId = state.roleLevels?.[r.id] || 'none';
    const level = ROLE_LEVELS.find((l) => l.id === levelId);
    const style = ROLE_STYLE[levelId];
    ctx.globalAlpha = style.alpha;
    roundRect(ctx, x, ry, 62, 62, 12);
    ctx.fillStyle = style.fill;
    ctx.fill();
    ctx.strokeStyle = style.stroke;
    ctx.lineWidth = style.width;
    ctx.stroke();
    if (roleImgs[i]) ctx.drawImage(roleImgs[i], x + 11, ry + 11, 40, 40);
    if (levelId === 'ng') {
      ctx.strokeStyle = hexToRgba(NG_COLOR, 0.85);
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x + 12, ry + 50);
      ctx.lineTo(x + 50, ry + 12);
      ctx.stroke();
      ctx.lineCap = 'butt';
    }
    ctx.font = `700 15px ${FONT_EN}`;
    ctx.fillStyle = levelId === 'main' || levelId === 'sub' ? theme.text : theme.sub;
    ctx.textAlign = 'center';
    ctx.fillText(r.label, x + 31, ry + 86);
    ctx.globalAlpha = 1;
    if (level) {
      ctx.font = `800 12px ${FONT_JP}`;
      const bw = Math.max(36, ctx.measureText(levelBadge(level)).width + 14);
      roundRect(ctx, x + 31 - bw / 2, ry - 9, bw, 18, 9);
      const filled = levelId === 'main' || levelId === 'ng';
      const color = levelId === 'ng' ? NG_COLOR : levelId === 'normal' ? theme.sub : theme.accent;
      ctx.fillStyle = filled ? color : theme.bg1;
      ctx.fill();
      if (!filled) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      ctx.fillStyle = filled ? (levelId === 'ng' ? '#ffffff' : theme.bg1) : color;
      ctx.fillText(levelBadge(level), x + 31, ry + 4);
    }
  });

  // Champions
  const cx0 = 480;
  sectionLabel(ctx, state.champLabel === 'fav' ? 'FAVORITE CHAMPIONS' : 'MAIN CHAMPIONS', cx0, 276, theme);
  const cs = 104, cgap = 20;
  for (let i = 0; i < 5; i++) {
    const x = cx0 + i * (cs + cgap);
    const id = state.champs[i]?.id;
    roundRect(ctx, x, ry - 6, cs, cs, 14);
    ctx.fillStyle = theme.panel;
    ctx.fill();
    if (id && champImgs[i]) {
      ctx.save();
      roundRect(ctx, x, ry - 6, cs, cs, 14);
      ctx.clip();
      // Data Dragon squares have a thin dark border, so overscan them slightly; crops are drawn as-is.
      if (state.champs[i].img) ctx.drawImage(champImgs[i], x, ry - 6, cs, cs);
      else ctx.drawImage(champImgs[i], x - 4, ry - 10, cs + 8, cs + 8);
      ctx.restore();
    }
    roundRect(ctx, x, ry - 6, cs, cs, 14);
    ctx.strokeStyle = id ? theme.accent : hexToRgba(theme.accent, 0.25);
    ctx.lineWidth = id ? 2 : 1.5;
    ctx.stroke();
    if (id && badgeImgs[i]) {
      const bx = x + cs - 8, by = ry - 6 + cs - 8;
      ctx.beginPath();
      ctx.arc(bx, by, 18, 0, Math.PI * 2);
      ctx.fillStyle = theme.bg1;
      ctx.fill();
      ctx.strokeStyle = theme.accent;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.drawImage(badgeImgs[i], bx - 12, by - 12, 24, 24);
    }
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
  for (const tag of state.tags.map(tagName)) {
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
    // Some themes keep the bottom-right corner free for their corner art.
    const bx = 60, by = 512, bw = CARD_W - 120 - (deco.commentRight || 0), bh = 112;
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

  // Watermark: site name, plus the URL so people who see a shared card can find the site.
  ctx.textAlign = 'right';
  const credit = state.showCredit !== false ? SITE_URL_SHORT : '';
  if (deco.watermark) {
    deco.watermark(ctx, CARD_W, CARD_H, theme, credit, fonts);
  } else {
    ctx.font = `700 13px ${FONT_EN}`;
    ctx.fillStyle = hexToRgba(theme.text, 0.5);
    ctx.fillText(credit ? `SUMMONER CARD · ${credit}` : 'SUMMONER CARD', CARD_W - (deco.watermarkRight || 32), CARD_H - 30);
  }

  canvas.width = CARD_W;
  canvas.height = CARD_H;
  canvas.getContext('2d').drawImage(off, 0, 0);
}
