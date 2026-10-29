// English page contents. Same shape as ja.mjs.
const X = '<a href="https://x.com/hotaka_1123" target="_blank" rel="noopener">X (@hotaka_1123)</a>';

export default ({ UPDATED, LEGAL, IMG, HOME }) => ({
  htmlLang: 'en',
  locale: 'en_US',
  siteSub: 'Summoner card maker',
  nav: { make: 'Make a card', guide: 'How to use', templates: 'Templates', banner: 'Promo banners', faq: 'FAQ' },
  footerNav: { guide: 'How to use', templates: 'Templates', banner: 'Promo banners', faq: 'FAQ', about: 'About & contact', privacy: 'Privacy policy', terms: 'Terms of use' },
  footer: {
    storage: 'Everything you enter stays in this browser and is never sent to a server. Feel free to use the images you make on social media, streams and anywhere else.',
    contact: `Bugs or requests? Feel free to reach out on ${X}.`,
    analytics: 'To improve the site, we use Google Analytics to count visits and how often features are used (what you enter and your images are not sent). See the <a href="/privacy/">privacy policy</a> for details.',
  },
  aria: { menu: 'Menu', siteInfo: 'Site information', breadcrumbs: 'Breadcrumbs', toc: 'Contents' },
  top: 'Home',
  cta: 'Make your summoner card →',
  translationNote: 'This is a translation of the Japanese original. If the two differ, the Japanese version takes precedence.',
  copied: 'Copied',
  copyFailed: 'Couldn’t copy. Please select the text and copy it manually',

  themes: [
    ['halloween', 'Halloween', 'Night purple and pumpkin orange with bats, cobwebs and a jack-o’-lantern. Your icon gets a witch hat. Looks great with a Bewitching skin as the background.'],
    ['christmas', 'Christmas', 'Red and green with a candy-cane border, string lights, snowflakes and a present. Your icon gets a Santa hat. Try it with a winter skin.'],
    ['hextech', 'Hextech', 'The classic gold-and-navy look, close to the LoL client. Goes with any skin background, so pick this if you can’t decide.'],
    ['noxus', 'Noxus', 'A bold red-and-black design. Perfect with skins of Noxian champions like Darius or Sion.'],
    ['freljord', 'Freljord', 'An icy light-blue design. Great with Ashe, Sejuani or any winter skin.'],
    ['shadow', 'Shadow Isles', 'An eerie glowing-green design for Thresh, Viego and other Shadow Isles champions.'],
    ['ionia', 'Ionia', 'A soft pink-and-purple design for Ahri, Irelia and cherry-blossom style skins.'],
    ['fairy', 'Dreamy Pink', 'A pastel pink “yume-kawaii” design with a unicorn horn, candy and a checkered floor.'],
    ['fairy-mint', 'Dreamy Blue', 'The blue version of Dreamy Pink, mixing pastel blue and lavender.'],
    ['guardian', 'Star Guardian', 'A bright and cute light design for Star Guardian and magical-girl skins.'],
    ['jirai', 'Jirai-kei', 'The black-and-pink Japanese “jirai-kei” style with ribbons, hearts, a lace border and gingham.'],
    ['ryousan', 'Ryousan-kei', 'The sweet white-and-pale-pink Japanese “ryousan-kei” style with pearls, lace and ribbons.'],
    ['y2k', 'Y2K', 'Chrome stars, smileys, butterflies and a rainbow frame for a Y2K retro look.'],
    ['gaming', 'Gaming RGB', 'RGB rainbow neon frame, glowing text and a synthwave grid on black. Pure gaming-PC energy.'],
    ['wafu', 'Japanese', 'A modern Japanese design: washi paper, red, white and gold, seigaiha waves, cherry petals and Mincho type.'],
  ],

  templates: {
    title: 'Summoner Card Templates (Themes) | SUMMONER CARD',
    description: '15 free summoner card templates for League of Legends: Halloween, Christmas, Gaming RGB, Y2K, Japanese, Jirai-kei and more. Pick a theme and make your LoL profile card right away.',
    h1: 'Summoner Card Templates (Themes)',
    intro: `
      <p>SUMMONER CARD has 15 templates (themes) to choose from. There’s no image editing involved: fill in the fields and your card is done. Press “Use this template” under a sample to open the maker with that theme selected.</p>
      <p>Every theme can use any champion skin or your own uploaded image as the background. Just changing the background gives the card a whole new feel.</p>`,
    button: 'Use this template →',
    alt: (name) => `Summoner card template: ${name}`,
  },

  faq: {
    title: 'FAQ | SUMMONER CARD (Summoner Card Maker)',
    description: 'Frequently asked questions about SUMMONER CARD, the LoL summoner card maker: is it free, how to save on a phone, what to do if saving fails in the X app, how your data is handled and more.',
    h1: 'FAQ',
    items: [
      ['What is a summoner card?', 'It’s a profile image where League of Legends players sum up their rank, roles, main champions, play times and so on. People use them to find duo partners and friends on X, Discord servers and elsewhere.'],
      ['Is it free? Do I need an account?', 'It’s completely free, and there’s no sign-up or login.'],
      ['Can I make one on my phone?', 'Yes, right in your phone’s browser. On iPhone, pressing “Save image” shows the card full size; long-press it to save it to Photos.'],
      ['Saving doesn’t work when I open the site from the X app', 'In-app browsers (X, Instagram, Discord and others) often block saving and sharing images. Choose “Open in browser” from the “…” menu at the top right to open the site in Safari or Chrome. You can also long-press the image that appears to save it.'],
      ['Do I need to edit a template image?', 'No image editing app needed. Fill in the fields and pick a theme, and the card is generated with champion and rank icons.'],
      ['What if I don’t want to show my summoner name?', 'Under the summoner name field you can pick a preset instead: “Private”, “Ask when we play”, “Ask me in DMs” or “Once we get along”.'],
      ['Is my rank fetched automatically?', 'Not at the moment; you choose it yourself. Unranked players, or anyone who’d rather not show their rank, can use it as is.'],
      ['Is anything I enter sent anywhere?', 'No. What you enter and the images you upload are processed and stored only in your browser and are never sent to our server.'],
      ['Can I edit my card later?', 'Your input is saved automatically in your browser, so you can pick up where you left off next time. It won’t carry over if you clear your browser data or open the site on another device or browser.'],
      ['Can I use the images however I like?', 'You can freely post them on X, Discord, your stream, Twitch panels and so on. You can’t sell the images or the LoL artwork in them. See the terms of use for details.'],
      ['Can I remove the URL in the bottom right of the card?', 'Yes: untick “Add the site URL to the bottom right of the card” below the design section. If you leave it on, it really helps the site grow!'],
      ['I found a bug / I’d like a feature', 'Feel free to reach out on X (@hotaka_1123).'],
    ],
  },

  guide: {
    title: 'How to Make a Summoner Card | SUMMONER CARD',
    description: 'A step-by-step guide to making a League of Legends summoner card (profile card): every field explained, the four role levels, cropping icons from skin art, adjusting the background and saving on a phone.',
    h1: 'How to make a summoner card',
    body: `
      <p>SUMMONER CARD is a free tool for making League of Legends profile cards, known as summoner cards, right in your browser. This guide walks through each field and shares tips for a great-looking card.</p>

      <nav class="toc" aria-label="Contents">
        <p>Contents</p>
        <ol>
          <li><a href="#basic">Basic info (name and icon)</a></li>
          <li><a href="#rank">Rank</a></li>
          <li><a href="#role">Roles</a></li>
          <li><a href="#champs">Main champions</a></li>
          <li><a href="#tags">Play style</a></li>
          <li><a href="#contact">Play time & contact</a></li>
          <li><a href="#comment">Message</a></li>
          <li><a href="#design">Design (theme and background)</a></li>
          <li><a href="#save">Saving and sharing</a></li>
          <li><a href="#tips">Tips for finding friends with your card</a></li>
        </ol>
      </nav>

      <section id="basic">
        <h2>1. Basic info (name and icon)</h2>
        <h3>Summoner name and tag</h3>
        <p>Enter the name part of your Riot ID and your tag (what comes after the #). The tag appears in small text next to your name, like “#NA1”.</p>
        <p>If you’d rather not show your name, press one of the presets under the field — <strong>“Private”, “Ask when we play”, “Ask me in DMs” or “Once we get along”</strong> — and that text appears in place of your name.</p>
        <h3>Level</h3>
        <p>Enter your summoner level to show “Lv.○○” under your icon. Leave it empty to hide it.</p>
        <h3>Icon</h3>
        <p>“Choose an icon” gives you three options:</p>
        <ul>
          <li><strong>Summoner icons</strong>: pick from about 5,000 in-game icons. Search by name, like “Ahri”, “K/DA” or “Poro”.</li>
          <li><strong>Champions</strong>: use a champion’s portrait.</li>
          <li><strong>Upload image</strong>: use any image you like. A crop window opens after uploading; drag and zoom to choose the part you want.</li>
        </ul>
        <p>The icon can be a circle or a square.</p>
      </section>

      <section id="rank">
        <h2>2. Rank</h2>
        <p>Choose your tier (Iron to Challenger) and division (I–IV) to show your rank emblem. Master and above have no division. If you’d rather not show a rank, leave it as “Unranked”.</p>
      </section>

      <section id="role">
        <h2>3. Roles</h2>
        <p>For each of TOP, JG, MID, ADC and SUP you can set one of four levels of how willing you are to play it.</p>
        <table class="doc-table">
          <thead><tr><th>Button</th><th>On the card</th><th>Meaning</th></tr></thead>
          <tbody>
            <tr><td>Main</td><td>MAIN (highlighted)</td><td>Your best role. Only one can be main</td></tr>
            <tr><td>Sub</td><td>SUB</td><td>A role you can also play in ranked</td></tr>
            <tr><td>Normals OK</td><td>NORM</td><td>A role you’ll play in normals</td></tr>
            <tr><td>No</td><td>NG (red, crossed out)</td><td>A role you can’t play</td></tr>
          </tbody>
        </table>
        <p>Press the selected button again to unset it.</p>
      </section>

      <section id="champs">
        <h2>4. Main champions</h2>
        <p>Add up to five champions with “+ Add”. Choose a role at the top of the champion picker first, and the champion is added <strong>with that role’s icon</strong>. You can add the same champion with different roles too (for example, Lux as both SUP and MID).</p>
        <ul>
          <li><strong>Skin art</strong>: press a champion’s “Skin art” button, pick any skin, and crop any part of its splash art to use as the icon. “Undo” goes back to the normal portrait.</li>
          <li><strong>Heading</strong>: switch between “Main champions” and “Favorite champions”.</li>
          <li><strong>Reordering</strong>: “←” moves a champion left and “×” removes it.</li>
        </ul>
      </section>

      <section id="tags">
        <h2>5. Play style</h2>
        <p>Pick up to six tags such as Casual, Ranked grinder, ARAM, Voice chat or LF duo. If what you want isn’t listed, make your own (up to 12 characters) with “+ Add your own”.</p>
      </section>

      <section id="contact">
        <h2>6. Play time & contact</h2>
        <p>Enter your play time, Discord, X, Twitch and YouTube. Only the fields you fill in appear under your name, and they’re arranged in two columns automatically when there are many.</p>
      </section>

      <section id="comment">
        <h2>7. Message</h2>
        <p>Up to 80 characters, shown at the bottom of the card. Line breaks work too (up to two lines).</p>
      </section>

      <section id="design">
        <h2>8. Design (theme and background)</h2>
        <h3>Theme</h3>
        <p>Choose from 15 themes. See them all on the <a href="/templates/">templates</a> page.</p>
        <h3>Background</h3>
        <ul>
          <li><strong>Choose a skin</strong>: pick a champion and skin, and its splash art becomes the background.</li>
          <li><strong>Upload your own image</strong>: use any image as the background (you can crop it when uploading).</li>
          <li><strong>Position, zoom and darkness</strong>: adjust with the sliders. You can also drag the card preview directly or zoom with the mouse wheel.</li>
        </ul>
        <p>If text is hard to read, raise “Darken background”.</p>
      </section>

      <section id="save">
        <h2>9. Saving and sharing</h2>
        <ul>
          <li><strong>Save image</strong>: downloads the card as a PNG. On iPhone the image is shown full size; long-press it and choose “Save to Photos”.</li>
          <li><strong>Copy image</strong>: on a computer, paste it straight into X or Discord with Ctrl+V.</li>
          <li><strong>Share on X</strong>: on a phone, send the image through the share menu. On a computer, the image is copied and the X post window opens.</li>
          <li><strong>Promo banner</strong>: you can also make a banner with your card in it. See <a href="/banner/">promo banners</a>.</li>
        </ul>
        <p>Your input is saved in your browser automatically. “Clear” on each section clears just that section, and “Reset everything” at the bottom clears it all.</p>
        <p class="note">Saving may not work in in-app browsers such as X’s. Choose “Open in browser” from the “…” menu at the top right.</p>
      </section>

      <section id="tips">
        <h2>10. Tips for finding friends with your card</h2>
        <ul>
          <li><strong>Be specific about play times</strong>: “weeknights 10pm–1am” makes it much easier for others to tell if you can play together than just “nights”.</li>
          <li><strong>Mark the roles you won’t play</strong>: knowing your “NG” roles helps people find you as a duo or 5-stack partner.</li>
          <li><strong>Say what you’re looking for with tags</strong>: “LF duo”, “LF 5-stack” or “Newbies welcome” attract people with the same goal.</li>
          <li><strong>Use hashtags when posting</strong>: on X, adding “#LeagueOfLegends” and “#SummonerCard” helps people find you.</li>
        </ul>
      </section>`,
  },

  banner: {
    title: 'Promo Banners (Free to Use) | SUMMONER CARD',
    description: 'Promo banners for SUMMONER CARD. Free to put on your stream overlay, Twitch panels, YouTube, blog or website. You can also make a banner with your own card in it.',
    h1: 'Promo banners (free to use)',
    body: `
      <p>These banners are for anyone kind enough to introduce SUMMONER CARD. Put them on your stream overlay, Twitch panels, YouTube description, blog or website — <strong>no need to ask</strong>. Where you can add a link, linking to <code>${HOME}</code> would be much appreciated.</p>
      <p class="thanks">No need to ask, but if you use one, a quick hello on ${X} would make my day 🙏 I’d love to check out your stream or post!</p>

      <section>
        <h2>Make a banner with your own card</h2>
        <p>Press “🎨 Make a promo banner with your card” in the card maker to get a banner (1800×600) featuring the card you made. It works as a Twitch panel image or an X header too. Cards with a dreamy theme get a pastel banner.</p>
      </section>

      <section>
        <h2>Banners to download (all 15 themes)</h2>
        <p>Click an image to open it full size (1800×600) and save it from there.</p>
        <!--BANNERS-->
      </section>

      <section>
        <h2>How to add one</h2>
        <h3>Blog or website</h3>
        <p>Paste this HTML as is.</p>
        <pre class="embed-code" id="embed-code">&lt;a href="${HOME}" target="_blank" rel="noopener"&gt;&lt;img src="https://summonercard.com${IMG}/banner.jpg" alt="SUMMONER CARD | Summoner card maker" width="600" height="200"&gt;&lt;/a&gt;</pre>
        <button type="button" class="btn ghost small" data-copy-target="embed-code">Copy HTML</button>
        <p>For another theme, change <code>banner.jpg</code> to that image’s file name (for example <code>banner-halloween.jpg</code>).</p>
        <h3>Twitch panel</h3>
        <p>On your channel, go to “About” → “Edit panels”, upload the banner as the image and put <code>${HOME}</code> in “Image links to”.</p>
        <h3>As text</h3>
        <pre class="embed-code" id="text-code">Make your LoL summoner card here👉 ${HOME}</pre>
        <button type="button" class="btn ghost small" data-copy-target="text-code">Copy text</button>
      </section>

      <section>
        <h2>Please note</h2>
        <ul>
          <li>Feel free to resize or crop the banners.</li>
          <li>Please don’t sell the banners or use them in a way that suggests you’re the official SUMMONER CARD.</li>
          <li>The banners contain LoL artwork. See the <a href="/terms/">terms of use</a> for Riot Games’ rights.</li>
        </ul>
      </section>`,
  },

  privacy: {
    title: 'Privacy Policy | SUMMONER CARD',
    description: 'Privacy policy of SUMMONER CARD (summoner card maker): how your input is handled, analytics and external services.',
    h1: 'Privacy policy',
    body: `
      <p>SUMMONER CARD (“the Site”) handles user information as follows.</p>

      <section>
        <h2>1. Your input and images</h2>
        <p>What you enter on the card (summoner name, contact details and so on) and the images you upload are processed only in your browser. They are never sent to or stored on our server.</p>
        <p>So you can pick up where you left off, your input is saved in your browser’s storage (localStorage). This data exists only on your device and is erased when you delete the site data in your browser or press “Reset everything” in the tool.</p>
      </section>

      <section>
        <h2>2. Analytics</h2>
        <p>To improve the Site, we use Google Analytics, an analytics tool by Google LLC. Google Analytics uses cookies to collect page views, referrers, device types and how often the Site’s features are used (such as how many images are saved and which themes are chosen). This data is aggregated anonymously and does not identify individuals. The text you enter and your images themselves are not sent.</p>
        <p>You can refuse this data collection by disabling cookies in your browser or by using the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener">Google Analytics Opt-out Browser Add-on</a>. For how Google handles data, see <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener">Google’s Privacy & Terms</a>.</p>
      </section>

      <section>
        <h2>3. Advertising</h2>
        <p>To cover running costs, the Site may in the future use third-party advertising services (such as Google AdSense). In that case, ad providers may use cookies to show ads based on your interests. We will update this policy before introducing ads.</p>
      </section>

      <section>
        <h2>4. External services</h2>
        <p>The Site loads data from the following external services in order to display content. When it does, connection information such as your device’s IP address is sent to each service.</p>
        <ul>
          <li>Riot Games “Data Dragon” (champion, icon and skin images)</li>
          <li>Community Dragon (rank emblems, role icons and summoner icon images)</li>
          <li>Google Fonts (web fonts)</li>
          <li>GitHub Pages (hosting of the Site)</li>
        </ul>
      </section>

      <section>
        <h2>5. Disclaimer</h2>
        <p>The operator is not liable for any damage arising from the use of the Site. See the <a href="/terms/">terms of use</a> for details.</p>
      </section>

      <section>
        <h2>6. Contact</h2>
        <p>For questions about this policy, please contact ${X}.</p>
      </section>

      <section>
        <h2>7. Changes</h2>
        <p>This policy may be revised without notice when necessary. Revisions take effect when they are posted on this page.</p>
        <p class="note">Established: ${UPDATED}</p>
      </section>`,
  },

  terms: {
    title: 'Terms of Use & Disclaimer | SUMMONER CARD',
    description: 'Terms of use and disclaimer of SUMMONER CARD (summoner card maker): how you can use the images you make, prohibited uses and Riot Games’ rights.',
    h1: 'Terms of use & disclaimer',
    body: `
      <p>These terms of use (“the Terms”) set out the conditions for using SUMMONER CARD (“the Site”). By using the Site, you are deemed to have agreed to the Terms.</p>

      <section>
        <h2>1. The service</h2>
        <p>The Site is a free web tool for making League of Legends profile card (summoner card) images. No account is required.</p>
      </section>

      <section>
        <h2>2. Using the images you make</h2>
        <ul>
          <li>You may use the images you make <strong>freely for personal activities</strong>, such as posts on social media (X, Discord, Instagram and so on), profiles, stream overlays, Twitch panels and blogs. Using them on monetized streams or channels is fine too.</li>
          <li>You <strong>may not sell or distribute for a fee</strong> the images themselves or the game artwork they contain.</li>
          <li>The site name and URL in the bottom right of the image can be hidden in the settings.</li>
        </ul>
      </section>

      <section>
        <h2>3. Riot Games’ rights</h2>
        <p>The rights to the champion, skin, icon, rank emblem and other images shown on cards belong to Riot Games, Inc. The Site is fan content made under Riot Games’ “<a href="https://www.riotgames.com/en/legal" target="_blank" rel="noopener">Legal Jibber Jabber</a>” policy and is not endorsed or sponsored by Riot Games.</p>
        <p class="legal">${LEGAL}</p>
      </section>

      <section>
        <h2>4. Images you upload</h2>
        <p>Only upload images for your icon or background that you have the right to use. Uploaded images are processed only in your browser and are not sent to our server.</p>
      </section>

      <section>
        <h2>5. Prohibited uses</h2>
        <ul>
          <li>Making or publishing cards that impersonate someone else or use another person’s name or account without permission</li>
          <li>Making or publishing cards with content that defames others or is discriminatory or obscene</li>
          <li>Infringing the copyright, portrait rights or other rights of third parties</li>
          <li>Interfering with the operation of the Site, or pretending to be the official Site</li>
          <li>Anything else that violates laws or public order and morals</li>
        </ul>
      </section>

      <section>
        <h2>6. Disclaimer</h2>
        <ul>
          <li>The Site is provided as is. We do not guarantee the accuracy of its content, that it works on every device and browser, or that it will continue to be available.</li>
          <li>Input saved in your browser may be lost depending on your browser’s settings or actions.</li>
          <li>The operator is not liable for any trouble or damage arising from the use of the Site or of the images you make.</li>
          <li>The Site may change, suspend or end its service without notice.</li>
        </ul>
      </section>

      <section>
        <h2>7. Changes to the Terms</h2>
        <p>The Terms may be changed without notice when necessary. Changes take effect when they are posted on this page.</p>
        <p class="note">Established: ${UPDATED}</p>
      </section>`,
  },

  about: {
    title: 'About & Contact | SUMMONER CARD',
    description: 'About SUMMONER CARD (summoner card maker): who runs it, how to get in touch and the assets it uses.',
    h1: 'About & contact',
    body: `
      <section>
        <h2>About SUMMONER CARD</h2>
        <p>SUMMONER CARD is a free, individually run tool made so League of Legends players can easily create “summoner cards” to introduce themselves and find friends. The goal is that you can make a card just by filling in fields, without editing a template image.</p>
      </section>

      <section>
        <h2>Operator</h2>
        <table class="doc-table">
          <tbody>
            <tr><th>Site name</th><td>SUMMONER CARD (Summoner card maker)</td></tr>
            <tr><th>URL</th><td><a href="/">${HOME}</a></td></tr>
            <tr><th>Run by</th><td>hotaka (individual)</td></tr>
            <tr><th>Contact</th><td>${X}</td></tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Contact</h2>
        <p>Bug reports, feature requests or anything about the site: feel free to send a DM or reply on ${X}. The operator is based in Japan, but messages in English are welcome. For bugs, it helps a lot to mention your device and browser (for example, Safari on iPhone, or inside the X app) and what you were doing when it happened.</p>
      </section>

      <section>
        <h2>Assets used</h2>
        <ul>
          <li>Champion, skin and icon images: Riot Games “Data Dragon”</li>
          <li>Rank emblems, role icons and summoner icons: <a href="https://www.communitydragon.org/" target="_blank" rel="noopener">Community Dragon</a></li>
          <li>Fonts: Google Fonts (M PLUS 1p, M PLUS Rounded 1c, Cinzel, Dancing Script, Noto Sans)</li>
        </ul>
        <p class="legal">${LEGAL}</p>
      </section>`,
  },
});
