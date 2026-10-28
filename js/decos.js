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
};
