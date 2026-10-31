// SUMMONER CARD API: looks up a Riot ID and returns what the card maker can fill in.
// Runs on Cloudflare Workers; the Riot API key lives in the RIOT_KEY secret and never reaches the browser.
//   GET /lookup?id=<gameName#tagLine>&platform=<jp1|kr|na1|...>
// Responses are cached for CACHE_SECONDS so repeated lookups cost no Riot requests.

const PLATFORMS = {
  jp1: 'asia', kr: 'asia',
  na1: 'americas', br1: 'americas', la1: 'americas', la2: 'americas',
  euw1: 'europe', eun1: 'europe', tr1: 'europe', ru: 'europe', me1: 'europe',
  oc1: 'sea', sg2: 'sea', ph2: 'sea', th2: 'sea', tw2: 'sea', vn2: 'sea',
};
// Southeast Asian servers were merged into SG2; older accounts may still answer on their own shard.
const SEA = ['sg2', 'th2', 'vn2', 'tw2', 'ph2'];
const ALLOWED_ORIGINS = ['https://summonercard.com', 'http://localhost:8765'];
const CACHE_SECONDS = 600;

class RiotError extends Error {
  constructor(status) {
    super(`riot ${status}`);
    this.status = status;
  }
}

function riot(env, host, path) {
  return async () => {
    for (let attempt = 0; ; attempt++) {
      const res = await fetch(`https://${host}.api.riotgames.com${path}`, { headers: { 'X-Riot-Token': env.RIOT_KEY } });
      if (res.ok) return res.json();
      // Short waits on a rate limit; give up rather than hold the visitor for minutes.
      const wait = Number(res.headers.get('Retry-After') || 1);
      if (res.status === 429 && attempt < 2 && wait <= 3) {
        await new Promise((r) => setTimeout(r, wait * 1000));
        continue;
      }
      throw new RiotError(res.status);
    }
  };
}

// Runs async jobs with at most `limit` in flight.
async function pool(jobs, limit) {
  const out = new Array(jobs.length);
  let next = 0;
  const worker = async () => {
    while (next < jobs.length) {
      const i = next++;
      out[i] = await jobs[i]().catch(() => null);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, jobs.length) }, worker));
  return out;
}

async function findSummoner(env, platform, puuid) {
  const tries = SEA.includes(platform) ? [platform, ...SEA.filter((p) => p !== platform)] : [platform];
  for (const p of tries) {
    try {
      return { platform: p, summoner: await riot(env, p, `/lol/summoner/v4/summoners/by-puuid/${puuid}`)() };
    } catch (e) {
      if (e.status !== 404) throw e;
    }
  }
  throw new RiotError(404);
}

async function lookup(env, gameName, tagLine, wanted) {
  const region = PLATFORMS[wanted];
  const account = await riot(env, region === 'sea' ? 'asia' : region, `/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`)();
  const { puuid } = account;
  const { platform, summoner } = await findSummoner(env, wanted, puuid);
  const matchCount = Number(env.MATCH_COUNT || 20);
  const [entries, mastery, ids] = await Promise.all([
    riot(env, platform, `/lol/league/v4/entries/by-puuid/${puuid}`)().catch(() => []),
    riot(env, platform, `/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/top?count=30`)().catch(() => []),
    riot(env, region, `/lol/match/v5/matches/by-puuid/${puuid}/ids?type=ranked&count=${matchCount}`)().catch(() => []),
  ]);
  const matches = await pool(ids.map((id) => riot(env, region, `/lol/match/v5/matches/${id}`)), 10);

  // Per-champion ranked record, with the position played most on it.
  const champs = new Map();
  for (const m of matches) {
    const me = m?.info?.participants?.find((p) => p.puuid === puuid);
    if (!me || m.info.gameDuration < 300) continue; // remakes say nothing about the champion
    const c = champs.get(me.championId) || { key: String(me.championId), games: 0, wins: 0, roles: {} };
    c.games++;
    if (me.win) c.wins++;
    if (me.teamPosition) c.roles[me.teamPosition] = (c.roles[me.teamPosition] || 0) + 1;
    champs.set(me.championId, c);
  }
  const ROLE = { TOP: 'top', JUNGLE: 'jungle', MIDDLE: 'middle', BOTTOM: 'bottom', UTILITY: 'utility' };
  const solo = entries.find((e) => e.queueType === 'RANKED_SOLO_5x5') || entries.find((e) => e.queueType === 'RANKED_FLEX_SR');

  return {
    gameName: account.gameName,
    tagLine: account.tagLine,
    platform,
    level: summoner.summonerLevel,
    iconId: summoner.profileIconId,
    rank: solo ? { queue: solo.queueType, tier: solo.tier, division: solo.rank, wins: solo.wins, losses: solo.losses } : null,
    mastery: mastery.map((m) => ({ key: String(m.championId), points: m.championPoints, level: m.championLevel })),
    matches: matches.filter(Boolean).length,
    champs: [...champs.values()]
      .map(({ roles, ...c }) => ({ ...c, role: ROLE[Object.entries(roles).sort((a, b) => b[1] - a[1])[0]?.[0]] || '' }))
      .sort((a, b) => b.games - a.games),
  };
}

function json(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'access-control-allow-origin': origin,
      vary: 'Origin',
      'cache-control': status === 200 ? `public, max-age=${CACHE_SECONDS}` : 'no-store',
    },
  });
}

export default {
  async fetch(request, env, ctx) {
    const reqOrigin = request.headers.get('Origin') || '';
    const origin = ALLOWED_ORIGINS.includes(reqOrigin) ? reqOrigin : ALLOWED_ORIGINS[0];
    const url = new URL(request.url);
    if (request.method === 'OPTIONS') return json(null, 204, origin);
    if (url.pathname !== '/lookup') return json({ error: 'not_found' }, 404, origin);

    const [gameName, tagLine] = (url.searchParams.get('id') || '').split('#').map((s) => s.trim());
    const platform = url.searchParams.get('platform') || '';
    if (!gameName || !tagLine || gameName.length > 16 || tagLine.length > 5 || !PLATFORMS[platform]) {
      return json({ error: 'bad_request' }, 400, origin);
    }

    // Cache on a normalized key so "Name#TAG" and "name#tag" share an entry.
    const cache = globalThis.caches?.default;
    const cacheKey = new Request(`https://cache.summonercard.com/lookup/${platform}/${encodeURIComponent(`${gameName}#${tagLine}`.toLowerCase())}`);
    const hit = cache && await cache.match(cacheKey);
    if (hit) {
      const body = await hit.json();
      return json(body, 200, origin);
    }
    try {
      const body = await lookup(env, gameName, tagLine, platform);
      if (cache) ctx.waitUntil(cache.put(cacheKey, json(body, 200, origin)));
      return json(body, 200, origin);
    } catch (e) {
      const status = e instanceof RiotError ? e.status : 500;
      const error = status === 404 ? 'not_found' : status === 429 ? 'busy' : 'failed';
      return json({ error }, status === 404 ? 404 : status === 429 ? 429 : 502, origin);
    }
  },
};
