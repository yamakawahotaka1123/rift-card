// "Import from Riot ID": fills the basic info and rank, then offers champions by ranked win rate or mastery.
// The lookup goes through our Worker (worker/index.js) so the Riot API key stays off the page.
import { MAX_CHAMPS } from './data.js';
import { champSquareUrl } from './card.js';
import { track } from './analytics.js';
import { LANG, t } from './i18n.js';

// Empty until the Worker is deployed; the section stays hidden without it.
const API = location.hostname === 'localhost' ? 'http://localhost:8787' : '';

const PLATFORMS = [
  ['jp1', 'JP'], ['kr', 'KR'], ['sg2', 'SEA'], ['vn2', 'VN'], ['tw2', 'TW'], ['oc1', 'OCE'],
  ['na1', 'NA'], ['br1', 'BR'], ['la1', 'LAN'], ['la2', 'LAS'],
  ['euw1', 'EUW'], ['eun1', 'EUNE'], ['tr1', 'TR'], ['ru', 'RU'], ['me1', 'ME'],
];
const DEFAULT_PLATFORM = { ja: 'jp1', ko: 'kr', th: 'sg2', vi: 'vn2', 'zh-TW': 'tw2', 'zh-CN': 'sg2', 'pt-BR': 'br1', es: 'la1', de: 'euw1', fr: 'euw1', en: 'na1' };
const PLATFORM_KEY = 'riftcard:platform';
// Win-rate list: champions with at least this many ranked games, relaxed when too few qualify.
const MIN_GAMES = [10, 5, 3];

const $ = (sel) => document.querySelector(sel);

export function initRiotImport({ getState, update, ctxData, toast }) {
  if (!API) return;
  $('#riot-import').hidden = false;
  const select = $('#riot-platform');
  let saved = '';
  try { saved = localStorage.getItem(PLATFORM_KEY) || ''; } catch { /* storage blocked */ }
  const initial = PLATFORMS.some(([id]) => id === saved) ? saved : DEFAULT_PLATFORM[LANG] || 'na1';
  select.innerHTML = PLATFORMS.map(([id, label]) => `<option value="${id}"${id === initial ? ' selected' : ''}>${label}</option>`).join('');

  const byKey = {};
  for (const c of Object.values(ctxData.champions)) byKey[c.key] = c.id;

  let result = null;
  let tab = 'win';
  let lists = { win: [], mastery: [] };

  const status = (text) => { $('#riot-status').textContent = text; };

  function buildLists(data) {
    const champs = data.champs.filter((c) => byKey[c.key]);
    const min = MIN_GAMES.find((n) => champs.filter((c) => c.games >= n).length >= 3) ?? MIN_GAMES.at(-1);
    const win = champs
      .filter((c) => c.games >= min)
      .map((c) => ({ id: byKey[c.key], role: c.role, wr: Math.round((c.wins / c.games) * 100), games: c.games }))
      .sort((a, b) => b.wr - a.wr || b.games - a.games);
    const roleOf = Object.fromEntries(champs.map((c) => [c.key, c.role]));
    const mastery = data.mastery
      .filter((m) => byKey[m.key])
      .map((m) => ({ id: byKey[m.key], role: roleOf[m.key] || '', points: m.points }));
    return { win, mastery, min };
  }

  function renderGrid() {
    const items = lists[tab];
    for (const b of $('#riot-tabs').children) b.classList.toggle('on', b.dataset.tab === tab);
    $('#riot-note').textContent = tab === 'win'
      ? (items.length ? t('riot.winNote', { matches: result.matches, min: lists.min }) : t('riot.winEmpty'))
      : t('riot.masteryNote');
    const { champs } = getState();
    $('#riot-grid').innerHTML = items.map((c) => {
      const on = champs.some((e) => e.id === c.id);
      const stat = tab === 'win' ? t('riot.games', { wr: c.wr, n: c.games }) : t('riot.points', { pts: c.points.toLocaleString(LANG) });
      return `<button type="button" class="riot-champ${on ? ' on' : ''}" data-riot-champ="${c.id}" data-role="${c.role}">
        <img src="${champSquareUrl(ctxData.version, c.id)}" alt="" loading="lazy">
        <span class="riot-name">${ctxData.champions[c.id]?.name || c.id}</span>
        <span class="riot-stat">${stat}</span>
      </button>`;
    }).join('');
    $('#riot-top5').hidden = !items.length;
  }

  function toggle(id, role) {
    const { champs } = getState();
    if (champs.some((e) => e.id === id)) {
      update({ champs: champs.filter((e) => e.id !== id) });
    } else if (champs.length >= MAX_CHAMPS) {
      toast(t('toast.champsMax', { label: t('champLabel.main'), n: MAX_CHAMPS }));
      return;
    } else {
      update({ champs: [...champs, { id, role }] });
    }
    renderGrid();
  }

  async function load() {
    const raw = $('#riot-id').value.trim().replace(/＃/g, '#');
    const [name, tag] = raw.split('#').map((s) => s?.trim());
    if (!name || !tag) {
      status(t('riot.badId'));
      return;
    }
    const platform = select.value;
    try { localStorage.setItem(PLATFORM_KEY, platform); } catch { /* storage blocked */ }
    const btn = $('#riot-load');
    btn.disabled = true;
    status(t('riot.loading'));
    try {
      const res = await fetch(`${API}/lookup?${new URLSearchParams({ id: `${name}#${tag}`, platform })}`);
      const data = await res.json();
      if (!res.ok) {
        status(t(`riot.${data.error === 'not_found' ? 'notFound' : data.error === 'busy' ? 'busy' : 'failed'}`));
        track('riot_import', { result: data.error || 'failed', platform });
        return;
      }
      result = data;
      const patch = {
        name: data.gameName,
        tag: data.tagLine,
        level: String(data.level),
        iconId: String(data.iconId),
        iconTitle: '',
        iconChamp: '',
        iconUpload: '',
      };
      if (data.rank) Object.assign(patch, { tier: data.rank.tier, division: data.rank.division || 'IV' });
      else patch.tier = 'UNRANKED';
      update(patch);
      lists = buildLists(data);
      tab = lists.win.length ? 'win' : 'mastery';
      $('#riot-champs').hidden = false;
      renderGrid();
      status(t('riot.done', { name: `${data.gameName}#${data.tagLine}` }));
      track('riot_import', { result: 'ok', platform, ranked: data.rank ? data.rank.tier : 'none' });
    } catch {
      status(t('riot.failed'));
      track('riot_import', { result: 'network', platform });
    } finally {
      btn.disabled = false;
    }
  }

  $('#riot-load').addEventListener('click', load);
  $('#riot-id').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.isComposing) load();
  });
  $('#riot-tabs').addEventListener('click', (e) => {
    const b = e.target.closest('[data-tab]');
    if (!b) return;
    tab = b.dataset.tab;
    renderGrid();
  });
  $('#riot-grid').addEventListener('click', (e) => {
    const b = e.target.closest('[data-riot-champ]');
    if (b) toggle(b.dataset.riotChamp, b.dataset.role);
  });
  $('#riot-top5').addEventListener('click', () => {
    const pick = lists[tab].slice(0, MAX_CHAMPS).map((c) => ({ id: c.id, role: c.role }));
    update({ champs: pick });
    renderGrid();
    track('riot_top5', { list: tab });
  });
}
