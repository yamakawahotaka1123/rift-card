// フィアレスドラフト: 1セッション = 1 Durable Object。
// 青・赤・観戦の3つの WebSocket 接続を受け、状態をまとめて同期する。
// シリーズ内で「ピックされた」チャンピオンは次の試合でピック不可（フィアレスドラフト、通常版）。
// 勝敗はこのサイトでは扱わない（Discord 側で記録する）。ここは純粋にドラフトの進行だけを見る。

// 本家トーナメントドラフトの順番（BAN1 x6 → PICK1 x6 → BAN2 x4 → PICK2 x4）
const ORDER = [
  ...['blue', 'red', 'blue', 'red', 'blue', 'red'].map((team) => ({ type: 'ban', team })),
  ...['blue', 'red', 'red', 'blue', 'blue', 'red'].map((team) => ({ type: 'pick', team })),
  ...['red', 'blue', 'red', 'blue'].map((team) => ({ type: 'ban', team })),
  ...['red', 'blue', 'blue', 'red'].map((team) => ({ type: 'pick', team })),
];

const SESSION_TTL_MS = 6 * 60 * 60 * 1000; // 6時間アクセスが無ければ消す
const MIN_TIMER = 5;
const MAX_TIMER = 120;
const DEFAULT_TIMER = 60;

const DDRAGON = 'https://ddragon.leagueoflegends.com';

function randomToken() {
  return crypto.randomUUID().replace(/-/g, '');
}

function freshGame() {
  return { step: 0, bans: { blue: [], red: [] }, picks: { blue: [], red: [] } };
}

function freshReady() {
  return { blue: false, red: false };
}

function freshHover() {
  return { blue: null, red: null };
}

export class DraftSession {
  constructor(state, env) {
    this.state = state;
    this.env = env;
    this.sockets = new Map(); // WebSocket -> { side: 'blue'|'red'|'spectator' }
    this.data = null;
    this.championIds = null; // 遅延取得してキャッシュ（タイムアウト時のランダム選択用）
  }

  async load() {
    if (this.data) return this.data;
    this.data = (await this.state.storage.get('data')) ?? null;
    return this.data;
  }

  async save() {
    await this.state.storage.put('data', this.data);
    await this.scheduleAlarm();
  }

  /** 次のターン締切 or セッションTTL、どちらか早い方にアラームを合わせる */
  async scheduleAlarm() {
    const turnDeadline = this.data.phase === 'drafting' ? this.data.turnStartedAt + this.data.timerSeconds * 1000 : Infinity;
    const ttlDeadline = this.data.lastActive + SESSION_TTL_MS;
    await this.state.storage.setAlarm(Math.min(turnDeadline, ttlDeadline));
  }

  async fetch(request) {
    const url = new URL(request.url);

    if (request.method === 'POST' && url.pathname.endsWith('/create')) {
      return this.handleCreate(request);
    }
    if (url.pathname.endsWith('/ws')) {
      return this.handleWebSocket(request, url);
    }
    return new Response('not found', { status: 404 });
  }

  async handleCreate(request) {
    const body = await request.json().catch(() => ({}));
    const seriesLength = body.seriesLength === 5 ? 5 : 3;
    const timerSeconds = Math.min(MAX_TIMER, Math.max(MIN_TIMER, Number(body.timerSeconds) || DEFAULT_TIMER));

    const now = Date.now();
    const data = {
      seriesLength,
      game: 1,
      phase: 'waiting', // waiting（両者レディ待ち） | drafting | done
      usedChampions: [], // 過去の試合でピックされたチャンピオン（フィアレス対象）
      current: freshGame(),
      ready: freshReady(),
      redoRequest: freshReady(),
      hover: freshHover(),
      blueToken: randomToken(),
      redToken: randomToken(),
      createdAt: now,
      timerSeconds,
      turnStartedAt: now,
      lastActive: now,
    };
    this.data = data;
    await this.save();

    return Response.json({
      blueToken: data.blueToken,
      redToken: data.redToken,
      seriesLength,
      timerSeconds,
    });
  }

  async handleWebSocket(request, url) {
    if (request.headers.get('Upgrade') !== 'websocket') {
      return new Response('expected websocket', { status: 426 });
    }
    const data = await this.load();
    if (!data) return new Response('session not found', { status: 404 });

    const token = url.searchParams.get('token') || '';
    let side = 'spectator';
    if (token && token === data.blueToken) side = 'blue';
    else if (token && token === data.redToken) side = 'red';

    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    server.accept();
    this.sockets.set(server, { side });

    server.addEventListener('message', (ev) => this.handleMessage(server, side, ev));
    server.addEventListener('close', () => this.sockets.delete(server));
    server.addEventListener('error', () => this.sockets.delete(server));

    this.send(server, { type: 'hello', side });
    this.send(server, { type: 'state', ...this.publicState() });

    return new Response(null, { status: 101, webSocket: client });
  }

  async handleMessage(socket, side, ev) {
    let msg;
    try {
      msg = JSON.parse(ev.data);
    } catch {
      return;
    }
    const data = await this.load();
    if (!data) return;
    data.lastActive = Date.now();

    if (msg.type === 'select' && data.phase === 'drafting') {
      this.applySelect(data, side, msg.championId);
    } else if (msg.type === 'nextGame' && data.phase === 'done') {
      this.applyNextGame(data);
    } else if (msg.type === 'ready' && data.phase === 'waiting') {
      this.applyReady(data, side);
    } else if (msg.type === 'redoRequest' && data.phase === 'drafting') {
      this.applyRedoRequest(data, side);
    } else if (msg.type === 'hover' && data.phase === 'drafting') {
      this.applyHover(data, side, msg.championId);
    } else {
      await this.save(); // lastActive だけでも反映しておく
      return;
    }

    await this.save();
    this.broadcast({ type: 'state', ...this.publicState() });
  }

  /** そのチャンピオンがいま選べるか（今回の試合で未使用、ピックならフィアレス対象でもない） */
  isAvailable(data, step, championId) {
    const cur = data.current;
    const takenThisGame = new Set([
      ...cur.bans.blue, ...cur.bans.red,
      ...cur.picks.blue, ...cur.picks.red,
    ]);
    if (takenThisGame.has(championId)) return false;
    if (step.type === 'pick' && data.usedChampions.includes(championId)) return false;
    return true;
  }

  applySelect(data, side, championId) {
    if (typeof championId !== 'string' || !championId) return;
    const cur = data.current;
    const step = ORDER[cur.step];
    if (!step) return;
    if (step.team !== side) return; // 自分のチームの番じゃない
    if (!this.isAvailable(data, step, championId)) return;

    this.commitStep(data, step, championId);
  }

  /** 確定前の「仮選択」。相手・観戦者にもリアルタイムで見える（本家の仮ホバー表示と同じ） */
  applyHover(data, side, championId) {
    if (side !== 'blue' && side !== 'red') return;
    const cur = data.current;
    const step = ORDER[cur.step];
    if (!step || step.team !== side) return; // 自分のチームの番じゃない
    if (championId === null) {
      data.hover[side] = null;
      return;
    }
    if (typeof championId !== 'string' || !this.isAvailable(data, step, championId)) return;
    data.hover[side] = data.hover[side] === championId ? null : championId; // もう一度押すと取り消し
  }

  commitStep(data, step, championId) {
    const cur = data.current;
    if (step.type === 'ban') cur.bans[step.team].push(championId);
    else cur.picks[step.team].push(championId);
    data.hover[step.team] = null;

    cur.step++;
    if (cur.step >= ORDER.length) {
      data.phase = 'done';
      data.usedChampions.push(...cur.picks.blue, ...cur.picks.red);
    } else {
      data.turnStartedAt = Date.now();
    }
  }

  applyNextGame(data) {
    if (data.game >= data.seriesLength) return; // シリーズ終了
    data.game++;
    data.phase = 'waiting';
    data.current = freshGame();
    data.ready = freshReady();
    data.redoRequest = freshReady();
    data.hover = freshHover();
  }

  /** 両者レディでドラフト開始（BAN1から） */
  applyReady(data, side) {
    if (side !== 'blue' && side !== 'red') return;
    data.ready[side] = true;
    if (data.ready.blue && data.ready.red) {
      data.phase = 'drafting';
      data.turnStartedAt = Date.now();
    }
  }

  /** もう一度押すと取り消せる（押し間違い対策）。両者そろったら今の試合だけリセット */
  applyRedoRequest(data, side) {
    if (side !== 'blue' && side !== 'red') return;
    data.redoRequest[side] = !data.redoRequest[side];
    if (data.redoRequest.blue && data.redoRequest.red) {
      data.current = freshGame();
      data.redoRequest = freshReady();
      data.hover = freshHover();
      data.turnStartedAt = Date.now();
    }
  }

  async getChampionIds() {
    if (this.championIds) return this.championIds;
    const versions = await fetch(`${DDRAGON}/api/versions.json`).then((r) => r.json());
    const json = await fetch(`${DDRAGON}/cdn/${versions[0]}/data/en_US/champion.json`).then((r) => r.json());
    this.championIds = Object.keys(json.data);
    return this.championIds;
  }

  /** 時間切れ: その番の人の代わりにランダムで選ぶ（バン/ピックどちらも、何も選ばれないままにはしない） */
  async autoCommit(data, step) {
    const ids = await this.getChampionIds();
    const pool = ids.filter((id) => this.isAvailable(data, step, id));
    if (!pool.length) return; // 理論上ほぼ無いが、選べる候補が無ければ何もしない
    const pick = pool[Math.floor(Math.random() * pool.length)];
    this.commitStep(data, step, pick);
    this.broadcast({ type: 'timeout', team: step.team, action: step.type, championId: pick });
  }

  publicState() {
    const { seriesLength, game, phase, usedChampions, current, timerSeconds, turnStartedAt, ready, redoRequest, hover } = this.data;
    const step = ORDER[current.step] ?? null;
    return {
      seriesLength,
      game,
      phase,
      usedChampions,
      order: ORDER,
      step: current.step,
      bans: current.bans,
      picks: current.picks,
      turn: phase === 'drafting' ? step : null,
      ready,
      redoRequest: phase === 'drafting' ? redoRequest : freshReady(),
      hover: phase === 'drafting' ? hover : freshHover(),
      timerSeconds,
      turnDeadline: phase === 'drafting' ? turnStartedAt + timerSeconds * 1000 : null,
    };
  }

  send(socket, msg) {
    try {
      socket.send(JSON.stringify(msg));
    } catch {
      /* 切断済みなら無視 */
    }
  }

  broadcast(msg) {
    for (const socket of this.sockets.keys()) this.send(socket, msg);
  }

  // ターンのタイムアウト（時間切れの自動選択）と、セッション非アクティブ時の掃除を両方見る
  async alarm() {
    const data = await this.load();
    if (!data) return;

    if (Date.now() - data.lastActive >= SESSION_TTL_MS) {
      await this.state.storage.deleteAll();
      return;
    }

    if (data.phase === 'drafting' && Date.now() >= data.turnStartedAt + data.timerSeconds * 1000) {
      const step = ORDER[data.current.step];
      if (step) await this.autoCommit(data, step);
      await this.save();
      this.broadcast({ type: 'state', ...this.publicState() });
      return;
    }

    await this.scheduleAlarm(); // まだどちらの締切も来ていない（スプリアス起床）
  }
}
