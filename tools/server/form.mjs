// Markup for the Discord server card maker (/server/). The strings come from tools/server/<lang>.mjs;
// js/server.js reads the data-* attributes on #server-tool for text it draws or shows.
const attr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');

export function serverTool(s) {
  return `
      <div class="server-tool" id="server-tool" data-all-ranks="${attr(s.allRanks)}" data-name="${attr(s.namePh)}" data-invite-empty="${attr(s.inviteEmpty)}" data-join-text="${attr(s.joinTextPh)}" data-any="${attr(s.any)}" data-default-skin="${attr(s.defaultSkin)}" data-copied="${attr(s.copied)}" data-copy-failed="${attr(s.copyFailed)}" data-long-press="${attr(s.longPress)}" data-sample="${attr(JSON.stringify(s.sample))}">
        <div class="canvas-wrap">
          <canvas id="server-card" width="1200" height="675"></canvas>
        </div>
        <div class="actions">
          <button type="button" class="btn primary" id="sv-save">${s.save}</button>
          <button type="button" class="btn" id="sv-copy">${s.copy}</button>
          <button type="button" class="btn ghost" id="sv-sample">${s.sampleBtn}</button>
          <button type="button" class="btn ghost" id="sv-reset">${s.reset}</button>
        </div>

        <form class="editor server-form" id="sv-form" autocomplete="off" onsubmit="return false">
          <fieldset>
            <legend>${s.secBasic}</legend>
            <div class="row">
              <label class="field grow"><span>${s.name}</span>
                <input name="name" maxlength="30" placeholder="${attr(s.namePh)}">
              </label>
            </div>
            <div class="field"><span>${s.icon}</span>
              <div class="picker-row">
                <label class="btn ghost small upload"><span>${s.upload}</span><input type="file" accept="image/*" id="sv-icon" hidden></label>
                <button type="button" class="btn ghost small" id="sv-icon-clear">${s.clear}</button>
                <select name="iconShape"><option value="square">${s.square}</option><option value="circle">${s.circle}</option></select>
              </div>
            </div>
            <div class="row">
              <label class="field grow"><span>${s.members}</span>
                <input name="members" maxlength="12" placeholder="${attr(s.membersPh)}">
              </label>
              <label class="field grow"><span>${s.hours}</span>
                <input name="hours" maxlength="30" placeholder="${attr(s.hoursPh)}">
              </label>
            </div>
            <div class="row">
              <label class="field grow"><span>${s.join}</span>
                <select name="joinMode"><option value="link">${s.joinLink}</option><option value="text">${s.joinPrivate}</option></select>
              </label>
            </div>
            <div class="row" data-join="link">
              <label class="field grow"><span>${s.invite}</span>
                <input name="invite" maxlength="40" placeholder="discord.gg/xxxxxx" inputmode="url">
              </label>
            </div>
            <label class="credit-toggle" data-join="link">
              <input type="checkbox" name="showQr">
              <span>${s.qr}</span>
            </label>
            <div class="row" data-join="text" hidden>
              <label class="field grow"><span>${s.joinText}</span>
                <input name="joinText" maxlength="24" placeholder="${attr(s.joinTextPh)}">
              </label>
            </div>
            <div class="row">
              <label class="field grow"><span>${s.rankFrom}</span><select name="rankFrom" id="sv-rank-from"></select></label>
              <label class="field grow"><span>${s.rankTo}</span><select name="rankTo" id="sv-rank-to"></select></label>
            </div>
          </fieldset>

          <fieldset>
            <legend>${s.secAbout}</legend>
            <label class="field"><span>${s.about}</span>
              <textarea name="about" maxlength="120" rows="3" placeholder="${attr(s.aboutPh)}"></textarea>
            </label>
            <div class="field"><span>${s.tags}</span>
              <div class="chips" id="sv-tags">
${s.tagList.map((tag) => `                <button type="button" class="chip" data-tag="${attr(tag)}">${tag}</button>`).join('\n')}
              </div>
            </div>
            <label class="field"><span>${s.customTags}</span>
              <input name="customTags" maxlength="40" placeholder="${attr(s.customTagsPh)}">
            </label>
            <label class="field"><span>${s.message}</span>
              <textarea name="message" maxlength="60" rows="2" placeholder="${attr(s.messagePh)}"></textarea>
            </label>
          </fieldset>

          <fieldset>
            <legend>${s.secDesign}</legend>
            <div class="field"><span>${s.theme}</span>
              <div class="themes" id="sv-themes"></div>
            </div>
            <div class="field"><span>${s.bg}</span>
              <div class="picker-row">
                <input id="sv-champ" class="grow" list="sv-champ-list" placeholder="${attr(s.champPh)}">
                <datalist id="sv-champ-list"></datalist>
                <select name="splashSkin" id="sv-skin" class="grow"></select>
              </div>
              <div class="picker-row">
                <label class="btn ghost small upload"><span>${s.uploadBg}</span><input type="file" accept="image/*" id="sv-bg" hidden></label>
                <button type="button" class="btn ghost small" id="sv-bg-clear">${s.noBg}</button>
              </div>
            </div>
            <div class="row">
              <label class="field grow"><span>${s.bgX}</span><input name="bgOffX" type="range" min="-1" max="1" step="0.005"></label>
              <label class="field grow"><span>${s.bgY}</span><input name="bgOffY" type="range" min="-1" max="1" step="0.005"></label>
            </div>
            <div class="row">
              <label class="field grow"><span>${s.zoom}</span><input name="bgZoom" type="range" min="0.5" max="4" step="0.01"></label>
              <label class="field grow"><span>${s.dim}</span><input name="dim" type="range" min="0.2" max="0.85" step="0.01"></label>
            </div>
          </fieldset>

          <label class="credit-toggle">
            <input type="checkbox" name="showCredit">
            <span>${s.credit}</span>
          </label>
        </form>

        <dialog id="sv-save-dialog">
          <img id="sv-save-img" alt="">
          <p class="hint">${s.longPress}</p>
          <div class="actions"><button type="button" class="btn ghost" id="sv-save-close">${s.close}</button></div>
        </dialog>
      </div>`;
}
