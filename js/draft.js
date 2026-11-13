// フィアレスドラフト（/draft/）。チャンピオンデータは summonercard.com 本体と同じく Data Dragon から直接取る。
// サーバー側は worker/draft.js（Durable Object）。ここは状態を受け取って描画するだけ。
import { DDRAGON } from './data.js';

const champSquareUrl = (version, id) => `${DDRAGON}/cdn/${version}/img/champion/${id}.png`;
// Community Dragon の「センタリング済みスプラッシュ」。公式DDragonのloading画像と違い、どのチャンピオンも顔が中央に来るよう加工済み。
const champCenteredUrl = (key) => `https://cdn.communitydragon.org/latest/champion/${key}/splash-art/centered`;

const API = location.hostname === 'localhost' ? 'http://localhost:8787' : 'https://summonercard-api.summonercard.workers.dev';

const $ = (sel) => document.querySelector(sel);
const params = new URLSearchParams(location.search);
const sessionId = params.get('id') || '';
const token = params.get('token') || '';

const ctx = { version: '', champions: {}, list: [] };
let ws = null;
let mySide = 'spectator';
let state = null;

function setStatus(text) {
  $('#status').textContent = text;
}

function randomId() {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 10);
}

function buildUrl(id, tok) {
  const url = new URL(location.href);
  url.search = '';
  url.searchParams.set('id', id);
  if (tok) url.searchParams.set('token', tok);
  return url.toString();
}

function initLobby() {
  $('#lobby').hidden = false;
  const boButtons = [...document.querySelectorAll('#lobby-bo button')];
  boButtons.forEach((b) => b.addEventListener('click', () => {
    boButtons.forEach((x) => x.classList.toggle('active', x === b));
  }));

  $('#lobby-create').addEventListener('click', async () => {
    if (!API) {
      setStatus('⚠ ドラフトサーバーが未設定です（js/draft.js の API を設定してください）');
      return;
    }
    const btn = $('#lobby-create');
    btn.disabled = true;
    btn.textContent = '作成中…';
    try {
      const seriesLength = Number(boButtons.find((b) => b.classList.contains('active'))?.dataset.value) || 3;
      const timerSeconds = Math.min(120, Math.max(5, Number($('#lobby-timer').value) || 60));
      const id = randomId();
      const res = await fetch(`${API}/draft/${id}/create`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ seriesLength, timerSeconds }),
      });
      if (!res.ok) throw new Error('create failed');
      const data = await res.json();
      $('#link-blue').value = buildUrl(id, data.blueToken);
      $('#link-red').value = buildUrl(id, data.redToken);
      $('#link-spectator').value = buildUrl(id, '');
      $('#lobby-links').classList.add('show');
    } catch {
      setStatus('⚠ 部屋の作成に失敗しました。サーバーが混み合っているか、本日のアクセス上限に達した可能性があります。時間を置いてもう一度試してください（日本時間で朝9時ごろにリセットされます）');
    } finally {
      btn.disabled = false;
      btn.textContent = '作成';
    }
  });

  document.querySelectorAll('[data-copy]').forEach((b) => b.addEventListener('click', async () => {
    const input = document.getElementById(b.dataset.copy);
    try {
      await navigator.clipboard.writeText(input.value);
      const orig = b.textContent;
      b.textContent = 'コピーした✓';
      setTimeout(() => { b.textContent = orig; }, 1500);
    } catch {
      input.select();
    }
  }));
}

async function loadChampions() {
  const versions = await fetch(`${DDRAGON}/api/versions.json`).then((r) => r.json());
  ctx.version = versions[0];
  const json = await fetch(`${DDRAGON}/cdn/${ctx.version}/data/ja_JP/champion.json`).then((r) => r.json());
  ctx.champions = json.data;
  ctx.list = Object.values(json.data).sort((a, b) => a.name.localeCompare(b.name, 'ja'));
}

function connect() {
  if (!API) {
    setStatus('⚠ ドラフトサーバーが未設定です（js/draft.js の API を設定してください）');
    return;
  }
  if (!sessionId) {
    setStatus('⚠ URLにセッションIDがありません');
    return;
  }
  const wsUrl = `${API.replace(/^http/, 'ws')}/draft/${encodeURIComponent(sessionId)}/ws?token=${encodeURIComponent(token)}`;
  ws = new WebSocket(wsUrl);
  ws.addEventListener('open', () => setStatus('接続しました'));
  ws.addEventListener('close', () => setStatus('切断されました。再読み込みしてください（繰り返す場合はサーバーが混み合っている可能性があります）'));
  ws.addEventListener('error', () => setStatus('⚠ 接続エラー。サーバーが混み合っているか、本日のアクセス上限に達した可能性があります'));
  ws.addEventListener('message', (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.type === 'hello') {
      mySide = msg.side;
      const badge = $('#side-badge');
      badge.textContent = { blue: '🔵 BLUE', red: '🔴 RED', spectator: '👀 観戦' }[mySide];
      badge.className = mySide;
    } else if (msg.type === 'state') {
      state = msg;
      render();
    } else if (msg.type === 'timeout') {
      const teamLabel = msg.team === 'blue' ? '🔵 BLUE' : '🔴 RED';
      const actionLabel = msg.action === 'ban' ? 'BAN' : 'PICK';
      showToast(`⏱ 時間切れ！ ${teamLabel} の${actionLabel}をランダムで自動選択しました: ${champName(msg.championId)}`);
    }
  });
}

let toastTimer = null;
function showToast(text) {
  const el = $('#toast');
  el.textContent = text;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 4000);
}

function tickTimer() {
  const remain = state && state.phase === 'drafting' && state.turnDeadline
    ? Math.max(0, Math.ceil((state.turnDeadline - Date.now()) / 1000))
    : null;
  for (const el of [$('#timer'), $('#bcast-timer')]) {
    el.textContent = remain === null ? '' : `⏱ ${remain}s`;
    el.classList.toggle('low', remain !== null && remain <= 10);
  }
}
setInterval(tickTimer, 250);

function select(championId) {
  if (!ws || ws.readyState !== WebSocket.OPEN) return;
  ws.send(JSON.stringify({ type: 'select', championId }));
}

function nextGame() {
  if (!ws || ws.readyState !== WebSocket.OPEN) return;
  ws.send(JSON.stringify({ type: 'nextGame' }));
}

function sendReady() {
  if (!ws || ws.readyState !== WebSocket.OPEN) return;
  ws.send(JSON.stringify({ type: 'ready' }));
}

function sendRedoRequest() {
  if (!ws || ws.readyState !== WebSocket.OPEN) return;
  ws.send(JSON.stringify({ type: 'redoRequest' }));
}

function champImg(id) {
  return `<img src="${champSquareUrl(ctx.version, id)}" alt="" loading="lazy">`;
}

function champName(id) {
  return ctx.champions[id]?.name || id;
}

/** まだ確定していない「仮選択」を、次に埋まる枠にプレビュー表示する（相手・観戦者にも同じものが見える） */
function previewFor(team, type) {
  if (state.phase !== 'drafting' || state.turn.team !== team || state.turn.type !== type) return null;
  return state.hover[team] || null;
}

function renderBans(ids, team) {
  const preview = previewFor(team, 'ban');
  const slots = Array.from({ length: 5 }, (_, i) => ids[i] ?? (i === ids.length ? preview : null));
  return slots.map((id, i) => {
    const isPreview = id && i === ids.length && preview;
    return `
    <div class="ban-slot${id ? ' filled' : ' empty'}${isPreview ? ' preview' : ''}">
      ${id ? `<img src="${champSquareUrl(ctx.version, id)}" alt="">` : `<span class="ban-num">${i + 1}</span>`}
    </div>`;
  }).join('');
}

function champKey(id) {
  return id ? ctx.champions[id]?.key : null;
}

function renderPicks(ids, team) {
  const preview = previewFor(team, 'pick');
  const nextIdx = ids.length; // 次に埋まる枠
  const slots = Array.from({ length: 5 }, (_, i) => ids[i] ?? (i === nextIdx ? preview : null));
  return slots.map((id, i) => {
    const isPreview = id && i === nextIdx && preview;
    const isActiveSlot = state.phase === 'drafting' && state.turn.team === team && state.turn.type === 'pick' && i === nextIdx;
    return `
      <div class="pick-row${id ? '' : ' empty'}${isActiveSlot ? ' active' : ''}${isPreview ? ' preview' : ''}">
        ${id ? `<img class="pick-row-icon" src="${champSquareUrl(ctx.version, id)}" alt="">` : '<div class="pick-row-icon empty-icon"></div>'}
        <div class="pick-row-text">
          <div class="pick-num">PICK ${i + 1}</div>
          <div class="pick-row-name">${id ? champName(id) : '未選択'}</div>
        </div>
      </div>`;
  }).join('');
}

function renderReadyPanel() {
  const panel = $('#ready-panel');
  panel.hidden = state.phase !== 'waiting';
  if (panel.hidden) return;

  for (const side of ['blue', 'red']) {
    const el = $(`#ready-${side}`);
    const ok = state.ready[side];
    el.classList.toggle('ok', ok);
    el.classList.toggle('wait', !ok);
    el.textContent = `${side === 'blue' ? '🔵 BLUE' : '🔴 RED'} ${ok ? '✅ 準備完了' : '⌛ 準備中…'}`;
  }

  const btn = $('#ready-btn');
  if (mySide !== 'blue' && mySide !== 'red') {
    btn.hidden = true;
    return;
  }
  btn.hidden = false;
  const pressed = state.ready[mySide];
  btn.disabled = pressed;
  btn.classList.toggle('pressed', pressed);
  btn.textContent = pressed ? '✅ 準備完了ずみ（相手を待っています）' : '準備完了';
}

function renderRedoRow() {
  const row = $('#redo-row');
  if (state.phase !== 'drafting' || (mySide !== 'blue' && mySide !== 'red')) {
    row.hidden = true;
    return;
  }
  row.hidden = false;
  const mine = state.redoRequest[mySide];
  const otherSide = mySide === 'blue' ? 'red' : 'blue';
  const other = state.redoRequest[otherSide];
  const btn = $('#redo-btn');
  btn.classList.toggle('requested', mine);
  btn.textContent = mine ? '🔄 希望を取り消す' : '🔄 この試合をやり直したい';
  $('#redo-note').textContent = mine
    ? '相手の同意待ちです'
    : other
      ? '相手がやり直しを希望しています。同意する場合はボタンを押してください'
      : '';
}

function bcastBans(ids, team) {
  const preview = previewFor(team, 'ban');
  const slots = Array.from({ length: 5 }, (_, i) => ids[i] ?? (i === ids.length ? preview : null));
  return slots.map((id, i) => {
    const isPreview = id && i === ids.length && preview;
    return `
    <div class="bcast-ban${id ? ' filled' : ' empty'}${isPreview ? ' preview' : ''}">
      ${id ? `<img src="${champSquareUrl(ctx.version, id)}" alt="">` : ''}
    </div>`;
  }).join('');
}

function bcastPicks(ids, team) {
  const preview = previewFor(team, 'pick');
  const nextIdx = ids.length;
  const slots = Array.from({ length: 5 }, (_, i) => ids[i] ?? (i === nextIdx ? preview : null));
  return slots.map((id, i) => {
    const isPreview = id && i === nextIdx && preview;
    const key = champKey(id);
    // センタリング済みバナーが読み込めなければ公式スクエアアイコンにフォールバックする
    const img = key
      ? `<img class="bcast-pick-img" src="${champCenteredUrl(key)}" onerror="this.onerror=null;this.src='${champSquareUrl(ctx.version, id)}';this.classList.add('fallback')" alt="">`
      : '';
    return `
      <div class="bcast-pick${isPreview ? ' preview' : ''}">
        ${img}
        <div class="fade"></div>
        <div class="name">${id ? champName(id) : ''}</div>
      </div>`;
  }).join('');
}

function renderBroadcast() {
  $('#bcast-game-badge').textContent = `GAME ${state.game} ・ BEST OF ${state.seriesLength}`;
  $('#bcast-bans-blue').innerHTML = bcastBans(state.bans.blue, 'blue');
  $('#bcast-bans-red').innerHTML = bcastBans(state.bans.red, 'red');
  $('#bcast-picks-blue').innerHTML = bcastPicks(state.picks.blue, 'blue');
  $('#bcast-picks-red').innerHTML = bcastPicks(state.picks.red, 'red');

  const label = $('#bcast-turn-label');
  if (state.phase === 'waiting') {
    label.textContent = `レディ待ち… 🔵 ${state.ready.blue ? '✅' : '⌛'}　🔴 ${state.ready.red ? '✅' : '⌛'}`;
  } else if (state.phase === 'done') {
    label.textContent = state.game >= state.seriesLength ? `シリーズ終了（全${state.seriesLength}試合）` : `第${state.game}試合のドラフト終了`;
  } else {
    const t = state.turn;
    label.textContent = `${t.team === 'blue' ? '🔵 BLUE' : '🔴 RED'} の ${t.type === 'ban' ? 'BAN' : 'PICK'} 番です`;
  }
  tickTimer();
}

function renderProgressBar() {
  const bar = $('#progress-bar');
  bar.innerHTML = state.order.map((s, i) => {
    const done = i < state.step;
    const current = i === state.step && state.phase === 'drafting';
    const cls = [s.team, s.type, done ? 'done' : '', current ? 'current' : ''].filter(Boolean).join(' ');
    return `<div class="progress-seg ${cls}" title="${i + 1}. ${s.team === 'blue' ? 'BLUE' : 'RED'} ${s.type === 'ban' ? 'BAN' : 'PICK'}"></div>`;
  }).join('');
  $('#progress-count').textContent = `${Math.min(state.step, state.order.length)}/${state.order.length}`;
}

function render() {
  if (!state) return;

  const spectating = mySide === 'spectator';
  $('#board').hidden = spectating;
  $('#broadcast').style.display = spectating ? 'flex' : 'none';
  if (spectating) {
    renderBroadcast();
    return;
  }

  $('#game-badge').textContent = `GAME ${state.game} ・ BEST OF ${state.seriesLength}`;
  renderProgressBar();
  renderReadyPanel();
  renderRedoRow();

  const usedSet = new Set(state.usedChampions);
  const bannedSet = new Set([...state.bans.blue, ...state.bans.red]);
  const pickedSet = new Set([...state.picks.blue, ...state.picks.red]);

  $('#blue-bans').innerHTML = renderBans(state.bans.blue, 'blue');
  $('#red-bans').innerHTML = renderBans(state.bans.red, 'red');
  $('#blue-picks').innerHTML = renderPicks(state.picks.blue, 'blue');
  $('#red-picks').innerHTML = renderPicks(state.picks.red, 'red');

  const turnEl = $('#turn');
  const turnText = $('#turn-text');
  turnEl.style.display = state.phase === 'waiting' ? 'none' : 'inline-block';
  if (state.phase === 'waiting') {
    $('#next-game').hidden = true;
  } else if (state.phase === 'done') {
    const last = state.game >= state.seriesLength;
    turnText.textContent = last ? `シリーズ終了（全${state.seriesLength}試合）` : `第${state.game}試合のドラフト終了`;
    turnEl.classList.remove('your-turn');
    $('#next-game').hidden = last || mySide === 'spectator';
  } else {
    const t = state.turn;
    const actionLabel = t.type === 'ban' ? 'BAN' : 'PICK';
    const teamLabel = t.team === 'blue' ? '🔵 BLUE' : '🔴 RED';
    const yourTurn = t.team === mySide;
    turnText.textContent = `${teamLabel} の ${actionLabel} 番です${yourTurn ? '　👉 あなたの番です' : ''}`;
    turnEl.classList.toggle('your-turn', yourTurn);
    $('#next-game').hidden = true;
  }
  tickTimer();

  renderConfirmBar();

  const query = $('#champ-search').value.trim();
  const grid = $('#champ-grid');
  grid.innerHTML = ctx.list.filter((c) => !query || c.name.includes(query) || c.id.toLowerCase().includes(query.toLowerCase())).map((c) => {
    const fearlessUsed = usedSet.has(c.id); // 過去の試合でピック済み（この試合中はずっとそう表示する）
    const fearlessBlocks = state.phase === 'drafting' && state.turn.type === 'pick' && fearlessUsed;
    const disabled = bannedSet.has(c.id) || pickedSet.has(c.id) || fearlessBlocks;
    const canAct = state.phase === 'drafting' && state.turn.team === mySide && !disabled;
    const hovering = canAct && state.hover[mySide] === c.id;
    const title = fearlessUsed ? 'フィアレス: 過去の試合でピック済みのため、このシリーズ中はピックできません' : '';
    let badge = '';
    if (bannedSet.has(c.id)) badge = `<span class="champ-badge ban">BAN</span>`;
    else if (state.picks.blue.includes(c.id)) badge = `<span class="champ-badge blue">B</span>`;
    else if (state.picks.red.includes(c.id)) badge = `<span class="champ-badge red">R</span>`;
    return `<button type="button" class="champ${disabled ? ' disabled' : ''}${canAct ? ' can-act' : ''}${fearlessUsed ? ' fearless' : ''}${hovering ? ' hovering' : ''}"
        data-id="${c.id}" ${disabled ? 'disabled' : ''} title="${title}">
      ${champImg(c.id)}${badge}
      <span>${c.name}</span>
    </button>`;
  }).join('');
}

function renderConfirmBar() {
  const bar = $('#confirm-bar');
  const canAct = state.phase === 'drafting' && state.turn.team === mySide && (mySide === 'blue' || mySide === 'red');
  bar.hidden = !canAct;
  if (!canAct) return;
  const picked = state.hover[mySide];
  const actionLabel = state.turn.type === 'ban' ? 'BAN' : 'PICK';
  $('#confirm-label').textContent = picked ? `選択中: ${champName(picked)}` : 'チャンピオンを選んでください';
  const btn = $('#confirm-btn');
  btn.disabled = !picked;
  btn.textContent = `🔒 ${actionLabel}を確定`;
}

function hoverChampion(championId) {
  if (!ws || ws.readyState !== WebSocket.OPEN) return;
  ws.send(JSON.stringify({ type: 'hover', championId }));
}

function confirmSelection() {
  if (!state || !state.hover[mySide]) return;
  select(state.hover[mySide]);
}

$('#champ-grid').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-id]');
  if (btn && !btn.disabled) hoverChampion(btn.dataset.id);
});

document.addEventListener('keydown', (e) => {
  if (!state || state.phase !== 'drafting') return;
  const mine = state.hover[mySide];
  if (!mine) return;
  if (e.key === 'Enter') {
    e.preventDefault();
    confirmSelection();
  } else if (e.key === 'Escape') {
    hoverChampion(mine); // 同じチャンピオンをもう一度送るとトグルで解除される
  }
});
$('#champ-search').addEventListener('input', () => render());
$('#confirm-btn').addEventListener('click', confirmSelection);
$('#next-game').addEventListener('click', nextGame);
$('#ready-btn').addEventListener('click', sendReady);
$('#redo-btn').addEventListener('click', sendRedoRequest);

(async () => {
  if (!sessionId) {
    initLobby();
    return;
  }
  $('#board').hidden = false;
  setStatus('読み込み中…');
  await loadChampions();
  connect();
})();
