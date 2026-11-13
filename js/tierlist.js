// チャンピオン ティアリストメーカー（/tierlist/）。個人が作って画像として共有するための、バックエンド不要のツール。
// データ取得は summonercard.com 本体・フィアレスドラフトと同じく Data Dragon から直接。
import { DDRAGON } from './data.js';

const champSquareUrl = (version, id) => `${DDRAGON}/cdn/${version}/img/champion/${id}.png`;

const TIERS = [
  { id: 'S', color: '#ff7f7f' },
  { id: 'A', color: '#ffbf7f' },
  { id: 'B', color: '#ffdf7f' },
  { id: 'C', color: '#ffff7f' },
  { id: 'D', color: '#bfff7f' },
  { id: 'F', color: '#7fbfff' },
];
const STORAGE_KEY = 'sc-tierlist-v1';

const $ = (sel) => document.querySelector(sel);

const ctx = { version: '', champions: {}, list: [] };
// state.tiers: { S: [championId...], ... }、state.pool: [championId...]
let state = null;

function defaultState(ids) {
  const tiers = {};
  for (const t of TIERS) tiers[t.id] = [];
  return { title: '', tiers, pool: [...ids] };
}

function loadSavedState(ids) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    if (!saved || typeof saved !== 'object' || !saved.tiers || !Array.isArray(saved.pool)) return null;
    const known = new Set(ids);
    const placed = new Set();
    const tiers = {};
    for (const t of TIERS) {
      const arr = Array.isArray(saved.tiers[t.id]) ? saved.tiers[t.id].filter((id) => known.has(id) && !placed.has(id)) : [];
      arr.forEach((id) => placed.add(id));
      tiers[t.id] = arr;
    }
    const pool = ids.filter((id) => !placed.has(id));
    return { title: typeof saved.title === 'string' ? saved.title.slice(0, 40) : '', tiers, pool };
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

async function loadChampions() {
  const versions = await fetch(`${DDRAGON}/api/versions.json`).then((r) => r.json());
  ctx.version = versions[0];
  const json = await fetch(`${DDRAGON}/cdn/${ctx.version}/data/ja_JP/champion.json`).then((r) => r.json());
  ctx.champions = json.data;
  ctx.list = Object.values(json.data).sort((a, b) => a.name.localeCompare(b.name, 'ja'));
}

function champName(id) {
  return ctx.champions[id]?.name || id;
}

// ------------------------------------------------------------ 描画

function buildTileEl(id, removable) {
  const tile = document.createElement('div');
  tile.className = 'tile';
  tile.dataset.id = id;
  const img = document.createElement('img');
  img.src = champSquareUrl(ctx.version, id);
  img.alt = champName(id);
  img.loading = 'lazy';
  tile.appendChild(img);
  const name = document.createElement('div');
  name.className = 'name';
  name.textContent = champName(id);
  tile.appendChild(name);
  if (removable) {
    const rm = document.createElement('div');
    rm.className = 'remove';
    rm.textContent = '×';
    rm.addEventListener('pointerdown', (e) => e.stopPropagation());
    rm.addEventListener('click', (e) => {
      e.stopPropagation();
      moveChampion(id, 'pool');
      renderAll();
      save();
    });
    tile.appendChild(rm);
  }
  tile.addEventListener('pointerdown', onTilePointerDown);
  return tile;
}

function renderTiers() {
  const wrap = $('#tiers');
  wrap.innerHTML = '';
  for (const t of TIERS) {
    const row = document.createElement('div');
    row.className = 'tier-row';
    const label = document.createElement('div');
    label.className = 'tier-label';
    label.style.background = t.color;
    label.textContent = t.id;
    const zone = document.createElement('div');
    zone.className = 'tier-zone';
    zone.dataset.zone = t.id;
    for (const id of state.tiers[t.id]) zone.appendChild(buildTileEl(id, true));
    row.appendChild(label);
    row.appendChild(zone);
    wrap.appendChild(row);
  }
}

function renderPool(filter = '') {
  const zone = $('#pool-zone');
  zone.innerHTML = '';
  zone.dataset.zone = 'pool';
  const q = filter.trim().toLowerCase();
  const ids = state.pool.filter((id) => !q || champName(id).toLowerCase().includes(q) || id.toLowerCase().includes(q));
  if (state.pool.length === 0) {
    const empty = document.createElement('div');
    empty.id = 'pool-empty';
    empty.textContent = '全員ランク分けしたよ！';
    zone.appendChild(empty);
  } else {
    for (const id of ids) zone.appendChild(buildTileEl(id, false));
  }
  $('#pool-count').textContent = `${state.pool.length}/${ctx.list.length}`;
}

function renderAll() {
  renderTiers();
  renderPool($('#search').value);
}

// ------------------------------------------------------------ データ操作

function zoneArray(zoneId) {
  return zoneId === 'pool' ? state.pool : state.tiers[zoneId];
}

function moveChampion(id, toZone, toIndex = -1) {
  for (const t of TIERS) {
    const i = state.tiers[t.id].indexOf(id);
    if (i !== -1) state.tiers[t.id].splice(i, 1);
  }
  const pi = state.pool.indexOf(id);
  if (pi !== -1) state.pool.splice(pi, 1);
  const arr = zoneArray(toZone);
  if (toIndex < 0 || toIndex > arr.length) arr.push(id);
  else arr.splice(toIndex, 0, id);
}

// ------------------------------------------------------------ ドラッグ（Pointer Events。マウス/タッチ共通）

let drag = null; // { id, ghost, fromZone }

function zoneElements() {
  return [...document.querySelectorAll('.tier-zone, #pool-zone')];
}

function findDropTarget(x, y) {
  for (const zone of zoneElements()) {
    const r = zone.getBoundingClientRect();
    if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return zone;
  }
  return null;
}

function indexInZone(zone, x, y) {
  const tiles = [...zone.querySelectorAll('.tile')];
  for (let i = 0; i < tiles.length; i++) {
    const r = tiles[i].getBoundingClientRect();
    const midY = r.top + r.height / 2;
    if (y < midY - r.height / 2) continue;
    if (y <= midY) {
      if (x < r.left + r.width / 2) return i;
    } else if (y <= r.bottom) {
      if (x < r.left + r.width / 2) return i;
      return i + 1;
    }
  }
  return tiles.length;
}

function onTilePointerDown(e) {
  if (e.button !== undefined && e.button !== 0) return;
  const tile = e.currentTarget;
  const id = tile.dataset.id;
  const rect = tile.getBoundingClientRect();
  const fromZone = tile.closest('[data-zone]')?.dataset.zone;
  const ghost = tile.cloneNode(true);
  ghost.classList.add('ghost');
  ghost.style.width = `${rect.width}px`;
  ghost.style.height = `${rect.height}px`;
  ghost.style.left = `${rect.left}px`;
  ghost.style.top = `${rect.top}px`;
  document.body.appendChild(ghost);
  tile.classList.add('dragging');

  drag = {
    id, fromZone, ghost, tile,
    offX: e.clientX - rect.left, offY: e.clientY - rect.top,
    startX: e.clientX, startY: e.clientY, moved: false,
  };
  tile.setPointerCapture(e.pointerId);
  tile.addEventListener('pointermove', onTilePointerMove);
  tile.addEventListener('pointerup', onTilePointerUp);
  tile.addEventListener('pointercancel', onTilePointerUp);
  e.preventDefault();
}

function onTilePointerMove(e) {
  if (!drag) return;
  drag.moved = drag.moved || Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY) > 4;
  drag.ghost.style.left = `${e.clientX - drag.offX}px`;
  drag.ghost.style.top = `${e.clientY - drag.offY}px`;
  document.querySelectorAll('.tier-zone.hover, #pool-zone.hover').forEach((z) => z.classList.remove('hover'));
  const target = findDropTarget(e.clientX, e.clientY);
  if (target) target.classList.add('hover');
}

function onTilePointerUp(e) {
  if (!drag) return;
  const { id, fromZone, ghost, tile } = drag;
  tile.removeEventListener('pointermove', onTilePointerMove);
  tile.removeEventListener('pointerup', onTilePointerUp);
  tile.removeEventListener('pointercancel', onTilePointerUp);
  document.querySelectorAll('.tier-zone.hover, #pool-zone.hover').forEach((z) => z.classList.remove('hover'));
  ghost.remove();
  tile.classList.remove('dragging');

  const target = drag.moved ? findDropTarget(e.clientX, e.clientY) : null;
  if (target) {
    const toZone = target.dataset.zone;
    const idx = indexInZone(target, e.clientX, e.clientY);
    moveChampion(id, toZone, toZone === fromZone ? idx : idx);
    save();
  }
  drag = null;
  renderAll();
}

// ------------------------------------------------------------ 画像として保存

async function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

async function exportImage() {
  const TILE = 64;
  const GAP = 6;
  const LABEL_W = 84;
  const PAD = 16;
  const TITLE_H = state.title.trim() ? 48 : 0;
  const CANVAS_W = 960;
  const cols = Math.max(1, Math.floor((CANVAS_W - LABEL_W - PAD * 2) / (TILE + GAP)));

  const rows = TIERS.map((t) => {
    const ids = state.tiers[t.id];
    const lineCount = Math.max(1, Math.ceil(ids.length / cols));
    return { ...t, ids, height: lineCount * (TILE + GAP) + GAP };
  });
  const totalH = PAD * 2 + TITLE_H + rows.reduce((s, r) => s + r.height, 0) + 28;

  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_W;
  canvas.height = totalH;
  const g = canvas.getContext('2d');
  g.fillStyle = '#06090d';
  g.fillRect(0, 0, CANVAS_W, totalH);

  let y = PAD;
  if (TITLE_H) {
    g.fillStyle = '#f0e6d2';
    g.font = '700 22px "M PLUS 1p", sans-serif';
    g.textBaseline = 'top';
    g.fillText(state.title.trim().slice(0, 40), PAD, y);
    y += TITLE_H;
  }

  const images = new Map();
  const allIds = rows.flatMap((r) => r.ids);
  await Promise.all(allIds.map(async (id) => {
    images.set(id, await loadImage(champSquareUrl(ctx.version, id)));
  }));

  for (const r of rows) {
    g.fillStyle = r.color;
    g.fillRect(PAD, y, LABEL_W, r.height);
    g.fillStyle = '#1a1406';
    g.font = '700 28px Georgia, serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(r.id, PAD + LABEL_W / 2, y + r.height / 2);
    g.textAlign = 'left';
    g.textBaseline = 'alphabetic';

    g.fillStyle = '#0b1016';
    g.fillRect(PAD + LABEL_W, y, CANVAS_W - PAD * 2 - LABEL_W, r.height);

    r.ids.forEach((id, i) => {
      const col = i % cols;
      const line = Math.floor(i / cols);
      const x = PAD + LABEL_W + GAP + col * (TILE + GAP);
      const iy = y + GAP + line * (TILE + GAP);
      const img = images.get(id);
      if (img) {
        g.drawImage(img, x, iy, TILE, TILE);
      } else {
        g.fillStyle = '#22303e';
        g.fillRect(x, iy, TILE, TILE);
      }
      g.strokeStyle = 'rgba(255,255,255,.15)';
      g.strokeRect(x, iy, TILE, TILE);
    });

    y += r.height;
  }

  g.fillStyle = '#7c8794';
  g.font = '12px "M PLUS 1p", sans-serif';
  g.textAlign = 'right';
  g.fillText('summonercard.com', CANVAS_W - PAD, totalH - PAD + 2);

  return canvas;
}

async function onSaveClick() {
  const btn = $('#save-btn');
  btn.disabled = true;
  const orig = btn.textContent;
  btn.textContent = '作成中…';
  try {
    const canvas = await exportImage();
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `tierlist_${Date.now()}.png`;
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

async function main() {
  await loadChampions();
  const ids = ctx.list.map((c) => c.id);
  state = loadSavedState(ids) || defaultState(ids);

  $('#title-input').value = state.title;
  $('#title-input').addEventListener('input', (e) => {
    state.title = e.target.value.slice(0, 40);
    save();
  });
  $('#search').addEventListener('input', (e) => renderPool(e.target.value));
  $('#reset-btn').addEventListener('click', () => {
    if (!confirm('ティア分けと タイトルを全部リセットするよ。いい？')) return;
    state = defaultState(ids);
    $('#title-input').value = '';
    renderAll();
    save();
  });
  $('#save-btn').addEventListener('click', onSaveClick);

  renderAll();
}

main().catch((e) => {
  console.error(e);
  showToast('⚠ チャンピオンデータの取得に失敗しました。時間を置いてもう一度試してね');
});
