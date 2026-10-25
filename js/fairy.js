// Pastel "fairy" decorations: gradient sky, clouds, confetti, sparkles and daisy clusters.
// Layout is generated from a fixed seed so the card looks the same on every redraw.

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

function daisy(ctx, x, y, r, petal, center, rot = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  const n = 9;
  for (let i = 0; i < n; i++) {
    const a = (Math.PI * 2 * i) / n;
    ctx.beginPath();
    ctx.ellipse(Math.cos(a) * r * 0.55, Math.sin(a) * r * 0.55, r * 0.5, r * 0.2, a, 0, Math.PI * 2);
    ctx.fillStyle = petal;
    ctx.fill();
    ctx.strokeStyle = 'rgba(180,150,210,0.35)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.26, 0, Math.PI * 2);
  ctx.fillStyle = center;
  ctx.fill();
  ctx.restore();
}

function leaf(ctx, x, y, len, angle, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(len * 0.5, -len * 0.28, len, 0);
  ctx.quadraticCurveTo(len * 0.5, len * 0.28, 0, 0);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

function cloud(ctx, x, y, w, color) {
  ctx.fillStyle = color;
  const bumps = [[0, 0, 0.32], [0.28, -0.12, 0.38], [0.6, -0.04, 0.3], [0.85, 0.06, 0.24], [0.45, 0.1, 0.34]];
  for (const [dx, dy, r] of bumps) {
    ctx.beginPath();
    ctx.arc(x + dx * w, y + dy * w, r * w, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Background pieces that sit behind the card content.
export function drawFairyBackdrop(ctx, W, H, theme, hasImage) {
  const rand = rng(20261025);
  if (!hasImage) {
    const glow = ctx.createRadialGradient(W * 0.5, H * 0.45, 40, W * 0.5, H * 0.45, W * 0.6);
    glow.addColorStop(0, 'rgba(255,255,255,0.55)');
    glow.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 7; i++) cloud(ctx, -60 + i * 200 + rand() * 60, H - 10 + rand() * 20, 190 + rand() * 60, 'rgba(255,255,255,0.75)');
  }
  // Confetti and petals
  for (let i = 0; i < 46; i++) {
    const x = rand() * W, y = rand() * H;
    const color = theme.confetti[Math.floor(rand() * theme.confetti.length)];
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rand() * Math.PI);
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = color;
    if (rand() < 0.5) ctx.fillRect(-5, -3, 10, 6);
    else {
      ctx.beginPath();
      ctx.ellipse(0, 0, 8, 4.5, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
  ctx.globalAlpha = 1;
  for (let i = 0; i < 26; i++) {
    sparkle(ctx, rand() * W, rand() * H, 4 + rand() * 7, i % 3 ? 'rgba(255,255,255,0.9)' : theme.gold);
  }
}

export function drawFairyFrame(ctx, W, H, theme) {
  ctx.save();
  ctx.lineWidth = 5;
  ctx.strokeStyle = 'rgba(255,255,255,0.95)';
  ctx.beginPath();
  ctx.roundRect(16, 16, W - 32, H - 32, 28);
  ctx.stroke();
  ctx.setLineDash([2, 7]);
  ctx.lineCap = 'round';
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = theme.accent;
  ctx.beginPath();
  ctx.roundRect(26, 26, W - 52, H - 52, 22);
  ctx.stroke();
  ctx.restore();
}

// Flower clusters in the corners, drawn on top of everything else.
export function drawFairyCorners(ctx, W, H, theme) {
  const rand = rng(1123);
  const corners = [[0, 0, 1, 1], [W, 0, -1, 1], [0, H, 1, -1], [W, H, -1, -1]];
  const k = 1.45; // overall cluster size
  for (const [cx, cy, sx, sy] of corners) {
    for (let i = 0; i < 7; i++) {
      leaf(ctx, cx + sx * (8 + rand() * 40) * k, cy + sy * (8 + rand() * 40) * k, (30 + rand() * 18) * k,
        Math.atan2(sy, sx) + (rand() - 0.5) * 1.9, i % 2 ? theme.leaf : theme.leaf2);
    }
    // [dx, dy, radius, tinted]
    const flowers = [[24, 24, 30, 0], [68, 12, 21, 0], [12, 70, 21, 0], [60, 56, 14, 1], [100, 26, 11, 1], [26, 104, 11, 1], [92, 66, 9, 0]];
    for (const [dx, dy, r, tinted] of flowers) {
      daisy(ctx, cx + sx * dx * k, cy + sy * dy * k, r * k, tinted ? theme.flower2 : '#ffffff',
        tinted ? '#ffffff' : '#f6d16b', rand() * Math.PI);
    }
    sparkle(ctx, cx + sx * 128 * k * 0.9, cy + sy * 34 * k, 8, theme.gold);
    sparkle(ctx, cx + sx * 40 * k, cy + sy * 128 * k * 0.9, 6, '#ffffff');
  }
}
