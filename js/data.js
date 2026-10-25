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
    bg1: '#fbe3f0', bg2: '#dff0f4', bgStops: ['#fcd5ea', '#e9dbfb', '#d6eff7'],
    holo: ['#ffd1ea', '#e2d1ff', '#c9f1ec', '#cfe3ff', '#ffe1f0'],
    accent: '#e48ab8', accent2: '#a990e0', gold: '#d2a640', text: '#5b3d66', sub: '#a58fb0', panel: 'rgba(255,255,255,0.74)',
    confetti: ['#f7a8c8', '#b9a4ec', '#9fdcd0', '#ffd98a', '#a9cff5'],
  },
  {
    id: 'fairy-mint', label: 'ゆめかわミント', light: true, deco: 'fairy',
    bg1: '#e2f5ef', bg2: '#fbe6f0', bgStops: ['#d3f2ea', '#e3e0fb', '#fbe1ee'],
    holo: ['#c9f1ec', '#cfe3ff', '#e2d1ff', '#ffd1ea', '#d6f5e6'],
    accent: '#5dbcac', accent2: '#a990e0', gold: '#cfa443', text: '#3d5560', sub: '#8ba5aa', panel: 'rgba(255,255,255,0.74)',
    confetti: ['#9fdcd0', '#b9a4ec', '#f7a8c8', '#ffd98a', '#a9cff5'],
  },
  { id: 'guardian', label: 'スターガーディアン', light: true, bg1: '#fff3fb', bg2: '#e7e8ff', accent: '#c45bd0', accent2: '#5b7cf0', text: '#2a1d3a', sub: '#6e6280', panel: 'rgba(255,255,255,0.72)' },
];

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
  mainRole: '',
  subRoles: [],
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
  bgX: 0.5,
  bgZoom: 1,
  splashY: 0.3,
  dim: 0.6,
  theme: 'hextech',
};

export const SAMPLE_STATE = {
  ...DEFAULT_STATE,
  name: 'ポロ大好き',
  tag: 'JP1',
  level: '287',
  iconChamp: 'Ahri',
  tier: 'EMERALD',
  division: 'II',
  mainRole: 'middle',
  subRoles: ['utility'],
  champs: [
    { id: 'Ahri', role: 'middle' },
    { id: 'Syndra', role: 'middle' },
    { id: 'Orianna', role: 'middle' },
    { id: 'Lux', role: 'utility' },
    { id: 'Lux', role: 'middle' },
  ],
  tags: ['ランク勢', 'デュオ募集', 'VCあり', '社会人'],
  hours: '平日22時〜深夜 / 休日いつでも',
  discord: 'poro_love',
  x: 'poro_love_lol',
  comment: 'ミッドメインです！一緒にランク回せる方、気軽に声かけてください。',
  splashChamp: 'Ahri',
  splashSkin: 0,
  splashY: 0.25,
  dim: 0.6,
  theme: 'hextech',
};
