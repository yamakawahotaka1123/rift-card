// 作戦ボード（マップツール、/map/）。サモナーズリフトの地図にペン・矢印・ピン・チャンピオン・テキストを置いて、
// ローテーションやダイブ、オブジェクト取りの作戦を図解し、画像として保存・共有するためのツール。
import { DDRAGON } from './data.js';

const STORAGE_KEY = 'sc-map-v1';
const PALETTE = ['#ff4655', '#3fa7ff', '#ffd23f', '#39e67a', '#c77dff', '#ffffff', '#111111', '#ff9f43'];
const LW_PEN = 0.006;
const LW_ARROW = 0.008;
const PIN_R = 0.018;
const CHAMP_R = 0.05;
const TEXT_SIZE = 0.032;
const ARROWHEAD_LEN = 0.03;
const MOVE_THRESHOLD = 6;

const $ = (sel) => document.querySelector(sel);

const ctx = { version: '', champions: {}, champList: [], mapImg: null, imgCache: new Map() };

let state = { title: '', objects: [] };
let currentTool = 'pen';
let currentColor = PALETTE[0];
let armedChampId = null;

let canvas, cctx;
let drawingObj = null; // ペンで描画中のオブジェクト
let arrowDraft = null; // 矢印のプレビュー
let pointerDownPt = null;

function defaultState() {
  return { title: '', objects: [] };
}

function sanitizeState(saved) {
  if (!saved || typeof saved !== 'object' || !Array.isArray(saved.objects)) return null;
  const objects = saved.objects.filter((o) => o && typeof o === 'object' && typeof o.type === 'string');
  return { title: typeof saved.title === 'string' ? saved.title.slice(0, 40) : '', objects };
}

function loadSavedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return sanitizeState(JSON.parse(raw));
  } catch {
    return null;
  }
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // 端末のストレージが使えなくても動作自体は継続する
  }
}

let toastTimer = null;
function showToast(text) {
  const el = $('#toast');
  el.textContent = text;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
}

async function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function champIconUrl(id) {
  return `${DDRAGON}/cdn/${ctx.version}/img/champion/${id}.png`;
}

function getChampImage(id) {
  const cached = ctx.imgCache.get(id);
  if (cached instanceof HTMLImageElement) return Promise.resolve(cached);
  if (cached) return cached; // 読み込み中の Promise
  const p = loadImage(champIconUrl(id)).then((img) => {
    ctx.imgCache.set(id, img);
    return img;
  });
  ctx.imgCache.set(id, p);
  return p;
}

async function loadData() {
  const versions = await fetch(`${DDRAGON}/api/versions.json`).then((r) => r.json());
  ctx.version = versions[0];
  const champJson = await fetch(`${DDRAGON}/cdn/${ctx.version}/data/ja_JP/champion.json`).then((r) => r.json());
  ctx.champions = champJson.data;
  ctx.champList = Object.values(champJson.data)
    .map((c) => ({ id: c.id, name: c.name }))
    .sort((a, b) => a.name.localeCompare(b.name, 'ja'));
  ctx.mapImg = await loadImage(`${DDRAGON}/cdn/${ctx.version}/img/map/map11.png`);
}

// ------------------------------------------------------------ キャンバス描画

function sizeCanvas() {
  const rect = canvas.parentElement.getBoundingClientRect();
  const L = Math.round(rect.width);
  const dpr = window.devicePixelRatio || 1;
  canvas.width = L * dpr;
  canvas.height = L * dpr;
  cctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return L;
}

function drawArrowHead(g, x1, y1, x2, y2, len, color) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const a1 = angle + Math.PI * 0.85;
  const a2 = angle - Math.PI * 0.85;
  g.beginPath();
  g.moveTo(x2, y2);
  g.lineTo(x2 + len * Math.cos(a1), y2 + len * Math.sin(a1));
  g.lineTo(x2 + len * Math.cos(a2), y2 + len * Math.sin(a2));
  g.closePath();
  g.fillStyle = color;
  g.fill();
}

function drawTextLabel(g, L, obj) {
  const fontPx = Math.max(11, TEXT_SIZE * L);
  g.font = `700 ${fontPx}px "M PLUS 1p", sans-serif`;
  g.textBaseline = 'middle';
  const padX = 6;
  const w = g.measureText(obj.text).width + padX * 2;
  const h = fontPx + 8;
  const x = obj.x * L;
  const y = obj.y * L;
  g.fillStyle = 'rgba(6,9,13,.72)';
  g.beginPath();
  if (g.roundRect) g.roundRect(x - w / 2, y - h / 2, w, h, 6);
  else g.rect(x - w / 2, y - h / 2, w, h);
  g.fill();
  g.strokeStyle = obj.color;
  g.lineWidth = 1.5;
  g.stroke();
  g.fillStyle = obj.color;
  g.textAlign = 'center';
  g.fillText(obj.text, x, y + 1);
  g.textAlign = 'left';
}

function drawObject(g, L, obj) {
  if (obj.type === 'pen') {
    if (!obj.pts.length) return;
    g.strokeStyle = obj.color;
    g.lineWidth = Math.max(2, LW_PEN * L);
    g.lineCap = 'round';
    g.lineJoin = 'round';
    g.beginPath();
    g.moveTo(obj.pts[0].x * L, obj.pts[0].y * L);
    for (const p of obj.pts.slice(1)) g.lineTo(p.x * L, p.y * L);
    g.stroke();
  } else if (obj.type === 'arrow') {
    const x1 = obj.x1 * L, y1 = obj.y1 * L, x2 = obj.x2 * L, y2 = obj.y2 * L;
    g.strokeStyle = obj.color;
    g.lineWidth = Math.max(2, LW_ARROW * L);
    g.lineCap = 'round';
    g.beginPath();
    g.moveTo(x1, y1);
    g.lineTo(x2, y2);
    g.stroke();
    drawArrowHead(g, x1, y1, x2, y2, Math.max(10, ARROWHEAD_LEN * L), obj.color);
  } else if (obj.type === 'pin') {
    const r = Math.max(6, PIN_R * L);
    g.beginPath();
    g.arc(obj.x * L, obj.y * L, r, 0, Math.PI * 2);
    g.fillStyle = obj.color;
    g.fill();
    g.lineWidth = Math.max(1.5, r * .18);
    g.strokeStyle = '#06090d';
    g.stroke();
  } else if (obj.type === 'champ') {
    const r = Math.max(14, CHAMP_R * L);
    const img = ctx.imgCache.get(obj.champId);
    const x = obj.x * L, y = obj.y * L;
    g.save();
    g.beginPath();
    g.arc(x, y, r, 0, Math.PI * 2);
    g.closePath();
    g.clip();
    if (img && img.complete) g.drawImage(img, x - r, y - r, r * 2, r * 2);
    else { g.fillStyle = '#22303e'; g.fillRect(x - r, y - r, r * 2, r * 2); }
    g.restore();
    g.beginPath();
    g.arc(x, y, r, 0, Math.PI * 2);
    g.lineWidth = Math.max(2, r * .16);
    g.strokeStyle = obj.color;
    g.stroke();
  } else if (obj.type === 'text') {
    drawTextLabel(g, L, obj);
  }
}

function render() {
  const L = canvas.getBoundingClientRect().width;
  cctx.clearRect(0, 0, L, L);
  if (ctx.mapImg) cctx.drawImage(ctx.mapImg, 0, 0, L, L);
  for (const obj of state.objects) drawObject(cctx, L, obj);
  if (drawingObj) drawObject(cctx, L, drawingObj);
  if (arrowDraft) drawObject(cctx, L, arrowDraft);
}

// ------------------------------------------------------------ 入力座標

function ptFromEvent(e) {
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width;
  const y = (e.clientY - rect.top) / rect.height;
  return { x: Math.min(1, Math.max(0, x)), y: Math.min(1, Math.max(0, y)) };
}

function dist(a, b) {
  return Math.hypot((a.x - b.x) * canvas.getBoundingClientRect().width, (a.y - b.y) * canvas.getBoundingClientRect().height);
}

// ------------------------------------------------------------ ツール操作

function setTool(tool) {
  currentTool = tool;
  document.querySelectorAll('.btn.tool').forEach((b) => b.classList.toggle('active', b.dataset.tool === tool));
  if (tool !== 'champ') disarmChamp();
}

function setColor(color) {
  currentColor = color;
  document.querySelectorAll('.swatch').forEach((s) => s.classList.toggle('active', s.dataset.color === color));
}

function armChamp(id) {
  armedChampId = id;
  getChampImage(id).then(() => render());
  $('#armed-badge').style.display = 'flex';
  $('#armed-badge-img').src = champIconUrl(id);
  $('#armed-badge-name').textContent = ctx.champions[id]?.name || id;
  setTool('champ');
}

function disarmChamp() {
  armedChampId = null;
  $('#armed-badge').style.display = 'none';
}

function openChampModal() {
  $('#champ-modal').hidden = false;
  $('#champ-search').value = '';
  $('#champ-search').focus();
  renderChampGrid('');
}

function closeChampModal() {
  $('#champ-modal').hidden = true;
}

function renderChampGrid(filter) {
  const grid = $('#champ-grid');
  grid.innerHTML = '';
  const q = filter.trim().toLowerCase();
  const list = ctx.champList.filter((c) => !q || c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q));
  for (const c of list) {
    const btn = document.createElement('button');
    btn.type = 'button';
    const img = document.createElement('img');
    img.src = champIconUrl(c.id);
    img.alt = c.name;
    img.loading = 'lazy';
    const span = document.createElement('span');
    span.textContent = c.name;
    btn.appendChild(img);
    btn.appendChild(span);
    btn.addEventListener('click', () => {
      closeChampModal();
      armChamp(c.id);
    });
    grid.appendChild(btn);
  }
}

let pendingTextPt = null;
function openTextModal(pt) {
  pendingTextPt = pt;
  $('#text-modal-input').value = '';
  $('#text-modal').hidden = false;
  $('#text-modal-input').focus();
}
function closeTextModal() {
  $('#text-modal').hidden = true;
  pendingTextPt = null;
}
function saveTextModal() {
  const text = $('#text-modal-input').value.trim().slice(0, 24);
  if (text && pendingTextPt) {
    state.objects.push({ type: 'text', color: currentColor, text, x: pendingTextPt.x, y: pendingTextPt.y });
    render();
    save();
  }
  closeTextModal();
}

// ------------------------------------------------------------ ポインター操作

function onPointerDown(e) {
  if (e.button !== undefined && e.button !== 0) return;
  canvas.setPointerCapture(e.pointerId);
  const pt = ptFromEvent(e);
  pointerDownPt = pt;

  if (currentTool === 'pen') {
    drawingObj = { type: 'pen', color: currentColor, pts: [pt] };
  } else if (currentTool === 'arrow') {
    arrowDraft = { type: 'arrow', color: currentColor, x1: pt.x, y1: pt.y, x2: pt.x, y2: pt.y };
  } else if (currentTool === 'pin') {
    state.objects.push({ type: 'pin', color: currentColor, x: pt.x, y: pt.y });
    render();
    save();
  } else if (currentTool === 'champ') {
    if (!armedChampId) { openChampModal(); return; }
    state.objects.push({ type: 'champ', champId: armedChampId, color: currentColor, x: pt.x, y: pt.y });
    render();
    save();
  } else if (currentTool === 'text') {
    openTextModal(pt);
  }
  e.preventDefault();
}

function onPointerMove(e) {
  if (!drawingObj && !arrowDraft) return;
  const pt = ptFromEvent(e);
  if (drawingObj) {
    drawingObj.pts.push(pt);
    render();
  } else if (arrowDraft) {
    arrowDraft.x2 = pt.x;
    arrowDraft.y2 = pt.y;
    render();
  }
}

function onPointerUp(e) {
  if (drawingObj) {
    if (drawingObj.pts.length > 1) state.objects.push(drawingObj);
    drawingObj = null;
    render();
    save();
  } else if (arrowDraft) {
    if (dist(pointerDownPt, ptFromEvent(e)) > MOVE_THRESHOLD) state.objects.push(arrowDraft);
    arrowDraft = null;
    render();
    save();
  }
}

// ------------------------------------------------------------ 画像として保存

async function exportImage() {
  const EXPORT_L = 1000;
  const TITLE_H = state.title.trim() ? 48 : 0;
  const PAD = 0;
  const canvasOut = document.createElement('canvas');
  canvasOut.width = EXPORT_L;
  canvasOut.height = EXPORT_L + TITLE_H + 24;
  const g = canvasOut.getContext('2d');
  g.fillStyle = '#06090d';
  g.fillRect(0, 0, canvasOut.width, canvasOut.height);

  let y = 0;
  if (TITLE_H) {
    g.fillStyle = '#f0e6d2';
    g.font = '700 22px "M PLUS 1p", sans-serif';
    g.textBaseline = 'top';
    g.fillText(state.title.trim().slice(0, 40), 16, 14);
    y = TITLE_H;
  }

  if (ctx.mapImg) g.drawImage(ctx.mapImg, 0, y, EXPORT_L, EXPORT_L);
  await Promise.all(
    state.objects.filter((o) => o.type === 'champ').map((o) => getChampImage(o.champId))
  );
  g.save();
  g.translate(0, y);
  for (const obj of state.objects) drawObject(g, EXPORT_L, obj);
  g.restore();

  g.fillStyle = '#7c8794';
  g.font = '12px "M PLUS 1p", sans-serif';
  g.textAlign = 'right';
  g.fillText('summonercard.com', EXPORT_L - 12, canvasOut.height - 18);

  return canvasOut;
}

async function onSaveClick() {
  const btn = $('#save-btn');
  btn.disabled = true;
  const orig = btn.textContent;
  btn.textContent = '作成中…';
  try {
    const canvasOut = await exportImage();
    const url = canvasOut.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `map_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (e) {
    console.error(e);
    showToast('⚠ 画像の作成に失敗しました。時間を置いてもう一度試してね');
  } finally {
    btn.disabled = false;
    btn.textContent = orig;
  }
}

// ------------------------------------------------------------ 起動

function buildPalette() {
  const wrap = $('#color-palette');
  for (const color of PALETTE) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'swatch';
    b.dataset.color = color;
    b.style.background = color;
    if (color === currentColor) b.classList.add('active');
    b.addEventListener('click', () => setColor(color));
    wrap.appendChild(b);
  }
}

async function main() {
  await loadData();
  state = loadSavedState() || defaultState();
  await Promise.all(state.objects.filter((o) => o.type === 'champ').map((o) => getChampImage(o.champId)));

  canvas = $('#map-canvas');
  cctx = canvas.getContext('2d');
  sizeCanvas();
  render();
  window.addEventListener('resize', () => { sizeCanvas(); render(); });

  $('#title-input').value = state.title;
  $('#title-input').addEventListener('input', (e) => {
    state.title = e.target.value.slice(0, 40);
    save();
  });

  document.querySelectorAll('.btn.tool').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.dataset.tool === 'champ' && !armedChampId) { openChampModal(); setTool('champ'); return; }
      setTool(btn.dataset.tool);
    });
  });

  buildPalette();
  $('#custom-color').addEventListener('input', (e) => setColor(e.target.value));

  $('#armed-badge-cancel').addEventListener('click', () => { disarmChamp(); setTool('pen'); });

  $('#undo-btn').addEventListener('click', () => {
    if (!state.objects.length) return;
    state.objects.pop();
    render();
    save();
  });
  $('#clear-btn').addEventListener('click', () => {
    if (!state.objects.length) return;
    if (!confirm('描いたものを全部消すよ。いい？')) return;
    state.objects = [];
    render();
    save();
  });
  $('#save-btn').addEventListener('click', onSaveClick);

  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointercancel', onPointerUp);

  $('#champ-search').addEventListener('input', (e) => renderChampGrid(e.target.value));
  $('#champ-modal-backdrop').addEventListener('click', closeChampModal);

  $('#text-modal-cancel').addEventListener('click', closeTextModal);
  $('#text-modal-save').addEventListener('click', saveTextModal);
  $('#text-modal-backdrop').addEventListener('click', closeTextModal);
  $('#text-modal-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') saveTextModal();
  });
}

main().catch((e) => {
  console.error(e);
  showToast('⚠ データの取得に失敗しました。時間を置いてもう一度試してね');
});
