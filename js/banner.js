// Promo banner (3:1) that shows the user's card next to the site name and URL.
// People can put it on stream overlays, Twitch panels, profiles or personal sites.
import { THEMES } from './data.js';
import { t, withCjk } from './i18n.js';

export const BANNER_W = 1800;
export const BANNER_H = 600;

const SERIF = '"Cinzel", "M PLUS 1p", serif';
const JP = withCjk('"M PLUS 1p", "Hiragino Sans", "Yu Gothic", sans-serif');
const ROUNDED = withCjk('"M PLUS Rounded 1c", "M PLUS 1p", sans-serif');

function hexToRgba(hex, alpha) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
}

function diamond(ctx, x, y, s) {
  ctx.beginPath();
  ctx.moveTo(x, y - s);
  ctx.lineTo(x + s, y);
  ctx.lineTo(x, y + s);
  ctx.lineTo(x - s, y);
  ctx.closePath();
}

function sparkle(ctx, x, y, s, color) {
  ctx.beginPath();
  ctx.moveTo(x, y - s);
  ctx.quadraticCurveTo(x, y, x + s, y);
  ctx.quadraticCurveTo(x, y, x, y + s);
  ctx.quadraticCurveTo(x, y, x - s, y);
  ctx.quadraticCurveTo(x, y, x, y - s);
  ctx.fillStyle = color;
  ctx.fill();
}

// Ring with a crystal in the middle; the pastel version gets small wings.
function drawEmblem(ctx, cx, cy, r, theme, fairy) {
  ctx.save();
  if (fairy) {
    for (const dir of [-1, 1]) {
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.ellipse(cx + dir * (r + 14 + i * 4), cy + 10 + i * 16, 30 - i * 6, 14 - i * 2, dir * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.strokeStyle = hexToRgba(theme.line || theme.accent, 0.8);
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }
    }
  }
  const ring = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
  if (fairy) {
    ring.addColorStop(0, '#ffffff');
    ring.addColorStop(1, theme.accent);
  } else {
    ring.addColorStop(0, '#f6e2b0');
    ring.addColorStop(0.5, theme.accent);
    ring.addColorStop(1, '#7a5a26');
  }
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = fairy ? 'rgba(255,255,255,0.9)' : theme.bg1;
  ctx.fill();
  ctx.lineWidth = 10;
  ctx.strokeStyle = ring;
  ctx.stroke();
  if (fairy) {
    ctx.setLineDash([3, 8]);
    ctx.lineWidth = 2;
    ctx.strokeStyle = theme.accent;
    ctx.beginPath();
    ctx.arc(cx, cy, r - 14, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  // Crystal
  const crystal = ctx.createLinearGradient(cx - 30, cy - r * 0.7, cx + 30, cy + r * 0.7);
  crystal.addColorStop(0, '#e4f6ff');
  crystal.addColorStop(0.5, fairy ? '#a9c8f7' : '#2f8ff0');
  crystal.addColorStop(1, fairy ? '#c6b3f3' : '#0b3d8c');
  ctx.beginPath();
  ctx.moveTo(cx, cy - r * 0.68);
  ctx.lineTo(cx + r * 0.3, cy);
  ctx.lineTo(cx, cy + r * 0.68);
  ctx.lineTo(cx - r * 0.3, cy);
  ctx.closePath();
  ctx.fillStyle = crystal;
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.8)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx, cy - r * 0.68);
  ctx.lineTo(cx, cy + r * 0.68);
  ctx.strokeStyle = 'rgba(255,255,255,0.45)';
  ctx.stroke();
  // Small marks above and below
  ctx.fillStyle = fairy ? theme.gold : theme.accent;
  if (fairy) {
    sparkle(ctx, cx, cy - r - 18, 16, theme.gold);
  } else {
    diamond(ctx, cx, cy - r - 8, 12);
    ctx.fill();
    diamond(ctx, cx, cy + r + 8, 12);
    ctx.fill();
  }
  ctx.restore();
}

// Shrinks the font size until `text` fits in maxWidth.
function fitFont(ctx, text, weight, size, family, maxWidth) {
  let s = size;
  ctx.font = `${weight} ${s}px ${family}`;
  while (ctx.measureText(text).width > maxWidth && s > 20) {
    s -= 2;
    ctx.font = `${weight} ${s}px ${family}`;
  }
  return s;
}

/**
 * Draws the promo banner. `card` is the already rendered card canvas (1200x675).
 * Returns a new canvas of BANNER_W x BANNER_H.
 */
export function renderBanner(card, state, siteLabel) {
  const theme = THEMES.find((t) => t.id === state.theme) || THEMES[0];
  // Light themes get the pastel banner style; dark themes the gold-on-navy one.
  const fairy = Boolean(theme.light);
  const c = document.createElement('canvas');
  c.width = BANNER_W;
  c.height = BANNER_H;
  const ctx = c.getContext('2d');

  // Background: the card itself, enlarged and blurred, then shaded so the left text reads well.
  ctx.fillStyle = theme.bg1;
  ctx.fillRect(0, 0, BANNER_W, BANNER_H);
  ctx.save();
  ctx.filter = 'blur(10px)';
  const scale = (BANNER_W * 1.1) / card.width;
  const bw = card.width * scale;
  const bh = card.height * scale;
  ctx.drawImage(card, (BANNER_W - bw) / 2, (BANNER_H - bh) / 2, bw, bh);
  ctx.restore();
  const shade = ctx.createLinearGradient(0, 0, BANNER_W, 0);
  shade.addColorStop(0, hexToRgba(theme.bg1, fairy ? 0.88 : 0.92));
  shade.addColorStop(0.5, hexToRgba(theme.bg1, fairy ? 0.6 : 0.7));
  shade.addColorStop(1, hexToRgba(theme.bg1, fairy ? 0.35 : 0.45));
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, BANNER_W, BANNER_H);

  // Frame
  ctx.save();
  if (fairy) {
    ctx.lineWidth = 3;
    ctx.strokeStyle = hexToRgba(theme.line || theme.accent, 0.6);
    ctx.setLineDash([3, 9]);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.roundRect(22, 22, BANNER_W - 44, BANNER_H - 44, 26);
    ctx.stroke();
    ctx.setLineDash([]);
    for (const [x, y, s, col] of [[90, 80, 16, theme.gold], [1000, 70, 12, '#ffffff'], [70, 520, 12, theme.accent], [980, 540, 10, '#ffffff']]) sparkle(ctx, x, y, s, col);
  } else {
    ctx.lineWidth = 2;
    ctx.strokeStyle = hexToRgba(theme.accent, 0.7);
    ctx.strokeRect(22, 22, BANNER_W - 44, BANNER_H - 44);
    ctx.fillStyle = theme.accent;
    for (const [x, y] of [[22, 22], [BANNER_W - 22, 22], [22, BANNER_H - 22], [BANNER_W - 22, BANNER_H - 22]]) {
      diamond(ctx, x, y, 8);
      ctx.fill();
    }
  }
  ctx.restore();

  // Card on the right, slightly tilted with a soft shadow.
  const cw = 820;
  const ch = (card.height / card.width) * cw;
  ctx.save();
  ctx.translate(1340, 300);
  ctx.rotate(0.035);
  ctx.shadowColor = fairy ? 'rgba(120,90,170,0.35)' : 'rgba(0,0,0,0.7)';
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 16;
  ctx.beginPath();
  ctx.roundRect(-cw / 2, -ch / 2, cw, ch, 14);
  ctx.fillStyle = theme.bg1;
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.clip();
  ctx.drawImage(card, -cw / 2, -ch / 2, cw, ch);
  ctx.restore();
  ctx.save();
  ctx.translate(1340, 300);
  ctx.rotate(0.035);
  ctx.beginPath();
  ctx.roundRect(-cw / 2, -ch / 2, cw, ch, 14);
  ctx.lineWidth = 3;
  ctx.strokeStyle = fairy ? '#ffffff' : hexToRgba(theme.accent, 0.8);
  ctx.stroke();
  ctx.restore();

  // Emblem + title
  drawEmblem(ctx, 175, 210, 82, theme, fairy);
  const titleX = 300;
  const titleMax = 600;
  const titleFamily = fairy ? ROUNDED : SERIF;
  const titleWeight = fairy ? 800 : 700;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  const s1 = fitFont(ctx, 'SUMMONER', titleWeight, 118, titleFamily, titleMax);
  const g1 = ctx.createLinearGradient(0, 120, 0, 240);
  if (fairy) {
    g1.addColorStop(0, '#9fb6f7');
    g1.addColorStop(1, theme.accent2 || '#a990e0');
  } else {
    g1.addColorStop(0, '#ffffff');
    g1.addColorStop(0.6, '#c9ced8');
    g1.addColorStop(1, '#8c93a3');
  }
  ctx.fillStyle = g1;
  ctx.shadowColor = fairy ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.6)';
  ctx.shadowBlur = fairy ? 0 : 12;
  if (fairy) {
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#ffffff';
    ctx.lineJoin = 'round';
    ctx.strokeText('SUMMONER', titleX, 230);
  }
  ctx.fillText('SUMMONER', titleX, 230);
  const summonerW = ctx.measureText('SUMMONER').width;

  ctx.font = `${titleWeight} ${Math.round(s1 * 1.02)}px ${titleFamily}`;
  const cardW = ctx.measureText('CARD').width;
  const cardX = titleX + (summonerW - cardW) / 2;
  const g2 = ctx.createLinearGradient(0, 260, 0, 360);
  if (fairy) {
    g2.addColorStop(0, '#ffb3d1');
    g2.addColorStop(1, theme.accent);
  } else {
    g2.addColorStop(0, '#fbe7b5');
    g2.addColorStop(0.5, theme.accent);
    g2.addColorStop(1, '#8a6a2e');
  }
  if (fairy) ctx.strokeText('CARD', cardX, 350);
  ctx.fillStyle = g2;
  ctx.fillText('CARD', cardX, 350);
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  // Decorative lines on both sides of CARD
  ctx.strokeStyle = fairy ? hexToRgba(theme.line || theme.accent, 0.7) : theme.accent;
  ctx.lineWidth = 2;
  for (const [x1, x2] of [[titleX, cardX - 24], [cardX + cardW + 24, titleX + summonerW]]) {
    if (x2 - x1 < 30) continue;
    for (const dy of [-6, 0, 6]) {
      ctx.globalAlpha = dy === 0 ? 1 : 0.5;
      ctx.beginPath();
      ctx.moveTo(x1, 312 + dy);
      ctx.lineTo(x2, 312 + dy);
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;

  // Tagline
  const centerX = 480;
  ctx.textAlign = 'center';
  ctx.fillStyle = fairy ? theme.text : '#ece6da';
  ctx.font = `${fairy ? 800 : 500} 42px ${fairy ? ROUNDED : JP}`;
  ctx.letterSpacing = '4px';
  ctx.fillText(t('banner.tagline'), centerX, 418);
  ctx.letterSpacing = '0px';

  // Call-to-action button with the URL under it
  const btnW = 460;
  const btnH = 80;
  const btnY = 448;
  ctx.beginPath();
  ctx.roundRect(centerX - btnW / 2, btnY, btnW, btnH, btnH / 2);
  const btn = ctx.createLinearGradient(centerX - btnW / 2, 0, centerX + btnW / 2, 0);
  if (fairy) {
    btn.addColorStop(0, '#9fb6f7');
    btn.addColorStop(1, '#c6a8f3');
  } else {
    btn.addColorStop(0, '#0e2240');
    btn.addColorStop(1, '#16335c');
  }
  ctx.fillStyle = btn;
  ctx.shadowColor = fairy ? 'rgba(150,120,220,0.4)' : 'rgba(200,170,110,0.35)';
  ctx.shadowBlur = 24;
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.lineWidth = 3;
  ctx.strokeStyle = fairy ? '#ffffff' : theme.accent;
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.font = `800 40px ${fairy ? ROUNDED : JP}`;
  ctx.fillText(t('banner.cta'), centerX, btnY + 54);
  ctx.font = `700 22px ${fairy ? ROUNDED : JP}`;
  ctx.fillStyle = fairy ? theme.sub : hexToRgba('#ece6da', 0.75);
  ctx.fillText(siteLabel, centerX, btnY + btnH + 34);

  return c;
}
