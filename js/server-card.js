// Draws the Discord server introduction card. Shares the theme, background and decorations
// with the summoner card (card.js), with its own layout for server details.
import { THEMES, TIERS } from './data.js';
import {
  CARD_H, CARD_W, drawBase, drawComment, drawIcon, drawTags, drawWatermark, emblemUrl, ensureFonts, fitText,
  hexToRgba, loadImage, loadSplash, roundRect, sectionLabel, useThemeFonts, wrapLines,
} from './card.js';
import { tierName } from './i18n.js';
import { qrMatrix } from './qr.js';

// The tiers people can pick as the bottom and top of the server's rank range.
export const RANK_TIERS = TIERS.filter((t) => t.id !== 'UNRANKED');

// Text for the rank range, e.g. "Silver – Diamond"; empty ends mean "any".
export function rankRange(state, allRanks) {
  const from = RANK_TIERS.find((t) => t.id === state.rankFrom);
  const to = RANK_TIERS.find((t) => t.id === state.rankTo);
  if (!from && !to) return allRanks;
  if (from && to && from === to) return tierName(from);
  return `${from ? tierName(from) : ''} 〜 ${to ? tierName(to) : ''}`.trim();
}

// discord.com/invite/abc and discord.gg/abc are the same invite; show the short form.
const shortInvite = (invite) => invite.replace(/^(www\.)?discord(app)?\.com\/invite\//i, 'discord.gg/');

function panel(ctx, x, y, w, h, theme) {
  roundRect(ctx, x, y, w, h, 14);
  ctx.fillStyle = theme.panel;
  ctx.fill();
  ctx.strokeStyle = hexToRgba(theme.accent, 0.35);
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

/**
 * labels: { allRanks, name, inviteEmpty, joinText } in the page language.
 * ctxData: { champions } from Data Dragon, used for the skin background.
 */
export async function renderServerCard(canvas, state, ctxData, labels) {
  const theme = THEMES.find((t) => t.id === state.theme) || THEMES[0];
  const tags = [...state.tags, ...String(state.customTags || '').split(/[,、，]/).map((s) => s.trim()).filter(Boolean)];
  const range = rankRange(state, labels.allRanks);
  const ends = [state.rankFrom, state.rankTo].filter((id, i, a) => id && a.indexOf(id) === i);

  const [splash, icon, emblems] = await Promise.all([
    state.bgUpload ? loadImage(state.bgUpload)
      : state.splashChamp ? loadSplash(state.splashChamp, ctxData.champions[state.splashChamp]?.key, state.splashSkin) : null,
    state.iconUpload ? loadImage(state.iconUpload) : null,
    Promise.all(ends.map((id) => loadImage(emblemUrl(id)))),
    ensureFonts([state.name, state.members, state.hours, state.invite, state.joinText, labels.joinText, state.about, state.message, range, ...tags], theme),
  ]);

  const { deco, fonts, jp, en } = useThemeFonts(theme);
  const off = document.createElement('canvas');
  off.width = CARD_W;
  off.height = CARD_H;
  const ctx = off.getContext('2d');
  ctx.textBaseline = 'alphabetic';

  drawBase(ctx, theme, deco, splash, state);
  drawIcon(ctx, icon, 60, 56, 150, state.iconShape, theme, deco, state.name);

  // Server name
  const nx = 240, nameMax = 600;
  ctx.textAlign = 'left';
  ctx.font = `700 15px ${en}`;
  ctx.fillStyle = theme.accent;
  ctx.letterSpacing = '3px';
  ctx.fillText('DISCORD SERVER', nx, 64);
  ctx.letterSpacing = '0px';
  ctx.fillStyle = theme.text;
  ctx.shadowColor = deco.nameGlow || (theme.light ? 'transparent' : 'rgba(0,0,0,0.6)');
  ctx.shadowBlur = deco.nameGlow ? 18 : 8;
  ctx.fillText(fitText(ctx, state.name || labels.name, nameMax, 800, 52, 28), nx, 118);
  ctx.shadowBlur = 0;
  ctx.shadowColor = 'transparent';
  const line = ctx.createLinearGradient(nx, 0, nx + nameMax, 0);
  line.addColorStop(0, theme.accent);
  line.addColorStop(1, hexToRgba(theme.accent, 0));
  ctx.fillStyle = line;
  ctx.fillRect(nx, 138, nameMax, 2);

  // Info rows
  const rows = [];
  if (state.members) rows.push(['MEMBERS', String(state.members)]);
  if (state.hours) rows.push(['TIME', state.hours]);
  rows.forEach(([label, value], r) => {
    const y = 180 + r * 32;
    ctx.font = `700 15px ${en}`;
    ctx.fillStyle = theme.accent;
    ctx.fillText(label, nx, y);
    ctx.fillStyle = theme.text;
    ctx.fillText(fitText(ctx, value, nameMax - 110, 700, 22, 14), nx + 110, y + 1);
  });

  // Rank emblems on the right: one or two crests, or "ALL RANKS"
  const rcx = 1010;
  ctx.textAlign = 'center';
  const crest = (img, cx, size) => {
    const src = Math.min(img.width, img.height) * 0.5;
    ctx.drawImage(img, (img.width - src) / 2, (img.height - src) / 2, src, src, cx - size / 2, 130 - size / 2, size, size);
  };
  const shown = emblems.filter(Boolean);
  if (shown.length === 2) {
    crest(shown[0], rcx - 80, 128);
    crest(shown[1], rcx + 80, 128);
    ctx.font = `800 30px ${jp}`;
    ctx.fillStyle = theme.text;
    ctx.fillText('〜', rcx, 142);
  } else if (shown.length === 1) {
    crest(shown[0], rcx, 190);
  } else {
    ctx.font = `700 44px ${en}`;
    ctx.fillStyle = theme.accent;
    ctx.fillText('ALL', rcx, 118);
    ctx.fillText('RANKS', rcx, 170);
  }
  ctx.fillStyle = theme.text;
  ctx.shadowColor = theme.light ? 'transparent' : 'rgba(0,0,0,0.7)';
  ctx.shadowBlur = 6;
  ctx.fillText(fitText(ctx, range, 300, 800, 28, 18), rcx, 238);
  ctx.shadowBlur = 0;
  ctx.shadowColor = 'transparent';

  // About
  sectionLabel(ctx, 'ABOUT', 60, 276, theme);
  panel(ctx, 60, 292, 700, 144, theme);
  if (state.about) {
    ctx.textAlign = 'left';
    ctx.font = `500 23px ${jp}`;
    ctx.fillStyle = theme.text;
    const lines = wrapLines(ctx, state.about, 650, 4);
    const lh = 32;
    const top = 292 + 72 - ((lines.length - 1) * lh) / 2 + 8;
    lines.forEach((l, i) => ctx.fillText(l, 84, top + i * lh));
  }

  // Invite
  sectionLabel(ctx, 'JOIN', 790, 276, theme);
  panel(ctx, 790, 292, 350, 144, theme);
  ctx.textAlign = 'center';
  ctx.fillStyle = theme.text;
  const invite = state.joinMode === 'text' ? '' : (state.invite || '').trim().replace(/^https?:\/\//, '');
  const qr = invite && state.showQr !== false ? qrMatrix(`https://${invite}`) : null;
  if (state.joinMode === 'text') {
    // No public link: a short note such as "DM me" instead, on one or two lines.
    const note = (state.joinText || '').trim() || labels.joinText;
    let size = 30;
    ctx.font = `800 ${size}px ${jp}`;
    let lines = wrapLines(ctx, note, 310, 2);
    if (lines.length > 1) {
      size = 26;
      ctx.font = `800 ${size}px ${jp}`;
      lines = wrapLines(ctx, note, 310, 2);
    }
    const lh = size + 10;
    lines.forEach((l, i) => ctx.fillText(l, 965, 374 + i * lh - ((lines.length - 1) * lh) / 2));
  } else if (qr) {
    // White tile with a quiet zone, so phones can scan it on any theme
    // Whole-pixel modules keep the edges sharp, which scanners need.
    const tile = 136, tx = 796, ty = 296;
    const cell = Math.floor((tile - 8) / qr.length);
    const ox = tx + Math.floor((tile - cell * qr.length) / 2), oy = ty + Math.floor((tile - cell * qr.length) / 2);
    roundRect(ctx, tx, ty, tile, tile, 10);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.fillStyle = '#16161a';
    qr.forEach((row, y) => row.forEach((dark, x) => {
      if (dark) ctx.fillRect(ox + x * cell, oy + y * cell, cell, cell);
    }));
    ctx.font = `700 14px ${en}`;
    ctx.fillStyle = theme.accent;
    ctx.letterSpacing = '2px';
    ctx.fillText('SCAN TO JOIN', 1036, 344);
    ctx.letterSpacing = '0px';
    // One line if it fits at a readable size, otherwise "discord.gg/" over the code.
    const label = shortInvite(invite);
    const cut = label.lastIndexOf('/') + 1;
    let size = 21;
    const fits = (parts) => parts.every((p) => ctx.measureText(p).width <= 180);
    ctx.font = `800 ${size}px ${jp}`;
    let lines = [label];
    while (!fits(lines) && size > 17) ctx.font = `800 ${--size}px ${jp}`;
    if (!fits(lines)) {
      lines = cut > 0 && cut < label.length ? [label.slice(0, cut), label.slice(cut)] : [label];
      size = 21;
      ctx.font = `800 ${size}px ${jp}`;
      while (!fits(lines) && size > 13) ctx.font = `800 ${--size}px ${jp}`;
      lines = lines.map((l) => fitText(ctx, l, 180, 800, size, size));
    }
    ctx.fillStyle = theme.text;
    const lh = size + 7;
    lines.forEach((l, i) => ctx.fillText(l, 1036, 382 + i * lh - ((lines.length - 1) * lh) / 2));
  } else if (invite) {
    ctx.fillText(fitText(ctx, shortInvite(invite), 310, 800, 30, 16), 965, 374);
  } else {
    ctx.font = `700 22px ${jp}`;
    ctx.fillStyle = theme.sub;
    ctx.fillText(labels.inviteEmpty, 965, 372);
  }

  drawTags(ctx, tags, theme);
  if (state.message) drawComment(ctx, state.message, theme, deco);
  drawWatermark(ctx, theme, deco, fonts, state.showCredit !== false);

  canvas.width = CARD_W;
  canvas.height = CARD_H;
  canvas.getContext('2d').drawImage(off, 0, 0);
}
