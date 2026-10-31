// Traditional Chinese page contents. Same shape as ja.mjs.
const X = '<a href="https://x.com/hotaka_1123" target="_blank" rel="noopener">X（@hotaka_1123）</a>';

export default ({ UPDATED, LEGAL, IMG, HOME }) => ({
  htmlLang: 'zh-TW',
  locale: 'zh_TW',
  siteSub: '召喚師卡片產生器',
  nav: { make: '製作卡片', guide: '使用方法', templates: '範本', banner: '宣傳橫幅', faq: '常見問題' },
  footerNav: { guide: '使用方法', templates: '範本一覽', banner: '宣傳橫幅', faq: '常見問題', about: '關於・聯絡', privacy: '隱私權政策', terms: '使用條款' },
  footer: {
    storage: '輸入的內容只會儲存在此瀏覽器中，不會傳送到伺服器。製作的圖片可以自由用於社群、實況等。',
    contact: `有問題或建議請隨時透過 ${X} 聯絡。`,
    analytics: '為了改善網站，我們使用 Google Analytics 統計造訪次數和功能使用次數（不會傳送輸入內容和圖片）。詳情請見<a href="/privacy/">隱私權政策</a>。',
  },
  aria: { menu: '選單', siteInfo: '網站資訊', breadcrumbs: '目前位置', toc: '目錄' },
  top: '首頁',
  cta: '製作召喚師卡片 →',
  translationNote: '本頁面為日文原文的翻譯。如內容有出入，以日文版為準。',
  copied: '已複製',
  copyFailed: '複製失敗，請手動選取並複製',

  themes: [
    ['halloween', '萬聖節', '紫色配南瓜橘，加上蝙蝠、蜘蛛網和南瓜燈。頭像會戴上女巫帽。用魔女系列造型當背景特別搭。'],
    ['christmas', '聖誕節', '紅綠配色加拐杖糖邊框、燈串、雪花和禮物。頭像會戴上聖誕帽。試試用冬季造型當背景吧。'],
    ['newyear', '新年', '紅金配色加上日出光芒、梅花和鏡餅。頭像旁會有一把摺扇。很適合發新年祝福。'],
    ['lunar', '農曆新年', '鮮紅配金色，掛著燈籠、銅錢、梅花和金元寶。頭像旁掛著一盞燈籠。很適合發新春祝福。'],
    ['valentine', '情人節', '巧克力色配玫瑰粉，漂浮的愛心和心形禮盒。頭像上插著邱比特之箭。'],
    ['hextech', '海克斯科技', '接近LoL客戶端的金色與深藍經典設計。和任何造型背景都好搭，拿不定主意就選它。'],
    ['noxus', '諾克薩斯', '紅黑配色的霸氣設計。和達瑞斯、賽恩等諾克薩斯英雄的造型超級搭。'],
    ['freljord', '弗雷爾卓德', '像冰一樣的淺藍設計。適合艾希、史瓦妮或冬季造型背景。'],
    ['shadow', '闇影島', '泛著綠光的詭異設計。適合瑟雷西、維爾戈等闇影島英雄。'],
    ['ionia', '愛歐尼亞', '粉紫色的柔和設計。適合阿璃、伊瑞莉雅或櫻花風造型。'],
    ['fairy', '夢幻粉', '粉彩粉色的夢幻可愛風，附獨角獸角、糖果和格紋地板裝飾。'],
    ['fairy-mint', '夢幻藍', '夢幻粉的藍色版，粉彩藍和薰衣草紫的組合。'],
    ['guardian', '星光守護者', '明亮可愛的淺色設計。適合星光守護者或魔法少女系造型。'],
    ['jirai', '地雷系', '黑×粉的日系地雷系風格，附蝴蝶結、愛心、蕾絲邊框和格紋。'],
    ['ryousan', '量產型', '白×淡粉的日系量產型風格，用珍珠、蕾絲和蝴蝶結打造甜美感。'],
    ['y2k', 'Y2K', '銀色鍍鉻星星、笑臉、蝴蝶和彩虹邊框，打造Y2K復古風。'],
    ['gaming', '電競RGB', '黑底配RGB彩虹霓虹邊框、發光文字和合成波網格，滿滿電競PC感。'],
    ['wafu', '和風', '和紙底配紅白金三色、青海波紋和櫻花瓣，搭配明朝體的日式現代設計。'],
  ],

  templates: {
    title: '召喚師卡片範本（主題）一覽｜SUMMONER CARD',
    description: '15種以上LoL召喚師卡片・自我介紹卡範本預覽。萬聖節、聖誕節、電競RGB、Y2K、地雷系、和風等，選好主題即可免費製作。',
    h1: '召喚師卡片範本（主題）一覽',
    intro: `
      <p>SUMMONER CARD 提供15種以上範本（主題）供你選擇。不需要編輯圖片，填好內容卡片就完成了。點擊預覽下方的「用這個範本製作」，就會以該主題開啟製作頁面。</p>
      <p>每個主題都可以用喜歡的英雄造型原畫或自己上傳的圖片當背景。光是換個背景，感覺就會大不相同。</p>`,
    button: '用這個範本製作 →',
    alt: (name) => `召喚師卡片範本 ${name}`,
  },

  faq: {
    title: '常見問題｜SUMMONER CARD（召喚師卡片產生器）',
    description: 'SUMMONER CARD（LoL召喚師卡片製作工具）的常見問題：是否免費、手機上如何儲存、在X App中無法儲存時怎麼辦、輸入內容如何處理等。',
    h1: '常見問題',
    items: [
      ['什麼是召喚師卡片？', '是英雄聯盟玩家把牌位、位置、拿手英雄、遊戲時間等整理在一起的自我介紹圖片。常用於在X、Discord伺服器等地方找隊友和朋友。'],
      ['免費嗎？需要註冊嗎？', '完全免費，也不需要註冊或登入。'],
      ['手機上也能做嗎？', '可以直接在手機瀏覽器中製作。在iPhone上點擊「儲存圖片」後卡片會放大顯示，長按即可儲存到照片。'],
      ['從X App開啟後無法儲存', '在X、Instagram、LINE等App內建瀏覽器中，儲存或分享圖片可能會受到限制。請點右上角的「…」選擇「以瀏覽器開啟」，用Safari或Chrome開啟。直接在App內建瀏覽器中長按顯示的圖片也可以儲存。'],
      ['需要自己編輯範本圖片嗎？', '不需要，也不用修圖App。填好內容、選好主題，就會自動產生附英雄和牌位圖示的卡片。'],
      ['不想公開召喚師名稱怎麼辦？', '可以在召喚師名稱欄下方選擇「不公開」「一起玩時告訴你」「私訊告訴你」「熟了再告訴你」等固定文字。'],
      ['牌位會自動取得嗎？', '目前需要自己選擇。未分級或不想公開牌位的人也可以直接使用。'],
      ['輸入的內容會被傳送到哪裡嗎？', '輸入的內容和上傳的圖片只會在你的瀏覽器中處理和儲存，不會傳送到營運者的伺服器。'],
      ['之後還能修改嗎？', '輸入內容會自動儲存在瀏覽器中，下次開啟可以接著編輯。如果清除了瀏覽器資料，或在其他裝置、其他瀏覽器中開啟，則不會保留。'],
      ['做好的圖片可以隨意使用嗎？', '可以自由用於X、Discord、實況畫面、Twitch面板等。但不能販售製作的圖片或其中包含的LoL素材。詳情請見使用條款。'],
      ['可以去掉圖片右下角的網址嗎？', '取消勾選設計欄下方的「在卡片右下角加入網站網址」即可去掉。如果能保留的話，會幫網站被更多人知道，我會非常開心。'],
      ['發現了問題 / 想要某個功能', '歡迎透過X（@hotaka_1123）聯絡。'],
    ],
  },

  guide: {
    title: '召喚師卡片製作方法・使用指南｜SUMMONER CARD',
    description: '依項目詳細說明LoL召喚師卡片（自我介紹卡）的製作方法：位置的4級顯示、從造型原畫裁切頭像、調整背景，以及在手機上儲存的方法。',
    h1: '召喚師卡片的製作方法・使用方法',
    body: `
      <p>SUMMONER CARD 是一個只用瀏覽器就能製作英雄聯盟自我介紹卡「召喚師卡片」的免費工具。以下依序說明每個項目的填寫方法和做出好看卡片的小技巧。</p>

      <nav class="toc" aria-label="目錄">
        <p>目錄</p>
        <ol>
          <li><a href="#basic">基本資料（名稱・頭像）</a></li>
          <li><a href="#rank">牌位</a></li>
          <li><a href="#role">位置</a></li>
          <li><a href="#champs">拿手英雄</a></li>
          <li><a href="#tags">遊戲風格</a></li>
          <li><a href="#contact">遊戲時間・聯絡方式</a></li>
          <li><a href="#comment">一句話</a></li>
          <li><a href="#design">設計（主題・背景）</a></li>
          <li><a href="#save">儲存・分享</a></li>
          <li><a href="#tips">找隊友時更有效的卡片技巧</a></li>
        </ol>
      </nav>

      <section id="basic">
        <h2>1. 基本資料（名稱・頭像）</h2>
        <h3>召喚師名稱和標籤</h3>
        <p>輸入 Riot ID 的名稱部分和標籤（#後面的部分）。卡片上會在名稱旁邊以小字顯示，例如「#TW2」。</p>
        <p>不想顯示名稱時，點擊輸入框下方的<strong>「不公開」「一起玩時告訴你」「私訊告訴你」「熟了再告訴你」</strong>按鈕，就會用這句話代替名稱顯示。</p>
        <h3>等級</h3>
        <p>輸入召喚師等級後，會在頭像下方顯示「Lv.○○」。留空則不顯示。</p>
        <h3>頭像</h3>
        <p>在「選擇頭像」中可以用以下3種方式設定：</p>
        <ul>
          <li><strong>召喚師頭像</strong>：從遊戲內約5,000種頭像中選擇。可以用「阿璃」「K/DA」「魄羅」等名稱搜尋。</li>
          <li><strong>英雄</strong>：使用英雄的頭像。</li>
          <li><strong>上傳圖片</strong>：可以使用任意圖片。上傳後會開啟裁切畫面，拖曳和縮放選擇想用的部分即可。</li>
        </ul>
        <p>頭像形狀可以選擇「圓形」或「方形」。</p>
      </section>

      <section id="rank">
        <h2>2. 牌位</h2>
        <p>選擇牌位（鐵牌～菁英）和階級（I～IV），就會顯示牌位徽章。大師以上沒有階級。不想顯示牌位的話，保持「未分級」即可。</p>
      </section>

      <section id="role">
        <h2>3. 位置</h2>
        <p>上路（TOP）、打野（JG）、中路（MID）、下路（ADC）、輔助（SUP）都可以分別設定4個等級的「能玩程度」。</p>
        <table class="doc-table">
          <thead><tr><th>按鈕</th><th>卡片上的顯示</th><th>意思</th></tr></thead>
          <tbody>
            <tr><td>主玩</td><td>MAIN（突出顯示）</td><td>最拿手的位置，只能選一個</td></tr>
            <tr><td>副玩</td><td>SUB</td><td>積分也能玩的位置</td></tr>
            <tr><td>一般可</td><td>一般</td><td>一般對戰可以玩的位置</td></tr>
            <tr><td>不行</td><td>NG（紅色・斜線）</td><td>不會玩的位置</td></tr>
          </tbody>
        </table>
        <p>再按一次已選取的按鈕即可取消。</p>
      </section>

      <section id="champs">
        <h2>4. 拿手英雄</h2>
        <p>點擊「+ 新增」最多可選5個英雄。先在英雄選擇畫面上方選好位置再點擊，就會<strong>帶著該位置的圖示</strong>登記。同一個英雄也可以用不同位置登記（例如拉克絲同時作為輔助和中路佔2格）。</p>
        <ul>
          <li><strong>造型原畫</strong>：點擊各英雄的「造型原畫」按鈕選擇喜歡的造型，可以從原畫中裁切喜歡的部分做成頭像。點「還原」可恢復預設頭像。</li>
          <li><strong>標題</strong>：可以在「拿手英雄」和「喜歡的英雄」之間切換。</li>
          <li><strong>排序</strong>：「←」向左移動，「×」刪除。</li>
        </ul>
      </section>

      <section id="tags">
        <h2>5. 遊戲風格</h2>
        <p>可以從休閒玩家、衝分玩家、ARAM、可以語音、找雙排等標籤中最多選6個。清單裡沒有的，可以用「+ 自己新增」自由建立（最多12個字）。</p>
      </section>

      <section id="contact">
        <h2>6. 遊戲時間・聯絡方式</h2>
        <p>可以填寫遊戲時間、Discord、X、Twitch、YouTube。只有填寫的項目會顯示在名稱下方，項目較多時會自動排成兩欄。</p>
      </section>

      <section id="comment">
        <h2>7. 一句話</h2>
        <p>最多80個字，顯示在卡片下方。也可以換行（最多2行）。</p>
      </section>

      <section id="design">
        <h2>8. 設計（主題・背景）</h2>
        <h3>主題</h3>
        <p>可以從15種以上中選擇。預覽請看<a href="/templates/">範本一覽</a>。</p>
        <h3>背景</h3>
        <ul>
          <li><strong>從造型中選擇</strong>：選擇英雄和造型後，該原畫就會成為背景。</li>
          <li><strong>上傳自己的圖片</strong>：可以用任意圖片當背景（上傳時可以裁切）。</li>
          <li><strong>位置・縮放・暗度</strong>：可以用滑桿調整。也可以直接拖曳預覽卡片，或用滑鼠滾輪縮放。</li>
        </ul>
        <p>文字看不清楚時，調高「背景暗度」就會清楚很多。</p>
      </section>

      <section id="save">
        <h2>9. 儲存・分享</h2>
        <ul>
          <li><strong>儲存圖片</strong>：下載為PNG圖片。在iPhone上圖片會放大顯示，長按後選擇「儲存到照片」。</li>
          <li><strong>複製圖片</strong>：在電腦上可以直接貼上（Ctrl+V）到X或Discord的輸入框。</li>
          <li><strong>分享到X</strong>：在手機上可以透過分享選單連同圖片一起傳送。在電腦上會先複製圖片，再開啟X的發文頁面。</li>
          <li><strong>宣傳橫幅</strong>：也可以製作附有你的卡片的橫幅。詳情請看<a href="/banner/">宣傳橫幅</a>。</li>
        </ul>
        <p>輸入內容會自動儲存在瀏覽器中。各項目的「清除」只清除該項目，頁面底部的「全部重設」會清除全部內容。</p>
        <p class="note">在X等App內建瀏覽器中可能無法正常儲存。請點右上角的「…」選擇「以瀏覽器開啟」。</p>
      </section>

      <section id="tips">
        <h2>10. 找隊友時更有效的卡片技巧</h2>
        <ul>
          <li><strong>遊戲時間寫具體</strong>：比起「晚上」，「平日22點～1點」更容易讓人判斷能不能一起玩。</li>
          <li><strong>位置連「NG」也寫上</strong>：知道你不玩的位置，更容易找到雙排或五排的隊友。</li>
          <li><strong>用標籤寫清楚需求</strong>：加上「找雙排」「找五排」「歡迎新手」等，目的相同的人就會來找你。</li>
          <li><strong>發文時加上主題標籤</strong>：在X上加上「#英雄聯盟」「#召喚師卡片」更容易被找到。</li>
        </ul>
      </section>`,
  },

  banner: {
    title: '宣傳橫幅（歡迎自由使用）｜SUMMONER CARD',
    description: 'SUMMONER CARD的宣傳橫幅素材。可以自由放在實況畫面、Twitch面板、YouTube、部落格或個人網站上。也可以製作附有你自己卡片的橫幅。',
    h1: '宣傳橫幅（歡迎自由使用）',
    body: `
      <p>這些橫幅是為願意介紹 SUMMONER CARD 的朋友準備的。可以<strong>不用聯絡、自由地</strong>放在實況畫面、Twitch面板、YouTube說明欄、部落格或個人網站等地方。能加連結的地方，如果能連結到 <code>${HOME}</code> 會非常感謝。</p>
      <p class="thanks">不需要聯絡我，不過用了的話在 ${X} 說一聲我會超開心 🙏 讓我去看看你的實況或文章吧！</p>

      <section>
        <h2>製作附有自己卡片的橫幅</h2>
        <p>在卡片製作頁面點擊「🎨 用你的卡片製作宣傳橫幅」，就能產生使用你所做卡片的橫幅（1800×600）。也可以用作Twitch面板圖片或X橫幅。夢幻主題的卡片會產生粉彩版橫幅。</p>
      </section>

      <section>
        <h2>可下載的橫幅（全部主題）</h2>
        <p>點擊圖片會以原尺寸（1800×600）開啟，請在那裡儲存。</p>
        <!--BANNERS-->
      </section>

      <section>
        <h2>使用方法</h2>
        <h3>部落格・個人網站</h3>
        <p>請直接貼上以下HTML。</p>
        <pre class="embed-code" id="embed-code">&lt;a href="${HOME}" target="_blank" rel="noopener"&gt;&lt;img src="https://summonercard.com${IMG}/banner.jpg" alt="SUMMONER CARD｜召喚師卡片產生器" width="600" height="200"&gt;&lt;/a&gt;</pre>
        <button type="button" class="btn ghost small" data-copy-target="embed-code">複製HTML</button>
        <p>使用其他主題時，請把 <code>banner.jpg</code> 改成上面圖片的檔名（例如 <code>banner-halloween.jpg</code>）。</p>
        <h3>Twitch面板</h3>
        <p>在頻道的「關於」→「編輯面板」中上傳橫幅作為圖片，並在「圖片連結」中填入 <code>${HOME}</code>。</p>
        <h3>用文字介紹時</h3>
        <pre class="embed-code" id="text-code">LoL召喚師卡片可以在這裡製作👉 ${HOME}</pre>
        <button type="button" class="btn ghost small" data-copy-target="text-code">複製文字</button>
      </section>

      <section>
        <h2>使用須知</h2>
        <ul>
          <li>可以自由調整大小或裁切。</li>
          <li>請勿販售橫幅本身，或以看起來像 SUMMONER CARD 官方的方式使用。</li>
          <li>橫幅中包含LoL素材。關於 Riot Games 的權利，請參閱<a href="/terms/">使用條款</a>。</li>
        </ul>
      </section>`,
  },

  privacy: {
    title: '隱私權政策｜SUMMONER CARD',
    description: 'SUMMONER CARD（召喚師卡片產生器）的隱私權政策：關於輸入內容的處理、流量分析和外部服務。',
    h1: '隱私權政策',
    body: `
      <p>SUMMONER CARD（以下簡稱「本網站」）依以下方式處理使用者資訊。</p>

      <section>
        <h2>1. 輸入內容・圖片的處理</h2>
        <p>在卡片中輸入的內容（召喚師名稱、聯絡方式等）和上傳的圖片只會在你的瀏覽器中處理，不會傳送或儲存到營運者的伺服器。</p>
        <p>為了下次可以接著編輯，輸入內容會儲存在瀏覽器的儲存空間（localStorage）中。這些資訊只存在於你的裝置中，刪除瀏覽器的網站資料或點擊工具中的「全部重設」後即會清除。</p>
      </section>

      <section>
        <h2>2. 流量分析工具</h2>
        <p>本網站為了改善網站，使用 Google LLC 的流量分析工具「Google Analytics」。Google Analytics 使用 Cookie 收集頁面瀏覽次數、來源、使用裝置以及本網站功能的使用次數（圖片儲存次數、所選主題等）。這些資料以匿名方式統計，不會識別個人身分。卡片中輸入的文字和圖片本身不會被傳送。</p>
        <p>你可以透過在瀏覽器設定中停用 Cookie，或使用 <a href="https://tools.google.com/dlpage/gaoptout?hl=zh-TW" target="_blank" rel="noopener">Google Analytics 停用瀏覽器外掛程式</a>來拒絕資料收集。關於 Google 如何處理資料，請參閱 <a href="https://policies.google.com/technologies/partner-sites?hl=zh-TW" target="_blank" rel="noopener">Google 隱私權與條款</a>。</p>
      </section>

      <section>
        <h2>3. 關於廣告</h2>
        <p>為了支付營運費用，本網站使用第三方廣告服務「Google AdSense」。包括 Google 在內的廣告供應商會使用 Cookie，根據您過去造訪本網站及其他網站的資訊顯示廣告。您可以在 Google 的<a href="https://adssettings.google.com/" target="_blank" rel="noopener">廣告設定</a>中關閉個人化廣告，也可以在 <a href="https://www.aboutads.info/" target="_blank" rel="noopener">www.aboutads.info</a> 拒絕第三方供應商的 Cookie。</p>
      </section>

      <section>
        <h2>4. 外部服務的使用</h2>
        <p>為了顯示內容，本網站會從以下外部服務讀取資料。讀取時，你裝置的IP位址等連線資訊會被傳送到各服務。</p>
        <ul>
          <li>Riot Games「Data Dragon」（英雄・頭像・造型圖片）</li>
          <li>Community Dragon（牌位徽章・位置圖示・召喚師頭像圖片）</li>
          <li>Google Fonts（網頁字型）</li>
          <li>GitHub Pages（本網站的主機服務）</li>
        </ul>
      </section>

      <section>
        <h2>5. 免責聲明</h2>
        <p>對於因使用本網站而產生的損害，營運者不負任何責任。詳情請參閱<a href="/terms/">使用條款</a>。</p>
      </section>

      <section>
        <h2>6. 聯絡方式</h2>
        <p>關於本政策的詢問，請透過 ${X} 聯絡。</p>
      </section>

      <section>
        <h2>7. 修訂</h2>
        <p>本政策可能會視需要在未事先通知的情況下修訂。修訂後的內容自在本頁面公布之時起生效。</p>
        <p class="note">制定日期：${UPDATED}</p>
      </section>`,
  },

  terms: {
    title: '使用條款・免責聲明｜SUMMONER CARD',
    description: 'SUMMONER CARD（召喚師卡片產生器）的使用條款和免責聲明：製作圖片的使用範圍、禁止事項以及 Riot Games 的權利。',
    h1: '使用條款・免責聲明',
    body: `
      <p>本使用條款（以下簡稱「本條款」）規定 SUMMONER CARD（以下簡稱「本網站」）的使用條件。使用本網站即視為同意本條款。</p>

      <section>
        <h2>1. 服務內容</h2>
        <p>本網站是一個可以製作英雄聯盟自我介紹卡（召喚師卡片）圖片的免費網頁工具，不需要註冊會員。</p>
      </section>

      <section>
        <h2>2. 製作圖片的使用</h2>
        <ul>
          <li>製作的圖片可以<strong>在個人活動範圍內自由</strong>使用，例如發布到社群（X、Discord、Instagram 等）、個人檔案、實況畫面、Twitch面板、部落格等。在有營利的實況或頻道中使用也沒有問題。</li>
          <li><strong>不得販售或有償散布</strong>製作的圖片本身或其中包含的遊戲素材。</li>
          <li>圖片右下角的網站名稱・網址可以在設定中隱藏。</li>
        </ul>
      </section>

      <section>
        <h2>3. 關於 Riot Games 的權利</h2>
        <p>卡片上顯示的英雄、造型、頭像、牌位徽章等圖片的權利屬於 Riot Games, Inc.。本網站是依據 Riot Games「<a href="https://www.riotgames.com/en/legal" target="_blank" rel="noopener">Legal Jibber Jabber</a>」製作的粉絲內容，並非 Riot Games 認可或贊助。</p>
        <p class="legal">${LEGAL}</p>
      </section>

      <section>
        <h2>4. 關於上傳的圖片</h2>
        <p>用作頭像或背景上傳的圖片，僅限使用者本人擁有使用權的圖片。上傳的圖片只會在你的瀏覽器中處理，不會傳送到營運者的伺服器。</p>
      </section>

      <section>
        <h2>5. 禁止事項</h2>
        <ul>
          <li>製作或公開冒充他人的卡片，或擅自使用他人名稱・帳號的卡片</li>
          <li>製作或公開含有毀謗他人、歧視或猥褻內容的卡片</li>
          <li>侵害第三方著作權、肖像權等權利的行為</li>
          <li>妨礙本網站營運的行為，或假冒本網站官方的行為</li>
          <li>其他違反法令或公序良俗的行為</li>
        </ul>
      </section>

      <section>
        <h2>6. 免責聲明</h2>
        <ul>
          <li>本網站依現狀提供，不保證顯示內容的正確性、在所有裝置・瀏覽器上的運作以及持續提供。</li>
          <li>儲存在瀏覽器中的輸入內容可能會因瀏覽器設定或操作而遺失。</li>
          <li>對於因使用本網站或使用所製作的圖片而產生的糾紛或損害，營運者不負任何責任。</li>
          <li>本網站可能會在未事先通知的情況下變更內容、中斷或終止服務。</li>
        </ul>
      </section>

      <section>
        <h2>7. 條款的變更</h2>
        <p>本條款可能會視需要在未事先通知的情況下變更。變更後的條款自在本頁面公布之時起生效。</p>
        <p class="note">制定日期：${UPDATED}</p>
      </section>`,
  },

  about: {
    title: '關於・聯絡｜SUMMONER CARD',
    description: 'SUMMONER CARD（召喚師卡片產生器）的營運者資訊、聯絡方式以及使用的素材。',
    h1: '關於・聯絡',
    body: `
      <section>
        <h2>關於 SUMMONER CARD</h2>
        <p>SUMMONER CARD 是一個個人營運的免費工具，目的是讓英雄聯盟玩家能輕鬆製作用來找隊友和自我介紹的「召喚師卡片」。目標是不用編輯範本圖片，只要填寫內容就能做出卡片。</p>
      </section>

      <section>
        <h2>營運者</h2>
        <table class="doc-table">
          <tbody>
            <tr><th>網站名稱</th><td>SUMMONER CARD（召喚師卡片產生器）</td></tr>
            <tr><th>網址</th><td><a href="/">${HOME}</a></td></tr>
            <tr><th>營運者</th><td>hotaka（個人）</td></tr>
            <tr><th>聯絡方式</th><td>${X}</td></tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>聯絡</h2>
        <p>問題回報、功能建議、有關內容的聯絡等，歡迎透過 ${X} 的私訊或回覆隨時聯絡。營運者在日本，但也歡迎用中文留言（我會翻譯後閱讀）。如果是問題回報，請附上你使用的裝置・瀏覽器（例如 iPhone 的 Safari、X App內等）以及在什麼操作時發生，這會很有幫助。</p>
      </section>

      <section>
        <h2>使用的素材</h2>
        <ul>
          <li>英雄・造型・頭像圖片：Riot Games「Data Dragon」</li>
          <li>牌位徽章・位置圖示・召喚師頭像：<a href="https://www.communitydragon.org/" target="_blank" rel="noopener">Community Dragon</a></li>
          <li>字型：Google Fonts（M PLUS 1p、M PLUS Rounded 1c、Cinzel、Dancing Script、Noto Sans TC）</li>
        </ul>
        <p class="legal">${LEGAL}</p>
      </section>`,
  },
});
