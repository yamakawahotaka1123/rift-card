// Discord server card page (/server/) in Japanese.
import { serverTool } from './form.mjs';

const s = {
  nav: 'サーバー紹介',
  allRanks: '全ランク歓迎', any: '指定なし', namePh: 'サーバー名', inviteEmpty: '招待リンクを入力', defaultSkin: 'デフォルト',
  copied: '画像をコピーしました', copyFailed: 'コピーできませんでした。「画像を保存」を使ってください',
  longPress: '画像を長押しして保存してください',
  save: '画像を保存', copy: '画像をコピー', sampleBtn: 'サンプルを入れる', reset: 'リセット', close: '閉じる',
  secBasic: '基本情報', name: 'サーバー名', icon: 'サーバーアイコン', upload: '画像をアップ', clear: 'なし',
  square: '角丸', circle: '丸',
  members: 'メンバー数', membersPh: '例：120人', hours: '活動時間', hoursPh: '例：毎日21時〜',
  join: '参加方法', joinLink: '招待リンクを載せる', joinPrivate: '載せない（DMで、など文字で書く）',
  joinText: '参加方法の文字', joinTextPh: 'DMで気軽に声かけてね',
  invite: '招待リンク', qr: '招待リンクのQRコードを入れる', rankFrom: '対象ランク（下）', rankTo: '対象ランク（上）',
  secAbout: '紹介', about: '紹介文', aboutPh: '例：LoLをゆるく楽しむサーバーです。毎晩だれかしらVCにいます。',
  tags: 'タグ',
  tagList: ['初心者歓迎', '経験者歓迎', 'VCあり', '聞き専OK', 'ランク', 'ノーマル', 'ARAM', 'カスタム', '大会・クラッシュ', '社会人多め', '学生多め', '雑談メイン', '配信者いる', '18歳以上'],
  customTags: 'その他のタグ（カンマ区切り）', customTagsPh: '例：コーチング, TFTも',
  message: 'ひとこと', messagePh: '例：まずは見学だけでも大歓迎！',
  secDesign: 'デザイン', theme: 'テーマ', bg: '背景（チャンピオンのスキン）', champPh: 'チャンピオン名を入力',
  uploadBg: '自分の画像をアップ', noBg: '背景なし',
  bgX: '横位置', bgY: '縦位置', zoom: '拡大', dim: '背景の暗さ',
  credit: 'カード右下にサイトのURLを入れる（入れてもらえると広まって嬉しいです）',
  sample: {
    name: 'LoL ゆるふわ部', members: '120人', hours: '毎日21時〜', invite: 'discord.gg/example',
    about: 'LoLをゆるく楽しむサーバーです。毎晩だれかしらVCにいて、週末はカスタムもやっています。',
    tags: ['初心者歓迎', 'VCあり', 'カスタム', '社会人多め'], message: 'まずは見学だけでも大歓迎！気軽にどうぞ',
    rankFrom: 'IRON', rankTo: 'DIAMOND', splashChamp: 'Lux', splashSkin: 0,
  },
};

export default {
  nav: s.nav,
  title: 'Discordサーバー紹介カード作成（LoL）｜無料で募集画像を作る｜SUMMONER CARD',
  description: 'LoLのDiscordサーバーのメンバー募集に使える紹介カードを無料で作成。サーバー名・アイコン・対象ランク・タグ・招待リンクを入れるだけで、チャンピオンのスキン背景つきの画像ができます。',
  h1: 'Discordサーバー紹介カードを作る',
  body: `
      <p>LoLのDiscordサーバーのメンバー募集に使える、<strong>サーバー紹介カード</strong>を無料で作れます。サーバー名や対象ランク、タグ、招待リンクを入れるだけで、チャンピオンのスキン背景つきの画像が完成します。Xの「#LoLフレンド募集」やサーバー掲示板への投稿にどうぞ。</p>
${serverTool(s)}

      <section>
        <h2>使い方</h2>
        <ol class="steps">
          <li><strong>基本情報を入れる</strong><br>サーバー名、アイコン、メンバー数、活動時間、招待リンクを入力します。対象ランクは、下と上を選ぶと「シルバー 〜 ダイヤモンド」のように表示され、ランクエンブレムも並びます。どちらも「指定なし」なら「全ランク歓迎」になります。</li>
          <li><strong>紹介文とタグを選ぶ</strong><br>どんな雰囲気のサーバーかを紹介文に書き、当てはまるタグを選びます。一覧にないタグは「その他のタグ」にカンマ区切りで書けます。</li>
          <li><strong>テーマと背景を選んで保存</strong><br>サモナーカードと同じテーマが使えます。背景にはチャンピオンのスキンか、自分の画像（サーバーのバナーなど）を使えます。</li>
        </ol>
        <p>入力内容はこのブラウザにだけ保存され、サーバーには送信されません。</p>
      </section>

      <section>
        <h2>メンバーが集まりやすい紹介カードのコツ</h2>
        <ul>
          <li><strong>雰囲気をひとことで</strong>：「ガチでランクを回す」「ゆるく雑談しながら」など、どんな人が楽しめるサーバーかを紹介文の最初に書くと、合う人が集まりやすくなります。</li>
          <li><strong>活動時間を書く</strong>：人が多い時間帯がわかると、入ったあとに一緒に遊べるかどうかを判断しやすくなります。</li>
          <li><strong>招待リンクは期限なしに</strong>：Discordの招待リンクは、作成時に「期限なし」を選ばないと7日で切れてしまいます。画像に載せるリンクは期限なしにしておきましょう。</li>
          <li><strong>ルールは別に用意</strong>：カードには魅力を、細かいルールはサーバー内のルールチャンネルに書くのがおすすめです。</li>
        </ul>
        <p>個人の自己紹介カードは<a href="/">サモナーカード作成</a>で作れます。募集の書き方は<a href="/articles/recruit-tips/">LoLフレンド募集で人が集まる書き方</a>も参考にしてください。</p>
      </section>
      <script type="module" src="/js/server.js"></script>`,
};
