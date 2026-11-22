// あぐ鯖カスタム大会のトーナメント進行ボード。1大会 = 1 Durable Object（固定ID）。
// 「どの試合でどっちが勝ったか」だけを decisions として持ち、表示用の全体ツリーは
// 毎回 compute() で1回戦の固定組み合わせから作り直す（過去の勝敗を直したときのズレを防ぐため）。

const ROUND1 = [
  ['in the huton', 'Knock Knock'],
  ['KHMRD(カムラッド)', 'iron carry'],
  ['BOMBA', '5ADC'],
  ['GoldDemons', 'ティモフィズケイトセラウコンOTP'],
  ['チームカースト', 'ヴォイドグラブください'],
  ['ハゲモニ蛙', 'マッコリ揺蕩う'],
  ['メンタルエメラルド', 'なつき'],
  ['T1 海物語', 'ヤングやまちゃん'],
];
const ROUND_TITLES = ['1回戦', '準々決勝', '準決勝', '決勝'];
const MATCH_COUNTS = [8, 4, 2, 1];

function matchId(round, index) {
  return `r${round}m${index}`;
}

export class TournamentBoard {
  constructor(state, env) {
    this.state = state;
    this.env = env;
    this.data = null;
  }

  async load() {
    if (this.data) return this.data;
    this.data = (await this.state.storage.get('data')) ?? { decisions: {}, updatedAt: null };
    return this.data;
  }

  async save() {
    await this.state.storage.put('data', this.data);
  }

  /** 1回戦の固定カードと decisions から、全ラウンドのツリーを作り直す */
  compute() {
    const rounds = [];
    let prevWinners = null;
    for (let r = 0; r < ROUND_TITLES.length; r++) {
      const count = MATCH_COUNTS[r];
      const matches = [];
      for (let m = 0; m < count; m++) {
        const id = matchId(r, m);
        const team1 = r === 0 ? ROUND1[m][0] : (prevWinners[2 * m] ?? null);
        const team2 = r === 0 ? ROUND1[m][1] : (prevWinners[2 * m + 1] ?? null);
        const decision = this.data.decisions[id];
        const winner = decision === 0 ? team1 : decision === 1 ? team2 : null;
        matches.push({ id, team1, team2, winner });
      }
      rounds.push({ title: ROUND_TITLES[r], matches });
      prevWinners = matches.map((x) => x.winner);
    }
    return { rounds, champion: prevWinners[0] ?? null, updatedAt: this.data.updatedAt };
  }

  async fetch(request) {
    const url = new URL(request.url);
    await this.load();

    if (request.method === 'GET' && url.pathname.endsWith('/state')) {
      return Response.json(this.compute());
    }

    if (request.method === 'POST' && url.pathname.endsWith('/decide')) {
      const body = await request.json().catch(() => ({}));
      const id = body.matchId;
      const winnerIndex = body.winnerIndex;
      const idMatch = typeof id === 'string' && id.match(/^r(\d)m(\d+)$/);
      if (!idMatch || !(winnerIndex === 0 || winnerIndex === 1 || winnerIndex === null)) {
        return Response.json({ error: 'bad_request' }, { status: 400 });
      }
      const round = Number(idMatch[1]);

      if (winnerIndex !== null) {
        const before = this.compute();
        const match = before.rounds[round]?.matches.find((x) => x.id === id);
        if (!match || !match.team1 || !match.team2) {
          return Response.json({ error: 'not_ready' }, { status: 409 });
        }
      }

      // この試合より後のラウンドは、このカードの結果に依存しているので一緒にクリアする
      for (const key of Object.keys(this.data.decisions)) {
        const m = key.match(/^r(\d)m/);
        if (m && Number(m[1]) > round) delete this.data.decisions[key];
      }
      if (winnerIndex === null) delete this.data.decisions[id];
      else this.data.decisions[id] = winnerIndex;
      this.data.updatedAt = Date.now();
      await this.save();
      return Response.json(this.compute());
    }

    if (request.method === 'POST' && url.pathname.endsWith('/reset')) {
      this.data = { decisions: {}, updatedAt: Date.now() };
      await this.save();
      return Response.json(this.compute());
    }

    return new Response('not found', { status: 404 });
  }
}
