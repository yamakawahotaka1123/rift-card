// Pastel unicorn ("yumekawa") decorations: holographic sky, rainbows, clouds, stars,
// hearts, a unicorn horn for the icon and wings for the rank crest.
// Layout is generated from a fixed seed so the card looks the same on every redraw.

const RAINBOW = ['#ffb3c7', '#ffd3a8', '#fff0a6', '#c4efc9', '#b9dcff', '#d8c6ff'];

function rng(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
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

function star(ctx, x, y, r, color, rot = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 ? r * 0.5 : r;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
  }
  ctx.closePath();
  ctx.lineJoin = 'round';
  ctx.lineWidth = r * 0.35;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.stroke();
  ctx.fill();
  ctx.restore();
}

function heart(ctx, x, y, s, color, rot = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.beginPath();
  ctx.moveTo(0, s * 0.35);
  ctx.bezierCurveTo(-s * 1.1, -s * 0.35, -s * 0.45, -s * 1.05, 0, -s * 0.45);
  ctx.bezierCurveTo(s * 0.45, -s * 1.05, s * 1.1, -s * 0.35, 0, s * 0.35);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

function moon(ctx, x, y, r, color) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.arc(x + r * 0.45, y - r * 0.2, r * 0.85, 0, Math.PI * 2, true);
  ctx.fillStyle = color;
  ctx.fill('evenodd');
  ctx.restore();
}

function cloud(ctx, x, y, w, color = 'rgba(255,255,255,0.92)') {
  ctx.fillStyle = color;
  const bumps = [[0, 0, 0.26], [0.24, -0.16, 0.3], [0.52, -0.1, 0.27], [0.76, 0.02, 0.22], [0.38, 0.08, 0.28]];
  for (const [dx, dy, r] of bumps) {
    ctx.beginPath();
    ctx.arc(x + dx * w, y + dy * w, r * w, 0, Math.PI * 2);
    ctx.fill();
  }
}

function rainbow(ctx, cx, cy, inner, band, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  RAINBOW.slice().reverse().forEach((color, i) => {
    ctx.beginPath();
    ctx.arc(cx, cy, inner + band * (RAINBOW.length - i), Math.PI, 0);
    ctx.arc(cx, cy, inner + band * (RAINBOW.length - i - 1), 0, Math.PI, true);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  });
  ctx.restore();
}

// Background pieces that sit behind the card content.
export function drawFairyBackdrop(ctx, W, H, theme, hasImage) {
  const rand = rng(20261025);
  // Holographic sheen
  const holo = ctx.createLinearGradient(0, 0, W, H);
  theme.holo.forEach((c, i) => holo.addColorStop(i / (theme.holo.length - 1), c));
  ctx.save();
  ctx.globalAlpha = hasImage ? 0.28 : 0.55;
  ctx.fillStyle = holo;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();
  for (const [x, w] of [[W * 0.18, 140], [W * 0.55, 90], [W * 0.82, 120]]) {
    ctx.save();
    ctx.translate(x, 0);
    ctx.rotate(0.35);
    const g = ctx.createLinearGradient(-w, 0, w, 0);
    g.addColorStop(0, 'rgba(255,255,255,0)');
    g.addColorStop(0.5, `rgba(255,255,255,${hasImage ? 0.12 : 0.3})`);
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(-w, -100, w * 2, H * 1.6);
    ctx.restore();
  }

  // Rainbows with clouds at their feet
  rainbow(ctx, 150, H + 30, 120, 16, hasImage ? 0.5 : 0.75);
  cloud(ctx, -10, H - 20, 130);
  cloud(ctx, 220, H - 14, 120);
  rainbow(ctx, W - 40, 150, 70, 12, hasImage ? 0.35 : 0.55);
  cloud(ctx, W - 175, 140, 90);

  // Stars, hearts, moons and sparkles
  for (let i = 0; i < 34; i++) {
    const x = rand() * W, y = rand() * H;
    const color = theme.confetti[Math.floor(rand() * theme.confetti.length)];
    const kind = rand();
    ctx.globalAlpha = 0.75;
    if (kind < 0.4) star(ctx, x, y, 5 + rand() * 6, color, rand());
    else if (kind < 0.75) heart(ctx, x, y, 6 + rand() * 6, color, (rand() - 0.5) * 0.8);
    else sparkle(ctx, x, y, 5 + rand() * 6, '#ffffff');
  }
  ctx.globalAlpha = 1;
  moon(ctx, 40, 470, 13, theme.gold);
  for (let i = 0; i < 18; i++) sparkle(ctx, rand() * W, rand() * H, 3 + rand() * 5, i % 3 ? 'rgba(255,255,255,0.95)' : theme.gold);
}

export function drawFairyFrame(ctx, W, H, theme) {
  ctx.save();
  ctx.lineWidth = 5;
  ctx.strokeStyle = 'rgba(255,255,255,0.95)';
  ctx.beginPath();
  ctx.roundRect(16, 16, W - 32, H - 32, 28);
  ctx.stroke();
  const g = ctx.createLinearGradient(0, 0, W, H);
  RAINBOW.forEach((c, i) => g.addColorStop(i / (RAINBOW.length - 1), c));
  ctx.setLineDash([2, 7]);
  ctx.lineCap = 'round';
  ctx.lineWidth = 3;
  ctx.strokeStyle = g;
  ctx.beginPath();
  ctx.roundRect(26, 26, W - 52, H - 52, 22);
  ctx.stroke();
  ctx.restore();
}

// Stars and clouds in the corners, drawn under the content.
export function drawFairyCorners(ctx, W, H, theme) {
  cloud(ctx, W - 120, H - 18, 120);
  cloud(ctx, -30, 30, 100);
  star(ctx, 34, 108, 9, theme.gold, 0.2);
  star(ctx, 112, 30, 7, theme.confetti[1], -0.3);
  star(ctx, W - 40, H - 100, 9, theme.gold, 0.1);
  heart(ctx, W - 92, H - 70, 9, theme.confetti[0], 0.2);
  sparkle(ctx, W - 60, 40, 9, '#ffffff');
}

// Golden spiral horn sitting on top of the icon, centered on cx with its base at baseY.
export function drawUnicornHorn(ctx, cx, baseY, theme) {
  const h = 46, w = 26;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(cx - w / 2, baseY);
  ctx.quadraticCurveTo(cx - w * 0.2, baseY - h * 0.6, cx, baseY - h);
  ctx.quadraticCurveTo(cx + w * 0.2, baseY - h * 0.6, cx + w / 2, baseY);
  ctx.closePath();
  const g = ctx.createLinearGradient(cx - w / 2, 0, cx + w / 2, 0);
  g.addColorStop(0, '#fff4c8');
  g.addColorStop(0.5, theme.gold);
  g.addColorStop(1, '#f7d98b');
  ctx.fillStyle = g;
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.9)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.clip();
  // Spiral stripes
  ctx.strokeStyle = 'rgba(255,255,255,0.85)';
  ctx.lineWidth = 2.5;
  for (let i = 1; i <= 4; i++) {
    const y = baseY - (h * i) / 5;
    ctx.beginPath();
    ctx.moveTo(cx - w / 2, y + 7);
    ctx.lineTo(cx + w / 2, y - 3);
    ctx.stroke();
  }
  ctx.restore();
  sparkle(ctx, cx + 20, baseY - h + 6, 6, '#ffffff');
}

// A pair of feathered wings centered on (cx, cy), drawn behind the rank crest.
export function drawWings(ctx, cx, cy, theme) {
  for (const dir of [-1, 1]) {
    ctx.save();
    ctx.translate(cx + dir * 58, cy - 6);
    ctx.scale(dir, 1);
    // Feathers fan outward from the crest, longest at the top.
    const feathers = [[0, -26, 78, -0.55], [0, -8, 70, -0.25], [0, 10, 58, 0.05], [0, 26, 44, 0.35]];
    feathers.forEach(([x, y, len, angle], i) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.ellipse(len / 2, 0, len / 2, 13 - i, 0, 0, Math.PI * 2);
      const g = ctx.createLinearGradient(0, 0, len, 0);
      g.addColorStop(0, '#ffffff');
      g.addColorStop(1, theme.confetti[(i + 1) % theme.confetti.length]);
      ctx.fillStyle = g;
      ctx.fill();
      ctx.strokeStyle = 'rgba(170,140,210,0.45)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    });
    ctx.restore();
  }
}
