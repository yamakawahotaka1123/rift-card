// 大会ポイント計算ツール（/pointcalc/）。このツール・このルールは今回の大会専用（ランク→点数の対応は固定）。
import { TIERS, DIVISIONS } from './data.js';

const SLOT_COUNT = 5;
const CAP = 30;
const STORAGE_KEY = 'sc-pointcalc-v1';

const $ = (sel) => document.querySelector(sel);

// ランク→点数。null = 運営判断（アンランク）、'NG' = 参加不可（エメラルド以上）
function pointFor(tierId, divisionIndex) {
  // divisionIndex: DIVISIONS = ['IV','III','II','I'] の index（0,1 = IV/III、2,3 = II/I）
  const lowHalf = divisionIndex <= 1; // IV・III
  switch (tierId) {
    case 'UNRANKED': return null;
    case 'IRON': return 1;
    case 'BRONZE': return lowHalf ? 2 : 3;
    case 'SILVER': return lowHalf ? 4 : 5;
    case 'GOLD': return lowHalf ? 6 : 7;
    case 'PLATINUM': return lowHalf ? 9 : 10;
    default: return 'NG'; // EMERALD, DIAMOND, MASTER, GRANDMASTER, CHALLENGER
  }
}

function defaultState() {
  return Array.from({ length: SLOT_COUNT }, () => ({ tier: 'UNRANKED', division: 0 }));
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const saved = JSON.parse(raw);
    if (!Array.isArray(saved) || saved.length !== SLOT_COUNT) return defaultState();
    const ids = new Set(TIERS.map((t) => t.id));
    return saved.map((s) => ({
      tier: ids.has(s?.tier) ? s.tier : 'UNRANKED',
      division: Number.isInteger(s?.division) && s.division >= 0 && s.division < DIVISIONS.length ? s.division : 0,
    }));
  } catch {
    return defaultState();
  }
}

function save(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* 端末のストレージが使えなくても動作は継続する */ }
}

let state = loadState();

function tierHasDivisions(tierId) {
  return TIERS.find((t) => t.id === tierId)?.divisions ?? false;
}

function renderSlots() {
  const wrap = $('#slots');
  wrap.innerHTML = '';
  state.forEach((slot, i) => {
    const row = document.createElement('div');
    row.className = 'slot';

    const num = document.createElement('div');
    num.className = 'num';
    num.textContent = `${i + 1}.`;
    row.appendChild(num);

    const tierSelect = document.createElement('select');
    tierSelect.innerHTML = TIERS.map((t) => `<option value="${t.id}"${t.id === slot.tier ? ' selected' : ''}>${t.label}</option>`).join('');
    tierSelect.addEventListener('change', (e) => {
      state[i].tier = e.target.value;
      if (!tierHasDivisions(state[i].tier)) state[i].division = 0;
      save(state);
      renderSlots();
    });
    row.appendChild(tierSelect);

    const divSelect = document.createElement('select');
    divSelect.innerHTML = DIVISIONS.map((d, di) => `<option value="${di}"${di === slot.division ? ' selected' : ''}>${d}</option>`).join('');
    divSelect.disabled = !tierHasDivisions(slot.tier);
    divSelect.style.visibility = tierHasDivisions(slot.tier) ? 'visible' : 'hidden';
    divSelect.addEventListener('change', (e) => {
      state[i].division = Number(e.target.value);
      save(state);
      renderSlots();
    });
    row.appendChild(divSelect);

    const pt = document.createElement('div');
    const p = pointFor(slot.tier, slot.division);
    if (p === null) {
      pt.className = 'pt unknown';
      pt.textContent = '前シーズン参照';
    } else if (p === 'NG') {
      pt.className = 'pt ng';
      pt.textContent = '参加不可';
    } else {
      pt.className = 'pt ok';
      pt.textContent = `${p} 点`;
    }
    row.appendChild(pt);

    wrap.appendChild(row);
  });

  renderResult();
}

function renderResult() {
  const points = state.map((s) => pointFor(s.tier, s.division));
  const hasNg = points.some((p) => p === 'NG');
  const hasUnknown = points.some((p) => p === null);
  const total = points.reduce((sum, p) => sum + (typeof p === 'number' ? p : 0), 0);

  $('#total-pt').textContent = total;
  const box = $('#result');
  const verdict = $('#verdict');
  const reason = $('#reason');

  if (hasNg) {
    box.className = 'ng';
    verdict.textContent = '参加不可 ❌';
    reason.textContent = 'エメラルド以上のランクを含んでいるため、このチームは参加できません。';
  } else if (hasUnknown) {
    box.className = '';
    verdict.textContent = '要確認 🔍';
    reason.textContent = 'アンランクの人がいます。前シーズンの最終ランクを選び直してください（わからなければ運営に確認）。';
  } else if (total <= CAP) {
    box.className = 'ok';
    verdict.textContent = '参加OK ⭕';
    reason.textContent = '';
  } else {
    box.className = 'ng';
    verdict.textContent = `参加NG ❌（${total - CAP}点オーバー）`;
    reason.textContent = `合計が上限の${CAP}点を超えています。`;
  }
}

$('#reset-btn').addEventListener('click', () => {
  state = defaultState();
  save(state);
  renderSlots();
});

renderSlots();
