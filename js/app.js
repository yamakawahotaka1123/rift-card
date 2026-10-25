import {
  DDRAGON, DEFAULT_STATE, DIVISIONS, MAX_CHAMPS, MAX_COMMENT, MAX_TAGS,
  ROLES, SAMPLE_STATE, TAGS, THEMES, TIERS,
} from './data.js';
import { champSquareUrl, renderCard } from './card.js';

const STORAGE_KEY = 'riftcard:v1';
const $ = (sel) => document.querySelector(sel);

const form = $('#form');
const canvas = $('#card');
const ctxData = { version: '', champions: {} };
let state = loadState();
let sortedChamps = [];

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (saved) return { ...DEFAULT_STATE, ...saved };
  } catch { /* storage unavailable */ }
  return { ...DEFAULT_STATE };
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* storage unavailable */ }
}

function toast(message) {
  const el = $('#toast');
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove('show'), 3200);
}

// ---------- Rendering ----------

let renderToken = 0;
let renderQueued = false;
function scheduleRender() {
  if (renderQueued) return;
  renderQueued = true;
  requestAnimationFrame(async () => {
    renderQueued = false;
    if (!ctxData.version) return;
    const token = ++renderToken;
    const scratch = document.createElement('canvas');
    await renderCard(scratch, state, ctxData);
    if (token !== renderToken) return;
    canvas.getContext('2d').drawImage(scratch, 0, 0);
    $('#loading').hidden = true;
  });
}

function update(patch) {
  state = { ...state, ...patch };
  saveState();
  syncUI();
  scheduleRender();
}

// ---------- Form ----------

function buildStaticUI() {
  $('#tier').innerHTML = TIERS.map((t) => `<option value="${t.id}">${t.label}</option>`).join('');
  $('#division').innerHTML = DIVISIONS.map((d) => `<option value="${d}">${d}</option>`).join('');

  $('#roles').innerHTML = ROLES.map((r) => `
    <button type="button" class="role" data-role="${r.id}">
      <img src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/svg/position-${r.id}.svg" alt="">
      <span>${r.label}</span><em></em>
    </button>`).join('');

  $('#tags').innerHTML = TAGS.map((t) => `<button type="button" class="chip" data-tag="${t}">${t}</button>`).join('');

  $('#themes').innerHTML = THEMES.map((t) => `
    <button type="button" class="theme" data-theme="${t.id}" style="--a:${t.accent};--b:${t.bg1};--c:${t.bg2}">
      <i></i><span>${t.label}</span>
    </button>`).join('');
}

function syncUI() {
  for (const el of form.querySelectorAll('[name]')) {
    const value = state[el.name];
    if (document.activeElement === el) continue;
    if (el.name === 'splashSkin') continue;
    el.value = value ?? '';
  }
  $('#division-field').hidden = !TIERS.find((t) => t.id === state.tier)?.divisions;
  $('#comment-count').textContent = `${[...state.comment].length} / ${MAX_COMMENT}`;

  for (const group of form.querySelectorAll('[data-radio]')) {
    for (const b of group.children) b.classList.toggle('on', state[group.dataset.radio] === b.dataset.value);
  }

  for (const b of $('#roles').children) {
    const id = b.dataset.role;
    const kind = id === state.mainRole ? 'main' : state.subRoles.includes(id) ? 'sub' : '';
    b.className = `role ${kind}`;
    b.querySelector('em').textContent = kind === 'main' ? 'メイン' : kind === 'sub' ? 'サブ' : '';
  }

  for (const b of $('#tags').children) b.classList.toggle('on', state.tags.includes(b.dataset.tag));
  for (const b of $('#themes').children) b.classList.toggle('on', b.dataset.theme === state.theme);

  champButton($('#icon-btn'), state.iconChamp, 'チャンピオンから選ぶ');
  champButton($('#splash-btn'), state.splashChamp, 'チャンピオンを選ぶ');
  $('#skin').hidden = !state.splashChamp;
  $('#splash-clear').hidden = !state.splashChamp;
  $('#splash-controls').hidden = !state.splashChamp;

  const list = $('#champ-list');
  list.innerHTML = state.champs.map((id, i) => `
    <div class="champ-item">
      <img src="${champSquareUrl(ctxData.version, id)}" alt="">
      <span>${ctxData.champions[id]?.name || id}</span>
      <div class="champ-ops">
        <button type="button" data-move="${i}" title="左へ" ${i === 0 ? 'disabled' : ''}>←</button>
        <button type="button" data-remove="${i}" title="削除">×</button>
      </div>
    </div>`).join('')
    + (state.champs.length < MAX_CHAMPS ? '<button type="button" class="champ-add" data-pick="champs">＋ 追加</button>' : '');
}

function champButton(btn, id, emptyLabel) {
  if (id && ctxData.version) {
    btn.innerHTML = `<img src="${champSquareUrl(ctxData.version, id)}" alt=""><span>${ctxData.champions[id]?.name || id}</span>`;
  } else {
    btn.innerHTML = `<span class="empty">${emptyLabel}</span>`;
  }
}

form.addEventListener('input', (e) => {
  const el = e.target;
  if (!el.name) return;
  let value = el.value;
  if (el.type === 'range' || el.name === 'splashSkin') value = Number(value);
  if (el.name === 'x') value = value.replace(/^@/, '');
  update({ [el.name]: value });
});

form.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;

  if (btn.parentElement?.dataset.radio) {
    update({ [btn.parentElement.dataset.radio]: btn.dataset.value });
  } else if (btn.dataset.role) {
    const id = btn.dataset.role;
    let { mainRole, subRoles } = state;
    subRoles = subRoles.filter((r) => r !== id);
    if (mainRole === id) {
      mainRole = '';
    } else if (state.subRoles.includes(id)) {
      if (mainRole) subRoles.push(mainRole);
      mainRole = id;
    } else {
      subRoles.push(id);
    }
    update({ mainRole, subRoles });
  } else if (btn.dataset.tag) {
    const tag = btn.dataset.tag;
    if (state.tags.includes(tag)) {
      update({ tags: state.tags.filter((t) => t !== tag) });
    } else if (state.tags.length >= MAX_TAGS) {
      toast(`プレイスタイルは${MAX_TAGS}個まで選べます`);
    } else {
      update({ tags: [...state.tags, tag] });
    }
  } else if (btn.dataset.theme) {
    update({ theme: btn.dataset.theme });
  } else if (btn.dataset.pick) {
    openPicker(btn.dataset.pick);
  } else if (btn.dataset.remove) {
    const champs = [...state.champs];
    champs.splice(Number(btn.dataset.remove), 1);
    update({ champs });
  } else if (btn.dataset.move) {
    const i = Number(btn.dataset.move);
    const champs = [...state.champs];
    [champs[i - 1], champs[i]] = [champs[i], champs[i - 1]];
    update({ champs });
  } else if (btn.id === 'splash-clear') {
    update({ splashChamp: '', splashSkin: 0 });
  }
});

// ---------- Skins ----------

const skinCache = new Map();
async function loadSkins(id) {
  if (!skinCache.has(id)) {
    skinCache.set(id, fetch(`${DDRAGON}/cdn/${ctxData.version}/data/ja_JP/champion/${id}.json`)
      .then((r) => r.json())
      .then((json) => json.data[id].skins)
      .catch(() => [{ num: 0, name: 'default' }]));
  }
  return skinCache.get(id);
}

async function syncSkins() {
  const select = $('#skin');
  if (!state.splashChamp) {
    select.innerHTML = '';
    return;
  }
  const id = state.splashChamp;
  const skins = await loadSkins(id);
  if (id !== state.splashChamp) return;
  select.innerHTML = skins.map((s) => `<option value="${s.num}">${s.name === 'default' ? 'デフォルト' : s.name}</option>`).join('');
  select.value = String(state.splashSkin);
}

// ---------- Champion picker ----------

const picker = $('#picker');
let pickTarget = '';

// Lets "あーり" match "アーリ".
const normalize = (s) => s.normalize('NFKC').toLowerCase()
  .replace(/[ぁ-ゖ]/g, (c) => String.fromCharCode(c.charCodeAt(0) + 0x60))
  .replace(/[\s・'.]/g, '');

function openPicker(target) {
  if (!sortedChamps.length) return;
  pickTarget = target;
  $('#picker-search').value = '';
  renderPicker();
  picker.showModal();
  if (matchMedia('(pointer: fine)').matches) $('#picker-search').focus();
}

function renderPicker() {
  const q = normalize($('#picker-search').value);
  const chosen = pickTarget === 'champs' ? state.champs : [pickTarget === 'icon' ? state.iconChamp : state.splashChamp];
  const items = sortedChamps.filter((c) => !q || c.search.includes(q));
  $('#picker-status').textContent = pickTarget === 'champs'
    ? `${state.champs.length} / ${MAX_CHAMPS} 体選択中`
    : '';
  $('#picker-grid').innerHTML = items.map((c) => `
    <button type="button" class="${chosen.includes(c.id) ? 'on' : ''}" data-id="${c.id}">
      <img loading="lazy" src="${champSquareUrl(ctxData.version, c.id)}" alt="">
      <span>${c.name}</span>
    </button>`).join('') || '<p class="picker-empty">見つかりませんでした</p>';
}

$('#picker-search').addEventListener('input', renderPicker);
$('#picker-close').addEventListener('click', () => picker.close());
picker.addEventListener('click', (e) => {
  if (e.target === picker) picker.close();
});

$('#picker-grid').addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-id]');
  if (!btn) return;
  const id = btn.dataset.id;
  if (pickTarget === 'champs') {
    if (state.champs.includes(id)) {
      update({ champs: state.champs.filter((c) => c !== id) });
    } else if (state.champs.length >= MAX_CHAMPS) {
      toast(`得意チャンピオンは${MAX_CHAMPS}体まで選べます`);
      return;
    } else {
      update({ champs: [...state.champs, id] });
    }
    renderPicker();
    if (state.champs.length >= MAX_CHAMPS) picker.close();
  } else if (pickTarget === 'icon') {
    update({ iconChamp: id, iconId: '' });
    picker.close();
  } else {
    update({ splashChamp: id, splashSkin: 0 });
    syncSkins();
    picker.close();
  }
});

// ---------- Export ----------

const cardBlob = () => new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
const fileName = () => `summoner-card-${(state.name || 'card').replace(/[\\/:*?"<>|\s]/g, '_')}.png`;

$('#btn-download').addEventListener('click', async () => {
  const blob = await cardBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName();
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

async function copyImage() {
  if (!navigator.clipboard || !window.ClipboardItem) return false;
  try {
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': cardBlob() })]);
    return true;
  } catch {
    return false;
  }
}

$('#btn-copy').addEventListener('click', async () => {
  toast(await copyImage() ? '画像をコピーしました' : 'このブラウザではコピーできません。「画像を保存」を使ってください');
});

$('#btn-share').addEventListener('click', async () => {
  const text = 'LoLの自己紹介カードを作りました！';
  const hashtags = ['LoL自己紹介カード', 'サモナーカード', 'LoLフレンド募集'];
  const pageUrl = location.href.split('#')[0];

  // Phones: hand the image straight to the OS share sheet (X, LINE, Discord…).
  const blob = await cardBlob();
  const file = new File([blob], fileName(), { type: 'image/png' });
  if (matchMedia('(pointer: coarse)').matches && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], text: `${text}\n${hashtags.map((h) => `#${h}`).join(' ')}\n${pageUrl}` });
      return;
    } catch (err) {
      if (err.name === 'AbortError') return;
    }
  }

  // Desktop: X's intent URL can't attach images, so copy the image for pasting.
  const copied = await copyImage();
  const intent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(pageUrl)}&hashtags=${encodeURIComponent(hashtags.join(','))}`;
  window.open(intent, '_blank', 'noopener');
  toast(copied ? '画像をコピーしました。投稿欄に貼り付け（Ctrl+V）てください' : '保存した画像を投稿に添付してください');
});

$('#btn-sample').addEventListener('click', () => {
  update({ ...SAMPLE_STATE });
  syncSkins();
});

$('#btn-reset').addEventListener('click', () => {
  if (!confirm('入力内容をすべてリセットしますか？')) return;
  update({ ...DEFAULT_STATE });
  syncSkins();
});

// ---------- Boot ----------

async function init() {
  buildStaticUI();
  syncUI();
  try {
    const versions = await fetch(`${DDRAGON}/api/versions.json`).then((r) => r.json());
    ctxData.version = versions[0];
    const json = await fetch(`${DDRAGON}/cdn/${ctxData.version}/data/ja_JP/champion.json`).then((r) => r.json());
    ctxData.champions = json.data;
    sortedChamps = Object.values(json.data)
      .map((c) => ({ id: c.id, name: c.name, search: normalize(`${c.name}${c.id}${c.title}`) }))
      .sort((a, b) => a.name.localeCompare(b.name, 'ja'));
  } catch {
    $('#loading').textContent = 'チャンピオンデータを読み込めませんでした。再読み込みしてください。';
    return;
  }
  syncUI();
  syncSkins();
  scheduleRender();
  // Re-render once web fonts finish so the first preview isn't stuck on a fallback font.
  document.fonts?.ready.then(scheduleRender);
}

init();
