// Discord server card page (/en/server/) in English.
import { serverTool } from './form.mjs';

const s = {
  nav: 'Server cards',
  allRanks: 'All ranks welcome', any: 'Any', namePh: 'Server name', inviteEmpty: 'Add an invite link', defaultSkin: 'Default',
  copied: 'Image copied', copyFailed: 'Couldn’t copy. Please use “Save image” instead',
  longPress: 'Long-press the image to save it',
  save: 'Save image', copy: 'Copy image', sampleBtn: 'Fill in a sample', reset: 'Reset', close: 'Close',
  secBasic: 'Basics', name: 'Server name', icon: 'Server icon', upload: 'Upload image', clear: 'None',
  square: 'Rounded', circle: 'Circle',
  members: 'Members', membersPh: 'e.g. 120', hours: 'Active hours', hoursPh: 'e.g. Every night from 9 pm',
  join: 'How to join', joinLink: 'Show an invite link', joinPrivate: 'Don’t show it (write something like “DM me”)',
  joinText: 'How to join (text)', joinTextPh: 'DM me for an invite',
  invite: 'Invite link', qr: 'Add a QR code for the invite link', rankFrom: 'Rank range (from)', rankTo: 'Rank range (to)',
  secAbout: 'About', about: 'Description', aboutPh: 'e.g. A chill LoL server. Someone is in voice chat most nights.',
  tags: 'Tags',
  tagList: ['Beginners welcome', 'Veterans welcome', 'Voice chat', 'Listen-only OK', 'Ranked', 'Normals', 'ARAM', 'Customs', 'Clash & tournaments', 'Mostly adults', 'Mostly students', 'Chat-focused', 'Streamers', '18+'],
  customTags: 'Other tags (comma-separated)', customTagsPh: 'e.g. Coaching, TFT too',
  message: 'Short message', messagePh: 'e.g. Feel free to just drop by and look around!',
  secDesign: 'Design', theme: 'Theme', bg: 'Background (champion skin)', champPh: 'Type a champion name',
  uploadBg: 'Upload your own image', noBg: 'No background',
  bgX: 'Horizontal', bgY: 'Vertical', zoom: 'Zoom', dim: 'Darken background',
  credit: 'Add the site URL in the bottom-right corner (it really helps the site grow)',
  sample: {
    name: 'Chill Rift Club', members: '120', hours: 'Every night from 9 pm', invite: 'discord.gg/example',
    about: 'A chill LoL server. Someone is in voice chat most nights, and we run custom games on weekends.',
    tags: ['Beginners welcome', 'Voice chat', 'Customs', 'Mostly adults'], message: 'Feel free to just drop by and look around!',
    rankFrom: 'IRON', rankTo: 'DIAMOND', splashChamp: 'Lux', splashSkin: 0,
  },
};

export default {
  nav: s.nav,
  title: 'Discord Server Card Maker for LoL | Free recruitment image | SUMMONER CARD',
  description: 'Make a free introduction card for your League of Legends Discord server. Add the server name, icon, rank range, tags and invite link to get an image with a champion skin background.',
  h1: 'Make a Discord server card',
  body: `
      <p>Make a free <strong>server card</strong> to recruit members for your League of Legends Discord server. Add the server name, rank range, tags and invite link, and you get an image with a champion skin background. Post it on X or on server listing sites.</p>
${serverTool(s)}

      <section>
        <h2>How to use</h2>
        <ol class="steps">
          <li><strong>Fill in the basics</strong><br>Enter the server name, icon, member count, active hours and invite link. Pick the bottom and top of your rank range to show something like “Silver – Diamond” with rank emblems. Leave both on “Any” to show “All ranks welcome”.</li>
          <li><strong>Describe the server and pick tags</strong><br>Say what kind of server it is and choose the tags that fit. Add anything missing under “Other tags”, separated by commas.</li>
          <li><strong>Choose a theme and background, then save</strong><br>All summoner card themes are available. Use a champion skin or your own image (such as your server banner) as the background.</li>
        </ol>
        <p>What you enter is saved only in this browser and never sent to a server.</p>
      </section>

      <section>
        <h2>Tips for a card that brings people in</h2>
        <ul>
          <li><strong>Sum up the vibe</strong>: open the description with who will enjoy the server, such as “serious ranked grinding” or “relaxed games and chat”.</li>
          <li><strong>List active hours</strong>: knowing when people are around helps newcomers tell whether they’ll have someone to play with.</li>
          <li><strong>Use a non-expiring invite</strong>: Discord invites expire after 7 days unless you choose “Never” when creating them. Use a permanent link on the image.</li>
          <li><strong>Keep the rules separate</strong>: put the appeal on the card and the detailed rules in a rules channel inside the server.</li>
        </ul>
        <p>Make a personal profile card with the <a href="/">summoner card maker</a>. For writing the post, see <a href="/articles/recruit-tips/">How to write a LoL friend or duo post that gets replies</a>.</p>
      </section>
      <script type="module" src="/js/server.js"></script>`,
};
