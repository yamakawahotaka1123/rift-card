// Discord server card maker (/server/): form state, preview, uploads and saving.
import { DDRAGON, availableThemes } from './data.js';
import { CARD_H, CARD_W } from './card.js';
import { RANK_TIERS, renderServerCard } from './server-card.js';
import { LANG, LANG_INFO, themeName, tierName } from './i18n.js';
import { track } from './analytics.js';

const STORAGE_KEY = 'riftcard:server';
const $ = (sel) => document.querySelector(sel);
const root = $('#server-tool');
const form = $('#sv-form');
const canvas = $('#server-card');
const L = root.dataset;
const labels = { allRanks: L.allRanks, name: L.name, inviteEmpty: L.inviteEmpty };
const SAMPLE = JSON.parse(L.sample);

const DEFAULT = {
  theme: 'hextech', name: '', iconUpload: '', iconShape: 'square', members: '', hours: '', invite: '',
  rankFrom: '', rankTo: '', about: '', tags: [], customTags: '', message: '',
  splashChamp: '', splashSkin: 0, bgUpload: '', bgOffX: 0, bgOffY: 0, bgZoom: 1, dim: 0.55, showCredit: true,
};
const ctxData = { version: '', champions: {} };

function load() {
  try {
    return { ...DEFAULT, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') };
  } catch {
    return { ...DEFAULT };
  }
}
let state = load();

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full (large uploaded images) or blocked; the card still works for this visit.
  }
}

function toast(message) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove('show'), 3000);
}

// ---------- Rendering ----------

let pending = null;
let drawing = false;
function render() {
  pending = { ...state };
  if (drawing) return;
  drawing = true;
  (async () => {
    while (pending) {
      const next = pending;
      pending = null;
      await renderServerCard(canvas, next, ctxData, labels);
    }
    drawing = false;
  })();
}

function update(patch) {
  state = { ...state, ...patch };
  save();
  syncUI();
  render();
}

// ---------- Form ----------

function buildUI() {
  const any = `<option value="">${L.any}</option>`;
  const options = RANK_TIERS.map((t) => `<option value="${t.id}">${tierName(t)}</option>`).join('');
  $('#sv-rank-from').innerHTML = any + options;
  $('#sv-rank-to').innerHTML = any + options;
  $('#sv-themes').innerHTML = availableThemes().map((theme) => `
    <button type="button" class="theme" data-theme="${theme.id}" style="--a:${theme.accent};--b:${theme.bg1};--c:${theme.bg2}">
      <i></i><span>${themeName(theme)}</span>
    </button>`).join('');
}

function syncUI() {
  for (const el of form.querySelectorAll('[name]')) {
    if (document.activeElement === el || el.name === 'splashSkin') continue;
    if (el.type === 'checkbox') el.checked = Boolean(state[el.name]);
    else el.value = state[el.name] ?? '';
  }
  for (const b of $('#sv-tags').children) b.classList.toggle('on', state.tags.includes(b.dataset.tag));
  for (const b of $('#sv-themes').children) b.classList.toggle('on', b.dataset.theme === state.theme);
  if (document.activeElement !== $('#sv-champ')) $('#sv-champ').value = ctxData.champions[state.splashChamp]?.name || '';
}

form.addEventListener('input', (e) => {
  const el = e.target;
  if (!el.name) return;
  const value = el.type === 'checkbox' ? el.checked
    : el.type === 'range' || el.name === 'splashSkin' ? Number(el.value) : el.value;
  state = { ...state, [el.name]: value };
  save();
  render();
});

$('#sv-tags').addEventListener('click', (e) => {
  const tag = e.target.closest('[data-tag]')?.dataset.tag;
  if (!tag) return;
  update({ tags: state.tags.includes(tag) ? state.tags.filter((x) => x !== tag) : [...state.tags, tag] });
});

$('#sv-themes').addEventListener('click', (e) => {
  const theme = e.target.closest('[data-theme]')?.dataset.theme;
  if (theme) update({ theme });
});

// ---------- Background skin ----------

const skinCache = new Map();
function loadSkins(id) {
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
  const select = $('#sv-skin');
  const id = state.splashChamp;
  if (!id) {
    select.innerHTML = '';
    return;
  }
  const skins = await loadSkins(id);
  if (id !== state.splashChamp) return;
  select.innerHTML = skins.map((s) => `<option value="${s.num}">${s.name === 'default' ? L.defaultSkin : s.name}</option>`).join('');
  select.value = String(state.splashSkin);
}

$('#sv-champ').addEventListener('change', (e) => {
  const q = e.target.value.trim().toLowerCase();
  const champ = Object.values(ctxData.champions).find((c) => c.name.toLowerCase() === q || c.id.toLowerCase() === q);
  if (!champ) return;
  update({ splashChamp: champ.id, splashSkin: 0, bgUpload: '', bgOffX: 0, bgOffY: 0, bgZoom: 1 });
  syncSkins();
});

$('#sv-bg-clear').addEventListener('click', () => {
  update({ splashChamp: '', bgUpload: '' });
  syncSkins();
});

// ---------- Uploads ----------

function readImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

// Icon: center-cropped square. Background: scaled down to card size.
async function fromFile(file, kind) {
  const img = await readImage(file);
  const c = document.createElement('canvas');
  if (kind === 'icon') {
    const side = Math.min(img.width, img.height);
    c.width = c.height = 256;
    c.getContext('2d').drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, 256, 256);
  } else {
    const scale = Math.min(1, (CARD_W * 1.5) / img.width, (CARD_H * 1.5) / img.height);
    c.width = Math.round(img.width * scale);
    c.height = Math.round(img.height * scale);
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
  }
  return c.toDataURL('image/jpeg', 0.88);
}

$('#sv-icon').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  e.target.value = '';
  if (file) update({ iconUpload: await fromFile(file, 'icon') });
});
$('#sv-icon-clear').addEventListener('click', () => update({ iconUpload: '' }));
$('#sv-bg').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  e.target.value = '';
  if (file) update({ bgUpload: await fromFile(file, 'bg'), splashChamp: '', bgOffX: 0, bgOffY: 0, bgZoom: 1 });
  syncSkins();
});

// ---------- Buttons ----------

const UA = navigator.userAgent;
const IS_IOS = /iPhone|iPad|iPod/.test(UA) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const IN_APP = /Twitter|TwitterAndroid|FBAN|FBAV|Instagram|Line\/|Discord|; wv\)/i.test(UA)
  || (IS_IOS && !/Safari\//.test(UA) && !/CriOS|FxiOS|EdgiOS/.test(UA));

$('#sv-save').addEventListener('click', () => {
  track('server_card_save', { theme: state.theme });
  // iPhone and in-app browsers: show the image so it can be saved with a long press.
  if (IS_IOS || IN_APP) {
    $('#sv-save-img').src = canvas.toDataURL('image/png');
    $('#sv-save-dialog').showModal();
    return;
  }
  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'discord-server-card.png';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, 'image/png');
});
$('#sv-save-close').addEventListener('click', () => $('#sv-save-dialog').close());

$('#sv-copy').addEventListener('click', async () => {
  try {
    const blob = new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
    toast(L.copied);
    track('server_card_copy', { theme: state.theme });
  } catch {
    toast(L.copyFailed);
  }
});

$('#sv-sample').addEventListener('click', () => {
  update({ ...DEFAULT, ...SAMPLE, theme: state.theme });
  syncSkins();
});
$('#sv-reset').addEventListener('click', () => {
  update({ ...DEFAULT });
  syncSkins();
});

// ---------- Start ----------

buildUI();
syncUI();
render();
try {
  const versions = await fetch(`${DDRAGON}/api/versions.json`).then((r) => r.json());
  ctxData.version = versions[0];
  const json = await fetch(`${DDRAGON}/cdn/${ctxData.version}/data/${LANG_INFO.ddragon}/champion.json`).then((r) => r.json());
  ctxData.champions = json.data;
  $('#sv-champ-list').innerHTML = Object.values(json.data)
    .sort((a, b) => a.name.localeCompare(b.name, LANG))
    .map((c) => `<option value="${c.name}"></option>`).join('');
  syncUI();
  syncSkins();
  render();
} catch {
  // Without Data Dragon the card still works with uploaded images.
}
document.fonts?.ready.then(render);
