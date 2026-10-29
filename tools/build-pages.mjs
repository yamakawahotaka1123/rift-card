// Generates the static subpages (guide, templates, banner, FAQ, privacy, terms, about)
// from one shared layout so the header and footer stay identical everywhere.
// Run with: node tools/build-pages.mjs   (writes <slug>/index.html and updates sitemap.xml)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://summonercard.com';
const UPDATED = '2026-10-29';

const FONTS = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=M+PLUS+1p:wght@400;500;700;800&display=swap';

export const NAV = [
  ['/', 'カードを作る'],
  ['/guide/', '使い方'],
  ['/templates/', 'テンプレ'],
  ['/banner/', '宣伝バナー'],
  ['/faq/', 'よくある質問'],
];

export const FOOTER_LINKS = [
  ['/guide/', '使い方'],
  ['/templates/', 'テンプレ一覧'],
  ['/banner/', '宣伝バナー'],
  ['/faq/', 'よくある質問'],
  ['/about/', '運営者・お問い合わせ'],
  ['/privacy/', 'プライバシーポリシー'],
  ['/terms/', '利用規約'],
];

const LEGAL = 'SUMMONER CARD isn\'t endorsed by Riot Games and doesn\'t reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.';

export function header(current) {
  const links = NAV.map(([href, label]) => `<a href="${href}"${href === current ? ' aria-current="page"' : ''}>${label}</a>`).join('');
  return `<header class="site-header">
    <a class="logo" href="/">SUMMONER CARD <span>サモナーカード作成メーカー</span></a>
    <nav class="site-nav" aria-label="メニュー">${links}</nav>
  </header>`;
}

export function footer() {
  const links = FOOTER_LINKS.map(([href, label]) => `<a href="${href}">${label}</a>`).join('');
  return `<footer class="site-footer">
    <nav class="footer-nav" aria-label="サイト情報">${links}</nav>
    <p>入力内容はこのブラウザにだけ保存され、サーバーには送信されません。作成した画像はSNS投稿や配信などに自由に使えます。</p>
    <p>不具合・ご要望は <a href="https://x.com/hotaka_1123" target="_blank" rel="noopener">X（@hotaka_1123）</a> までお気軽にどうぞ。</p>
    <p id="analytics-notice" hidden>サイト改善のため、Google Analytics でアクセス数や機能の利用回数を計測しています（入力内容や画像は送信しません）。詳しくは<a href="/privacy/">プライバシーポリシー</a>をご覧ください。</p>
    <p class="legal">${LEGAL}</p>
    <p class="legal">© 2026 SUMMONER CARD</p>
  </footer>`;
}

const CTA = `<p class="cta"><a class="btn primary" href="/">サモナーカードを作る →</a></p>`;

function layout({ slug, title, description, h1, body, jsonld = [] }) {
  const url = `${SITE}/${slug}/`;
  const crumbs = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'SUMMONER CARD', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: h1, item: url },
    ],
  };
  const ld = JSON.stringify({ '@context': 'https://schema.org', '@graph': [crumbs, ...jsonld] }, null, 2);
  return `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script>
    if (location.protocol === 'http:' && location.hostname !== 'localhost') location.replace(\`https://\${location.host}\${location.pathname}\${location.search}\${location.hash}\`);
  </script>
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${url}">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${SITE}/og.jpg">
  <meta property="og:site_name" content="SUMMONER CARD">
  <meta property="og:locale" content="ja_JP">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="theme-color" content="#c8aa6e">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" as="style" href="${FONTS}" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="${FONTS}"></noscript>
  <link rel="stylesheet" href="/css/style.css">
  <script type="application/ld+json">
${ld}
  </script>
</head>
<body class="subpage">
  ${header(`/${slug}/`)}

  <main class="doc">
    <nav class="breadcrumbs" aria-label="パンくずリスト"><a href="/">トップ</a> › <span>${h1}</span></nav>
    <article class="guide">
      <h1>${h1}</h1>
${body.trim()}
      ${CTA}
    </article>
  </main>

  ${footer()}

  <div class="toast" id="toast" role="status" aria-live="polite"></div>
  <script type="module" src="/js/page.js"></script>
</body>
</html>
`;
}

// ---------- Page contents ----------

const THEMES = [
  ['halloween', 'ハロウィン', '紫とかぼちゃオレンジに、コウモリ・クモの巣・ジャック・オ・ランタン。アイコンに魔女の帽子がのります。魅惑の魔女スキンを背景にするのがおすすめ。'],
  ['christmas', 'クリスマス', '赤と緑にキャンディケインの縁取り、電飾、雪の結晶、プレゼント。アイコンにサンタ帽がのります。冬のスキンを背景にどうぞ。'],
  ['hextech', 'ヘクステック', '金と紺の、LoLのクライアントに近い王道デザイン。どんなスキン背景とも合わせやすく、迷ったらこれ。'],
  ['noxus', 'ノクサス', '赤と黒の力強いデザイン。ダリウスやサイオンなど、ノクサス系チャンプのスキンと相性抜群。'],
  ['freljord', 'フレヨルド', '氷のような水色のデザイン。アッシュやセジュアニ、冬のスキン背景にぴったり。'],
  ['shadow', 'シャドウアイル', '緑に光る不気味なデザイン。スレッシュやヴィエゴなど、シャドウアイル系に。'],
  ['ionia', 'アイオニア', 'ピンクと紫のやわらかいデザイン。アーリやイレリア、桜っぽいスキンに。'],
  ['fairy', 'ゆめかわピンク', 'パステルピンクの「ゆめかわ・病みかわ」デザイン。ユニコーンの角やキャンディ、チェック柄の床などの飾り付き。'],
  ['fairy-mint', 'ゆめかわブルー', 'ゆめかわピンクの水色版。パステルブルーとラベンダーの組み合わせ。'],
  ['guardian', 'スターガーディアン', '明るくかわいいライト系デザイン。スターガーディアンや魔法少女系のスキンに。'],
  ['jirai', '地雷系', '黒×ピンクの地雷系デザイン。リボン、ハート、レースの縁取り、ギンガムチェック付き。'],
  ['ryousan', '量産型', '白×淡いピンクの量産型デザイン。パールとレース、リボンで甘めに。'],
  ['y2k', 'Y2K', '銀色のクロームスター、スマイル、蝶、虹色の枠でY2K（平成レトロ）風に。'],
  ['gaming', 'ゲーミング', '黒地にRGBの虹色ネオン枠と光る文字、シンセウェーブ風のグリッド。ゲーミングPC感。'],
  ['wafu', '和風', '和紙の地に紅白と金、青海波と桜の花びら、明朝体の和モダンデザイン。'],
];

const FAQ = [
  ['サモナーカードとは何ですか？', 'LoL（League of Legends）のプレイヤーが、ランク・ロール・得意チャンピオン・活動時間などをまとめた自己紹介画像です。Xの「#LoLフレンド募集」「#サモナーカード」や、Discordサーバーの自己紹介チャンネルでよく使われています。'],
  ['無料で使えますか？登録は必要ですか？', '完全無料で、会員登録やログインも必要ありません。'],
  ['スマホでも作れますか？', 'スマホのブラウザでそのまま作れます。iPhoneでは「画像を保存」を押すとカードが大きく表示されるので、長押しで写真に保存してください。'],
  ['Xのアプリから開くと保存できません', 'X・LINE・Instagramなどのアプリ内ブラウザでは、画像の保存やシェアが制限されることがあります。右上の「…」から「ブラウザで開く」を選び、SafariやChromeで開いてください。アプリ内ブラウザのままでも、表示された画像を長押しすれば保存できます。'],
  ['テンプレ画像を編集しないといけませんか？', 'いいえ。画像編集アプリは不要です。項目を入力してテーマを選ぶだけで、チャンピオンやランクのアイコン入りのカードが自動で完成します。'],
  ['サモナーネームを出したくない場合は？', 'サモナーネーム欄の下にある「非公開」「やるとき教えます」「DMで教えます」「仲良くなったら教えます」の定型文を選べます。'],
  ['ランクは自動で取得されますか？', '現在は手入力です。アンランクの方や、ランクを載せたくない方もそのまま使えます。'],
  ['入力した内容はどこかに送信されますか？', '入力内容やアップロードした画像は、お使いのブラウザ内だけで処理・保存され、運営者のサーバーには送信されません。'],
  ['入力内容はあとから編集できますか？', '入力内容はお使いのブラウザに自動で保存されるので、次に開いたときも続きから編集できます。ブラウザのデータを消したり、別の端末・別のブラウザで開いたりした場合は引き継がれません。'],
  ['作った画像は自由に使っていいですか？', 'Xやnote、Discord、配信画面、Twitchのパネルなどに自由に使えます。作成した画像や、そこに含まれるLoLの素材を販売することはできません。詳しくは利用規約をご覧ください。'],
  ['画像の右下のURLは消せますか？', 'デザイン欄の下にある「カード右下にサイトのURLを入れる」のチェックを外すと消せます。入れたままにしていただけると、サイトが広まってとても嬉しいです。'],
  ['不具合を見つけました／こんな機能がほしいです', 'X（@hotaka_1123）までお気軽にご連絡ください。'],
];

const pages = [
  {
    slug: 'guide',
    title: 'サモナーカードの作り方・使い方ガイド｜SUMMONER CARD',
    description: 'LoLのサモナーカード（自己紹介カード）の作り方を、入力項目ごとに詳しく解説。ロールの4段階表示、スキン画像からのアイコン切り抜き、背景の調整、スマホでの保存方法まで。',
    h1: 'サモナーカードの作り方・使い方',
    body: `
      <p>SUMMONER CARD は、LoL（League of Legends）の自己紹介カード「サモナーカード」をブラウザだけで作れる無料ツールです。ここでは、各項目の入力方法と、きれいに仕上げるコツを順番に説明します。</p>

      <nav class="toc" aria-label="目次">
        <p>目次</p>
        <ol>
          <li><a href="#basic">基本情報（名前・アイコン）</a></li>
          <li><a href="#rank">ランク</a></li>
          <li><a href="#role">ロール</a></li>
          <li><a href="#champs">得意チャンピオン</a></li>
          <li><a href="#tags">プレイスタイル</a></li>
          <li><a href="#contact">活動時間・連絡先</a></li>
          <li><a href="#comment">ひとこと</a></li>
          <li><a href="#design">デザイン（テーマ・背景）</a></li>
          <li><a href="#save">保存・シェア</a></li>
          <li><a href="#tips">フレンド募集で伝わるカードのコツ</a></li>
        </ol>
      </nav>

      <section id="basic">
        <h2>1. 基本情報（名前・アイコン）</h2>
        <h3>サモナーネームとタグ</h3>
        <p>Riot ID の名前部分とタグ（#の後ろ）を入力します。カードでは名前の横に「#JP1」のように小さく表示されます。</p>
        <p>名前を載せたくない場合は、入力欄の下にある<strong>「非公開」「やるとき教えます」「DMで教えます」「仲良くなったら教えます」</strong>のボタンを押すと、その文が名前の代わりに表示されます。</p>
        <h3>レベル</h3>
        <p>サモナーレベルを入力すると、アイコンの下に「Lv.○○」と表示されます。空欄なら表示されません。</p>
        <h3>アイコン</h3>
        <p>「アイコンを選ぶ」から、次の3つの方法で設定できます。</p>
        <ul>
          <li><strong>サモナーアイコン</strong>：ゲーム内の約5,000種類のアイコンから選べます。「アーリ」「K/DA」「ポロ」のように名前で検索できます（ひらがなでもOK）。</li>
          <li><strong>チャンピオン</strong>：チャンピオンの顔アイコンを使います。</li>
          <li><strong>画像をアップ</strong>：好きな画像を使えます。アップ後にトリミング画面が開くので、ドラッグと拡大で使いたい部分を選んでください。</li>
        </ul>
        <p>アイコンの形は「丸」と「四角」から選べます。</p>
      </section>

      <section id="rank">
        <h2>2. ランク</h2>
        <p>ティア（アイアン〜チャレンジャー）とディビジョン（Ⅰ〜Ⅳ）を選ぶと、ランクのエンブレムが表示されます。マスター以上はディビジョンなしです。ランクを載せたくない場合は「アンランク」のままでOKです。</p>
      </section>

      <section id="role">
        <h2>3. ロール</h2>
        <p>TOP・JG・MID・ADC・SUP のそれぞれに、4段階の「やれる度合い」を設定できます。</p>
        <table class="doc-table">
          <thead><tr><th>ボタン</th><th>カードでの表示</th><th>意味</th></tr></thead>
          <tbody>
            <tr><td>メイン</td><td>MAIN（強調）</td><td>一番得意なロール。1つだけ選べます</td></tr>
            <tr><td>サブ</td><td>SUB</td><td>ランクでもできるロール</td></tr>
            <tr><td>ノマなら可</td><td>ノマ可</td><td>ノーマルなら行けるロール</td></tr>
            <tr><td>無理</td><td>NG（赤・斜線）</td><td>できないロール</td></tr>
          </tbody>
        </table>
        <p>選んでいるボタンをもう一度押すと解除されます。</p>
      </section>

      <section id="champs">
        <h2>4. 得意チャンピオン</h2>
        <p>「＋追加」から最大5体まで選べます。チャンピオン選択画面の上でロールを選んでから押すと、<strong>そのロールのアイコン付き</strong>で登録されます。同じチャンピオンを別のロールで登録することもできます（例：ラックスをSUPとMIDで2枠）。</p>
        <ul>
          <li><strong>スキン画像</strong>：各チャンピオンの「スキン画像」ボタンから好きなスキンを選び、スプラッシュアートの好きな部分を切り抜いてアイコンにできます。「元に戻す」で通常のアイコンに戻ります。</li>
          <li><strong>見出し</strong>：「得意チャンピオン」と「好きなチャンピオン」を切り替えられます。</li>
          <li><strong>並び替え</strong>：「←」で左に移動、「×」で削除できます。</li>
        </ul>
      </section>

      <section id="tags">
        <h2>5. プレイスタイル</h2>
        <p>エンジョイ勢・ランク勢・ARAM・VCあり・デュオ募集などのタグを最大6個まで選べます。一覧にないものは「＋自分で追加」から12文字まで自由に作れます。</p>
      </section>

      <section id="contact">
        <h2>6. 活動時間・連絡先</h2>
        <p>活動時間、Discord、X、Twitch、YouTube を入力できます。入力した項目だけが名前の下に表示されます。項目が多いときは自動で2列に並びます。</p>
      </section>

      <section id="comment">
        <h2>7. ひとこと</h2>
        <p>80文字まで、カードの下に表示されます。改行も使えます（2行まで）。</p>
      </section>

      <section id="design">
        <h2>8. デザイン（テーマ・背景）</h2>
        <h3>テーマ</h3>
        <p>15種類から選べます。見本は<a href="/templates/">テンプレ一覧</a>で見られます。</p>
        <h3>背景</h3>
        <ul>
          <li><strong>スキンから選ぶ</strong>：チャンピオンとスキンを選ぶと、そのスプラッシュアートが背景になります。</li>
          <li><strong>自分の画像をアップ</strong>：好きな画像を背景にできます（アップ時にトリミングできます）。</li>
          <li><strong>位置・拡大・暗さ</strong>：スライダーで調整できます。プレビューのカードを直接ドラッグして動かしたり、マウスホイールで拡大したりもできます。</li>
        </ul>
        <p>文字が読みにくいときは「背景の暗さ」を上げると見やすくなります。</p>
      </section>

      <section id="save">
        <h2>9. 保存・シェア</h2>
        <ul>
          <li><strong>画像を保存</strong>：PNG画像としてダウンロードします。iPhone では画像が大きく表示されるので、長押しして「写真に保存」を選んでください。</li>
          <li><strong>画像をコピー</strong>：パソコンなら、そのままXやDiscordの投稿欄に貼り付け（Ctrl+V）できます。</li>
          <li><strong>Xでシェア</strong>：スマホでは共有メニューから画像ごと送れます。パソコンでは画像をコピーしたうえでXの投稿画面が開きます。</li>
          <li><strong>宣伝バナー</strong>：自分のカード入りのバナーも作れます。詳しくは<a href="/banner/">宣伝バナー</a>へ。</li>
        </ul>
        <p>入力内容はブラウザに自動保存されます。各項目の「クリア」でその項目だけ、ページ下の「すべてリセット」で全部を消せます。</p>
        <p class="note">Xなどのアプリ内ブラウザでは保存がうまくいかないことがあります。右上の「…」から「ブラウザで開く」を選んでください。</p>
      </section>

      <section id="tips">
        <h2>10. フレンド募集で伝わるカードのコツ</h2>
        <ul>
          <li><strong>活動時間は具体的に</strong>：「夜」より「平日22時〜1時」のほうが、一緒に遊べるか判断しやすくなります。</li>
          <li><strong>ロールは「NG」まで書く</strong>：できないロールが分かると、デュオやフルパの相手が見つかりやすくなります。</li>
          <li><strong>募集内容をタグで</strong>：「デュオ募集」「フルパ募集」「初心者歓迎」などを入れておくと、目的の合う人から声がかかります。</li>
          <li><strong>ハッシュタグを付けて投稿</strong>：Xでは「#LoLフレンド募集」「#サモナーカード」を付けると見つけてもらいやすくなります。</li>
        </ul>
      </section>`,
  },
  {
    slug: 'templates',
    title: 'サモナーカードのテンプレ（テーマ）一覧｜SUMMONER CARD',
    description: 'LoLのサモナーカード・自己紹介カードのテンプレ15種類の見本。ハロウィン、クリスマス、地雷系、量産型、Y2K、ゲーミング、和風、ゆめかわなど、テーマを選んでそのまま無料で作成できます。',
    h1: 'サモナーカードのテンプレ（テーマ）一覧',
    body: `
      <p>SUMMONER CARD では、15種類のテンプレ（テーマ）からデザインを選べます。画像を編集する必要はなく、項目を入力すればカードが完成します。見本の下の「このテンプレで作る」を押すと、そのテーマが選ばれた状態で作成画面が開きます。</p>
      <p>どのテーマでも、好きなチャンピオンのスキン画像や、自分でアップした画像を背景にできます。背景を変えるだけでも雰囲気が大きく変わります。</p>
      <div class="theme-list">
${THEMES.map(([id, name, text]) => `        <section class="theme-item">
          <h2>${name}</h2>
          <img src="/img/theme-${id}.jpg" width="600" height="338" loading="lazy" alt="サモナーカード テンプレ ${name}">
          <p>${text}</p>
          <a class="btn small" href="/?theme=${id}">このテンプレで作る →</a>
        </section>`).join('\n')}
      </div>`,
  },
  {
    slug: 'banner',
    title: '宣伝バナー（ご自由にお使いください）｜SUMMONER CARD',
    description: 'SUMMONER CARDの宣伝バナー素材。配信画面・Twitchのパネル・YouTube・ブログや個人サイトに自由に貼れます。自分のカード入りのバナーも作成できます。',
    h1: '宣伝バナー（ご自由にお使いください）',
    body: `
      <p>SUMMONER CARD を紹介していただける方向けのバナーです。配信画面・Twitchのパネル・YouTubeの概要欄・ブログや個人サイトなどに、<strong>連絡不要で自由に</strong>貼っていただけます。リンクを付けられる場所では、リンク先を <code>https://summonercard.com/</code> にしていただけると嬉しいです。</p>
      <p class="thanks">連絡は不要ですが、使ってくれたら <a href="https://x.com/hotaka_1123" target="_blank" rel="noopener">X（@hotaka_1123）</a> でひとこと教えてもらえると、とても喜びます🙏 配信や記事を見に行かせてください！</p>

      <section>
        <h2>自分のカード入りのバナーを作る</h2>
        <p>カード作成画面の「🎨 自分のカードで宣伝バナーを作る」を押すと、作ったカードを使ったバナー（1800×600）ができます。Twitchのパネル画像やXのヘッダーにも使えます。ゆめかわテーマのカードからは、パステル版のバナーになります。</p>
      </section>

      <section>
        <h2>配布用バナー</h2>
        <div class="gallery banners">
          <figure><img src="/img/banner.jpg" width="1800" height="600" loading="lazy" alt="SUMMONER CARD サモナーカード作成メーカーの宣伝バナー"><figcaption>通常版（1800×600）</figcaption></figure>
          <figure><img src="/img/banner-pastel.jpg" width="1800" height="600" loading="lazy" alt="SUMMONER CARD サモナーカード作成メーカーの宣伝バナー（パステル）"><figcaption>パステル版（1800×600）</figcaption></figure>
        </div>
      </section>

      <section>
        <h2>貼り方</h2>
        <h3>ブログ・個人サイト</h3>
        <p>次のHTMLをそのまま貼り付けてください。</p>
        <pre class="embed-code" id="embed-code">&lt;a href="https://summonercard.com/" target="_blank" rel="noopener"&gt;&lt;img src="https://summonercard.com/img/banner.jpg" alt="SUMMONER CARD｜サモナーカード作成メーカー" width="600" height="200"&gt;&lt;/a&gt;</pre>
        <button type="button" class="btn ghost small" data-copy-target="embed-code">HTMLをコピー</button>
        <p>パステル版を使う場合は、<code>banner.jpg</code> を <code>banner-pastel.jpg</code> に変えてください。</p>
        <h3>Twitchのパネル</h3>
        <p>チャンネルの「概要」→「パネルを編集」で、画像にバナーをアップロードし、「画像リンク」に <code>https://summonercard.com/</code> を入れてください。</p>
        <h3>テキストで紹介する場合</h3>
        <pre class="embed-code" id="text-code">LoLのサモナーカードはこちらで作れます👉 https://summonercard.com/</pre>
        <button type="button" class="btn ghost small" data-copy-target="text-code">テキストをコピー</button>
      </section>

      <section>
        <h2>ご利用にあたって</h2>
        <ul>
          <li>サイズの変更やトリミングは自由です。</li>
          <li>バナーそのものの販売や、SUMMONER CARD の公式であるかのような使い方はご遠慮ください。</li>
          <li>バナーにはLoLの素材が含まれています。Riot Games の権利については<a href="/terms/">利用規約</a>をご覧ください。</li>
        </ul>
      </section>`,
  },
  {
    slug: 'faq',
    title: 'よくある質問｜SUMMONER CARD（サモナーカード作成メーカー）',
    description: 'SUMMONER CARD（LoLのサモナーカード作成ツール）のよくある質問。無料で使えるか、スマホでの保存方法、Xのアプリで保存できないとき、入力内容の扱いなど。',
    h1: 'よくある質問',
    body: `
      <dl class="faq">
${FAQ.map(([q, a]) => `        <dt>${q}</dt>\n        <dd>${a}</dd>`).join('\n')}
      </dl>`,
    jsonld: [{
      '@type': 'FAQPage',
      mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    }],
  },
  {
    slug: 'privacy',
    title: 'プライバシーポリシー｜SUMMONER CARD',
    description: 'SUMMONER CARD（サモナーカード作成メーカー）のプライバシーポリシー。入力内容の取り扱い、アクセス解析、外部サービスについて。',
    h1: 'プライバシーポリシー',
    body: `
      <p>SUMMONER CARD（以下「本サイト」）は、利用者の情報を次のとおり取り扱います。</p>

      <section>
        <h2>1. 入力内容・画像の取り扱い</h2>
        <p>カードに入力した内容（サモナーネーム、連絡先など）やアップロードした画像は、お使いのブラウザ内だけで処理されます。運営者のサーバーに送信・保存されることはありません。</p>
        <p>次回も続きから編集できるよう、入力内容はお使いのブラウザの保存領域（localStorage）に保存されます。この情報はお使いの端末内にのみ存在し、ブラウザのサイトデータを削除するか、ツールの「すべてリセット」を押すと消去されます。</p>
      </section>

      <section>
        <h2>2. アクセス解析ツールについて</h2>
        <p>本サイトでは、サイトの改善のために Google LLC のアクセス解析ツール「Google Analytics」を利用しています。Google Analytics は Cookie を使用して、ページの閲覧数、参照元、使用端末、本サイトの機能の利用回数（画像の保存回数、選ばれたテーマなど）を収集します。これらは匿名で集計され、個人を特定するものではありません。カードに入力した文字や画像そのものは送信しません。</p>
        <p>データの収集はブラウザの設定で Cookie を無効にするか、<a href="https://tools.google.com/dlpage/gaoptout?hl=ja" target="_blank" rel="noopener">Google アナリティクス オプトアウト アドオン</a>を利用することで拒否できます。Google によるデータの取り扱いについては、<a href="https://policies.google.com/technologies/partner-sites?hl=ja" target="_blank" rel="noopener">Google のポリシーと規約</a>をご覧ください。</p>
      </section>

      <section>
        <h2>3. 広告について</h2>
        <p>本サイトでは、今後、運営費をまかなうために第三者配信の広告サービス（Google AdSense など）を利用する場合があります。その場合、広告配信事業者は利用者の興味に応じた広告を表示するために Cookie を使用することがあります。広告を導入する際は、本ポリシーを更新してお知らせします。</p>
      </section>

      <section>
        <h2>4. 外部サービスの利用</h2>
        <p>本サイトは、表示のために次の外部サービスからデータを読み込みます。読み込みの際、お使いの端末のIPアドレスなどの接続情報が各サービスに送信されます。</p>
        <ul>
          <li>Riot Games「Data Dragon」（チャンピオン・アイコン・スキン画像）</li>
          <li>Community Dragon（ランクエンブレム・ロールアイコン・サモナーアイコン画像）</li>
          <li>Google Fonts（Webフォント）</li>
          <li>GitHub Pages（本サイトのホスティング）</li>
        </ul>
      </section>

      <section>
        <h2>5. 免責事項</h2>
        <p>本サイトの利用によって生じた損害について、運営者は責任を負いません。詳しくは<a href="/terms/">利用規約</a>をご覧ください。</p>
      </section>

      <section>
        <h2>6. お問い合わせ</h2>
        <p>本ポリシーに関するお問い合わせは、<a href="https://x.com/hotaka_1123" target="_blank" rel="noopener">X（@hotaka_1123）</a>までご連絡ください。</p>
      </section>

      <section>
        <h2>7. 改定</h2>
        <p>本ポリシーは、必要に応じて予告なく改定することがあります。改定後の内容は、本ページに掲載した時点から効力を生じます。</p>
        <p class="note">制定日：${UPDATED}</p>
      </section>`,
  },
  {
    slug: 'terms',
    title: '利用規約・免責事項｜SUMMONER CARD',
    description: 'SUMMONER CARD（サモナーカード作成メーカー）の利用規約と免責事項。作成した画像の利用範囲、禁止事項、Riot Gamesの権利について。',
    h1: '利用規約・免責事項',
    body: `
      <p>この利用規約（以下「本規約」）は、SUMMONER CARD（以下「本サイト」）の利用条件を定めるものです。本サイトを利用した時点で、本規約に同意したものとみなします。</p>

      <section>
        <h2>1. サービス内容</h2>
        <p>本サイトは、League of Legends の自己紹介カード（サモナーカード）の画像を作成できる無料のWebツールです。会員登録は不要です。</p>
      </section>

      <section>
        <h2>2. 作成した画像の利用</h2>
        <ul>
          <li>作成した画像は、SNS（X、Discord、Instagram など）への投稿、プロフィール、配信画面、Twitchのパネル、ブログなど、<strong>個人の活動の範囲で自由に</strong>使用できます。収益化している配信やチャンネルでの使用も問題ありません。</li>
          <li>作成した画像そのものや、そこに含まれるゲーム素材を<strong>販売・有償配布することはできません</strong>。</li>
          <li>画像の右下にあるサイト名・URLの表示は、設定で非表示にできます。</li>
        </ul>
      </section>

      <section>
        <h2>3. Riot Games の権利について</h2>
        <p>カードに表示されるチャンピオン、スキン、アイコン、ランクエンブレムなどの画像の権利は Riot Games, Inc. に帰属します。本サイトは Riot Games の「<a href="https://www.riotgames.com/ja/legal" target="_blank" rel="noopener">Legal Jibber Jabber</a>」に基づくファンコンテンツであり、Riot Games が公認・支援するものではありません。</p>
        <p class="legal">${LEGAL}</p>
      </section>

      <section>
        <h2>4. アップロードする画像について</h2>
        <p>アイコンや背景にアップロードする画像は、利用者ご自身が使用する権利を持つものに限ってください。アップロードした画像はお使いのブラウザ内だけで処理され、運営者のサーバーには送信されません。</p>
      </section>

      <section>
        <h2>5. 禁止事項</h2>
        <ul>
          <li>他人になりすましたカードや、他人の名前・アカウントを無断で使ったカードの作成・公開</li>
          <li>他人を誹謗中傷する内容、差別的・わいせつな内容を含むカードの作成・公開</li>
          <li>第三者の著作権・肖像権などの権利を侵害する行為</li>
          <li>本サイトの運営を妨げる行為、本サイトの公式であるかのように装う行為</li>
          <li>その他、法令や公序良俗に反する行為</li>
        </ul>
      </section>

      <section>
        <h2>6. 免責事項</h2>
        <ul>
          <li>本サイトは現状のまま提供されます。表示内容の正確性、すべての端末・ブラウザでの動作、継続的な提供を保証するものではありません。</li>
          <li>ブラウザに保存された入力内容は、ブラウザの設定や操作によって失われることがあります。</li>
          <li>本サイトの利用、または作成した画像の利用によって生じたトラブルや損害について、運営者は責任を負いません。</li>
          <li>本サイトは予告なく内容の変更・提供の中断・終了をすることがあります。</li>
        </ul>
      </section>

      <section>
        <h2>7. 規約の変更</h2>
        <p>本規約は、必要に応じて予告なく変更することがあります。変更後の規約は、本ページに掲載した時点から効力を生じます。</p>
        <p class="note">制定日：${UPDATED}</p>
      </section>`,
  },
  {
    slug: 'about',
    title: '運営者情報・お問い合わせ｜SUMMONER CARD',
    description: 'SUMMONER CARD（サモナーカード作成メーカー）の運営者情報とお問い合わせ先、使用している素材について。',
    h1: '運営者情報・お問い合わせ',
    body: `
      <section>
        <h2>SUMMONER CARD について</h2>
        <p>SUMMONER CARD は、LoL（League of Legends）のプレイヤーが、フレンド募集や自己紹介に使う「サモナーカード」を手軽に作れるようにと作った、個人運営の無料ツールです。テンプレ画像を編集しなくても、項目を入力するだけでカードができることを目指しています。</p>
      </section>

      <section>
        <h2>運営者</h2>
        <table class="doc-table">
          <tbody>
            <tr><th>サイト名</th><td>SUMMONER CARD（サモナーカード作成メーカー）</td></tr>
            <tr><th>URL</th><td><a href="/">https://summonercard.com/</a></td></tr>
            <tr><th>運営者</th><td>hotaka（個人）</td></tr>
            <tr><th>連絡先</th><td><a href="https://x.com/hotaka_1123" target="_blank" rel="noopener">X（@hotaka_1123）</a></td></tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>お問い合わせ</h2>
        <p>不具合の報告、機能の要望、掲載内容に関するご連絡などは、<a href="https://x.com/hotaka_1123" target="_blank" rel="noopener">X（@hotaka_1123）</a>のDMまたはリプライでお気軽にどうぞ。不具合の場合は、お使いの端末・ブラウザ（例：iPhone の Safari、Xのアプリ内など）と、どの操作で起きたかを添えていただけると助かります。</p>
      </section>

      <section>
        <h2>使用している素材</h2>
        <ul>
          <li>チャンピオン・スキン・アイコン画像：Riot Games「Data Dragon」</li>
          <li>ランクエンブレム・ロールアイコン・サモナーアイコン：<a href="https://www.communitydragon.org/" target="_blank" rel="noopener">Community Dragon</a></li>
          <li>フォント：Google Fonts（M PLUS 1p、M PLUS Rounded 1c、Cinzel、Dancing Script）</li>
        </ul>
        <p class="legal">${LEGAL}</p>
      </section>`,
  },
];

for (const page of pages) {
  const dir = path.join(ROOT, page.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), layout(page));
  console.log('wrote', `${page.slug}/index.html`);
}

// Sitemap: top page (with images) plus every generated page.
const images = ['og.jpg', 'img/banner.jpg', 'img/banner-pastel.jpg', ...THEMES.map(([id]) => `img/theme-${id}.jpg`)];
const urls = [
  `  <url>
    <loc>${SITE}/</loc>
    <lastmod>${UPDATED}</lastmod>
${images.map((i) => `    <image:image><image:loc>${SITE}/${i}</image:loc></image:image>`).join('\n')}
  </url>`,
  ...pages.map((p) => `  <url>
    <loc>${SITE}/${p.slug}/</loc>
    <lastmod>${UPDATED}</lastmod>
  </url>`),
];
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.join('\n')}
</urlset>
`);
console.log('wrote sitemap.xml');
