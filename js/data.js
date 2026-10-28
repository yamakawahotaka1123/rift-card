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
