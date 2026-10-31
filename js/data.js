// Static data used by both the form and the card renderer.

export const DDRAGON = 'https://ddragon.leagueoflegends.com';
export const CDRAGON = 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default';
export const CDRAGON_GAME = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global';

export const TIERS = [
  { id: 'UNRANKED', label: 'アンランク', divisions: false },
  { id: 'IRON', label: 'アイアン', divisions: true },
  { id: 'BRONZE', label: 'ブロンズ', divisions: true },
  { id: 'SILVER', label: 'シルバー', divisions: true },
  { id: 'GOLD', label: 'ゴールド', divisions: true },
  { id: 'PLATINUM', label: 'プラチナ', divisions: true },
  { id: 'EMERALD', label: 'エメラルド', divisions: true },
  { id: 'DIAMOND', label: 'ダイヤモンド', divisions: true },
  { id: 'MASTER', label: 'マスター', divisions: false },
  { id: 'GRANDMASTER', label: 'グランドマスター', divisions: false },
  { id: 'CHALLENGER', label: 'チャレンジャー', divisions: false },
];

export const DIVISIONS = ['IV', 'III', 'II', 'I'];

export const ROLES = [
  { id: 'top', label: 'TOP' },
  { id: 'jungle', label: 'JG' },
  { id: 'middle', label: 'MID' },
  { id: 'bottom', label: 'ADC' },
  { id: 'utility', label: 'SUP' },
];

// For people who'd rather not show their Riot ID on the card.
export const NAME_PRESETS = ['非公開', 'やるとき教えます', 'DMで教えます', '仲良くなったら教えます'];

// How willing someone is to play each role, strongest first.
export const ROLE_LEVELS = [
  { id: 'main', label: 'メイン', badge: 'MAIN' },
  { id: 'sub', label: 'サブ', badge: 'SUB' },
  { id: 'normal', label: 'ノマなら可', badge: 'ノマ可' },
  { id: 'ng', label: '無理', badge: 'NG' },
];

export const mainRoleOf = (state) => Object.keys(state.roleLevels || {}).find((r) => state.roleLevels[r] === 'main') || '';

export const TAGS = [
  'エンジョイ勢', 'ランク勢', 'ノーマル', 'ARAM', 'アリーナ', 'スイフトプレイ',
  '初心者', '初心者歓迎', '復帰勢', 'VCあり', '聞き専OK', 'チャットのみ',
  'デュオ募集', 'フルパ募集', 'カスタム募集', '社会人', '学生', '配信してます',
];
export const MAX_TAGS = 6;
export const MAX_TAG_LENGTH = 12;
export const MAX_CHAMPS = 5;
export const MAX_COMMENT = 80;

export const THEMES = [
  { id: 'hextech', label: 'ヘクステック', bg1: '#0a1428', bg2: '#091f2e', accent: '#c8aa6e', accent2: '#0ac8b9', text: '#f0e6d2', sub: '#a09b8c', panel: 'rgba(1,10,19,0.62)' },
  { id: 'noxus', label: 'ノクサス', bg1: '#140707', bg2: '#2a0d0d', accent: '#e0473f', accent2: '#f2b25c', text: '#f6e7e2', sub: '#b39a94', panel: 'rgba(20,4,4,0.62)' },
  { id: 'freljord', label: 'フレヨルド', bg1: '#08182a', bg2: '#123049', accent: '#8fd3ff', accent2: '#e8f6ff', text: '#eef8ff', sub: '#9bb6c9', panel: 'rgba(4,16,30,0.6)' },
  { id: 'shadow', label: 'シャドウアイル', bg1: '#06120f', bg2: '#0c2a22', accent: '#3ee6a8', accent2: '#b6ffe2', text: '#e4fff4', sub: '#8fb3a5', panel: 'rgba(2,14,10,0.62)' },
  { id: 'ionia', label: 'アイオニア', bg1: '#1c0e1d', bg2: '#341a35', accent: '#f4a6c6', accent2: '#ffe0ee', text: '#fff2f8', sub: '#c4a3b5', panel: 'rgba(24,8,22,0.6)' },
  {
    id: 'fairy', label: 'ゆめかわピンク', light: true, deco: 'fairy',
    bg1: '#fbe3f0', bg2: '#d9e9fb', bgStops: ['#fcd8ec', '#e8dcfa', '#d6e8fb'],
    accent: '#e889b8', accent2: '#a990e0', gold: '#d6a94a', text: '#5b3d70', sub: '#a28fbd', panel: 'rgba(255,255,255,0.78)',
    line: '#9d86cf', candy: ['#f7a8c8', '#c6b3f3', '#a9d3f7', '#ffe08f'],
    checker: ['#fbd3e6', '#ffffff'], clouds: ['#e6d8fb', '#f9d6ea', '#d6e7fb'],
  },
  {
    id: 'fairy-mint', label: 'ゆめかわブルー', light: true, deco: 'fairy',
    bg1: '#e0f0fb', bg2: '#f7e1f0', bgStops: ['#d6ebfb', '#e5e0fa', '#fadced'],
    accent: '#7fb4e6', accent2: '#a990e0', gold: '#d6a94a', text: '#41507a', sub: '#93a0c0', panel: 'rgba(255,255,255,0.78)',
    line: '#8a93cf', candy: ['#a9d3f7', '#c6b3f3', '#f7a8c8', '#ffe08f'],
    checker: ['#d6e8fb', '#ffffff'], clouds: ['#dbe9fb', '#e6d8fb', '#f9d6ea'],
  },
  { id: 'guardian', label: 'スターガーディアン', light: true, bg1: '#fff3fb', bg2: '#e7e8ff', accent: '#c45bd0', accent2: '#5b7cf0', gold: '#e0a93a', text: '#2a1d3a', sub: '#6e6280', panel: 'rgba(255,255,255,0.72)' },
  {
    id: 'jirai', label: '地雷系', deco: 'jirai',
    bg1: '#160910', bg2: '#2a0f1f', bgStops: ['#1a0a12', '#2b1020', '#160910'],
    accent: '#ff6fa8', accent2: '#ffc2da', gold: '#ffc2da', text: '#fff0f6', sub: '#c99ab0', panel: 'rgba(22,6,14,0.72)',
  },
  {
    id: 'ryousan', label: '量産型', light: true, deco: 'ryousan',
    bg1: '#fff6f9', bg2: '#fde3ec', bgStops: ['#fff8fa', '#fde6ee', '#fbd9e5'],
    accent: '#ef8fb1', accent2: '#f7bcd0', gold: '#e9a9bf', line: '#e8a3bb', text: '#6b3a4c', sub: '#b88a9a', panel: 'rgba(255,255,255,0.8)',
  },
  {
    id: 'y2k', label: 'Y2K', light: true, deco: 'y2k',
    bg1: '#e9f1ff', bg2: '#ffd6f6', bgStops: ['#cfe6ff', '#f2d4ff', '#ffd6ec', '#d8fff4'],
    accent: '#6b4dff', accent2: '#ff5cc8', gold: '#ffb800', line: '#2a2350', text: '#231d4a', sub: '#6f6aa0', panel: 'rgba(255,255,255,0.75)',
  },
  {
    id: 'gaming', label: 'ゲーミング', deco: 'gaming',
    bg1: '#05050c', bg2: '#100c24', bgStops: ['#07061a', '#0d0b20', '#1a0b2e'],
    accent: '#00e5ff', accent2: '#ff2a6d', gold: '#ffb800', text: '#f2f7ff', sub: '#7f8bb0', panel: 'rgba(6,6,20,0.78)',
  },
  {
    id: 'wafu', label: '和風', light: true, deco: 'wafu',
    bg1: '#f8f1e4', bg2: '#efe1c6', bgStops: ['#fbf6ec', '#f3e8d3', '#ead9b9'],
    accent: '#b3242c', accent2: '#c9a24a', gold: '#c9a24a', line: '#8a6a2e', text: '#2b1d14', sub: '#8a7560', panel: 'rgba(255,251,242,0.82)',
  },
  {
    id: 'halloween', label: 'ハロウィン', deco: 'halloween',
    bg1: '#140a1f', bg2: '#2a1238', bgStops: ['#120820', '#24103a', '#3a1530'],
    accent: '#ff8a1f', accent2: '#b57bff', gold: '#ffb347', text: '#fff3e6', sub: '#bba6cc', panel: 'rgba(16,6,24,0.72)',
  },
  {
    id: 'christmas', label: 'クリスマス', deco: 'christmas',
    bg1: '#0b2a1c', bg2: '#14402a', bgStops: ['#0a2418', '#123a26', '#1c4a30'],
    accent: '#e8414f', accent2: '#f6f1e7', gold: '#e6c46a', text: '#fff8ef', sub: '#b6cbb8', panel: 'rgba(6,24,15,0.7)',
  },
  {
    // Shows up on its own from `from` (JST); until then only direct renders can use it.
    id: 'newyear', label: 'お正月', deco: 'newyear', from: '2026-12-01',
    bg1: '#5a0a13', bg2: '#8c1520', bgStops: ['#46070f', '#74101a', '#9a1c25'],
    accent: '#e6c15a', accent2: '#fff1d6', gold: '#f2d27a', text: '#fff7ea', sub: '#e9b9aa', panel: 'rgba(48,5,10,0.72)',
  },
  {
    id: 'lunar', label: '旧正月', deco: 'lunar', from: '2027-01-15',
    bg1: '#8e0d14', bg2: '#c81e22', bgStops: ['#760a10', '#a8141a', '#d4282a'],
    accent: '#ffc94a', accent2: '#ffe9b0', gold: '#f8cf5c', text: '#fff8e8', sub: '#ffc7b0', panel: 'rgba(80,4,8,0.7)',
  },
  {
    id: 'valentine', label: 'バレンタイン', deco: 'valentine', from: '2027-01-25',
    bg1: '#2b0d14', bg2: '#4d1626', bgStops: ['#22080f', '#3d1120', '#5c1a2e'],
    accent: '#ff5c8a', accent2: '#ffc2d4', gold: '#f4c58f', text: '#fff1f5', sub: '#d9a3b4', panel: 'rgba(30,6,14,0.72)',
  },
  {
    id: 'yozakura', label: '夜桜', deco: 'yozakura', from: '2027-03-01',
    bg1: '#0e0b24', bg2: '#2a1640', bgStops: ['#0b0a20', '#1c1236', '#3a1a48'],
    accent: '#ff5fa2', accent2: '#ffc1dc', gold: '#ffd9a8', text: '#fff3f8', sub: '#c3a9cf', panel: 'rgba(12,8,30,0.72)',
  },
  {
    id: 'songkran', label: 'ソンクラーン', deco: 'songkran', from: '2027-03-25',
    bg1: '#0a8fc4', bg2: '#38c6e8', bgStops: ['#0677b0', '#16a2d6', '#5fd6ef'],
    accent: '#ffffff', accent2: '#ff7ab6', gold: '#ffe066', text: '#ffffff', sub: '#d6f4ff', panel: 'rgba(0,60,100,0.55)',
  },
  {
    id: 'hanabi', label: '花火', deco: 'hanabi', from: '2027-07-01',
    bg1: '#050a24', bg2: '#0e1a46', bgStops: ['#03061a', '#0a1236', '#152456'],
    accent: '#ffd36b', accent2: '#ff6b8b', gold: '#f3c968', text: '#fffaf0', sub: '#a9b6dc', panel: 'rgba(4,8,30,0.72)',
  },
];

export const themeIsOut = (theme, now = new Date()) => !theme.from || now >= new Date(`${theme.from}T00:00:00+09:00`);
export const availableThemes = (now) => THEMES.filter((t) => themeIsOut(t, now));

export const DEFAULT_STATE = {
  name: '',
  tag: '',
  level: '',
  iconChamp: '',
  iconId: '',
  iconTitle: '',
  iconUpload: '',
  iconShape: 'circle',
  tier: 'UNRANKED',
  division: 'IV',
  // role id -> 'main' | 'sub' | 'normal' | 'ng'. Only one role can be 'main'.
  roleLevels: {},
  // Each entry is { id, role, img? }; the same champion may appear with different roles.
  // img is an optional data URL cropped from a skin splash.
  champs: [],
  champLabel: 'main',
  tags: [],
  customTags: [],
  hours: '',
  discord: '',
  x: '',
  twitch: '',
  youtube: '',
  comment: '',
  splashChamp: '',
  splashSkin: 0,
  bgUpload: '',
  // Background shift as a fraction of the card size (-1..1), and zoom relative to "cover".
  bgOffX: 0,
  bgOffY: 0,
  bgZoom: 1,
  dim: 0.6,
  theme: 'hextech',
  showCredit: true, // show the site URL in the card's watermark
};

// A parody sample (clearly marked as a joke in the comment). Contact fields stay empty
// so nothing on the card can be mistaken for a real person's accounts.
export const SAMPLE_STATE = {
  ...DEFAULT_STATE,
  name: 'Hide on bush',
  tag: 'KR1',
  level: '999',
  iconChamp: 'Ahri',
  tier: 'CHALLENGER',
  roleLevels: { middle: 'main', top: 'ng', jungle: 'ng', bottom: 'ng', utility: 'ng' },
  champs: [
    { id: 'Ahri', role: 'middle' },
    { id: 'Leblanc', role: 'middle' },
    { id: 'Azir', role: 'middle' },
    { id: 'Ryze', role: 'middle' },
    { id: 'Zed', role: 'middle' },
  ],
  tags: ['ランク勢', 'デュオ募集', '初心者歓迎'],
  hours: 'T1の試合がない日',
  comment: '世界大会優勝経験あります（5回くらい）。ミッド以外はやりません。\n※ネタのサンプルです',
  splashChamp: 'Ahri',
  splashSkin: 0,
  bgOffY: 0.05,
  dim: 0.6,
  theme: 'hextech',
};
