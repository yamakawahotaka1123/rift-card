import {
  CDRAGON_GAME, DDRAGON, DEFAULT_STATE, DIVISIONS, MAX_CHAMPS, MAX_COMMENT, MAX_TAG_LENGTH, MAX_TAGS, NAME_PRESETS,
  ROLE_LEVELS, ROLES, SAMPLE_STATE, TAGS, TIERS, availableThemes, mainRoleOf,
} from './data.js';
import { CARD_H, CARD_W, SITE_URL, champSquareUrl, loadSplash, profileIconUrl, renderCard } from './card.js';
import { cropImage } from './cropper.js';
import { initAnalytics, track } from './analytics.js';
import { renderBanner } from './banner.js';
import { initRiotImport } from './riot.js';
import {
  LANG, LANG_INFO, SHARE_HASHTAGS, allNamePresets, applyI18n, levelLabel, namePresets, t, tagName, themeName, tierName,
} from './i18n.js';

const STORAGE_KEY = 'riftcard:v1';
// Links people share point at the page for their language, so previews show that language.
const PAGE_URL = new URL(LANG_INFO.path, SITE_URL).href;
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
    toast(t('toast.tooBig'));
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
  $('#tier').innerHTML = TIERS.map((tier) => `<option value="${tier.id}">${tierName(tier)}</option>`).join('');
  $('#division').innerHTML = DIVISIONS.map((d) => `<option value="${d}">${d}</option>`).join('');

  $('#roles').innerHTML = ROLES.map((r) => `
    <div class="role" data-role="${r.id}">
      <img src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/svg/position-${r.id}.svg" alt="">
      <span>${r.label}</span>
      <div class="role-btns">
        ${ROLE_LEVELS.map((l) => `<button type="button" data-setrole="${l.id}" data-role-id="${r.id}">${levelLabel(l)}</button>`).join('')}
      </div>
    </div>`).join('');

  $('#name-presets').innerHTML = namePresets(NAME_PRESETS)
    .map((p) => `<button type="button" class="chip" data-name-preset="${p}">${p}</button>`).join('');

  $('#themes').innerHTML = availableThemes().map((theme) => `
    <button type="button" class="theme" data-theme="${theme.id}" style="--a:${theme.accent};--b:${theme.bg1};--c:${theme.bg2}">
      <i></i><span>${themeName(theme)}</span>
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
    $('#icon-btn').innerHTML = `<img src="${state.iconUpload}" alt=""><span>${t('upload.image')}</span>`;
  } else if (state.iconId) {
    $('#icon-btn').innerHTML = `<img src="${profileIconUrl(state.iconId)}" alt=""><span>${state.iconTitle || t('icon.n', { id: state.iconId })}</span>`;
  } else {
    champButton($('#icon-btn'), state.iconChamp, t('pick.icon'));
  }
  $('#icon-clear').hidden = !(state.iconUpload || state.iconId || state.iconChamp);
  $('#icon-recrop').hidden = !(state.iconUpload && uploadedFiles.icon);
  $('#bg-recrop').hidden = !(state.bgUpload && uploadedFiles.bg);

  if (state.bgUpload) {
    $('#splash-btn').innerHTML = `<img src="${state.bgUpload}" alt="" class="wide"><span>${t('upload.image')}</span>`;
  } else {
    champButton($('#splash-btn'), state.splashChamp, t('pick.skin'));
  }
  const hasBg = Boolean(state.splashChamp || state.bgUpload);
  $('#skin').hidden = !state.splashChamp || Boolean(state.bgUpload);
  $('#splash-clear').hidden = !hasBg;
  $('#splash-controls').hidden = !hasBg;
  canvas.classList.toggle('draggable', hasBg);
  $('#show-credit').checked = state.showCredit !== false;

  const roleOptions = (selected) => `<option value="">${t('role.none')}</option>`
    + ROLES.map((r) => `<option value="${r.id}"${r.id === selected ? ' selected' : ''}>${r.label}</option>`).join('');
  const list = $('#champ-list');
  $('#champ-legend').textContent = champLabelText();
  list.innerHTML = state.champs.map(({ id, role, img }, i) => `
    <div class="champ-item">
      <img src="${img || champSquareUrl(ctxData.version, id)}" alt="">
      <span>${ctxData.champions[id]?.name || id}</span>
      <select class="champ-role" data-role-index="${i}">${roleOptions(role)}</select>
      <button type="button" class="champ-img-btn" data-skinimg="${i}">${t('btn.skinImg')}</button>
      ${img ? `<button type="button" class="champ-img-btn" data-resetimg="${i}">${t('btn.revert')}</button>` : ''}
      <div class="champ-ops">
        <button type="button" data-move="${i}" title="${t('title.left')}" ${i === 0 ? 'disabled' : ''}>←</button>
        <button type="button" data-remove="${i}" title="${t('btn.delete')}">×</button>
      </div>
    </div>`).join('')
    + (state.champs.length < MAX_CHAMPS ? `<button type="button" class="champ-add" data-pick="champs">${t('btn.add')}</button>` : '');
}

const champLabelText = () => t(state.champLabel === 'fav' ? 'champLabel.fav' : 'champLabel.main');

const escapeHtml = (s) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

function renderTags() {
  const chip = (tag, custom) => `
    <button type="button" class="chip${state.tags.includes(tag) ? ' on' : ''}${custom ? ' custom' : ''}" data-tag="${escapeHtml(tag)}">
      ${escapeHtml(tagName(tag))}${custom ? `<span class="chip-del" data-deltag="${escapeHtml(tag)}" title="${t('btn.delete')}">×</span>` : ''}
    </button>`;
  $('#tags').innerHTML = TAGS.map((tag) => chip(tag, false)).join('')
    + state.customTags.map((tag) => chip(tag, true)).join('')
    + `<button type="button" class="chip add" data-addtag>${t('btn.addTag')}</button>`;
}

// Swaps the "+" chip for a text box; Enter or leaving the box adds the tag.
function startAddTag(btn) {
  const input = document.createElement('input');
  input.className = 'chip-input';
  input.maxLength = MAX_TAG_LENGTH;
  input.placeholder = t('ph.tagMax', { n: MAX_TAG_LENGTH });
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
      if (tags.length >= MAX_TAGS) toast(t('toast.tagsMaxAdded', { n: MAX_TAGS }));
      else tags = [...tags, tag];
    }
    update({ customTags, tags });
    track('custom_tag_add');
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
    const turningOn = state.name !== preset;
    update(turningOn ? { name: preset, tag: '' } : { name: '' });
    if (turningOn) track('name_preset', { preset });
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
      toast(t('toast.tagsMax', { n: MAX_TAGS }));
    } else {
      update({ tags: [...state.tags, tag] });
    }
  } else if (btn.dataset.theme) {
    update({ theme: btn.dataset.theme });
    track('theme_select', { theme: btn.dataset.theme });
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
  icon: () => ({ aspect: 1, round: state.iconShape === 'circle', outW: 300, outH: 300, title: t('crop.icon') }),
  bg: () => ({ aspect: CARD_W / CARD_H, outW: 1600, outH: 900, title: t('crop.bg') }),
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
    if (data) {
      APPLY[kind](data);
      track('image_upload', { target: kind });
    }
  } catch {
    uploadedFiles[kind] = null;
    toast(t('toast.badImage'));
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
  track('section_clear', { section });
});

function resetAll() {
  if (!confirm(t('confirm.reset'))) return;
  uploadedFiles.icon = uploadedFiles.bg = null;
  update({ ...DEFAULT_STATE });
  syncSkins();
  track('reset_all');
}

// ---------- Skins ----------

const skinCache = new Map();
async function loadSkins(id) {
  if (!skinCache.has(id)) {
    skinCache.set(id, fetch(`${DDRAGON}/cdn/${ctxData.version}/data/${LANG_INFO.ddragon}/champion/${id}.json`)
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
  select.innerHTML = skins.map((s) => `<option value="${s.num}">${s.name === 'default' ? t('skin.default') : s.name}</option>`).join('');
  select.value = String(state.splashSkin);
}

// ---------- Favorite champion image from a skin ----------

const skinPicker = $('#skin-picker');
let skinTarget = -1;

async function openSkinPicker(index) {
  skinTarget = index;
  const { id } = state.champs[index];
  $('#skin-picker-title').textContent = t('skin.pickTitle', { name: ctxData.champions[id]?.name || id });
  $('#skin-grid').innerHTML = `<p class="picker-empty">${t('loading')}</p>`;
  skinPicker.showModal();
  const skins = await loadSkins(id);
  if (skinTarget !== index) return;
  // Tiles use the same file names as splashes; if one is missing, show the champion portrait instead.
  $('#skin-grid').innerHTML = skins.map((s) => `
    <button type="button" data-skin-num="${s.num}">
      <img loading="lazy" src="${DDRAGON}/cdn/img/champion/tiles/${id}_${s.num}.jpg" alt=""
        onerror="this.onerror=null;this.src='${champSquareUrl(ctxData.version, id)}'">
      <span>${s.name === 'default' ? t('skin.default') : s.name}</span>
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
    const data = await cropImage(blob, { aspect: 1, outW: 240, outH: 240, title: t('crop.champ', { name: ctxData.champions[entry.id]?.name || entry.id }) });
    if (!data) return;
    // The list may have changed while cropping; match on the same entry object.
    update({ champs: state.champs.map((c) => (c === entry ? { ...c, img: data } : c)) });
    track('champ_skin_icon', { champion: entry.id });
  } catch {
    toast(t('toast.skinFail'));
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
  $('#picker-role-buttons').innerHTML = [{ id: '', label: t('role.noneShort') }, ...ROLES]
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
    iconList = fetch(`${CDRAGON_GAME}/${LANG_INFO.cdragon}/v1/summoner-icons.json`)
      .then((r) => r.json())
      .then((icons) => icons
        .map((i) => {
          const title = i.title.replace(/\s*(アイコン|Icon|아이콘|头像|頭像|圖示|图标)$/i, '');
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
    ? t('ph.searchIcon')
    : t('ph.searchChamp');
  if (pickTab === 'profile') {
    renderIconGrid();
    return;
  }
  const q = normalize($('#picker-search').value);
  const items = sortedChamps.filter((c) => !q || c.search.includes(q));
  $('#picker-status').textContent = pickTarget === 'champs'
    ? t('picker.champStatus', { n: state.champs.length, max: MAX_CHAMPS })
    : '';
  const roleLabel = (id) => ROLES.find((r) => r.id === id)?.label || t('role.none');
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
  }).join('') || `<p class="picker-empty">${t('notFound')}</p>`;
}

async function renderIconGrid() {
  const grid = $('#picker-grid');
  if (!iconData) {
    $('#picker-status').textContent = t('icons.loading');
    grid.innerHTML = '';
  }
  const icons = await loadIcons();
  if (pickTab !== 'profile' || !picker.open) return;
  if (!icons.length) {
    $('#picker-status').textContent = t('icons.fail');
    return;
  }
  const q = normalize($('#picker-search').value);
  const items = icons.filter((i) => !q || i.search.includes(q));
  $('#picker-status').textContent = t('icons.count', { n: items.length.toLocaleString() });
  grid.innerHTML = items.slice(0, iconLimit).map((i) => `
    <button type="button" class="${i.id === String(state.iconId) ? 'on' : ''}" data-icon="${i.id}" title="${i.title}">
      <img loading="lazy" src="${profileIconUrl(i.id)}" alt="">
      <span>${i.title}</span>
    </button>`).join('')
    + (items.length > iconLimit ? `<button type="button" class="picker-more" data-more>${t('icons.more', { n: (items.length - iconLimit).toLocaleString() })}</button>` : '')
    || `<p class="picker-empty">${t('notFound')}</p>`;
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
      toast(t('toast.champsMax', { label: champLabelText(), n: MAX_CHAMPS }));
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

// What the exported card used, attached to save/copy/share events.
function cardSummary() {
  const levels = Object.values(state.roleLevels);
  return {
    theme: state.theme,
    background: state.bgUpload ? 'upload' : state.splashChamp ? 'skin' : 'none',
    icon: state.iconUpload ? 'upload' : state.iconId ? 'summoner_icon' : state.iconChamp ? 'champion' : 'none',
    tier: state.tier,
    champ_count: state.champs.length,
    skin_icons: state.champs.filter((c) => c.img).length,
    tag_count: state.tags.length,
    custom_tags: state.customTags.length,
    role_levels: ROLE_LEVELS.filter((l) => levels.includes(l.id)).map((l) => l.id).join(',') || 'none',
    name_hidden: allNamePresets(NAME_PRESETS).includes(state.name),
    has_comment: Boolean(state.comment),
    has_stream: Boolean(state.twitch || state.youtube),
  };
}
const fileName = () => `summoner-card-${(state.name || 'card').replace(/[\\/:*?"<>|\s]/g, '_')}.png`;

// In-app browsers (X, LINE, Instagram, Discord…) often can't download files, copy images or
// open the share sheet. iOS in-app views lack the "Safari/" token; Android WebViews carry "; wv)".
const UA = navigator.userAgent;
const IS_IOS = /iPhone|iPad|iPod/.test(UA) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const IN_APP = /Twitter|TwitterAndroid|FBAN|FBAV|Instagram|Line\/|Discord|; wv\)/i.test(UA)
  || (IS_IOS && !/Safari\//.test(UA) && !/CriOS|FxiOS|EdgiOS/.test(UA));

// Shows the card as a plain image so it can be saved with a long press, which works everywhere.
function showSaveDialog(hint) {
  $('#save-img').src = canvas.toDataURL('image/png');
  $('#save-dialog .save-hint').innerHTML = hint
    || t('save.hint');
  $('#save-dialog').showModal();
}
$('#save-close').addEventListener('click', () => $('#save-dialog').close());

if (IN_APP) $('#inapp-banner').hidden = false;
$('#inapp-copy').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(PAGE_URL);
    toast(t('toast.inAppUrl'));
  } catch {
    toast(PAGE_URL);
  }
});

$('#btn-download').addEventListener('click', async () => {
  // iPhone downloads go to the Files app, and in-app browsers often can't download at all,
  // so offer a long-press save there instead.
  if (IN_APP || IS_IOS) {
    showSaveDialog();
    track('card_download', { method: 'long_press', ...cardSummary() });
    showSpread();
    return;
  }
  const blob = await cardBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName();
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  track('card_download', cardSummary());
  showSpread();
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
  const copied = await copyImage();
  if (copied) {
    toast(t('toast.copied'));
    track('card_copy', cardSummary());
    showSpread();
  } else if (matchMedia('(pointer: coarse)').matches) {
    showSaveDialog(t('save.copyHint'));
  } else {
    toast(t('toast.copyFail'));
  }
});

const xIntent = (text, hashtags) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
  + `&url=${encodeURIComponent(PAGE_URL)}&hashtags=${encodeURIComponent(hashtags.join(','))}`;

$('#btn-share').addEventListener('click', async () => {
  const text = t('share.text');

  // In-app browsers can't attach the image anywhere: let the user save it first, then post.
  if (IN_APP) {
    showSaveDialog(t('share.inApp', { url: xIntent(text, SHARE_HASHTAGS) }));
    track('card_share', { method: 'in_app', ...cardSummary() });
    showSpread();
    return;
  }

  // Phones: hand the image straight to the OS share sheet (X, LINE, Discord…).
  const blob = await cardBlob();
  const file = new File([blob], fileName(), { type: 'image/png' });
  if (matchMedia('(pointer: coarse)').matches && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], text: `${text}${PAGE_URL}\n${SHARE_HASHTAGS.map((h) => `#${h}`).join(' ')}` });
      track('card_share', { method: 'share_sheet', ...cardSummary() });
      showSpread();
      return;
    } catch (err) {
      if (err.name === 'AbortError') return;
    }
  }

  // Desktop: X's intent URL can't attach images, so copy the image for pasting.
  const copied = await copyImage();
  window.open(xIntent(text, SHARE_HASHTAGS), '_blank', 'noopener');
  track('card_share', { method: 'x', ...cardSummary() });
  toast(t(copied ? 'toast.sharePaste' : 'toast.shareAttach'));
  showSpread();
});

// ---------- "Please spread the word" panel ----------

// Shown after the first save/copy/share; once closed it stays closed on this browser.
const SPREAD_KEY = 'riftcard:spread-dismissed';
function showSpread() {
  try {
    if (localStorage.getItem(SPREAD_KEY)) return;
  } catch { /* storage unavailable: still show it */ }
  $('#spread').hidden = false;
}

$('#spread-close').addEventListener('click', () => {
  $('#spread').hidden = true;
  try {
    localStorage.setItem(SPREAD_KEY, '1');
  } catch { /* storage unavailable */ }
});

$('#spread-share').addEventListener('click', () => {
  window.open(xIntent(t('spread.tweet'), SHARE_HASHTAGS), '_blank', 'noopener');
  track('site_share', { method: 'x' });
});

$('#spread-copy').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(PAGE_URL);
    toast(t('toast.siteUrl'));
    track('site_share', { method: 'copy_url' });
  } catch {
    toast(PAGE_URL);
  }
});

$('#btn-sample').addEventListener('click', () => {
  update({ ...SAMPLE_STATE, hours: t('sample.hours'), comment: t('sample.comment') });
  syncSkins();
  track('sample_load');
});

// ---------- Promo banner ----------

let bannerCanvas = null;
$('#btn-banner').addEventListener('click', () => {
  bannerCanvas = renderBanner(canvas, state, new URL(SITE_URL).host);
  $('#banner-img').src = bannerCanvas.toDataURL('image/png');
  $('#banner-dialog').showModal();
  track('banner_open', { theme: state.theme });
});
$('#banner-close').addEventListener('click', () => $('#banner-dialog').close());

$('#banner-save').addEventListener('click', () => {
  // In-app browsers and iPhone: the image in the dialog can be saved with a long press.
  if (IN_APP || IS_IOS) {
    toast(t('toast.bannerLongPress'));
  } else {
    bannerCanvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'summoner-card-banner.png';
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, 'image/png');
  }
  track('banner_save', { theme: state.theme });
});

$('#banner-copy-url').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(PAGE_URL);
    toast(t('toast.bannerUrl'));
  } catch {
    toast(PAGE_URL);
  }
});

// Copy buttons for code samples in the guide.
document.addEventListener('click', async (e) => {
  const id = e.target.closest('[data-copy-target]')?.dataset.copyTarget;
  if (!id) return;
  try {
    await navigator.clipboard.writeText(document.getElementById(id).textContent);
    toast(t('toast.copyDone'));
    track('embed_copy');
  } catch {
    toast(t('toast.copyManual'));
  }
});

$('#show-credit').addEventListener('change', (e) => {
  update({ showCredit: e.target.checked });
  track('credit_toggle', { on: e.target.checked });
});

$('#btn-reset').addEventListener('click', resetAll);
$('#btn-reset-all').addEventListener('click', resetAll);

// ---------- Boot ----------

async function init() {
  applyI18n();
  initAnalytics();
  if (IN_APP) track('in_app_browser');
  buildStaticUI();
  syncUI();
  try {
    const versions = await fetch(`${DDRAGON}/api/versions.json`).then((r) => r.json());
    ctxData.version = versions[0];
    const json = await fetch(`${DDRAGON}/cdn/${ctxData.version}/data/${LANG_INFO.ddragon}/champion.json`).then((r) => r.json());
    ctxData.champions = json.data;
    sortedChamps = Object.values(json.data)
      .map((c) => ({ id: c.id, name: c.name, search: normalize(`${c.name}${c.id}${c.title}`) }))
      .sort((a, b) => a.name.localeCompare(b.name, LANG));
  } catch {
    $('#loading').textContent = t('load.fail');
    return;
  }
  // "/?theme=fairy" (from the template page) preselects a theme, then the URL is cleaned up.
  const themeParam = new URLSearchParams(location.search).get('theme');
  if (themeParam && availableThemes().some((t) => t.id === themeParam)) {
    state = { ...state, theme: themeParam };
    saveState();
    track('theme_from_link', { theme: themeParam });
    history.replaceState(null, '', location.pathname);
  }
  syncUI();
  syncSkins();
  scheduleRender();
  initRiotImport({ getState: () => state, update, ctxData, toast });
  // Re-render whenever web fonts finish loading so the preview isn't stuck on a fallback font.
  document.fonts?.ready.then(scheduleRender);
  document.fonts?.addEventListener('loadingdone', scheduleRender);
}

init();
