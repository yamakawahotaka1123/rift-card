import {
  CDRAGON_GAME, DDRAGON, DEFAULT_STATE, DIVISIONS, MAX_CHAMPS, MAX_COMMENT, MAX_TAG_LENGTH, MAX_TAGS, NAME_PRESETS,
  ROLE_LEVELS, ROLES, SAMPLE_STATE, TAGS, THEMES, TIERS, mainRoleOf,
} from './data.js';
import { CARD_H, CARD_W, champSquareUrl, loadSplash, profileIconUrl, renderCard } from './card.js';
import { cropImage } from './cropper.js';

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
    if (saved) {
      // Older saves stored champs as ids with roles in a separate champRoles map.
      if (Array.isArray(saved.champs)) {
        saved.champs = saved.champs.map((c) => (typeof c === 'string' ? { id: c, role: saved.champRoles?.[c] || '' } : c));
      }
      delete saved.champRoles;
      // Older saves stored roles as mainRole + subRoles.
      if (!saved.roleLevels && (saved.mainRole || saved.subRoles)) {
        saved.roleLevels = Object.fromEntries((saved.subRoles || []).map((r) => [r, 'sub']));
        if (saved.mainRole) saved.roleLevels[saved.mainRole] = 'main';
      }
      delete saved.mainRole;
      delete saved.subRoles;
      // Older saves positioned the background with bgX/splashY focus values; start centered instead.
      delete saved.bgX;
      delete saved.splashY;
      return { ...DEFAULT_STATE, ...saved };
    }
  } catch { /* storage unavailable */ }
  return { ...DEFAULT_STATE };
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
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

// save: false skips localStorage while dragging; the final position is saved on release.
function update(patch, { save = true } = {}) {
  state = { ...state, ...patch };
  if (save && !saveState() && (state.iconUpload || state.bgUpload)) {
    toast('画像が大きすぎてブラウザに保存できませんでした（ページを閉じると消えます）');
  }
  syncUI();
  scheduleRender();
}

// ---------- Drag the background on the preview ----------

const hasBackground = () => Boolean(state.splashChamp || state.bgUpload);
const clampOffset = (v) => Math.round(Math.min(1, Math.max(-1, v)) * 1000) / 1000;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 4;
let bgDrag = null;

canvas.addEventListener('pointerdown', (e) => {
  if (!hasBackground()) return;
  canvas.setPointerCapture(e.pointerId);
  bgDrag = { x: e.clientX, y: e.clientY, offX: Number(state.bgOffX), offY: Number(state.bgOffY) };
});

canvas.addEventListener('pointermove', (e) => {
  if (!bgDrag) return;
  // The image follows the pointer 1:1 (offsets are fractions of the card size).
  const rect = canvas.getBoundingClientRect();
  update({
    bgOffX: clampOffset(bgDrag.offX + (e.clientX - bgDrag.x) / rect.width),
    bgOffY: clampOffset(bgDrag.offY + (e.clientY - bgDrag.y) / rect.height),
  }, { save: false });
});

const endBgDrag = () => {
  if (!bgDrag) return;
  bgDrag = null;
  saveState();
};
canvas.addEventListener('pointerup', endBgDrag);
canvas.addEventListener('pointercancel', endBgDrag);

canvas.addEventListener('wheel', (e) => {
  if (!hasBackground()) return;
  e.preventDefault();
  const zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Number(state.bgZoom || 1) * Math.exp(-e.deltaY * 0.0015)));
  update({ bgZoom: Math.round(zoom * 100) / 100 });
}, { passive: false });

// ---------- Form ----------

function buildStaticUI() {
  $('#tier').innerHTML = TIERS.map((t) => `<option value="${t.id}">${t.label}</option>`).join('');
  $('#division').innerHTML = DIVISIONS.map((d) => `<option value="${d}">${d}</option>`).join('');

  $('#roles').innerHTML = ROLES.map((r) => `
    <div class="role" data-role="${r.id}">
      <img src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/svg/position-${r.id}.svg" alt="">
      <span>${r.label}</span>
      <div class="role-btns">
        ${ROLE_LEVELS.map((l) => `<button type="button" data-setrole="${l.id}" data-role-id="${r.id}">${l.label}</button>`).join('')}
      </div>
    </div>`).join('');

  $('#name-presets').innerHTML = NAME_PRESETS
    .map((p) => `<button type="button" class="chip" data-name-preset="${p}">${p}</button>`).join('');

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
    const kind = state.roleLevels[id] || '';
    b.className = `role ${kind}`;
    for (const btn of b.querySelectorAll('[data-setrole]')) btn.classList.toggle('on', btn.dataset.setrole === kind);
  }

  renderTags();
  for (const b of $('#name-presets').children) b.classList.toggle('on', b.dataset.namePreset === state.name);
  for (const b of $('#themes').children) b.classList.toggle('on', b.dataset.theme === state.theme);

  if (state.iconUpload) {
    $('#icon-btn').innerHTML = `<img src="${state.iconUpload}" alt=""><span>アップロード画像</span>`;
  } else if (state.iconId) {
    $('#icon-btn').innerHTML = `<img src="${profileIconUrl(state.iconId)}" alt=""><span>${state.iconTitle || `アイコン #${state.iconId}`}</span>`;
  } else {
    champButton($('#icon-btn'), state.iconChamp, 'アイコンを選ぶ');
  }
  $('#icon-clear').hidden = !(state.iconUpload || state.iconId || state.iconChamp);
  $('#icon-recrop').hidden = !(state.iconUpload && uploadedFiles.icon);
  $('#bg-recrop').hidden = !(state.bgUpload && uploadedFiles.bg);

  if (state.bgUpload) {
    $('#splash-btn').innerHTML = `<img src="${state.bgUpload}" alt="" class="wide"><span>アップロード画像</span>`;
  } else {
    champButton($('#splash-btn'), state.splashChamp, 'スキンから選ぶ');
  }
  const hasBg = Boolean(state.splashChamp || state.bgUpload);
  $('#skin').hidden = !state.splashChamp || Boolean(state.bgUpload);
  $('#splash-clear').hidden = !hasBg;
  $('#splash-controls').hidden = !hasBg;
  canvas.classList.toggle('draggable', hasBg);

  const roleOptions = (selected) => `<option value="">ロールなし</option>`
    + ROLES.map((r) => `<option value="${r.id}"${r.id === selected ? ' selected' : ''}>${r.label}</option>`).join('');
  const list = $('#champ-list');
  $('#champ-legend').textContent = champLabelText();
  list.innerHTML = state.champs.map(({ id, role, img }, i) => `
    <div class="champ-item">
      <img src="${img || champSquareUrl(ctxData.version, id)}" alt="">
      <span>${ctxData.champions[id]?.name || id}</span>
      <select class="champ-role" data-role-index="${i}">${roleOptions(role)}</select>
      <button type="button" class="champ-img-btn" data-skinimg="${i}">スキン画像</button>
      ${img ? `<button type="button" class="champ-img-btn" data-resetimg="${i}">元に戻す</button>` : ''}
      <div class="champ-ops">
        <button type="button" data-move="${i}" title="左へ" ${i === 0 ? 'disabled' : ''}>←</button>
        <button type="button" data-remove="${i}" title="削除">×</button>
      </div>
    </div>`).join('')
    + (state.champs.length < MAX_CHAMPS ? '<button type="button" class="champ-add" data-pick="champs">＋ 追加</button>' : '');
}

const champLabelText = () => (state.champLabel === 'fav' ? '好きなチャンピオン' : '得意チャンピオン');

const escapeHtml = (s) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

function renderTags() {
  const chip = (t, custom) => `
    <button type="button" class="chip${state.tags.includes(t) ? ' on' : ''}${custom ? ' custom' : ''}" data-tag="${escapeHtml(t)}">
      ${escapeHtml(t)}${custom ? `<span class="chip-del" data-deltag="${escapeHtml(t)}" title="削除">×</span>` : ''}
    </button>`;
  $('#tags').innerHTML = TAGS.map((t) => chip(t, false)).join('')
    + state.customTags.map((t) => chip(t, true)).join('')
    + '<button type="button" class="chip add" data-addtag>＋ 自分で追加</button>';
}

// Swaps the "+" chip for a text box; Enter or leaving the box adds the tag.
function startAddTag(btn) {
  const input = document.createElement('input');
  input.className = 'chip-input';
  input.maxLength = MAX_TAG_LENGTH;
  input.placeholder = `${MAX_TAG_LENGTH}文字まで`;
  btn.replaceWith(input);
  input.focus();
  let done = false;
  const finish = (save) => {
    if (done) return;
    done = true;
    const tag = input.value.trim().replace(/\s+/g, ' ');
    if (!save || !tag) {
      renderTags();
      return;
    }
    const customTags = TAGS.includes(tag) || state.customTags.includes(tag) ? state.customTags : [...state.customTags, tag];
    let { tags } = state;
    if (!tags.includes(tag)) {
      if (tags.length >= MAX_TAGS) toast(`プレイスタイルは${MAX_TAGS}個まで選べます（追加だけしました）`);
      else tags = [...tags, tag];
    }
    update({ customTags, tags });
  };
  input.addEventListener('keydown', (e) => {
    if (e.isComposing) return;
    if (e.key === 'Enter') finish(true);
    if (e.key === 'Escape') finish(false);
  });
  input.addEventListener('blur', () => finish(true));
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
  if (el.dataset.roleIndex) {
    const i = Number(el.dataset.roleIndex);
    update({ champs: state.champs.map((c, j) => (j === i ? { ...c, role: el.value } : c)) });
    return;
  }
  if (!el.name) return;
  let value = el.value;
  if (el.type === 'range' || el.name === 'splashSkin') value = Number(value);
  if (el.name === 'x' || el.name === 'youtube') value = value.replace(/^@/, '');
  update({ [el.name]: value });
});

form.addEventListener('click', (e) => {
  const del = e.target.closest('[data-deltag]');
  if (del) {
    const tag = del.dataset.deltag;
    update({ customTags: state.customTags.filter((t) => t !== tag), tags: state.tags.filter((t) => t !== tag) });
    return;
  }
  const btn = e.target.closest('button');
  if (!btn) return;

  if (btn.dataset.namePreset) {
    // A preset replaces the Riot ID, so the tag is cleared too. Pressing it again clears the name.
    const preset = btn.dataset.namePreset;
    update(state.name === preset ? { name: '' } : { name: preset, tag: '' });
  } else if (btn.dataset.addtag !== undefined) {
    startAddTag(btn);
  } else if (btn.parentElement?.dataset.radio) {
    update({ [btn.parentElement.dataset.radio]: btn.dataset.value });
  } else if (btn.dataset.setrole) {
    // Pressing the active button again turns the role off. Only one main role:
    // choosing a new main clears the previous one.
    const id = btn.dataset.roleId;
    const level = btn.dataset.setrole;
    const roleLevels = { ...state.roleLevels };
    if (roleLevels[id] === level) {
      delete roleLevels[id];
    } else {
      if (level === 'main') {
        for (const r of Object.keys(roleLevels)) if (roleLevels[r] === 'main') delete roleLevels[r];
      }
      roleLevels[id] = level;
    }
    update({ roleLevels });
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
  } else if (btn.dataset.skinimg) {
    openSkinPicker(Number(btn.dataset.skinimg));
  } else if (btn.dataset.resetimg) {
    const i = Number(btn.dataset.resetimg);
    update({ champs: state.champs.map((c, j) => (j === i ? { id: c.id, role: c.role } : c)) });
  } else if (btn.dataset.remove) {
    update({ champs: state.champs.filter((_, j) => j !== Number(btn.dataset.remove)) });
  } else if (btn.dataset.move) {
    const i = Number(btn.dataset.move);
    const champs = [...state.champs];
    [champs[i - 1], champs[i]] = [champs[i], champs[i - 1]];
    update({ champs });
  } else if (btn.id === 'bg-pos-reset') {
    update({ bgOffX: 0, bgOffY: 0, bgZoom: 1 });
  } else if (btn.id === 'splash-clear') {
    update({ splashChamp: '', splashSkin: 0, bgUpload: '' });
  } else if (btn.id === 'icon-clear') {
    update({ iconChamp: '', iconId: '', iconTitle: '', iconUpload: '' });
  }
});

// ---------- Uploads ----------

// Originals stay in memory (not localStorage) so the user can re-crop during this visit.
const uploadedFiles = { icon: null, bg: null };
const CROP = {
  icon: () => ({ aspect: 1, round: state.iconShape === 'circle', outW: 300, outH: 300, title: 'アイコンをトリミング' }),
  bg: () => ({ aspect: CARD_W / CARD_H, outW: 1600, outH: 900, title: '背景をトリミング' }),
};
const APPLY = {
  icon: (data) => update({ iconUpload: data, iconId: '', iconTitle: '', iconChamp: '' }),
  bg: (data) => update({ bgUpload: data, splashChamp: '', splashSkin: 0, bgOffX: 0, bgOffY: 0, bgZoom: 1 }),
};

async function cropAndApply(kind) {
  const file = uploadedFiles[kind];
  if (!file) return;
  try {
    const data = await cropImage(file, CROP[kind]());
    if (data) APPLY[kind](data);
  } catch {
    uploadedFiles[kind] = null;
    toast('この画像は読み込めませんでした。JPEGかPNGを試してください');
  }
  syncUI();
}

for (const kind of ['icon', 'bg']) {
  $(`#${kind}-upload`).addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    uploadedFiles[kind] = file;
    cropAndApply(kind);
  });
  $(`#${kind}-recrop`).addEventListener('click', () => cropAndApply(kind));
}

// ---------- Reset ----------

const SECTIONS = {
  basic: ['name', 'tag', 'level', 'iconChamp', 'iconId', 'iconTitle', 'iconUpload', 'iconShape'],
  rank: ['tier', 'division'],
  roles: ['roleLevels'],
  champs: ['champs', 'champLabel'],
  tags: ['tags', 'customTags'],
  contact: ['hours', 'discord', 'x', 'twitch', 'youtube'],
  comment: ['comment'],
  design: ['theme', 'splashChamp', 'splashSkin', 'bgUpload', 'bgOffX', 'bgOffY', 'bgZoom', 'dim'],
};

form.addEventListener('click', (e) => {
  const section = e.target.closest('[data-clear]')?.dataset.clear;
  if (!section) return;
  const patch = Object.fromEntries(SECTIONS[section].map((k) => [k, DEFAULT_STATE[k]]));
  if (section === 'basic') uploadedFiles.icon = null;
  if (section === 'design') uploadedFiles.bg = null;
  update(patch);
  syncSkins();
});

function resetAll() {
  if (!confirm('入力内容をすべてリセットしますか？')) return;
  uploadedFiles.icon = uploadedFiles.bg = null;
  update({ ...DEFAULT_STATE });
  syncSkins();
}

// ---------- Skins ----------

const skinCache = new Map();
async function loadSkins(id) {
  if (!skinCache.has(id)) {
    skinCache.set(id, fetch(`${DDRAGON}/cdn/${ctxData.version}/data/ja_JP/champion/${id}.json`)
      .then((r) => r.json())
      // Chromas are listed as skins with a parentSkin but have no splash art of their own.
      .then((json) => json.data[id].skins.filter((s) => s.parentSkin === undefined))
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

// ---------- Favorite champion image from a skin ----------

const skinPicker = $('#skin-picker');
let skinTarget = -1;

async function openSkinPicker(index) {
  skinTarget = index;
  const { id } = state.champs[index];
  $('#skin-picker-title').textContent = `${ctxData.champions[id]?.name || id} のスキンを選ぶ`;
  $('#skin-grid').innerHTML = '<p class="picker-empty">読み込み中…</p>';
  skinPicker.showModal();
  const skins = await loadSkins(id);
  if (skinTarget !== index) return;
  // Tiles use the same file names as splashes; if one is missing, show the champion portrait instead.
  $('#skin-grid').innerHTML = skins.map((s) => `
    <button type="button" data-skin-num="${s.num}">
      <img loading="lazy" src="${DDRAGON}/cdn/img/champion/tiles/${id}_${s.num}.jpg" alt=""
        onerror="this.onerror=null;this.src='${champSquareUrl(ctxData.version, id)}'">
      <span>${s.name === 'default' ? 'デフォルト' : s.name}</span>
    </button>`).join('');
}

$('#skin-picker-close').addEventListener('click', () => skinPicker.close());
skinPicker.addEventListener('click', (e) => {
  if (e.target === skinPicker) skinPicker.close();
});

$('#skin-grid').addEventListener('click', async (e) => {
  const btn = e.target.closest('[data-skin-num]');
  if (!btn) return;
  const index = skinTarget;
  const entry = state.champs[index];
  skinPicker.close();
  try {
    const splash = await loadSplash(entry.id, ctxData.champions[entry.id]?.key, btn.dataset.skinNum);
    if (!splash) throw new Error('no splash');
    const blob = await fetch(splash.src).then((r) => r.blob());
    const data = await cropImage(blob, { aspect: 1, outW: 240, outH: 240, title: `${ctxData.champions[entry.id]?.name || entry.id} のアイコンをトリミング` });
    if (!data) return;
    // The list may have changed while cropping; match on the same entry object.
    update({ champs: state.champs.map((c) => (c === entry ? { ...c, img: data } : c)) });
  } catch {
    toast('このスキンの画像を読み込めませんでした');
  }
});

// ---------- Picker (champions / summoner icons) ----------

const picker = $('#picker');
let pickTarget = '';
let pickTab = 'champ';
const ICON_PAGE = 180;
let iconLimit = ICON_PAGE;
let iconList = null;
let iconData = null;
let pickRole = '';

// Role that newly added favorite champions get; starts at the main role.
function renderPickerRoles() {
  $('#picker-role-buttons').innerHTML = [{ id: '', label: 'なし' }, ...ROLES]
    .map((r) => `<button type="button" data-pickrole="${r.id}" class="${r.id === pickRole ? 'on' : ''}">${r.label}</button>`)
    .join('');
}

$('#picker-role-buttons').addEventListener('click', (e) => {
  const b = e.target.closest('[data-pickrole]');
  if (!b) return;
  pickRole = b.dataset.pickrole;
  renderPickerRoles();
  if (pickTarget === 'champs') renderPicker();
});

// Lets "あーり" match "アーリ" and "kda" match "K/DA".
const normalize = (s) => s.normalize('NFKC').toLowerCase()
  .replace(/[ぁ-ゖ]/g, (c) => String.fromCharCode(c.charCodeAt(0) + 0x60))
  .replace(/[\s・'./\-:]/g, '');

// ~5,000 icons (320KB gzipped), so only fetch them when the icon tab is first opened.
function loadIcons() {
  if (!iconList) {
    iconList = fetch(`${CDRAGON_GAME}/ja_jp/v1/summoner-icons.json`)
      .then((r) => r.json())
      .then((icons) => icons
        .map((i) => {
          const title = i.title.replace(/\s*アイコン$/, '');
          return { id: String(i.id), title, year: i.yearReleased, search: normalize(`${title}${i.id}`) };
        })
        .sort((a, b) => b.year - a.year || Number(b.id) - Number(a.id)))
      .then((list) => (iconData = list))
      .catch(() => {
        iconList = null;
        return [];
      });
  }
  return iconList;
}

function openPicker(target) {
  if (!sortedChamps.length) return;
  pickTarget = target;
  pickTab = target === 'icon' && !state.iconChamp ? 'profile' : 'champ';
  $('#picker-tabs').hidden = target !== 'icon';
  $('#picker-roles').hidden = target !== 'champs';
  if (target === 'champs') {
    pickRole = mainRoleOf(state);
    renderPickerRoles();
  }
  $('#picker-search').value = '';
  renderPicker();
  picker.showModal();
  if (matchMedia('(pointer: fine)').matches) $('#picker-search').focus();
}

function renderPicker() {
  iconLimit = ICON_PAGE;
  for (const b of $('#picker-tabs').children) b.classList.toggle('on', b.dataset.tab === pickTab);
  $('#picker-search').placeholder = pickTab === 'profile'
    ? 'アイコンを検索（例：アーリ、K/DA、ポロ）'
    : 'チャンピオンを検索（ひらがなOK）';
  if (pickTab === 'profile') {
    renderIconGrid();
    return;
  }
  const q = normalize($('#picker-search').value);
  const items = sortedChamps.filter((c) => !q || c.search.includes(q));
  $('#picker-status').textContent = pickTarget === 'champs'
    ? `${state.champs.length} / ${MAX_CHAMPS} 体選択中（上で選んだロールで登録。同じチャンプを別ロールで追加もできます）`
    : '';
  const roleLabel = (id) => ROLES.find((r) => r.id === id)?.label || 'ロールなし';
  $('#picker-grid').innerHTML = items.map((c) => {
    let cls = '';
    let note = '';
    if (pickTarget === 'champs') {
      const entries = state.champs.filter((e) => e.id === c.id);
      // "on" = already added with the role selected above; "partial" = added with another role.
      if (entries.some((e) => e.role === pickRole)) cls = 'on';
      else if (entries.length) cls = 'partial';
      if (entries.length) note = `<em>${entries.map((e) => roleLabel(e.role)).join('・')}</em>`;
    } else if (c.id === (pickTarget === 'icon' ? state.iconChamp : state.splashChamp)) {
      cls = 'on';
    }
    return `
    <button type="button" class="${cls}" data-id="${c.id}">
      <img loading="lazy" src="${champSquareUrl(ctxData.version, c.id)}" alt="">
      <span>${c.name}</span>${note}
    </button>`;
  }).join('') || '<p class="picker-empty">見つかりませんでした</p>';
}

async function renderIconGrid() {
  const grid = $('#picker-grid');
  if (!iconData) {
    $('#picker-status').textContent = 'アイコン一覧を読み込み中…';
    grid.innerHTML = '';
  }
  const icons = await loadIcons();
  if (pickTab !== 'profile' || !picker.open) return;
  if (!icons.length) {
    $('#picker-status').textContent = 'アイコン一覧を読み込めませんでした。閉じてもう一度開いてください。';
    return;
  }
  const q = normalize($('#picker-search').value);
  const items = icons.filter((i) => !q || i.search.includes(q));
  $('#picker-status').textContent = `${items.length.toLocaleString()} 件（新しい順）`;
  grid.innerHTML = items.slice(0, iconLimit).map((i) => `
    <button type="button" class="${i.id === String(state.iconId) ? 'on' : ''}" data-icon="${i.id}" title="${i.title}">
      <img loading="lazy" src="${profileIconUrl(i.id)}" alt="">
      <span>${i.title}</span>
    </button>`).join('')
    + (items.length > iconLimit ? `<button type="button" class="picker-more" data-more>もっと見る（残り ${(items.length - iconLimit).toLocaleString()} 件）</button>` : '')
    || '<p class="picker-empty">見つかりませんでした</p>';
}

// Load the next page automatically when scrolled near the bottom.
picker.addEventListener('scroll', () => {
  if (pickTab !== 'profile') return;
  if (picker.scrollTop + picker.clientHeight < picker.scrollHeight - 400) return;
  if (!$('#picker-grid [data-more]')) return;
  iconLimit += ICON_PAGE;
  renderIconGrid();
});

$('#picker-search').addEventListener('input', renderPicker);
$('#picker-close').addEventListener('click', () => picker.close());
picker.addEventListener('click', (e) => {
  if (e.target === picker) picker.close();
});
$('#picker-tabs').addEventListener('click', (e) => {
  const tab = e.target.closest('[data-tab]')?.dataset.tab;
  if (!tab || tab === pickTab) return;
  pickTab = tab;
  $('#picker-search').value = '';
  renderPicker();
});

$('#picker-grid').addEventListener('click', (e) => {
  if (e.target.closest('[data-more]')) {
    iconLimit += ICON_PAGE;
    renderIconGrid();
    return;
  }
  const iconBtn = e.target.closest('button[data-icon]');
  if (iconBtn) {
    update({ iconId: iconBtn.dataset.icon, iconTitle: iconBtn.title, iconChamp: '' });
    picker.close();
    return;
  }
  const btn = e.target.closest('button[data-id]');
  if (!btn) return;
  const id = btn.dataset.id;
  if (pickTarget === 'champs') {
    // Same champion + same role toggles off; a different role adds another entry.
    if (state.champs.some((c) => c.id === id && c.role === pickRole)) {
      update({ champs: state.champs.filter((c) => !(c.id === id && c.role === pickRole)) });
    } else if (state.champs.length >= MAX_CHAMPS) {
      toast(`${champLabelText()}は${MAX_CHAMPS}体まで選べます`);
      return;
    } else {
      update({ champs: [...state.champs, { id, role: pickRole }] });
    }
    renderPicker();
    if (state.champs.length >= MAX_CHAMPS) picker.close();
  } else if (pickTarget === 'icon') {
    update({ iconChamp: id, iconId: '', iconTitle: '', iconUpload: '' });
    picker.close();
  } else {
    update({ splashChamp: id, splashSkin: 0, bgUpload: '', bgOffX: 0, bgOffY: 0, bgZoom: 1 });
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

$('#btn-reset').addEventListener('click', resetAll);
$('#btn-reset-all').addEventListener('click', resetAll);

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
  // Re-render whenever web fonts finish loading so the preview isn't stuck on a fallback font.
  document.fonts?.ready.then(scheduleRender);
  document.fonts?.addEventListener('loadingdone', scheduleRender);
}

init();
