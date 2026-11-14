// チャンピオン／アイテム ティアリストメーカー（/tierlist/）。個人が作って画像として共有するための、バックエンド不要のツール。
// データ取得は summonercard.com 本体・フィアレスドラフトと同じく Data Dragon から直接。
import { DDRAGON } from './data.js';

const TIERS = [
  { id: 'S', color: '#ff7f7f' },
  { id: 'A', color: '#ffbf7f' },
  { id: 'B', color: '#ffdf7f' },
  { id: 'C', color: '#ffff7f' },
  { id: 'D', color: '#bfff7f' },
  { id: 'F', color: '#7fbfff' },
];
const LABEL_MAX = 12;
const LABEL_TEMPLATES = [
  { id: 'default', name: 'デフォルト（S/A/B/C/D/F）', labels: ['S', 'A', 'B', 'C', 'D', 'F'] },
  { id: 'pickpool', name: 'ピックプール紹介（得意〜NG）', labels: ['得意', 'できる', 'できなくもない', '微妙', '苦手', 'NG'] },
];
const STORAGE_KEY = 'sc-tierlist-v2';
const MODE_LABEL = { champ: 'チャンピオン', item: 'アイテム' };

const $ = (sel) => document.querySelector(sel);

const ctx = { version: '', champions: {}, champList: [], items: {}, itemList: [] };
let mode = 'champ';
// state[mode].tiers: { S: [id...], ... }、state[mode].pool: [id...]、state[mode].title: string
let state = null;

function idsOf(m) {
  return m === 'champ' ? ctx.champList.map((c) => c.id) : ctx.itemList.map((it) => it.id);
}

function defaultLabels() {
  const labels = {};
  for (const t of TIERS) labels[t.id] = t.id;
  return labels;
}

function defaultBoard(ids) {
  const tiers = {};
  for (const t of TIERS) tiers[t.id] = [];
  return { title: '', labels: defaultLabels(), tiers, pool: [...ids] };
}

function defaultState() {
  return { champ: defaultBoard(idsOf('champ')), item: defaultBoard(idsOf('item')) };
}

function sanitizeBoard(saved, ids) {
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
  const labels = defaultLabels();
  if (saved.labels && typeof saved.labels === 'object') {
    for (const t of TIERS) {
      const v = saved.labels[t.id];
      if (typeof v === 'string' && v.trim()) labels[t.id] = v.trim().slice(0, LABEL_MAX);
    }
  }
  return { title: typeof saved.title === 'string' ? saved.title.slice(0, 40) : '', labels, tiers, pool };
}

function loadSavedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    const champ = sanitizeBoard(saved?.champ, idsOf('champ'));
    const item = sanitizeBoard(saved?.item, idsOf('item'));
    if (!champ && !item) return null;
    return { champ: champ || defaultBoard(idsOf('champ')), item: item || defaultBoard(idsOf('item')) };
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

async function loadData() {
  const versions = await fetch(`${DDRAGON}/api/versions.json`).then((r) => r.json());
  ctx.version = versions[0];
  const [champJson, itemJson] = await Promise.all([
    fetch(`${DDRAGON}/cdn/${ctx.version}/data/ja_JP/champion.json`).then((r) => r.json()),
    fetch(`${DDRAGON}/cdn/${ctx.version}/data/ja_JP/item.json`).then((r) => r.json()),
  ]);
  ctx.champions = champJson.data;
  ctx.champList = Object.values(champJson.data)
    .map((c) => ({ id: c.id, name: c.name }))
    .sort((a, b) => a.name.localeCompare(b.name, 'ja'));

  ctx.items = itemJson.data;
  ctx.itemList = Object.entries(itemJson.data)
    .filter(([, it]) => it.gold?.purchasable && it.maps?.['11'])
    .map(([id, it]) => ({ id, name: it.name }))
    .sort((a, b) => a.name.localeCompare(b.name, 'ja'));
}

function iconUrl(m, id) {
  return m === 'champ' ? `${DDRAGON}/cdn/${ctx.version}/img/champion/${id}.png` : `${DDRAGON}/cdn/${ctx.version}/img/item/${id}.png`;
}
function nameOf(m, id) {
  return m === 'champ' ? (ctx.champions[id]?.name || id) : (ctx.items[id]?.name || id);
}

// ------------------------------------------------------------ 描画

function buildTileEl(id, removable) {
  const tile = document.createElement('div');
  tile.className = 'tile';
  tile.dataset.id = id;
  const img = document.createElement('img');
  img.src = iconUrl(mode, id);
  img.alt = nameOf(mode, id);
  img.loading = 'lazy';
  tile.appendChild(img);
  const name = document.createElement('div');
  name.className = 'name';
  name.textContent = nameOf(mode, id);
  tile.appendChild(name);
  if (removable) {
    const rm = document.createElement('div');
    rm.className = 'remove';
    rm.textContent = '×';
    rm.addEventListener('pointerdown', (e) => e.stopPropagation());
    rm.addEventListener('click', (e) => {
      e.stopPropagation();
      moveItem(id, 'pool');
      renderAll();
      save();
    });
    tile.appendChild(rm);
  }
  tile.addEventListener('pointerdown', onTilePointerDown);
  return tile;
}

function commitLabel(t, label) {
  const board = state[mode];
  let text = label.textContent.replace(/\s+/g, ' ').trim().slice(0, LABEL_MAX);
  if (!text) text = t.id;
  if (board.labels[t.id] !== text) {
    board.labels[t.id] = text;
    save();
  }
  if (label.textContent !== text) label.textContent = text;
}

function renderTiers() {
  const wrap = $('#tiers');
  wrap.innerHTML = '';
  const board = state[mode];
  for (const t of TIERS) {
    const row = document.createElement('div');
    row.className = 'tier-row';
    const label = document.createElement('div');
    label.className = 'tier-label';
    label.style.background = t.color;
    label.contentEditable = 'true';
    label.spellcheck = false;
    label.textContent = board.labels[t.id] ?? t.id;
    label.title = 'クリックしてラベルを書きかえられます';
    label.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); label.blur(); }
    });
    label.addEventListener('paste', (e) => {
      e.preventDefault();
      const text = (e.clipboardData || window.clipboardData).getData('text/plain');
      document.execCommand('insertText', false, text);
    });
    label.addEventListener('blur', () => commitLabel(t, label));
    const zone = document.createElement('div');
    zone.className = 'tier-zone';
    zone.dataset.zone = t.id;
    for (const id of board.tiers[t.id]) zone.appendChild(buildTileEl(id, true));
    row.appendChild(label);
    row.appendChild(zone);
    wrap.appendChild(row);
  }
}

function applyLabelTemplate(templateId) {
  const tpl = LABEL_TEMPLATES.find((x) => x.id === templateId);
  if (!tpl) return;
  const board = state[mode];
  TIERS.forEach((t, i) => { board.labels[t.id] = tpl.labels[i] ?? t.id; });
  renderTiers();
  save();
  showToast(`ラベルを「${tpl.name}」にしたよ`);
}

function renderPool(filter = '') {
  const zone = $('#pool-zone');
  zone.innerHTML = '';
  zone.dataset.zone = 'pool';
  const board = state[mode];
  const q = filter.trim().toLowerCase();
  const ids = board.pool.filter((id) => !q || nameOf(mode, id).toLowerCase().includes(q) || id.toLowerCase().includes(q));
  if (board.pool.length === 0) {
    const empty = document.createElement('div');
    empty.id = 'pool-empty';
    empty.textContent = '全部ランク分けしたよ！';
    zone.appendChild(empty);
  } else {
    for (const id of ids) zone.appendChild(buildTileEl(id, false));
  }
  $('#pool-count').textContent = `${board.pool.length}/${idsOf(mode).length}`;
  $('#pool-head h2').textContent = `${MODE_LABEL[mode]}一覧`;
  $('#search').placeholder = `${MODE_LABEL[mode]}検索…`;
}

function renderTabs() {
  document.querySelectorAll('#mode-tabs .tab').forEach((b) => b.classList.toggle('active', b.dataset.mode === mode));
}

function renderAll() {
  $('#title-input').value = state[mode].title;
  renderTabs();
  renderTiers();
  renderPool($('#search').value);
}

// ------------------------------------------------------------ データ操作

function zoneArray(zoneId) {
  const board = state[mode];
  return zoneId === 'pool' ? board.pool : board.tiers[zoneId];
}

function moveItem(id, toZone, toIndex = -1) {
  const board = state[mode];
  for (const t of TIERS) {
    const i = board.tiers[t.id].indexOf(id);
    if (i !== -1) board.tiers[t.id].splice(i, 1);
  }
  const pi = board.pool.indexOf(id);
  if (pi !== -1) board.pool.splice(pi, 1);
  const arr = zoneArray(toZone);
  if (toIndex < 0 || toIndex > arr.length) arr.push(id);
  else arr.splice(toIndex, 0, id);
}

// ------------------------------------------------------------ ドラッグ（Pointer Events。マウス/タッチ共通）

let drag = null;

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
    moveItem(id, toZone, idx);
    save();
  }
  drag = null;
  renderAll();
}

// ------------------------------------------------------------ 画像として保存

function wrapLabelLines(g, text, maxWidth) {
  const lines = [];
  let cur = '';
  for (const ch of text) {
    const test = cur + ch;
    if (cur && g.measureText(test).width > maxWidth) {
      lines.push(cur);
      cur = ch;
    } else {
      cur = test;
    }
  }
  if (cur) lines.push(cur);
  return lines;
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

async function exportImage() {
  const board = state[mode];
  const TILE = 64;
  const GAP = 6;
  const LABEL_W = 84;
  const PAD = 16;
  const TITLE_H = board.title.trim() ? 48 : 0;
  const CANVAS_W = 960;
  const cols = Math.max(1, Math.floor((CANVAS_W - LABEL_W - PAD * 2) / (TILE + GAP)));

  const rows = TIERS.map((t) => {
    const ids = board.tiers[t.id];
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
    g.fillText(board.title.trim().slice(0, 40), PAD, y);
    y += TITLE_H;
  }

  const images = new Map();
  const allIds = rows.flatMap((r) => r.ids);
  await Promise.all(allIds.map(async (id) => {
    images.set(id, await loadImage(iconUrl(mode, id)));
  }));

  for (const r of rows) {
    g.fillStyle = r.color;
    g.fillRect(PAD, y, LABEL_W, r.height);
    g.fillStyle = '#1a1406';
    const labelText = board.labels[r.id] ?? r.id;
    const isAlnum = /^[A-Za-z0-9+\-]{1,3}$/.test(labelText);
    const fontFamily = isAlnum ? 'Georgia, serif' : '"M PLUS 1p", sans-serif';
    const fontPx = labelText.length <= 2 ? 28 : labelText.length <= 4 ? 20 : 15;
    g.font = `700 ${fontPx}px ${fontFamily}`;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    const lines = wrapLabelLines(g, labelText, LABEL_W - 12);
    const lineH = fontPx * 1.15;
    const startY = y + r.height / 2 - ((lines.length - 1) * lineH) / 2;
    lines.forEach((ln, i) => g.fillText(ln, PAD + LABEL_W / 2, startY + i * lineH));
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
    a.download = `tierlist_${mode}_${Date.now()}.png`;
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
  await loadData();
  state = loadSavedState() || defaultState();

  document.querySelectorAll('#mode-tabs .tab').forEach((btn) => {
    btn.addEventListener('click', () => {
      mode = btn.dataset.mode;
      $('#search').value = '';
      renderAll();
    });
  });

  $('#title-input').addEventListener('input', (e) => {
    state[mode].title = e.target.value.slice(0, 40);
    save();
  });
  $('#search').addEventListener('input', (e) => renderPool(e.target.value));
  $('#reset-btn').addEventListener('click', () => {
    if (!confirm(`${MODE_LABEL[mode]}のタブだけリセットするよ。いい？`)) return;
    state[mode] = defaultBoard(idsOf(mode));
    renderAll();
    save();
  });
  $('#save-btn').addEventListener('click', onSaveClick);

  const tplSelect = $('#label-template');
  for (const tpl of LABEL_TEMPLATES) {
    const opt = document.createElement('option');
    opt.value = tpl.id;
    opt.textContent = tpl.name;
    tplSelect.appendChild(opt);
  }
  tplSelect.addEventListener('change', (e) => {
    if (e.target.value) applyLabelTemplate(e.target.value);
  });

  renderAll();
}

main().catch((e) => {
  console.error(e);
  showToast('⚠ データの取得に失敗しました。時間を置いてもう一度試してね');
});
