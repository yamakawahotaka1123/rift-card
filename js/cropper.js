// Crop dialog: the frame is fixed and the image pans/zooms behind it.
const dialog = document.getElementById('cropper');
const stage = document.getElementById('crop-stage');
const img = document.getElementById('crop-img');
const mask = document.getElementById('crop-mask');
const zoomInput = document.getElementById('crop-zoom');

const MAX_ZOOM = 5;
let view = null; // { w, h, W, H, base, zoom, ox, oy }
let resolveCrop = null;
const pointers = new Map();
let pinchStart = null;

const scale = () => view.base * view.zoom;

function clamp() {
  const s = scale();
  view.ox = Math.min(0, Math.max(view.W - view.w * s, view.ox));
  view.oy = Math.min(0, Math.max(view.H - view.h * s, view.oy));
}

function draw() {
  clamp();
  const s = scale();
  img.style.width = `${view.w * s}px`;
  img.style.height = `${view.h * s}px`;
  img.style.transform = `translate(${view.ox}px, ${view.oy}px)`;
  zoomInput.value = String(view.zoom);
}

// Zoom while keeping the image point under (px, py) fixed.
function zoomAt(zoom, px = view.W / 2, py = view.H / 2) {
  const prev = scale();
  view.zoom = Math.min(MAX_ZOOM, Math.max(1, zoom));
  const next = scale();
  view.ox = px - ((px - view.ox) / prev) * next;
  view.oy = py - ((py - view.oy) / prev) * next;
  draw();
}

function stagePoint(e) {
  const r = stage.getBoundingClientRect();
  return [e.clientX - r.left, e.clientY - r.top];
}

stage.addEventListener('pointerdown', (e) => {
  stage.setPointerCapture(e.pointerId);
  pointers.set(e.pointerId, stagePoint(e));
  if (pointers.size === 2) {
    const [a, b] = [...pointers.values()];
    pinchStart = { dist: Math.hypot(a[0] - b[0], a[1] - b[1]), zoom: view.zoom };
  }
});

stage.addEventListener('pointermove', (e) => {
  if (!pointers.has(e.pointerId)) return;
  const prev = pointers.get(e.pointerId);
  const cur = stagePoint(e);
  pointers.set(e.pointerId, cur);
  if (pointers.size === 1) {
    view.ox += cur[0] - prev[0];
    view.oy += cur[1] - prev[1];
    draw();
  } else if (pointers.size === 2 && pinchStart) {
    const [a, b] = [...pointers.values()];
    const dist = Math.hypot(a[0] - b[0], a[1] - b[1]);
    zoomAt(pinchStart.zoom * (dist / pinchStart.dist), (a[0] + b[0]) / 2, (a[1] + b[1]) / 2);
  }
});

const endPointer = (e) => {
  pointers.delete(e.pointerId);
  if (pointers.size < 2) pinchStart = null;
};
stage.addEventListener('pointerup', endPointer);
stage.addEventListener('pointercancel', endPointer);

stage.addEventListener('wheel', (e) => {
  e.preventDefault();
  const [px, py] = stagePoint(e);
  zoomAt(view.zoom * Math.exp(-e.deltaY * 0.0015), px, py);
}, { passive: false });

zoomInput.addEventListener('input', () => zoomAt(Number(zoomInput.value)));

function finish(result) {
  const done = resolveCrop;
  resolveCrop = null;
  if (img.src.startsWith('blob:')) URL.revokeObjectURL(img.src);
  dialog.close();
  done?.(result);
}

document.getElementById('crop-cancel').addEventListener('click', () => finish(null));
dialog.addEventListener('cancel', (e) => {
  e.preventDefault();
  finish(null);
});

let output = null;
document.getElementById('crop-ok').addEventListener('click', () => {
  const s = scale();
  const c = document.createElement('canvas');
  c.width = output.outW;
  c.height = output.outH;
  const g = c.getContext('2d');
  g.imageSmoothingQuality = 'high';
  g.drawImage(img, -view.ox / s, -view.oy / s, view.W / s, view.H / s, 0, 0, c.width, c.height);
  finish(c.toDataURL('image/jpeg', 0.88));
});

/**
 * Opens the crop dialog for an image file.
 * Resolves with a JPEG data URL of size outW x outH, or null if cancelled.
 */
export function cropImage(file, { aspect, round = false, outW, outH, title }) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const probe = new Image();
    probe.onload = () => {
      document.getElementById('crop-title').textContent = title;
      mask.classList.toggle('round', round);
      stage.style.aspectRatio = String(aspect);
      // Keep tall frames (the square icon) from overflowing short screens.
      stage.style.maxWidth = `${Math.round(window.innerHeight * 0.55 * aspect)}px`;
      dialog.showModal();
      const W = stage.clientWidth;
      const H = W / aspect;
      view = {
        w: probe.naturalWidth,
        h: probe.naturalHeight,
        W,
        H,
        base: Math.max(W / probe.naturalWidth, H / probe.naturalHeight),
        zoom: 1,
        ox: 0,
        oy: 0,
      };
      // Start centered.
      view.ox = (W - view.w * view.base) / 2;
      view.oy = (H - view.h * view.base) / 2;
      output = { outW, outH };
      resolveCrop = resolve;
      img.src = url;
      draw();
    };
    probe.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('unsupported image'));
    };
    probe.src = url;
  });
}
