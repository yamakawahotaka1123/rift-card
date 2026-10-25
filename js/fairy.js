// Pastel "yumekawa / yami-kawa" decorations in a sticker style: everything has a soft
// lavender outline. Checkered floor, puffy clouds, lollipops, a syringe, capsules,
// bandages, striped hearts, stars and a unicorn horn for the icon.
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

// Fill the current path, then outline it in the theme's line color.
function ink(ctx, theme, fill, width = 3) {
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.lineWidth = width;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.strokeStyle = theme.line;
  ctx.stroke();
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

function starPath(ctx, x, y, r, rot = 0) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 ? r * 0.5 : r;
    const a = (Math.PI / 5) * i - Math.PI / 2 + rot;
    ctx.lineTo(x + Math.cos(a) * rad, y + Math.sin(a) * rad);
  }
  ctx.closePath();
}

function heartPath(ctx, x, y, s) {
  ctx.beginPath();
  ctx.moveTo(x, y + s * 0.42);
  ctx.bezierCurveTo(x - s * 1.15, y - s * 0.3, x - s * 0.5, y - s * 1.1, x, y - s * 0.45);
  ctx.bezierCurveTo(x + s * 0.5, y - s * 1.1, x + s * 1.15, y - s * 0.3, x, y + s * 0.42);
  ctx.closePath();
}

// Circles are outlined first and filled after, so only the outer edge of the cloud shows a line.
function cloud(ctx, theme, x, y, w, fill) {
  const bumps = [[0, 0, 0.24], [0.2, -0.17, 0.27], [0.45, -0.22, 0.3], [0.7, -0.12, 0.25], [0.88, 0.02, 0.2], [0.45, 0.06, 0.3]];
  ctx.lineWidth = 6;
  ctx.strokeStyle = theme.line;
  for (const [dx, dy, r] of bumps) {
    ctx.beginPath();
    ctx.arc(x + dx * w, y + dy * w, r * w, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = fill;
  for (const [dx, dy, r] of bumps) {
    ctx.beginPath();
    ctx.arc(x + dx * w, y + dy * w, r * w, 0, Math.PI * 2);
    ctx.fill();
  }
  // Soft highlight
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.beginPath();
  ctx.ellipse(x + 0.35 * w, y - 0.28 * w, 0.12 * w, 0.05 * w, -0.3, 0, Math.PI * 2);
  ctx.fill();
}

function lollipop(ctx, theme, x, y, r) {
  // Striped stick
  ctx.beginPath();
  ctx.roundRect(x - 4, y, 8, r * 2.6, 4);
  ink(ctx, theme, '#ffffff', 2.5);
  ctx.save();
  ctx.clip();
  ctx.strokeStyle = theme.candy[0];
  ctx.lineWidth = 3;
  for (let i = 0; i < 8; i++) {
    ctx.beginPath();
    ctx.moveTo(x - 6, y + i * 12);
    ctx.lineTo(x + 6, y + i * 12 - 7);
    ctx.stroke();
  }
  ctx.restore();
  // Swirl candy
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ink(ctx, theme, theme.candy[0]);
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, r - 2, 0, Math.PI * 2);
  ctx.clip();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = r * 0.22;
  ctx.beginPath();
  for (let t = 0; t < Math.PI * 6; t += 0.1) {
    const rad = (t / (Math.PI * 6)) * r;
    ctx.lineTo(x + Math.cos(t) * rad, y + Math.sin(t) * rad);
  }
  ctx.stroke();
  ctx.restore();
}

function syringe(ctx, theme, x, y, len, angle) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  const bw = len * 0.2;
  // Needle
  ctx.beginPath();
  ctx.moveTo(len * 0.62, -2);
  ctx.lineTo(len * 0.86, 0);
  ctx.lineTo(len * 0.62, 2);
  ink(ctx, theme, '#eef3ff', 2);
  // Tip
  ctx.beginPath();
  ctx.roundRect(len * 0.52, -bw * 0.22, len * 0.12, bw * 0.44, 3);
  ink(ctx, theme, '#ffffff', 2.5);
  // Barrel with pink liquid
  ctx.beginPath();
  ctx.roundRect(0, -bw / 2, len * 0.54, bw, 6);
  ink(ctx, theme, 'rgba(225,240,255,0.95)');
  ctx.save();
  ctx.clip();
  ctx.fillStyle = theme.candy[0];
  ctx.fillRect(len * 0.22, -bw / 2, len * 0.34, bw);
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(len * (0.3 + i * 0.08), (i % 2 ? -1 : 1) * bw * 0.15, bw * 0.12, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
  ctx.strokeStyle = theme.line;
  ctx.lineWidth = 1.5;
  for (let i = 1; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(len * 0.1 * i, -bw / 2);
    ctx.lineTo(len * 0.1 * i, -bw / 2 + bw * 0.3);
    ctx.stroke();
  }
  // Flange and plunger with a heart end
  ctx.beginPath();
  ctx.roundRect(-6, -bw * 0.85, 8, bw * 1.7, 4);
  ink(ctx, theme, '#ffffff', 2.5);
  ctx.beginPath();
  ctx.roundRect(-len * 0.2, -bw * 0.14, len * 0.2, bw * 0.28, 3);
  ink(ctx, theme, '#ffffff', 2.5);
  ctx.save();
  ctx.translate(-len * 0.24, 0);
  ctx.rotate(-Math.PI / 2);
  heartPath(ctx, 0, 0, bw * 0.75);
  ink(ctx, theme, '#ffffff');
  ctx.restore();
  ctx.restore();
}

function capsule(ctx, theme, x, y, len, angle) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  const h = len * 0.42;
  ctx.beginPath();
  ctx.roundRect(-len / 2, -h / 2, len / 2, h, [h / 2, 0, 0, h / 2]);
  ink(ctx, theme, theme.candy[0], 2.5);
  ctx.beginPath();
  ctx.roundRect(0, -h / 2, len / 2, h, [0, h / 2, h / 2, 0]);
  ink(ctx, theme, '#ffffff', 2.5);
  ctx.restore();
}

function bandage(ctx, theme, x, y, len, angle) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  const h = len * 0.34;
  ctx.beginPath();
  ctx.roundRect(-len / 2, -h / 2, len, h, h / 2);
  ink(ctx, theme, '#ffe3ea', 2.5);
  ctx.beginPath();
  ctx.roundRect(-len * 0.16, -h / 2 + 3, len * 0.32, h - 6, 3);
  ink(ctx, theme, '#ffffff', 2);
  ctx.fillStyle = theme.line;
  for (const dx of [-0.34, -0.26, 0.26, 0.34]) {
    for (const dy of [-0.18, 0.18]) {
      ctx.beginPath();
      ctx.arc(dx * len, dy * h, 1.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

function checkerFloor(ctx, theme, W, H, top) {
  const size = 26;
  ctx.save();
  ctx.globalAlpha = 0.8;
  for (let y = top, row = 0; y < H; y += size, row++) {
    for (let x = 0, col = 0; x < W; x += size, col++) {
      ctx.fillStyle = (row + col) % 2 ? theme.checker[0] : theme.checker[1];
      ctx.fillRect(x, y, size, size);
    }
  }
  ctx.restore();
  // Fade the top edge into the sky.
  const fade = ctx.createLinearGradient(0, top, 0, top + 40);
  fade.addColorStop(0, theme.bgStops[theme.bgStops.length - 1]);
  fade.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = fade;
  ctx.fillRect(0, top, W, 40);
}

// Background pieces that sit behind the card content.
export function drawFairyBackdrop(ctx, W, H, theme, hasImage) {
  const rand = rng(20261025);
  if (!hasImage) {
    // Faint polka dots
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    for (let y = 18; y < H; y += 36) {
      for (let x = (y / 36) % 2 ? 18 : 0; x < W; x += 36) {
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  checkerFloor(ctx, theme, W, H, H - 92);

  // Scattered outlined stars, hearts, capsules and sparkles, kept out of the text and image areas.
  const keepOut = [
    [50, 30, 225, 235], [225, 40, 870, 260], [880, 20, 1150, 255],
    [50, 255, 440, 405], [465, 255, 1105, 440], [50, 440, 640, 500], [50, 500, 945, 635],
  ];
  const free = (x, y) => !keepOut.some(([x1, y1, x2, y2]) => x > x1 - 12 && x < x2 + 12 && y > y1 - 12 && y < y2 + 12);
  for (let i = 0, placed = 0; placed < 22 && i < 400; i++) {
    const x = 30 + rand() * (W - 60), y = 30 + rand() * (H - 140);
    if (!free(x, y)) continue;
    placed++;
    const color = theme.candy[Math.floor(rand() * theme.candy.length)];
    const kind = rand();
    ctx.globalAlpha = 0.85;
    if (kind < 0.35) {
      starPath(ctx, x, y, 7 + rand() * 5, rand());
      ink(ctx, theme, color, 2);
    } else if (kind < 0.7) {
      heartPath(ctx, x, y, 7 + rand() * 5);
      ink(ctx, theme, color, 2);
    } else if (kind < 0.82) {
      capsule(ctx, theme, x, y, 22, rand() * Math.PI);
    } else {
      sparkle(ctx, x, y, 6 + rand() * 5, '#ffffff');
    }
  }
  ctx.globalAlpha = 1;
  for (let i = 0; i < 16; i++) sparkle(ctx, rand() * W, rand() * H, 3 + rand() * 4, i % 3 ? '#ffffff' : theme.gold);
}

export function drawFairyFrame(ctx, W, H, theme) {
  ctx.save();
  ctx.lineWidth = 7;
  ctx.strokeStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(16, 16, W - 32, H - 32, 28);
  ctx.stroke();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = theme.line;
  ctx.beginPath();
  ctx.roundRect(12, 12, W - 24, H - 24, 32);
  ctx.stroke();
  ctx.setLineDash([2, 8]);
  ctx.lineCap = 'round';
  ctx.lineWidth = 3;
  ctx.strokeStyle = theme.accent;
  ctx.beginPath();
  ctx.roundRect(26, 26, W - 52, H - 52, 22);
  ctx.stroke();
  ctx.restore();
}

// Corner illustrations, drawn under the content.
export function drawFairyCorners(ctx, W, H, theme) {
  // Bottom-left clouds
  cloud(ctx, theme, -40, H - 30, 170, theme.clouds[0]);
  cloud(ctx, theme, 90, H - 8, 130, theme.clouds[1]);
  // Bottom-right scene (the comment box is shortened to make room)
  lollipop(ctx, theme, W - 92, H - 150, 34);
  syringe(ctx, theme, W - 200, H - 92, 150, -0.5);
  cloud(ctx, theme, W - 230, H - 26, 150, theme.clouds[2]);
  cloud(ctx, theme, W - 120, H - 10, 160, theme.clouds[0]);
  starPath(ctx, W - 40, H - 210, 11, 0.2);
  ink(ctx, theme, theme.gold, 2);
  heartPath(ctx, W - 165, H - 175, 10);
  ink(ctx, theme, theme.candy[1], 2);
  // Top corners
  starPath(ctx, 34, 40, 9, -0.2);
  ink(ctx, theme, theme.gold, 2);
  sparkle(ctx, W - 50, 44, 9, '#ffffff');
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
  g.addColorStop(0, '#ffffff');
  g.addColorStop(0.5, theme.candy[1]);
  g.addColorStop(1, theme.candy[2]);
  ink(ctx, theme, g, 2.5);
  ctx.clip();
  ctx.strokeStyle = theme.candy[0];
  ctx.lineWidth = 4;
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

// A small bandage stuck on the icon's lower-left edge.
export function drawIconBandage(ctx, cx, cy, r, theme) {
  bandage(ctx, theme, cx - r * 0.72, cy + r * 0.62, 52, -0.75);
}
