// Per-theme decoration sets. A theme picks one with `deco: '<name>'` in data.js.
// Every hook is optional; the card renderer falls back to the default look.
//   fonts      { jp, en, title, load: [font specs to preload], titleSample }
//   vertical   background gradient runs top-to-bottom instead of diagonally
//   backdrop(ctx, W, H, theme, hasImage)   behind everything
//   frame(ctx, W, H, theme)                border + corner art, still under the content
//   iconDeco(ctx, cx, cy, r, theme)        on top of the icon ring
//   label(ctx, text, x, y, theme, fonts)   section titles ("ROLE", "MAIN CHAMPIONS")
//   nameGlow   color for a glow behind the name
//   commentRight  pixels reserved on the right of the comment box for corner art
//   watermarkRight  distance of the default watermark from the right edge (default 32)
//   watermark(ctx, W, H, theme, credit, fonts)
import {
  drawFairyBackdrop, drawFairyCorners, drawFairyFrame, drawIconBandage, drawUnicornHorn,
} from './fairy.js';

const ROUNDED = '"M PLUS Rounded 1c", "M PLUS 1p", "Hiragino Maru Gothic ProN", sans-serif';
const SCRIPT = '"Dancing Script", cursive';
const MINCHO = '"Shippori Mincho", "Yu Mincho", "Hiragino Mincho ProN", serif';

function rgba(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

function rng(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Areas where text and images sit; scattered decorations avoid them.
const KEEP_OUT = [
  [50, 30, 225, 235], [225, 40, 870, 260], [880, 20, 1150, 255],
  [50, 255, 440, 405], [465, 255, 1105, 440], [50, 440, 640, 500], [50, 500, 1150, 635],
];
const isFree = (x, y, pad = 12) => !KEEP_OUT.some(([x1, y1, x2, y2]) => x > x1 - pad && x < x2 + pad && y > y1 - pad && y < y2 + pad);

function scatter(seed, count, W, H, draw) {
  const rand = rng(seed);
  for (let i = 0, placed = 0; placed < count && i < 600; i++) {
    const x = 26 + rand() * (W - 52), y = 26 + rand() * (H - 52);
    if (!isFree(x, y)) continue;
    placed++;
    draw(x, y, rand);
  }
}

// ---------- Shapes ----------

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

function heart(ctx, x, y, s) {
  ctx.beginPath();
  ctx.moveTo(x, y + s * 0.42);
  ctx.bezierCurveTo(x - s * 1.15, y - s * 0.3, x - s * 0.5, y - s * 1.1, x, y - s * 0.45);
  ctx.bezierCurveTo(x + s * 0.5, y - s * 1.1, x + s * 1.15, y - s * 0.3, x, y + s * 0.42);
  ctx.closePath();
}

function cross(ctx, x, y, s, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x - s * 0.14, y - s, s * 0.28, s * 2);
  ctx.fillRect(x - s * 0.6, y - s * 0.45, s * 1.2, s * 0.28);
}

// Ribbon bow centered on (x, y); s is roughly half its width.
function bow(ctx, x, y, s, fill, line, rot = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.lineWidth = Math.max(2, s * 0.08);
  ctx.strokeStyle = line;
  ctx.lineJoin = 'round';
  // Tails
  for (const dir of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(dir * s * 0.08, s * 0.1);
    ctx.lineTo(dir * s * 0.45, s * 0.95);
    ctx.lineTo(dir * s * 0.25, s * 0.85);
    ctx.lineTo(dir * s * 0.12, s * 1.0);
    ctx.lineTo(-dir * s * 0.02, s * 0.15);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.stroke();
  }
  // Loops
  for (const dir of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(dir * s * 0.5, -s * 0.75, dir * s * 1.15, -s * 0.45, dir * s * 1.0, 0);
    ctx.bezierCurveTo(dir * s * 1.15, s * 0.45, dir * s * 0.5, s * 0.55, 0, 0);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.stroke();
    // Fold line
    ctx.beginPath();
    ctx.moveTo(dir * s * 0.25, -s * 0.05);
    ctx.quadraticCurveTo(dir * s * 0.6, -s * 0.05, dir * s * 0.75, s * 0.15);
    ctx.stroke();
  }
  // Knot
  ctx.beginPath();
  ctx.ellipse(0, 0, s * 0.2, s * 0.24, 0, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function pearl(ctx, x, y, r) {
  const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.1, x, y, r);
  g.addColorStop(0, '#ffffff');
  g.addColorStop(0.7, '#f6e9ee');
  g.addColorStop(1, '#d9c3cc');
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = g;
  ctx.fill();
}

// Scalloped lace border around a rounded rectangle at inset `m`.
function laceFrame(ctx, W, H, m, color, holes) {
  const r = 10, step = 20;
  ctx.fillStyle = color;
  const edge = (x, y) => {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  };
  for (let x = m; x <= W - m; x += step) { edge(x, m); edge(x, H - m); }
  for (let y = m; y <= H - m; y += step) { edge(m, y); edge(W - m, y); }
  ctx.fillStyle = holes;
  const hole = (x, y) => {
    ctx.beginPath();
    ctx.arc(x, y, 2.4, 0, Math.PI * 2);
    ctx.fill();
  };
  for (let x = m; x <= W - m; x += step) { hole(x, m - 4); hole(x, H - m + 4); }
  for (let y = m; y <= H - m; y += step) { hole(m - 4, y); hole(W - m + 4, y); }
}

function chromeStar(ctx, x, y, s, rot = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const rad = i % 2 ? s * 0.32 : s;
    const a = (Math.PI / 4) * i - Math.PI / 2;
    ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
  }
  ctx.closePath();
  const g = ctx.createLinearGradient(-s, -s, s, s);
  g.addColorStop(0, '#ffffff');
  g.addColorStop(0.35, '#b9c2d6');
  g.addColorStop(0.5, '#ffffff');
  g.addColorStop(0.7, '#8d97ad');
  g.addColorStop(1, '#eef2fb');
  ctx.fillStyle = g;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#5b5f86';
  ctx.stroke();
  ctx.restore();
}

function smiley(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = '#ffe14d';
  ctx.fill();
  ctx.lineWidth = Math.max(2, r * 0.12);
  ctx.strokeStyle = '#2a2350';
  ctx.stroke();
  ctx.fillStyle = '#2a2350';
  for (const dx of [-0.33, 0.33]) {
    ctx.beginPath();
    ctx.ellipse(x + dx * r, y - r * 0.2, r * 0.1, r * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(x, y + r * 0.05, r * 0.55, 0.2 * Math.PI, 0.8 * Math.PI);
  ctx.stroke();
}

function butterfly(ctx, x, y, s, color, rot = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.fillStyle = color;
  ctx.strokeStyle = '#2a2350';
  ctx.lineWidth = 1.5;
  for (const dir of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(dir * s * 0.5, -s * 0.25, s * 0.55, s * 0.4, dir * -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(dir * s * 0.4, s * 0.35, s * 0.35, s * 0.28, dir * 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  ctx.fillStyle = '#2a2350';
  ctx.fillRect(-s * 0.05, -s * 0.5, s * 0.1, s * 1.0);
  ctx.restore();
}

function petal(ctx, x, y, s, rot, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.beginPath();
  ctx.moveTo(0, s);
  ctx.bezierCurveTo(-s * 0.9, s * 0.2, -s * 0.5, -s * 0.8, -s * 0.12, -s * 0.85);
  ctx.lineTo(0, -s * 0.6);
  ctx.lineTo(s * 0.12, -s * 0.85);
  ctx.bezierCurveTo(s * 0.5, -s * 0.8, s * 0.9, s * 0.2, 0, s);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

function sakura(ctx, x, y, s, color, center) {
  for (let i = 0; i < 5; i++) {
    const a = (Math.PI * 2 * i) / 5;
    petal(ctx, x + Math.sin(a) * s * 0.55, y - Math.cos(a) * s * 0.55, s * 0.6, a, color);
  }
  ctx.beginPath();
  ctx.arc(x, y, s * 0.18, 0, Math.PI * 2);
  ctx.fillStyle = center;
  ctx.fill();
}

// Stylised gold cloud (suyari-gasumi) band.
function kumo(ctx, x, y, w, h, color) {
  ctx.beginPath();
  ctx.moveTo(x + h / 2, y);
  ctx.lineTo(x + w - h / 2, y);
  ctx.arc(x + w - h / 2, y + h / 2, h / 2, -Math.PI / 2, Math.PI / 2);
  ctx.lineTo(x + h / 2, y + h);
  ctx.arc(x + h / 2, y + h / 2, h / 2, Math.PI / 2, Math.PI * 1.5);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function bat(ctx, x, y, s, color, rot = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.fillStyle = color;
  for (const dir of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.15);
    ctx.quadraticCurveTo(dir * s * 0.6, -s * 0.75, dir * s * 1.25, -s * 0.35);
    // Scalloped lower edge
    ctx.quadraticCurveTo(dir * s * 1.05, -s * 0.1, dir * s * 0.95, s * 0.1);
    ctx.quadraticCurveTo(dir * s * 0.8, -s * 0.05, dir * s * 0.62, s * 0.12);
    ctx.quadraticCurveTo(dir * s * 0.45, -s * 0.02, dir * s * 0.3, s * 0.2);
    ctx.quadraticCurveTo(dir * s * 0.15, s * 0.05, 0, s * 0.2);
    ctx.closePath();
    ctx.fill();
  }
  ctx.beginPath();
  ctx.ellipse(0, 0, s * 0.2, s * 0.32, 0, 0, Math.PI * 2);
  ctx.fill();
  // Ears
  for (const dir of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(dir * s * 0.05, -s * 0.22);
    ctx.lineTo(dir * s * 0.16, -s * 0.48);
    ctx.lineTo(dir * s * 0.2, -s * 0.18);
    ctx.fill();
  }
  ctx.restore();
}

function pumpkin(ctx, x, y, r) {
  ctx.save();
  ctx.translate(x, y);
  // Stem
  ctx.fillStyle = '#4f7a2a';
  ctx.beginPath();
  ctx.moveTo(-r * 0.1, -r * 0.7);
  ctx.quadraticCurveTo(-r * 0.05, -r * 1.15, r * 0.22, -r * 1.2);
  ctx.lineTo(r * 0.14, -r * 0.7);
  ctx.closePath();
  ctx.fill();
  // Ribbed body
  ctx.strokeStyle = '#b04a00';
  ctx.lineWidth = Math.max(1.5, r * 0.06);
  for (const [dx, w] of [[-0.45, 0.6], [0.45, 0.6], [0, 0.55]]) {
    const g = ctx.createRadialGradient(dx * r - r * 0.15, -r * 0.3, r * 0.1, dx * r, 0, r);
    g.addColorStop(0, '#ffb24a');
    g.addColorStop(1, '#f06a00');
    ctx.beginPath();
    ctx.ellipse(dx * r, 0, r * w, r * 0.8, 0, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.stroke();
  }
  ctx.fillStyle = '#2a0f00';
  for (const dir of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(dir * r * 0.18, -r * 0.08);
    ctx.lineTo(dir * r * 0.42, -r * 0.08);
    ctx.lineTo(dir * r * 0.3, -r * 0.32);
    ctx.closePath();
    ctx.fill();
  }
  ctx.beginPath();
  ctx.moveTo(-r * 0.5, r * 0.15);
  for (let i = 0; i <= 6; i++) ctx.lineTo(-r * 0.5 + (r / 6) * i, r * (i % 2 ? 0.3 : 0.2));
  ctx.quadraticCurveTo(0, r * 0.65, -r * 0.5, r * 0.15);
  ctx.fill();
  ctx.restore();
}

function witchHat(ctx, x, y, s, rot = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#0d0614';
  ctx.fillStyle = '#2b1640';
  // Brim
  ctx.beginPath();
  ctx.ellipse(0, 0, s, s * 0.22, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // Bent cone
  ctx.beginPath();
  ctx.moveTo(-s * 0.55, -s * 0.05);
  ctx.quadraticCurveTo(-s * 0.3, -s * 0.8, s * 0.05, -s * 1.15);
  ctx.quadraticCurveTo(s * 0.25, -s * 1.3, s * 0.55, -s * 1.1);
  ctx.quadraticCurveTo(s * 0.3, -s * 1.0, s * 0.25, -s * 0.8);
  ctx.quadraticCurveTo(s * 0.4, -s * 0.4, s * 0.55, -s * 0.05);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // Band and buckle
  ctx.beginPath();
  ctx.moveTo(-s * 0.53, -s * 0.12);
  ctx.quadraticCurveTo(0, -s * 0.02, s * 0.53, -s * 0.12);
  ctx.lineTo(s * 0.48, -s * 0.3);
  ctx.quadraticCurveTo(0, -s * 0.2, -s * 0.47, -s * 0.3);
  ctx.closePath();
  ctx.fillStyle = '#ff8a1f';
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#ffd36b';
  ctx.strokeRect(-s * 0.1, -s * 0.28, s * 0.2, s * 0.16);
  ctx.restore();
}

// Spider web fanning out from a corner; sx/sy point into the card.
function cobweb(ctx, x, y, R, sx, sy, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(sx, sy);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.3;
  const spokes = 6;
  const pt = (i, d) => {
    const a = (Math.PI / 2) * (i / (spokes - 1));
    return [Math.cos(a) * d, Math.sin(a) * d];
  };
  for (let i = 0; i < spokes; i++) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(...pt(i, R));
    ctx.stroke();
  }
  for (let k = 1; k <= 4; k++) {
    const d = (R * k) / 4.3;
    ctx.beginPath();
    ctx.moveTo(...pt(0, d));
    for (let i = 1; i < spokes; i++) {
      const [mx, my] = pt(i - 0.5, d * 0.82);
      ctx.quadraticCurveTo(mx, my, ...pt(i, d));
    }
    ctx.stroke();
  }
  ctx.restore();
}

function snowflake(ctx, x, y, s, color, rot = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1.5, s * 0.12);
  ctx.lineCap = 'round';
  for (let i = 0; i < 6; i++) {
    ctx.rotate(Math.PI / 3);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -s);
    for (const t of [0.45, 0.72]) {
      ctx.moveTo(0, -s * t);
      ctx.lineTo(-s * 0.25, -s * (t + 0.2));
      ctx.moveTo(0, -s * t);
      ctx.lineTo(s * 0.25, -s * (t + 0.2));
    }
    ctx.stroke();
  }
  ctx.restore();
}

function holly(ctx, x, y, s, rot = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  for (const dir of [-1, 1]) {
    ctx.save();
    ctx.rotate(dir * 0.6);
    // Spiky leaf
    ctx.beginPath();
    ctx.moveTo(0, 0);
    const n = 3;
    for (let i = 1; i <= n; i++) {
      const t = i / n;
      ctx.quadraticCurveTo(dir * s * 0.12, -s * (t - 0.17), dir * s * 0.3, -s * (t - 0.1));
      ctx.lineTo(0, -s * t - (i === n ? s * 0.12 : 0));
    }
    for (let i = n - 1; i >= 0; i--) {
      const t = i / n;
      ctx.lineTo(-dir * s * 0.3, -s * (t + 0.23));
      ctx.quadraticCurveTo(-dir * s * 0.12, -s * (t + 0.15), 0, -s * t);
    }
    ctx.fillStyle = '#1f7a3a';
    ctx.fill();
    ctx.strokeStyle = '#0d3f1c';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  }
  for (const [bx, by] of [[0, -s * 0.05], [-s * 0.16, s * 0.08], [s * 0.16, s * 0.08]]) {
    ctx.beginPath();
    ctx.arc(bx, by, s * 0.13, 0, Math.PI * 2);
    ctx.fillStyle = '#e02434';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(bx - s * 0.04, by - s * 0.04, s * 0.04, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
  }
  ctx.restore();
}

function santaHat(ctx, x, y, s, rot = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  // Floppy red cone
  ctx.beginPath();
  ctx.moveTo(-s * 0.8, 0);
  ctx.quadraticCurveTo(-s * 0.5, -s * 1.1, s * 0.3, -s * 1.05);
  ctx.quadraticCurveTo(s * 0.9, -s * 0.95, s * 1.05, -s * 0.45);
  ctx.quadraticCurveTo(s * 0.65, -s * 0.6, s * 0.75, 0);
  ctx.closePath();
  const g = ctx.createLinearGradient(0, -s, 0, 0);
  g.addColorStop(0, '#ff4a55');
  g.addColorStop(1, '#c4121f');
  ctx.fillStyle = g;
  ctx.fill();
  // Fur band and pompom
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(-s * 0.92, -s * 0.12, s * 1.84, s * 0.32, s * 0.16);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(s * 1.05, -s * 0.45, s * 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function gift(ctx, x, y, s, box, ribbon) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = box;
  ctx.fillRect(-s * 0.8, -s * 0.45, s * 1.6, s * 1.2);
  ctx.fillRect(-s * 0.9, -s * 0.7, s * 1.8, s * 0.3);
  ctx.fillStyle = ribbon;
  ctx.fillRect(-s * 0.13, -s * 0.7, s * 0.26, s * 1.45);
  ctx.restore();
  bow(ctx, x, y - s * 0.72, s * 0.5, ribbon, '#8a6a1e', 0);
}

function ume(ctx, x, y, s, color, center) {
  ctx.fillStyle = color;
  for (let i = 0; i < 5; i++) {
    const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
    ctx.beginPath();
    ctx.arc(x + Math.cos(a) * s * 0.55, y + Math.sin(a) * s * 0.55, s * 0.48, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = center;
  ctx.lineWidth = Math.max(1, s * 0.06);
  for (let i = 0; i < 10; i++) {
    const a = (Math.PI * 2 * i) / 10;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(a) * s * 0.42, y + Math.sin(a) * s * 0.42);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.arc(x, y, s * 0.16, 0, Math.PI * 2);
  ctx.fillStyle = center;
  ctx.fill();
}

// Folding fan; (x, y) is the pivot, the fan opens upward.
function sensu(ctx, x, y, s, rot = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  const a0 = -Math.PI * 0.88, a1 = -Math.PI * 0.12, ribs = 8;
  for (let i = 0; i < ribs; i++) {
    const p = a0 + ((a1 - a0) * i) / ribs, q = a0 + ((a1 - a0) * (i + 1)) / ribs;
    ctx.beginPath();
    ctx.arc(0, 0, s, p, q);
    ctx.arc(0, 0, s * 0.35, q, p, true);
    ctx.closePath();
    ctx.fillStyle = i % 2 ? '#d61f2c' : '#f7e3a1';
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(0, 0, s, a0, a1);
  ctx.arc(0, 0, s * 0.35, a1, a0, true);
  ctx.closePath();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#b8902e';
  ctx.stroke();
  // Rising sun on the leaf
  ctx.beginPath();
  ctx.arc(0, -s * 0.68, s * 0.17, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(0, -s * 0.68, s * 0.12, 0, Math.PI * 2);
  ctx.fillStyle = '#e8202c';
  ctx.fill();
  ctx.strokeStyle = '#6b4a1a';
  ctx.lineWidth = 2;
  for (const a of [a0, (a0 + a1) / 2, a1]) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(a) * s * 0.35, Math.sin(a) * s * 0.35);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.arc(0, 0, s * 0.06, 0, Math.PI * 2);
  ctx.fillStyle = '#e6c15a';
  ctx.fill();
  ctx.restore();
}

// Kagami mochi on a small stand, topped with a mikan.
function kagamiMochi(ctx, x, y, s) {
  ctx.save();
  ctx.translate(x, y);
  // Stand
  ctx.fillStyle = '#c99a55';
  ctx.beginPath();
  ctx.moveTo(-s * 0.95, s * 0.35);
  ctx.lineTo(s * 0.95, s * 0.35);
  ctx.lineTo(s * 0.75, s * 0.75);
  ctx.lineTo(-s * 0.75, s * 0.75);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#e8bf74';
  ctx.fillRect(-s * 1.0, s * 0.27, s * 2.0, s * 0.12);
  // Paper with red edge
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-s * 0.85, s * 0.18, s * 1.7, s * 0.12);
  ctx.fillStyle = '#d61f2c';
  ctx.fillRect(-s * 0.85, s * 0.27, s * 1.7, s * 0.04);
  // Two mochi
  for (const [cy, rx, ry] of [[s * 0.02, 0.85, 0.3], [-s * 0.42, 0.65, 0.26]]) {
    const g = ctx.createLinearGradient(0, cy - s * ry, 0, cy + s * ry);
    g.addColorStop(0, '#ffffff');
    g.addColorStop(1, '#e9e1d2');
    ctx.beginPath();
    ctx.ellipse(0, cy, s * rx, s * ry, 0, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = '#cbbfa8';
    ctx.stroke();
  }
  // Mikan and leaf
  const g = ctx.createRadialGradient(-s * 0.08, -s * 0.9, s * 0.03, 0, -s * 0.8, s * 0.24);
  g.addColorStop(0, '#ffc35a');
  g.addColorStop(1, '#f07d0c');
  ctx.beginPath();
  ctx.arc(0, -s * 0.8, s * 0.24, 0, Math.PI * 2);
  ctx.fillStyle = g;
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(s * 0.16, -s * 1.05, s * 0.18, s * 0.07, -0.5, 0, Math.PI * 2);
  ctx.fillStyle = '#2f8a3c';
  ctx.fill();
  ctx.restore();
}

// Red paper lantern hanging from (x, y); s is roughly its height.
function lantern(ctx, x, y, s) {
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = '#c9952e';
  ctx.lineWidth = Math.max(1, s * 0.04);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, s * 0.12);
  ctx.stroke();
  const cy = s * 0.5, rx = s * 0.42, ry = s * 0.34;
  const g = ctx.createRadialGradient(-rx * 0.3, cy - ry * 0.3, s * 0.03, 0, cy, rx * 1.1);
  g.addColorStop(0, '#ff6a4a');
  g.addColorStop(1, '#c4121f');
  ctx.save();
  ctx.shadowColor = 'rgba(255,120,60,0.6)';
  ctx.shadowBlur = s * 0.35;
  ctx.beginPath();
  ctx.ellipse(0, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = g;
  ctx.fill();
  ctx.restore();
  // Ribs
  ctx.strokeStyle = 'rgba(120,10,15,0.55)';
  ctx.lineWidth = Math.max(1, s * 0.025);
  for (const k of [-0.55, 0, 0.55]) {
    ctx.beginPath();
    ctx.ellipse(0, cy, Math.abs(k) * rx || 0.5, ry, 0, -Math.PI / 2, Math.PI / 2, k < 0);
    ctx.stroke();
  }
  // Gold caps and tassel
  ctx.fillStyle = '#f2c14e';
  ctx.fillRect(-rx * 0.5, cy - ry - s * 0.06, rx, s * 0.08);
  ctx.fillRect(-rx * 0.5, cy + ry - s * 0.02, rx, s * 0.08);
  ctx.strokeStyle = '#f2c14e';
  ctx.lineWidth = Math.max(1, s * 0.035);
  for (const dx of [-0.08, 0, 0.08]) {
    ctx.beginPath();
    ctx.moveTo(dx * s * 0.5, cy + ry + s * 0.06);
    ctx.lineTo(dx * s, cy + ry + s * 0.32);
    ctx.stroke();
  }
  ctx.restore();
}

// Round coin with a square hole.
function coin(ctx, x, y, r, color) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.rect(x + r * 0.32, y - r * 0.32, -r * 0.64, r * 0.64);
  ctx.fillStyle = color;
  ctx.fill('evenodd');
  ctx.beginPath();
  ctx.arc(x, y, r * 0.78, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(120,60,0,0.35)';
  ctx.lineWidth = Math.max(1, r * 0.08);
  ctx.stroke();
}

// Boat-shaped gold ingot.
function goldIngot(ctx, x, y, s) {
  ctx.save();
  ctx.translate(x, y);
  const g = ctx.createLinearGradient(0, -s * 0.5, 0, s * 0.5);
  g.addColorStop(0, '#ffe69a');
  g.addColorStop(1, '#d19a22');
  ctx.beginPath();
  ctx.moveTo(-s, -s * 0.25);
  ctx.quadraticCurveTo(-s * 0.55, -s * 0.05, -s * 0.45, -s * 0.05);
  ctx.lineTo(s * 0.45, -s * 0.05);
  ctx.quadraticCurveTo(s * 0.55, -s * 0.05, s, -s * 0.25);
  ctx.quadraticCurveTo(s * 0.85, s * 0.45, 0, s * 0.45);
  ctx.quadraticCurveTo(-s * 0.85, s * 0.45, -s, -s * 0.25);
  ctx.closePath();
  ctx.fillStyle = g;
  ctx.fill();
  ctx.strokeStyle = '#9a6a10';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  // Dome on top
  ctx.beginPath();
  ctx.ellipse(0, -s * 0.12, s * 0.45, s * 0.32, 0, Math.PI, 0);
  ctx.fillStyle = '#ffd866';
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

// Heart-shaped chocolate box with a ribbon.
function heartBox(ctx, x, y, s) {
  ctx.save();
  ctx.translate(x, y);
  heart(ctx, 0, s * 0.15, s * 1.05);
  ctx.fillStyle = '#8c1530';
  ctx.fill();
  heart(ctx, 0, s * 0.08, s * 0.95);
  const g = ctx.createLinearGradient(0, -s, 0, s * 0.6);
  g.addColorStop(0, '#ff7aa2');
  g.addColorStop(1, '#d42a5b');
  ctx.fillStyle = g;
  ctx.fill();
  ctx.fillStyle = '#ffe1ea';
  ctx.fillRect(-s * 0.08, -s * 0.85, s * 0.16, s * 1.25);
  ctx.restore();
  bow(ctx, x, y - s * 0.38, s * 0.42, '#ffe1ea', '#c98aa0', 0);
}

// Heart pierced by Cupid's arrow; (x, y) is the heart's center.
function arrowHeart(ctx, x, y, s, rot = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.strokeStyle = '#f4c58f';
  ctx.lineWidth = Math.max(2, s * 0.08);
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-s * 1.5, 0);
  ctx.lineTo(-s * 0.6, 0);
  ctx.stroke();
  heart(ctx, 0, s * 0.15, s);
  ctx.fillStyle = '#ff3d6e';
  ctx.fill();
  ctx.lineWidth = Math.max(1.5, s * 0.06);
  ctx.strokeStyle = '#ffffff';
  ctx.stroke();
  ctx.strokeStyle = '#f4c58f';
  ctx.lineWidth = Math.max(2, s * 0.08);
  ctx.beginPath();
  ctx.moveTo(s * 0.6, 0);
  ctx.lineTo(s * 1.35, 0);
  ctx.stroke();
  // Head and fletching
  ctx.fillStyle = '#f4c58f';
  ctx.beginPath();
  ctx.moveTo(s * 1.6, 0);
  ctx.lineTo(s * 1.3, -s * 0.18);
  ctx.lineTo(s * 1.3, s * 0.18);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#ffb3c7';
  for (const dy of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(-s * 1.25, 0);
    ctx.lineTo(-s * 1.5, dy * s * 0.22);
    ctx.moveTo(-s * 1.05, 0);
    ctx.lineTo(-s * 1.3, dy * s * 0.22);
    ctx.stroke();
  }
  ctx.restore();
}

// Crescent moon: a disc with an offset disc cut out of it.
function crescent(ctx, x, y, r, color, glow) {
  ctx.save();
  ctx.shadowColor = glow;
  ctx.shadowBlur = r * 0.8;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.clip();
  ctx.beginPath();
  ctx.rect(x - r, y - r, r * 2, r * 2);
  ctx.arc(x + r * 0.45, y - r * 0.25, r * 0.85, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill('evenodd');
  ctx.restore();
}

// Firework burst: rays of dots from (x, y).
function firework(ctx, x, y, R, color, rays = 18) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineCap = 'round';
  const base = ctx.globalAlpha;
  for (let i = 0; i < rays; i++) {
    const a = (Math.PI * 2 * i) / rays;
    const c = Math.cos(a), s = Math.sin(a);
    ctx.lineWidth = Math.max(1, R * 0.025);
    ctx.globalAlpha = base * 0.5;
    ctx.beginPath();
    ctx.moveTo(x + c * R * 0.25, y + s * R * 0.25);
    ctx.lineTo(x + c * R * 0.8, y + s * R * 0.8);
    ctx.stroke();
    ctx.globalAlpha = base;
    for (const [t, d] of [[0.9, 0.05], [1.02, 0.035]]) {
      ctx.beginPath();
      ctx.arc(x + c * R * t, y + s * R * t, Math.max(1, R * d), 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

// Round uchiwa fan; (x, y) is the center of the leaf.
function uchiwa(ctx, x, y, s, rot, leaf, edge) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.fillStyle = '#c99a55';
  ctx.fillRect(-s * 0.07, s * 0.75, s * 0.14, s * 0.9);
  ctx.beginPath();
  ctx.arc(0, 0, s, 0, Math.PI * 2);
  ctx.fillStyle = leaf;
  ctx.fill();
  ctx.lineWidth = Math.max(2, s * 0.07);
  ctx.strokeStyle = edge;
  ctx.stroke();
  // Little firework on the leaf
  firework(ctx, s * 0.1, -s * 0.05, s * 0.55, edge, 12);
  ctx.restore();
}

// Jasmine flower: five slim white petals.
function jasmine(ctx, x, y, s, rot = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 5; i++) {
    ctx.rotate((Math.PI * 2) / 5);
    ctx.beginPath();
    ctx.ellipse(0, -s * 0.55, s * 0.22, s * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(0, 0, s * 0.16, 0, Math.PI * 2);
  ctx.fillStyle = '#ffd166';
  ctx.fill();
  ctx.restore();
}

// Water drop pointing up.
function drop(ctx, x, y, s, color) {
  ctx.beginPath();
  ctx.moveTo(x, y - s);
  ctx.bezierCurveTo(x + s * 0.15, y - s * 0.55, x + s * 0.6, y - s * 0.05, x + s * 0.6, y + s * 0.3);
  ctx.arc(x, y + s * 0.3, s * 0.6, 0, Math.PI);
  ctx.bezierCurveTo(x - s * 0.6, y - s * 0.05, x - s * 0.15, y - s * 0.55, x, y - s);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

// Splash of drops thrown up from (x, y).
function splash(ctx, x, y, s, color) {
  for (const [a, d, k] of [[-0.5, 1, 0.5], [-0.25, 1.3, 0.38], [0, 1.1, 0.45], [0.25, 1.35, 0.35], [0.5, 0.95, 0.42], [-0.1, 1.7, 0.25], [0.35, 1.8, 0.22]]) {
    drop(ctx, x + Math.sin(a) * s * d, y - Math.cos(a) * s * d, s * k, color);
  }
}

// Silver bowl of water with a jasmine floating in it.
function waterBowl(ctx, x, y, s) {
  ctx.save();
  ctx.translate(x, y);
  splash(ctx, 0, -s * 0.35, s * 0.55, 'rgba(120,214,255,0.9)');
  const g = ctx.createLinearGradient(-s, 0, s, 0);
  g.addColorStop(0, '#9aa7b3');
  g.addColorStop(0.45, '#ffffff');
  g.addColorStop(1, '#8592a0');
  ctx.beginPath();
  ctx.moveTo(-s, -s * 0.2);
  ctx.quadraticCurveTo(-s * 0.95, s * 0.6, 0, s * 0.62);
  ctx.quadraticCurveTo(s * 0.95, s * 0.6, s, -s * 0.2);
  ctx.closePath();
  ctx.fillStyle = g;
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(0, -s * 0.2, s, s * 0.2, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#5cc8f0';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#c3ccd5';
  ctx.stroke();
  ctx.fillStyle = '#b8c2cc';
  ctx.fillRect(-s * 0.3, s * 0.6, s * 0.6, s * 0.12);
  ctx.restore();
  jasmine(ctx, x + s * 0.3, y - s * 0.22, s * 0.22, 0.3);
}

// ---------- Shared pieces ----------

function scriptLabel(color) {
  return (ctx, text, x, y, theme, fonts) => {
    const title = text.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
    ctx.font = `700 28px ${fonts.title}`;
    ctx.fillStyle = theme[color] || theme.accent;
    ctx.fillText(title, x, y + 2);
    const w = ctx.measureText(title).width;
    ctx.fillStyle = rgba(theme[color] || theme.accent, 0.45);
    ctx.fillRect(x + w + 10, y - 6, 50, 1.5);
  };
}

function scriptWatermark(right) {
  return (ctx, W, H, theme, credit, fonts) => {
    ctx.textAlign = 'right';
    ctx.font = `700 24px ${fonts.title}`;
    ctx.fillStyle = theme.gold || theme.accent;
    ctx.fillText('Summoner Card', W - right, H - 30);
    if (credit) {
      const w = ctx.measureText('Summoner Card').width;
      ctx.font = `700 12px ${fonts.jp}`;
      ctx.fillStyle = rgba(theme.text, 0.6);
      ctx.fillText(credit, W - right - w - 10, H - 32);
    }
  };
}

const ROUNDED_FONTS = {
  jp: ROUNDED,
  en: ROUNDED,
  title: SCRIPT,
  load: ['500 24px "M PLUS Rounded 1c"', '700 24px "M PLUS Rounded 1c"', '800 24px "M PLUS Rounded 1c"', '700 24px "Dancing Script"'],
};

// ---------- Decoration sets ----------

export const DECOS = {
  fairy: {
    fonts: ROUNDED_FONTS,
    vertical: true,
    backdrop: drawFairyBackdrop,
    frame: (ctx, W, H, theme) => {
      drawFairyFrame(ctx, W, H, theme);
      drawFairyCorners(ctx, W, H, theme);
    },
    iconDeco: (ctx, cx, cy, r, theme) => {
      drawUnicornHorn(ctx, cx, cy - r + 8, theme);
      drawIconBandage(ctx, cx, cy, r, theme);
    },
    label: scriptLabel('gold'),
    commentRight: 210,
    watermark: scriptWatermark(270),
  },

  // 地雷系: black and pink, ribbons, hearts, crosses.
  jirai: {
    fonts: ROUNDED_FONTS,
    backdrop: (ctx, W, H, theme, hasImage) => {
      if (!hasImage) {
        // Pink gingham
        ctx.fillStyle = rgba(theme.accent, 0.06);
        for (let x = 0; x < W; x += 40) ctx.fillRect(x, 0, 20, H);
        for (let y = 0; y < H; y += 40) ctx.fillRect(0, y, W, 20);
      }
      scatter(4401, 26, W, H, (x, y, rand) => {
        const k = rand();
        if (k < 0.45) {
          heart(ctx, x, y, 8 + rand() * 6);
          ctx.fillStyle = rgba(theme.accent, 0.85);
          ctx.fill();
        } else if (k < 0.7) {
          cross(ctx, x, y, 7 + rand() * 4, rgba('#ffffff', 0.8));
        } else {
          sparkle(ctx, x, y, 6 + rand() * 5, '#ffffff');
        }
      });
    },
    frame: (ctx, W, H, theme) => {
      laceFrame(ctx, W, H, 22, '#0b0508', rgba(theme.accent, 0.9));
      ctx.lineWidth = 3;
      ctx.strokeStyle = theme.accent;
      ctx.beginPath();
      ctx.roundRect(30, 30, W - 60, H - 60, 14);
      ctx.stroke();
      ctx.setLineDash([2, 6]);
      ctx.lineWidth = 2;
      ctx.strokeStyle = rgba('#ffffff', 0.7);
      ctx.beginPath();
      ctx.roundRect(38, 38, W - 76, H - 76, 10);
      ctx.stroke();
      ctx.setLineDash([]);
      bow(ctx, W - 70, 62, 44, theme.accent, '#120609', 0.2);
      bow(ctx, W - 64, H - 62, 34, '#120609', theme.accent, -0.3);
    },
    iconDeco: (ctx, cx, cy, r, theme) => bow(ctx, cx + r * 0.7, cy - r * 0.8, 30, '#120609', theme.accent, 0.35),
    label: scriptLabel('accent'),
    nameGlow: '#ff6fa8',
    commentRight: 80,
    watermarkRight: 110,
  },

  // 量産型: white and soft pink, lace, pearls, ribbons.
  ryousan: {
    fonts: ROUNDED_FONTS,
    vertical: true,
    backdrop: (ctx, W, H, theme, hasImage) => {
      if (!hasImage) {
        ctx.fillStyle = rgba('#ffffff', 0.55);
        for (let y = 16; y < H; y += 32) {
          for (let x = (y / 32) % 2 ? 16 : 0; x < W; x += 32) {
            ctx.beginPath();
            ctx.arc(x, y, 3.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      scatter(5501, 20, W, H, (x, y, rand) => {
        if (rand() < 0.6) {
          heart(ctx, x, y, 7 + rand() * 5);
          ctx.fillStyle = rgba(theme.accent, 0.75);
          ctx.fill();
        } else {
          sparkle(ctx, x, y, 6 + rand() * 4, '#ffffff');
        }
      });
    },
    frame: (ctx, W, H, theme) => {
      laceFrame(ctx, W, H, 22, '#ffffff', rgba(theme.accent, 0.55));
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = theme.accent;
      ctx.beginPath();
      ctx.roundRect(30, 30, W - 60, H - 60, 16);
      ctx.stroke();
      // Pearl strands along the top and bottom edges
      for (let x = 70; x < W - 70; x += 18) {
        const sag = Math.sin(((x - 70) / (W - 140)) * Math.PI) * 6;
        pearl(ctx, x, 30 + sag, 5);
        pearl(ctx, x, H - 30 - sag, 5);
      }
      bow(ctx, W / 2, 30, 40, theme.accent, '#ffffff', 0);
      bow(ctx, W - 64, H - 60, 30, '#ffffff', theme.accent, 0.25);
    },
    iconDeco: (ctx, cx, cy, r, theme) => {
      for (let i = 0; i < 28; i++) {
        const a = (Math.PI * 2 * i) / 28;
        pearl(ctx, cx + Math.cos(a) * (r + 7), cy + Math.sin(a) * (r + 7), 4.5);
      }
      bow(ctx, cx, cy - r - 4, 32, theme.accent, '#ffffff', 0);
    },
    label: scriptLabel('accent'),
    commentRight: 80,
    watermarkRight: 110,
  },

  // Y2K: chrome stars, smileys, butterflies, holographic grid.
  y2k: {
    fonts: {
      jp: ROUNDED,
      en: ROUNDED,
      title: '"Bungee", "M PLUS Rounded 1c", sans-serif',
      load: ['700 24px "M PLUS Rounded 1c"', '800 24px "M PLUS Rounded 1c"', '400 24px "Bungee"'],
    },
    vertical: true,
    backdrop: (ctx, W, H, theme, hasImage) => {
      ctx.strokeStyle = rgba('#ffffff', hasImage ? 0.18 : 0.45);
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
      scatter(6601, 14, W, H, (x, y, rand) => {
        const k = rand();
        if (k < 0.5) chromeStar(ctx, x, y, 10 + rand() * 8, rand());
        else sparkle(ctx, x, y, 7 + rand() * 5, '#ffffff');
      });
    },
    frame: (ctx, W, H, theme) => {
      const g = ctx.createLinearGradient(0, 0, W, H);
      ['#ff8ad8', '#8ae6ff', '#c3ff8a', '#ffe68a', '#b48aff'].forEach((c, i, a) => g.addColorStop(i / (a.length - 1), c));
      ctx.lineWidth = 8;
      ctx.strokeStyle = g;
      ctx.beginPath();
      ctx.roundRect(20, 20, W - 40, H - 40, 26);
      ctx.stroke();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#2a2350';
      ctx.beginPath();
      ctx.roundRect(15, 15, W - 30, H - 30, 30);
      ctx.stroke();
      chromeStar(ctx, W - 60, 60, 34, 0.2);
      chromeStar(ctx, 52, H - 56, 26, -0.2);
      smiley(ctx, W - 54, H - 58, 26);
      butterfly(ctx, W - 120, 46, 18, '#8ae6ff', 0.3);
    },
    iconDeco: (ctx, cx, cy, r) => {
      chromeStar(ctx, cx + r * 0.78, cy - r * 0.72, 24, 0.25);
      smiley(ctx, cx - r * 0.8, cy + r * 0.62, 17);
    },
    label: (ctx, text, x, y, theme, fonts) => {
      ctx.font = `400 22px ${fonts.title}`;
      ctx.fillStyle = theme.accent;
      ctx.letterSpacing = '2px';
      ctx.fillText(text, x, y + 2);
      ctx.letterSpacing = '0px';
    },
    commentRight: 80,
    watermarkRight: 110,
  },

  // ゲーミング: black, RGB neon frame, synthwave grid, glowing text.
  gaming: {
    fonts: {
      jp: '"M PLUS 1p", "Hiragino Sans", sans-serif',
      en: '"Orbitron", "M PLUS 1p", sans-serif',
      title: '"Orbitron", "M PLUS 1p", sans-serif',
      load: ['700 24px "Orbitron"'],
    },
    backdrop: (ctx, W, H, theme, hasImage) => {
      // Perspective grid floor
      const horizon = H * 0.62;
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, horizon, W, H - horizon);
      ctx.clip();
      ctx.strokeStyle = rgba('#ff3df0', hasImage ? 0.25 : 0.4);
      ctx.lineWidth = 1.5;
      for (let i = -12; i <= 12; i++) {
        ctx.beginPath();
        ctx.moveTo(W / 2, horizon);
        ctx.lineTo(W / 2 + i * 140, H);
        ctx.stroke();
      }
      for (let k = 0; k < 9; k++) {
        const y = horizon + (H - horizon) * (k / 8) ** 2;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
      ctx.restore();
      // Scanlines
      ctx.fillStyle = 'rgba(255,255,255,0.025)';
      for (let y = 0; y < H; y += 4) ctx.fillRect(0, y, W, 1);
    },
    frame: (ctx, W, H) => {
      const g = ctx.createLinearGradient(0, 0, W, 0);
      ['#ff2a6d', '#ffb800', '#39ff14', '#00e5ff', '#7a5cff', '#ff2a6d'].forEach((c, i, a) => g.addColorStop(i / (a.length - 1), c));
      ctx.save();
      ctx.shadowColor = '#00e5ff';
      ctx.shadowBlur = 18;
      ctx.lineWidth = 4;
      ctx.strokeStyle = g;
      ctx.beginPath();
      ctx.roundRect(22, 22, W - 44, H - 44, 12);
      ctx.stroke();
      ctx.restore();
      // HUD corner brackets
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      for (const [x, y, sx, sy] of [[34, 34, 1, 1], [W - 34, 34, -1, 1], [34, H - 34, 1, -1], [W - 34, H - 34, -1, -1]]) {
        ctx.beginPath();
        ctx.moveTo(x, y + sy * 30);
        ctx.lineTo(x, y);
        ctx.lineTo(x + sx * 30, y);
        ctx.stroke();
      }
    },
    iconDeco: (ctx, cx, cy, r) => {
      const g = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
      ['#ff2a6d', '#ffb800', '#39ff14', '#00e5ff', '#7a5cff'].forEach((c, i, a) => g.addColorStop(i / (a.length - 1), c));
      ctx.save();
      ctx.shadowColor = '#00e5ff';
      ctx.shadowBlur = 16;
      ctx.lineWidth = 6;
      ctx.strokeStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, r + 2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    },
    label: (ctx, text, x, y, theme, fonts) => {
      ctx.save();
      ctx.font = `700 17px ${fonts.title}`;
      ctx.fillStyle = theme.accent;
      ctx.shadowColor = theme.accent;
      ctx.shadowBlur = 10;
      ctx.letterSpacing = '3px';
      ctx.fillText(text, x, y);
      ctx.restore();
    },
    nameGlow: '#00e5ff',
    watermarkRight: 76,
  },

  // 和風: washi paper, seigaiha waves, gold clouds, sakura, mincho type.
  wafu: {
    fonts: {
      jp: MINCHO,
      en: MINCHO,
      title: MINCHO,
      load: ['700 24px "Shippori Mincho"', '800 24px "Shippori Mincho"'],
    },
    vertical: true,
    backdrop: (ctx, W, H, theme, hasImage) => {
      // Seigaiha (overlapping wave arcs)
      ctx.save();
      ctx.strokeStyle = rgba(theme.gold, hasImage ? 0.12 : 0.22);
      ctx.lineWidth = 1.2;
      const R = 30;
      for (let row = 0, y = H; y > H * 0.45; row++, y -= R / 2) {
        for (let x = (row % 2) * R; x < W + R; x += R * 2) {
          for (let k = 1; k <= 3; k++) {
            ctx.beginPath();
            ctx.arc(x, y, (R * k) / 3, Math.PI, 0);
            ctx.stroke();
          }
        }
      }
      ctx.restore();
      scatter(7701, 22, W, H, (x, y, rand) => {
        ctx.globalAlpha = 0.85;
        petal(ctx, x, y, 7 + rand() * 5, rand() * Math.PI * 2, rand() < 0.5 ? '#f6b3c4' : '#fbd3dc');
        ctx.globalAlpha = 1;
      });
    },
    frame: (ctx, W, H, theme) => {
      ctx.lineWidth = 6;
      ctx.strokeStyle = theme.accent;
      ctx.strokeRect(18, 18, W - 36, H - 36);
      ctx.lineWidth = 2;
      ctx.strokeStyle = theme.gold;
      ctx.strokeRect(30, 30, W - 60, H - 60);
      // Corner ornaments
      ctx.fillStyle = theme.gold;
      for (const [x, y, sx, sy] of [[30, 30, 1, 1], [W - 30, 30, -1, 1], [30, H - 30, 1, -1], [W - 30, H - 30, -1, -1]]) {
        ctx.fillRect(x, y, sx * 26, sy * 4);
        ctx.fillRect(x, y, sx * 4, sy * 26);
        ctx.fillRect(x + sx * 10, y + sy * 10, sx * 8, sy * 8);
      }
      // Gold clouds in the empty band above the name
      kumo(ctx, 430, 38, 240, 20, rgba(theme.gold, 0.5));
      kumo(ctx, 600, 62, 180, 14, rgba(theme.gold, 0.35));
      sakura(ctx, W - 58, H - 60, 30, '#f4a3b8', '#c9a24a');
      sakura(ctx, W - 100, H - 40, 18, '#fbd3dc', '#c9a24a');
    },
    iconDeco: (ctx, cx, cy, r) => sakura(ctx, cx - r * 0.72, cy + r * 0.7, 22, '#f4a3b8', '#c9a24a'),
    label: (ctx, text, x, y, theme, fonts) => {
      ctx.fillStyle = theme.accent;
      ctx.fillRect(x, y - 15, 6, 18);
      ctx.font = `800 19px ${fonts.title}`;
      ctx.fillStyle = theme.text;
      ctx.letterSpacing = '3px';
      ctx.fillText(text, x + 14, y);
      ctx.letterSpacing = '0px';
    },
    commentRight: 90,
    watermarkRight: 120,
  },

  // ハロウィン: night purple and pumpkin orange, bats, cobwebs, a witch hat on the icon.
  halloween: {
    fonts: {
      jp: ROUNDED,
      en: ROUNDED,
      title: '"Creepster", "M PLUS Rounded 1c", cursive',
      load: ['700 24px "M PLUS Rounded 1c"', '800 24px "M PLUS Rounded 1c"', '400 24px "Creepster"'],
    },
    vertical: true,
    backdrop: (ctx, W, H, theme, hasImage) => {
      if (!hasImage) {
        // Pumpkin-coloured haze rising from the bottom
        const g = ctx.createRadialGradient(W / 2, H + 120, 40, W / 2, H + 120, W * 0.6);
        g.addColorStop(0, rgba(theme.accent, 0.35));
        g.addColorStop(1, rgba(theme.accent, 0));
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }
      scatter(8801, 22, W, H, (x, y, rand) => {
        const k = rand();
        if (k < 0.55) bat(ctx, x, y, 12 + rand() * 9, rgba(theme.accent2, 0.55), (rand() - 0.5) * 0.6);
        else sparkle(ctx, x, y, 5 + rand() * 4, rgba(theme.gold, 0.9));
      });
    },
    frame: (ctx, W, H, theme) => {
      ctx.save();
      ctx.shadowColor = theme.accent;
      ctx.shadowBlur = 14;
      ctx.lineWidth = 4;
      ctx.strokeStyle = theme.accent;
      ctx.beginPath();
      ctx.roundRect(22, 22, W - 44, H - 44, 14);
      ctx.stroke();
      ctx.restore();
      ctx.setLineDash([10, 8]);
      ctx.lineWidth = 2;
      ctx.strokeStyle = rgba(theme.accent2, 0.8);
      ctx.beginPath();
      ctx.roundRect(32, 32, W - 64, H - 64, 10);
      ctx.stroke();
      ctx.setLineDash([]);
      cobweb(ctx, W - 22, 22, 95, -1, 1, rgba('#ffffff', 0.45));
      cobweb(ctx, 22, H - 22, 80, 1, -1, rgba('#ffffff', 0.4));
      bat(ctx, W - 150, 52, 20, '#0a0410', 0.15);
      pumpkin(ctx, W - 66, H - 64, 34);
    },
    iconDeco: (ctx, cx, cy, r) => witchHat(ctx, cx + r * 0.3, cy - r * 0.78, 54, 0.3),
    label: (ctx, text, x, y, theme, fonts) => {
      ctx.save();
      ctx.font = `400 24px ${fonts.title}`;
      ctx.fillStyle = theme.accent;
      ctx.shadowColor = theme.accent;
      ctx.shadowBlur = 8;
      ctx.letterSpacing = '2px';
      ctx.fillText(text, x, y + 2);
      ctx.restore();
    },
    nameGlow: '#ff8a1f',
    commentRight: 90,
    watermarkRight: 120,
  },

  // クリスマス: evergreen and red, candy-cane border, string lights, snow, a Santa hat on the icon.
  christmas: {
    fonts: ROUNDED_FONTS,
    vertical: true,
    backdrop: (ctx, W, H, theme, hasImage) => {
      // Falling snow
      const rand = rng(9901);
      ctx.fillStyle = rgba('#ffffff', hasImage ? 0.55 : 0.4);
      for (let i = 0; i < 140; i++) {
        ctx.beginPath();
        ctx.arc(rand() * W, rand() * H, 1 + rand() * 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
      scatter(9902, 16, W, H, (x, y, r) => snowflake(ctx, x, y, 8 + r() * 7, rgba('#ffffff', 0.8), r()));
    },
    frame: (ctx, W, H, theme) => {
      // Candy-cane stripes
      ctx.lineWidth = 10;
      ctx.strokeStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(22, 22, W - 44, H - 44, 16);
      ctx.stroke();
      ctx.setLineDash([16, 16]);
      ctx.strokeStyle = theme.accent;
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.lineWidth = 2;
      ctx.strokeStyle = theme.gold;
      ctx.beginPath();
      ctx.roundRect(34, 34, W - 68, H - 68, 10);
      ctx.stroke();
      // String lights hanging along the top
      const bulbs = ['#ff4a55', '#ffd34d', '#4ade80', '#60a5fa', '#f472b6'];
      const x0 = 250, x1 = W - 280, span = 120;
      ctx.strokeStyle = '#1b3a24';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x0, 22);
      for (let x = x0; x < x1; x += span) ctx.quadraticCurveTo(x + span / 2, 46, x + span, 22);
      ctx.stroke();
      for (let x = x0, i = 0; x <= x1; x += span / 4, i++) {
        const t = ((x - x0) % span) / span;
        const by = 22 + 24 * 2 * t * (1 - t) + 7;
        ctx.save();
        ctx.shadowColor = bulbs[i % bulbs.length];
        ctx.shadowBlur = 10;
        ctx.fillStyle = bulbs[i % bulbs.length];
        ctx.beginPath();
        ctx.ellipse(x, by, 4.5, 6.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      holly(ctx, W - 50, 56, 34, -0.4);
      gift(ctx, W - 70, H - 56, 30, theme.accent, theme.gold);
    },
    iconDeco: (ctx, cx, cy, r) => santaHat(ctx, cx - r * 0.1, cy - r * 0.72, 56, -0.25),
    label: scriptLabel('gold'),
    commentRight: 90,
    watermarkRight: 120,
  },

  // お正月: crimson and gold, rising-sun rays, plum blossoms, kagami mochi, a fan on the icon.
  newyear: {
    fonts: {
      jp: MINCHO,
      en: MINCHO,
      title: MINCHO,
      load: ['700 24px "Shippori Mincho"', '800 24px "Shippori Mincho"'],
    },
    vertical: true,
    backdrop: (ctx, W, H, theme, hasImage) => {
      // Rising-sun rays from below the bottom edge
      ctx.save();
      ctx.fillStyle = rgba(theme.gold, hasImage ? 0.05 : 0.08);
      const ox = W / 2, oy = H + 60, rays = 24;
      for (let i = 0; i < rays; i += 2) {
        const p = Math.PI + (Math.PI * i) / rays, q = Math.PI + (Math.PI * (i + 1)) / rays;
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.arc(ox, oy, W, p, q);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
      scatter(1101, 24, W, H, (x, y, rand) => {
        if (rand() < 0.6) ume(ctx, x, y, 7 + rand() * 6, rand() < 0.5 ? rgba('#ffffff', 0.85) : rgba('#ffb3c1', 0.85), theme.gold);
        else sparkle(ctx, x, y, 5 + rand() * 4, rgba(theme.gold, 0.9));
      });
    },
    frame: (ctx, W, H, theme) => {
      ctx.lineWidth = 6;
      ctx.strokeStyle = theme.gold;
      ctx.strokeRect(18, 18, W - 36, H - 36);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = rgba('#ffffff', 0.7);
      ctx.strokeRect(30, 30, W - 60, H - 60);
      // Corner ornaments
      ctx.fillStyle = theme.gold;
      for (const [x, y, sx, sy] of [[30, 30, 1, 1], [W - 30, 30, -1, 1], [30, H - 30, 1, -1], [W - 30, H - 30, -1, -1]]) {
        ctx.fillRect(x, y, sx * 26, sy * 4);
        ctx.fillRect(x, y, sx * 4, sy * 26);
        ctx.fillRect(x + sx * 10, y + sy * 10, sx * 8, sy * 8);
      }
      kumo(ctx, 430, 38, 240, 20, rgba(theme.gold, 0.5));
      kumo(ctx, 600, 62, 180, 14, rgba(theme.gold, 0.35));
      kagamiMochi(ctx, W - 74, H - 86, 42);
      ume(ctx, W - 132, H - 44, 13, '#ffffff', theme.gold);
      ume(ctx, W - 22 - 18, 52, 12, '#ffb3c1', theme.gold);
    },
    iconDeco: (ctx, cx, cy, r) => {
      sensu(ctx, cx + r * 0.62, cy - r * 0.38, 46, 0.55);
      ume(ctx, cx - r * 0.74, cy + r * 0.7, 15, '#ffffff', '#e6c15a');
      ume(ctx, cx - r * 0.42, cy + r * 0.92, 10, '#ffb3c1', '#e6c15a');
    },
    label: (ctx, text, x, y, theme, fonts) => {
      ctx.fillStyle = theme.gold;
      ctx.fillRect(x, y - 15, 6, 18);
      ctx.font = `800 19px ${fonts.title}`;
      ctx.fillStyle = theme.text;
      ctx.letterSpacing = '3px';
      ctx.fillText(text, x + 14, y);
      ctx.letterSpacing = '0px';
    },
    nameGlow: '#f2d27a',
    commentRight: 110,
    watermarkRight: 150,
  },

  // 旧正月: bright red and gold, hanging lanterns, coins, plum blossoms, a gold ingot, a lantern on the icon.
  lunar: {
    fonts: {
      jp: MINCHO,
      en: MINCHO,
      title: MINCHO,
      load: ['700 24px "Shippori Mincho"', '800 24px "Shippori Mincho"'],
    },
    vertical: true,
    backdrop: (ctx, W, H, theme, hasImage) => {
      // Faint auspicious clouds
      ctx.save();
      ctx.globalAlpha = hasImage ? 0.5 : 1;
      for (const [x, y, w] of [[120, 560, 260], [700, 600, 320], [980, 300, 240], [300, 330, 200]]) kumo(ctx, x, y, w, 18, rgba(theme.gold, 0.1));
      ctx.restore();
      scatter(2202, 22, W, H, (x, y, rand) => {
        const k = rand();
        if (k < 0.4) coin(ctx, x, y, 7 + rand() * 5, rgba(theme.gold, 0.85));
        else if (k < 0.75) ume(ctx, x, y, 7 + rand() * 5, rgba('#ffd0d8', 0.85), theme.gold);
        else sparkle(ctx, x, y, 5 + rand() * 4, rgba(theme.gold, 0.9));
      });
    },
    frame: (ctx, W, H, theme) => {
      ctx.lineWidth = 5;
      ctx.strokeStyle = theme.gold;
      ctx.strokeRect(18, 18, W - 36, H - 36);
      ctx.lineWidth = 1.5;
      ctx.strokeRect(28, 28, W - 56, H - 56);
      // Fret corners
      ctx.lineWidth = 3;
      for (const [x, y, sx, sy] of [[28, 28, 1, 1], [W - 28, 28, -1, 1], [28, H - 28, 1, -1], [W - 28, H - 28, -1, -1]]) {
        ctx.beginPath();
        ctx.moveTo(x + sx * 34, y + sy * 6);
        ctx.lineTo(x + sx * 6, y + sy * 6);
        ctx.lineTo(x + sx * 6, y + sy * 34);
        ctx.moveTo(x + sx * 24, y + sy * 14);
        ctx.lineTo(x + sx * 14, y + sy * 14);
        ctx.lineTo(x + sx * 14, y + sy * 24);
        ctx.stroke();
      }
      // A cord of lanterns along the top
      const x0 = 280, x1 = W - 340, n = 5;
      ctx.strokeStyle = theme.gold;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x0 - 30, 18);
      ctx.quadraticCurveTo((x0 + x1) / 2, 34, x1 + 30, 18);
      ctx.stroke();
      for (let i = 0; i < n; i++) {
        const x = x0 + ((x1 - x0) * i) / (n - 1), t = (x - x0 + 30) / (x1 - x0 + 60);
        lantern(ctx, x, 18 + 32 * t * (1 - t), i % 2 ? 30 : 38);
      }
      goldIngot(ctx, W - 80, H - 66, 36);
      coin(ctx, W - 136, H - 46, 11, theme.gold);
      coin(ctx, W - 44, H - 110, 9, theme.gold);
    },
    iconDeco: (ctx, cx, cy, r) => {
      lantern(ctx, cx + r * 0.78, cy - r * 0.95, 46);
      ume(ctx, cx - r * 0.74, cy + r * 0.7, 15, '#ffd0d8', '#f2c14e');
      coin(ctx, cx - r * 0.4, cy + r * 0.95, 9, '#f2c14e');
    },
    label: (ctx, text, x, y, theme, fonts) => {
      ctx.save();
      ctx.translate(x + 6, y - 6);
      ctx.rotate(Math.PI / 4);
      ctx.fillStyle = theme.gold;
      ctx.fillRect(-5, -5, 10, 10);
      ctx.restore();
      ctx.font = `800 19px ${fonts.title}`;
      ctx.fillStyle = theme.text;
      ctx.letterSpacing = '3px';
      ctx.fillText(text, x + 18, y);
      ctx.letterSpacing = '0px';
    },
    nameGlow: '#ffcf5a',
    commentRight: 120,
    watermarkRight: 160,
  },

  // バレンタイン: chocolate and rose, floating hearts, a heart-shaped gift box, Cupid's arrow on the icon.
  valentine: {
    fonts: ROUNDED_FONTS,
    vertical: true,
    backdrop: (ctx, W, H, theme, hasImage) => {
      // Soft rosy glow
      const g = ctx.createRadialGradient(W * 0.75, H * 0.2, 20, W * 0.75, H * 0.2, W * 0.6);
      g.addColorStop(0, rgba(theme.accent, hasImage ? 0.12 : 0.2));
      g.addColorStop(1, rgba(theme.accent, 0));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      scatter(1402, 26, W, H, (x, y, rand) => {
        if (rand() < 0.7) {
          heart(ctx, x, y, 7 + rand() * 9);
          ctx.fillStyle = rgba(rand() < 0.5 ? theme.accent : theme.accent2, 0.5 + rand() * 0.4);
          ctx.fill();
        } else sparkle(ctx, x, y, 5 + rand() * 4, rgba('#ffffff', 0.85));
      });
    },
    frame: (ctx, W, H, theme) => {
      ctx.lineWidth = 4;
      ctx.strokeStyle = theme.accent;
      ctx.beginPath();
      ctx.roundRect(20, 20, W - 40, H - 40, 18);
      ctx.stroke();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = rgba(theme.accent2, 0.8);
      ctx.setLineDash([2, 7]);
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.roundRect(31, 31, W - 62, H - 62, 12);
      ctx.stroke();
      ctx.setLineDash([]);
      // Hearts on the corners and along the top
      for (const [x, y] of [[20, 20], [W - 20, 20], [20, H - 20]]) {
        heart(ctx, x, y + 3, 13);
        ctx.fillStyle = theme.accent;
        ctx.fill();
      }
      for (let x = 300; x <= W - 360; x += 70) {
        heart(ctx, x, 22, 7);
        ctx.fillStyle = rgba(theme.accent2, 0.9);
        ctx.fill();
      }
      bow(ctx, W - 56, 50, 22, theme.accent, '#8c1530', 0.2);
      heartBox(ctx, W - 76, H - 74, 40);
    },
    iconDeco: (ctx, cx, cy, r) => {
      arrowHeart(ctx, cx + r * 0.72, cy - r * 0.72, 20, -0.5);
      heart(ctx, cx - r * 0.78, cy + r * 0.78, 13);
      ctx.fillStyle = '#ff3d6e';
      ctx.fill();
      heart(ctx, cx - r * 0.45, cy + r * 1.0, 8);
      ctx.fillStyle = '#ffb3c7';
      ctx.fill();
    },
    label: scriptLabel('accent2'),
    nameGlow: '#ff5c8a',
    commentRight: 110,
    watermark: scriptWatermark(140),
  },

  // 夜桜: night sky with a pink neon frame, falling petals, a crescent moon, sakura on the icon.
  yozakura: {
    fonts: {
      jp: MINCHO,
      en: MINCHO,
      title: MINCHO,
      load: ['700 24px "Shippori Mincho"', '800 24px "Shippori Mincho"'],
    },
    vertical: true,
    backdrop: (ctx, W, H, theme, hasImage) => {
      const rand = rng(3301);
      ctx.fillStyle = rgba('#ffffff', hasImage ? 0.5 : 0.35);
      for (let i = 0; i < 70; i++) {
        ctx.beginPath();
        ctx.arc(rand() * W, rand() * H * 0.7, 0.6 + rand() * 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
      scatter(3302, 30, W, H, (x, y, r) => {
        ctx.globalAlpha = 0.6 + r() * 0.35;
        petal(ctx, x, y, 6 + r() * 6, r() * Math.PI * 2, r() < 0.5 ? '#ffb7d0' : '#ffd9e6');
        ctx.globalAlpha = 1;
      });
    },
    frame: (ctx, W, H, theme) => {
      ctx.save();
      ctx.shadowColor = theme.accent;
      ctx.shadowBlur = 16;
      ctx.lineWidth = 3;
      ctx.strokeStyle = theme.accent;
      ctx.beginPath();
      ctx.roundRect(22, 22, W - 44, H - 44, 14);
      ctx.stroke();
      ctx.stroke();
      ctx.restore();
      ctx.lineWidth = 1;
      ctx.strokeStyle = rgba(theme.accent2, 0.6);
      ctx.beginPath();
      ctx.roundRect(32, 32, W - 64, H - 64, 10);
      ctx.stroke();
      crescent(ctx, 560, 46, 18, '#fff4d6', '#ffe9a8');
      // Blossom clusters on two corners
      for (const [x, y, s, c] of [[W - 60, H - 62, 30, '#ff9cc2'], [W - 104, H - 38, 18, '#ffd1e1'], [W - 34, H - 104, 15, '#ffd1e1'], [44, H - 44, 16, '#ff9cc2'], [W - 44, 46, 16, '#ff9cc2']]) {
        ctx.save();
        ctx.shadowColor = '#ff5fa2';
        ctx.shadowBlur = 12;
        sakura(ctx, x, y, s, c, '#fff3a8');
        ctx.restore();
      }
    },
    iconDeco: (ctx, cx, cy, r) => {
      ctx.save();
      ctx.shadowColor = '#ff5fa2';
      ctx.shadowBlur = 12;
      sakura(ctx, cx - r * 0.72, cy + r * 0.7, 22, '#ff9cc2', '#fff3a8');
      sakura(ctx, cx + r * 0.75, cy - r * 0.7, 16, '#ffd1e1', '#fff3a8');
      ctx.restore();
    },
    label: (ctx, text, x, y, theme, fonts) => {
      ctx.save();
      ctx.font = `800 19px ${fonts.title}`;
      ctx.shadowColor = theme.accent;
      ctx.shadowBlur = 10;
      ctx.fillStyle = theme.accent2;
      ctx.letterSpacing = '3px';
      ctx.fillText(text, x, y);
      ctx.letterSpacing = '0px';
      ctx.restore();
    },
    nameGlow: '#ff5fa2',
    commentRight: 110,
    watermarkRight: 140,
  },

  // ソンクラーン: bright water blue, splashes and drops, jasmine garlands, a silver water bowl, flowers on the icon.
  songkran: {
    fonts: ROUNDED_FONTS,
    vertical: true,
    backdrop: (ctx, W, H, theme, hasImage) => {
      // Soft wave bands along the bottom
      ctx.save();
      for (let k = 0; k < 3; k++) {
        ctx.beginPath();
        const y0 = H - 40 - k * 34;
        ctx.moveTo(0, H);
        ctx.lineTo(0, y0);
        for (let x = 0; x <= W; x += 60) ctx.quadraticCurveTo(x + 30, y0 - 14 * (k % 2 ? 1 : -1), x + 60, y0);
        ctx.lineTo(W, H);
        ctx.closePath();
        ctx.fillStyle = rgba('#ffffff', (hasImage ? 0.08 : 0.16) - k * 0.03);
        ctx.fill();
      }
      ctx.restore();
      scatter(5501, 30, W, H, (x, y, rand) => {
        const k = rand();
        if (k < 0.5) drop(ctx, x, y, 6 + rand() * 6, rgba('#ffffff', 0.75));
        else if (k < 0.8) jasmine(ctx, x, y, 7 + rand() * 4, rand());
        else sparkle(ctx, x, y, 5 + rand() * 4, rgba('#ffffff', 0.95));
      });
    },
    frame: (ctx, W, H, theme) => {
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(20, 20, W - 40, H - 40, 18);
      ctx.stroke();
      ctx.lineWidth = 2;
      ctx.strokeStyle = theme.accent2;
      ctx.beginPath();
      ctx.roundRect(31, 31, W - 62, H - 62, 12);
      ctx.stroke();
      // Jasmine garland swagging along the top
      const x0 = 260, x1 = W - 330, sag = 22;
      for (let i = 0; i <= 26; i++) {
        const t = i / 26, x = x0 + (x1 - x0) * t;
        const y = 22 + sag * 4 * ((t * 3) % 1) * (1 - ((t * 3) % 1));
        jasmine(ctx, x, y, i % 2 ? 6 : 8, i);
      }
      for (const t of [0, 1 / 3, 2 / 3, 1]) {
        const x = x0 + (x1 - x0) * t;
        ctx.beginPath();
        ctx.arc(x, 22, 6, 0, Math.PI * 2);
        ctx.fillStyle = theme.accent2;
        ctx.fill();
      }
      waterBowl(ctx, W - 80, H - 70, 40);
      jasmine(ctx, W - 140, H - 40, 10, 0.5);
    },
    iconDeco: (ctx, cx, cy, r, theme) => {
      splash(ctx, cx + r * 0.78, cy - r * 0.55, 20, 'rgba(120,214,255,0.95)');
      jasmine(ctx, cx - r * 0.74, cy + r * 0.7, 16, 0.2);
      jasmine(ctx, cx - r * 0.42, cy + r * 0.95, 11, 0.8);
      ctx.beginPath();
      ctx.arc(cx - r * 0.95, cy + r * 0.38, 7, 0, Math.PI * 2);
      ctx.fillStyle = theme.accent2;
      ctx.fill();
    },
    label: scriptLabel('accent2'),
    nameGlow: '#0aa3d6',
    commentRight: 120,
    watermark: scriptWatermark(150),
  },

  // 花火: deep navy summer night, firework bursts, a gold frame, an uchiwa fan on the icon.
  hanabi: {
    fonts: {
      jp: MINCHO,
      en: MINCHO,
      title: MINCHO,
      load: ['700 24px "Shippori Mincho"', '800 24px "Shippori Mincho"'],
    },
    vertical: true,
    backdrop: (ctx, W, H, theme, hasImage) => {
      // Big faint bursts behind everything, brighter ones only where nothing sits
      const a = hasImage ? 0.32 : 0.45;
      for (const [x, y, R, c] of [[330, 140, 130, '#ff6b8b'], [800, 120, 150, '#ffd36b'], [1040, 430, 130, '#7ad7ff'], [160, 540, 110, '#b78bff'], [640, 560, 110, '#7dffb0']]) {
        ctx.save();
        ctx.globalAlpha = a;
        firework(ctx, x, y, R, c, 24);
        ctx.restore();
      }
      const rand = rng(6601);
      ctx.fillStyle = rgba('#ffffff', 0.4);
      for (let i = 0; i < 50; i++) {
        ctx.beginPath();
        ctx.arc(rand() * W, rand() * H, 0.6 + rand(), 0, Math.PI * 2);
        ctx.fill();
      }
    },
    frame: (ctx, W, H, theme) => {
      ctx.lineWidth = 4;
      ctx.strokeStyle = theme.gold;
      ctx.strokeRect(18, 18, W - 36, H - 36);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = rgba(theme.gold, 0.6);
      ctx.strokeRect(28, 28, W - 56, H - 56);
      // Small bright bursts in free corners
      for (const [x, y, R, c] of [[W - 60, 60, 26, '#ffd36b'], [60, H - 58, 22, '#ff6b8b'], [W - 140, H - 44, 16, '#7ad7ff']]) {
        ctx.save();
        ctx.shadowColor = c;
        ctx.shadowBlur = 8;
        firework(ctx, x, y, R, c, 14);
        ctx.restore();
      }
      uchiwa(ctx, W - 72, H - 92, 32, 0.35, '#1e3c8c', '#ffd36b');
    },
    iconDeco: (ctx, cx, cy, r) => {
      uchiwa(ctx, cx + r * 0.7, cy - r * 0.62, 32, 0.5, '#1e3c8c', '#ffd36b');
    },
    label: (ctx, text, x, y, theme, fonts) => {
      ctx.save();
      ctx.shadowColor = theme.gold;
      ctx.shadowBlur = 6;
      firework(ctx, x + 7, y - 6, 8, theme.gold, 10);
      ctx.restore();
      ctx.font = `800 19px ${fonts.title}`;
      ctx.fillStyle = theme.text;
      ctx.letterSpacing = '3px';
      ctx.fillText(text, x + 22, y);
      ctx.letterSpacing = '0px';
    },
    nameGlow: '#ffd36b',
    commentRight: 110,
    watermarkRight: 150,
  },
};
