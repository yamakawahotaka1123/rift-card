// Simplified Chinese page contents. Same shape as ja.mjs.
const X = '<a href="https://x.com/hotaka_1123" target="_blank" rel="noopener">X（@hotaka_1123）</a>';

export default ({ UPDATED, LEGAL, IMG, HOME }) => ({
  htmlLang: 'zh-CN',
  locale: 'zh_CN',
  siteSub: '召唤师卡片生成器',
  nav: { make: '制作卡片', guide: '使用方法', templates: '模板', banner: '宣传横幅', faq: '常见问题' },
  footerNav: { guide: '使用方法', templates: '模板一览', banner: '宣传横幅', faq: '常见问题', about: '关于・联系', privacy: '隐私政策', terms: '使用条款' },
  footer: {
    storage: '输入的内容只保存在此浏览器中，不会发送到服务器。制作的图片可以自由用于社交媒体、直播等。',
    contact: `有问题或建议请随时通过 ${X} 联系。`,
    analytics: '为了改进网站，我们使用 Google Analytics 统计访问量和功能使用次数（不会发送输入内容和图片）。详情请见<a href="/privacy/">隐私政策</a>。',
  },
  aria: { menu: '菜单', siteInfo: '网站信息', breadcrumbs: '当前位置', toc: '目录' },
  top: '首页',
  cta: '制作召唤师卡片 →',
  translationNote: '本页面为日文原文的翻译。如内容有出入，以日文版为准。',
  copied: '已复制',
  copyFailed: '复制失败，请手动选择并复制',

  themes: [
    ['halloween', '万圣节', '紫色配南瓜橙，加上蝙蝠、蜘蛛网和南瓜灯。头像会戴上女巫帽。用魔女系列皮肤做背景特别搭。'],
    ['christmas', '圣诞节', '红绿配色加拐杖糖边框、彩灯、雪花和礼物。头像会戴上圣诞帽。试试用冬季皮肤做背景吧。'],
    ['newyear', '新年', '红金配色加上日出光芒、梅花和镜饼。头像旁会有一把折扇。很适合发新年祝福。'],
    ['lunar', '春节', '鲜红配金色，挂着灯笼、铜钱、梅花和金元宝。头像旁挂着一盏灯笼。很适合发新春祝福。'],
    ['valentine', '情人节', '巧克力色配玫瑰粉，漂浮的爱心和心形礼盒。头像上插着丘比特之箭。'],
    ['yozakura', '夜樱', '夜空中闪着粉色霓虹的夜樱设计，飘落的花瓣和一弯新月。头像周围开满樱花。适合春天的问候和新赛季招募。'],
    ['songkran', '泼水节', '以泰国新年「宋干节（泼水节）」为主题：明亮的水蓝色、飞溅的水花、茉莉花环和银色水钵。'],
    ['hanabi', '烟花', '夏夜天空中绽放的烟花，藏青配金色边框，头像旁有一把团扇。适合暑假招募和夏日祭典的帖子。'],
    ['hextech', '海克斯科技', '接近LoL客户端的金色与藏青经典设计。和任何皮肤背景都好搭，拿不定主意就选它。'],
    ['noxus', '诺克萨斯', '红黑配色的霸气设计。和德莱厄斯、赛恩等诺克萨斯英雄的皮肤超级搭。'],
    ['freljord', '弗雷尔卓德', '冰一样的浅蓝设计。适合艾希、瑟庄妮或冬季皮肤背景。'],
    ['shadow', '暗影岛', '泛着绿光的诡异设计。适合锤石、佛耶戈等暗影岛英雄。'],
    ['ionia', '艾欧尼亚', '粉紫色的柔和设计。适合阿狸、艾瑞莉娅或樱花风皮肤。'],
    ['fairy', '梦幻粉', '粉彩粉色的梦幻可爱风，带独角兽角、糖果和格子地板装饰。'],
    ['fairy-mint', '梦幻蓝', '梦幻粉的蓝色版，粉彩蓝和薰衣草紫的组合。'],
    ['guardian', '星之守护者', '明亮可爱的浅色设计。适合星之守护者或魔法少女系皮肤。'],
    ['jirai', '地雷系', '黑×粉的日系地雷系风格，带蝴蝶结、爱心、蕾丝边框和格纹。'],
    ['ryousan', '量产型', '白×淡粉的日系量产型风格，用珍珠、蕾丝和蝴蝶结打造甜美感。'],
    ['y2k', 'Y2K', '银色镀铬星星、笑脸、蝴蝶和彩虹边框，打造Y2K复古风。'],
    ['gaming', '电竞RGB', '黑底配RGB彩虹霓虹边框、发光文字和合成波网格，满满电竞PC感。'],
    ['wafu', '和风', '和纸底配红白金三色、青海波纹和樱花瓣，搭配明朝体的日式现代设计。'],
  ],

  templates: {
    title: '召唤师卡片模板（主题）一览｜SUMMONER CARD',
    description: '15种以上LoL召唤师卡片・自我介绍卡模板预览。万圣节、圣诞节、电竞RGB、Y2K、地雷系、和风等，选好主题即可免费制作。',
    h1: '召唤师卡片模板（主题）一览',
    intro: `
      <p>SUMMONER CARD 提供15种以上模板（主题）供你选择。不需要编辑图片，填好内容卡片就完成了。点击预览下方的「用这个模板制作」，就会以该主题打开制作页面。</p>
      <p>每个主题都可以用喜欢的英雄皮肤原画或自己上传的图片做背景。光是换个背景，感觉就会大不相同。</p>`,
    button: '用这个模板制作 →',
    alt: (name) => `召唤师卡片模板 ${name}`,
  },

  faq: {
    title: '常见问题｜SUMMONER CARD（召唤师卡片生成器）',
    description: 'SUMMONER CARD（LoL召唤师卡片制作工具）的常见问题：是否免费、手机上如何保存、在X应用中无法保存时怎么办、输入内容如何处理等。',
    h1: '常见问题',
    items: [
      ['什么是召唤师卡片？', '是英雄联盟玩家把段位、位置、拿手英雄、游戏时间等整理在一起的自我介绍图片。常用于在X、Discord服务器等地方找队友和朋友。'],
      ['免费吗？需要注册吗？', '完全免费，也不需要注册或登录。'],
      ['手机上也能做吗？', '可以直接在手机浏览器中制作。在iPhone上点击「保存图片」后卡片会放大显示，长按即可存储到相册。'],
      ['从X应用打开后无法保存', '在X、Instagram等应用内浏览器中，保存或分享图片可能会受到限制。请点击右上角的「…」选择「在浏览器中打开」，用Safari或Chrome打开。直接在应用内浏览器中长按显示的图片也可以保存。'],
      ['需要自己编辑模板图片吗？', '不需要，也不用图片编辑软件。填好内容、选好主题，就会自动生成带英雄和段位图标的卡片。'],
      ['不想公开召唤师名称怎么办？', '可以在召唤师名称栏下方选择「不公开」「一起玩时告诉你」「私信告诉你」「熟了再告诉你」等固定文案。'],
      ['段位会自动获取吗？', '目前需要自己选择。未定级或不想公开段位的人也可以直接使用。'],
      ['输入的内容会被发送到哪里吗？', '输入的内容和上传的图片只会在你的浏览器中处理和保存，不会发送到运营者的服务器。'],
      ['之后还能修改吗？', '输入内容会自动保存在浏览器中，下次打开可以接着编辑。如果清除了浏览器数据，或在其他设备、其他浏览器中打开，则不会保留。'],
      ['做好的图片可以随便用吗？', '可以自由用于X、Discord、直播画面、Twitch面板等。但不能出售制作的图片或其中包含的LoL素材。详情请见使用条款。'],
      ['可以去掉图片右下角的网址吗？', '取消勾选设计栏下方的「在卡片右下角加入网站网址」即可去掉。如果能保留的话，会帮网站被更多人知道，我会非常开心。'],
      ['发现了问题 / 想要某个功能', '欢迎通过X（@hotaka_1123）联系。'],
    ],
  },

  guide: {
    title: '召唤师卡片制作方法・使用指南｜SUMMONER CARD',
    description: '按项目详细讲解LoL召唤师卡片（自我介绍卡）的制作方法：位置的4级显示、从皮肤原画裁剪头像、调整背景，以及在手机上保存的方法。',
    h1: '召唤师卡片的制作方法・使用方法',
    body: `
      <p>SUMMONER CARD 是一个只用浏览器就能制作英雄联盟自我介绍卡「召唤师卡片」的免费工具。下面按顺序说明每个项目的填写方法和做出好看卡片的小技巧。</p>

      <nav class="toc" aria-label="目录">
        <p>目录</p>
        <ol>
          <li><a href="#basic">基本信息（名称・头像）</a></li>
          <li><a href="#rank">段位</a></li>
          <li><a href="#role">位置</a></li>
          <li><a href="#champs">拿手英雄</a></li>
          <li><a href="#tags">游戏风格</a></li>
          <li><a href="#contact">游戏时间・联系方式</a></li>
          <li><a href="#comment">一句话</a></li>
          <li><a href="#design">设计（主题・背景）</a></li>
          <li><a href="#save">保存・分享</a></li>
          <li><a href="#tips">找队友时更有效的卡片技巧</a></li>
        </ol>
      </nav>

      <section id="basic">
        <h2>1. 基本信息（名称・头像）</h2>
        <h3>召唤师名称和标签</h3>
        <p>输入 Riot ID 的名称部分和标签（#后面的部分）。卡片上会在名称旁边以小字显示，例如「#TW2」。</p>
        <p>不想显示名称时，点击输入框下方的<strong>「不公开」「一起玩时告诉你」「私信告诉你」「熟了再告诉你」</strong>按钮，就会用这句话代替名称显示。</p>
        <h3>等级</h3>
        <p>输入召唤师等级后，会在头像下方显示「Lv.○○」。留空则不显示。</p>
        <h3>头像</h3>
        <p>在「选择头像」中可以用以下3种方式设置：</p>
        <ul>
          <li><strong>召唤师头像</strong>：从游戏内约5,000种头像中选择。可以用「阿狸」「K/DA」「魄罗」等名称搜索。</li>
          <li><strong>英雄</strong>：使用英雄的头像。</li>
          <li><strong>上传图片</strong>：可以使用任意图片。上传后会打开裁剪画面，拖动和缩放选择想用的部分即可。</li>
        </ul>
        <p>头像形状可以选择「圆形」或「方形」。</p>
      </section>

      <section id="rank">
        <h2>2. 段位</h2>
        <p>选择段位（坚韧黑铁～最强王者）和小段（I～IV），就会显示段位徽章。超凡大师及以上没有小段。不想显示段位的话，保持「未定级」即可。</p>
      </section>

      <section id="role">
        <h2>3. 位置</h2>
        <p>上单（TOP）、打野（JG）、中单（MID）、下路（ADC）、辅助（SUP）都可以分别设置4个等级的「能玩程度」。</p>
        <table class="doc-table">
          <thead><tr><th>按钮</th><th>卡片上的显示</th><th>含义</th></tr></thead>
          <tbody>
            <tr><td>主玩</td><td>MAIN（突出显示）</td><td>最拿手的位置，只能选一个</td></tr>
            <tr><td>副玩</td><td>SUB</td><td>排位也能玩的位置</td></tr>
            <tr><td>匹配可</td><td>匹配</td><td>匹配模式可以玩的位置</td></tr>
            <tr><td>不行</td><td>NG（红色・斜线）</td><td>不会玩的位置</td></tr>
          </tbody>
        </table>
        <p>再按一次已选中的按钮即可取消。</p>
      </section>

      <section id="champs">
        <h2>4. 拿手英雄</h2>
        <p>点击「+ 添加」最多可选5个英雄。先在英雄选择画面上方选好位置再点击，就会<strong>带着该位置的图标</strong>登记。同一个英雄也可以用不同位置登记（例如拉克丝同时作为辅助和中单占2格）。</p>
        <ul>
          <li><strong>皮肤原画</strong>：点击各英雄的「皮肤原画」按钮选择喜欢的皮肤，可以从原画中裁剪喜欢的部分做成头像。点「还原」可恢复默认头像。</li>
          <li><strong>标题</strong>：可以在「拿手英雄」和「喜欢的英雄」之间切换。</li>
          <li><strong>排序</strong>：「←」向左移动，「×」删除。</li>
        </ul>
      </section>

      <section id="tags">
        <h2>5. 游戏风格</h2>
        <p>可以从娱乐玩家、冲分玩家、大乱斗、可以语音、找双排等标签中最多选6个。列表里没有的，可以用「+ 自己添加」自由创建（最多12个字）。</p>
      </section>

      <section id="contact">
        <h2>6. 游戏时间・联系方式</h2>
        <p>可以填写游戏时间、Discord、X、Twitch、YouTube。只有填写的项目会显示在名称下方，项目较多时会自动排成两列。</p>
      </section>

      <section id="comment">
        <h2>7. 一句话</h2>
        <p>最多80个字，显示在卡片下方。也可以换行（最多2行）。</p>
      </section>

      <section id="design">
        <h2>8. 设计（主题・背景）</h2>
        <h3>主题</h3>
        <p>可以从15种以上中选择。预览请看<a href="/templates/">模板一览</a>。</p>
        <h3>背景</h3>
        <ul>
          <li><strong>从皮肤中选择</strong>：选择英雄和皮肤后，该原画就会成为背景。</li>
          <li><strong>上传自己的图片</strong>：可以用任意图片做背景（上传时可以裁剪）。</li>
          <li><strong>位置・缩放・暗度</strong>：可以用滑块调整。也可以直接拖动预览卡片，或用鼠标滚轮缩放。</li>
        </ul>
        <p>文字看不清时，调高「背景暗度」就会清楚很多。</p>
      </section>

      <section id="save">
        <h2>9. 保存・分享</h2>
        <ul>
          <li><strong>保存图片</strong>：下载为PNG图片。在iPhone上图片会放大显示，长按后选择「存储到相册」。</li>
          <li><strong>复制图片</strong>：在电脑上可以直接粘贴（Ctrl+V）到X或Discord的输入框。</li>
          <li><strong>分享到X</strong>：在手机上可以通过分享菜单连同图片一起发送。在电脑上会先复制图片，再打开X的发帖页面。</li>
          <li><strong>宣传横幅</strong>：也可以制作带有你的卡片的横幅。详情请看<a href="/banner/">宣传横幅</a>。</li>
        </ul>
        <p>输入内容会自动保存在浏览器中。各项目的「清除」只清除该项目，页面底部的「全部重置」会清除全部内容。</p>
        <p class="note">在X等应用内浏览器中可能无法正常保存。请点击右上角的「…」选择「在浏览器中打开」。</p>
      </section>

      <section id="tips">
        <h2>10. 找队友时更有效的卡片技巧</h2>
        <ul>
          <li><strong>游戏时间写具体</strong>：比起「晚上」，「工作日22点～1点」更容易让人判断能不能一起玩。</li>
          <li><strong>位置连「NG」也写上</strong>：知道你不玩的位置，更容易找到双排或五排的队友。</li>
          <li><strong>用标签写清楚需求</strong>：加上「找双排」「找五排」「欢迎新手」等，目的相同的人就会来找你。</li>
          <li><strong>发帖时加上话题标签</strong>：在X上加上「#英雄联盟」「#召唤师卡片」更容易被找到。</li>
        </ul>
      </section>`,
  },

  banner: {
    title: '宣传横幅（欢迎自由使用）｜SUMMONER CARD',
    description: 'SUMMONER CARD的宣传横幅素材。可以自由放在直播画面、Twitch面板、YouTube、博客或个人网站上。也可以制作带有你自己卡片的横幅。',
    h1: '宣传横幅（欢迎自由使用）',
    body: `
      <p>这些横幅是为愿意介绍 SUMMONER CARD 的朋友准备的。可以<strong>无需联系、自由地</strong>放在直播画面、Twitch面板、YouTube简介、博客或个人网站等地方。能加链接的地方，如果能链接到 <code>${HOME}</code> 会非常感谢。</p>
      <p class="thanks">不需要联系我，不过用了的话在 ${X} 说一声我会超开心 🙏 让我去看看你的直播或文章吧！</p>

      <section>
        <h2>制作带有自己卡片的横幅</h2>
        <p>在卡片制作页面点击「🎨 用你的卡片制作宣传横幅」，就能生成使用你所做卡片的横幅（1800×600）。也可以用作Twitch面板图片或X头图。梦幻主题的卡片会生成粉彩版横幅。</p>
      </section>

      <section>
        <h2>可下载的横幅（全部主题）</h2>
        <p>点击图片会以原尺寸（1800×600）打开，请在那里保存。</p>
        <!--BANNERS-->
      </section>

      <section>
        <h2>使用方法</h2>
        <h3>博客・个人网站</h3>
        <p>请直接粘贴以下HTML。</p>
        <pre class="embed-code" id="embed-code">&lt;a href="${HOME}" target="_blank" rel="noopener"&gt;&lt;img src="https://summonercard.com${IMG}/banner.jpg" alt="SUMMONER CARD｜召唤师卡片生成器" width="600" height="200"&gt;&lt;/a&gt;</pre>
        <button type="button" class="btn ghost small" data-copy-target="embed-code">复制HTML</button>
        <p>使用其他主题时，请把 <code>banner.jpg</code> 改成上面图片的文件名（例如 <code>banner-halloween.jpg</code>）。</p>
        <h3>Twitch面板</h3>
        <p>在频道的「关于」→「编辑面板」中上传横幅作为图片，并在「图片链接」中填入 <code>${HOME}</code>。</p>
        <h3>用文字介绍时</h3>
        <pre class="embed-code" id="text-code">LoL召唤师卡片可以在这里制作👉 ${HOME}</pre>
        <button type="button" class="btn ghost small" data-copy-target="text-code">复制文字</button>
      </section>

      <section>
        <h2>使用须知</h2>
        <ul>
          <li>可以自由调整大小或裁剪。</li>
          <li>请勿出售横幅本身，或以看起来像 SUMMONER CARD 官方的方式使用。</li>
          <li>横幅中包含LoL素材。关于 Riot Games 的权利，请参阅<a href="/terms/">使用条款</a>。</li>
        </ul>
      </section>`,
  },

  privacy: {
    title: '隐私政策｜SUMMONER CARD',
    description: 'SUMMONER CARD（召唤师卡片生成器）的隐私政策：关于输入内容的处理、访问分析和外部服务。',
    h1: '隐私政策',
    body: `
      <p>SUMMONER CARD（以下简称「本网站」）按以下方式处理用户信息。</p>

      <section>
        <h2>1. 输入内容・图片的处理</h2>
        <p>在卡片中输入的内容（召唤师名称、联系方式等）和上传的图片只会在你的浏览器中处理，不会发送或保存到运营者的服务器。</p>
        <p>为了下次可以接着编辑，输入内容会保存在浏览器的存储空间（localStorage）中。这些信息只存在于你的设备中，删除浏览器的网站数据或点击工具中的「全部重置」后即会清除。</p>
      </section>

      <section>
        <h2>2. 访问分析工具</h2>
        <p>本网站为了改进网站，使用 Google LLC 的访问分析工具「Google Analytics」。Google Analytics 使用 Cookie 收集页面浏览量、来源、使用设备以及本网站功能的使用次数（图片保存次数、所选主题等）。这些数据以匿名方式统计，不会识别个人身份。卡片中输入的文字和图片本身不会被发送。</p>
        <p>你可以通过在浏览器设置中禁用 Cookie，或使用 <a href="https://tools.google.com/dlpage/gaoptout?hl=zh-CN" target="_blank" rel="noopener">Google Analytics 停用浏览器插件</a>来拒绝数据收集。关于 Google 如何处理数据，请参阅 <a href="https://policies.google.com/technologies/partner-sites?hl=zh-CN" target="_blank" rel="noopener">Google 隐私权和条款</a>。</p>
      </section>

      <section>
        <h2>3. 关于广告</h2>
        <p>为了支付运营费用，本网站使用第三方广告服务「Google AdSense」。包括 Google 在内的广告供应商会使用 Cookie，根据您过去访问本网站及其他网站的信息展示广告。您可以在 Google 的<a href="https://adssettings.google.com/" target="_blank" rel="noopener">广告设置</a>中关闭个性化广告，也可以在 <a href="https://www.aboutads.info/" target="_blank" rel="noopener">www.aboutads.info</a> 拒绝第三方供应商的 Cookie。</p>
      </section>

      <section>
        <h2>4. 外部服务的使用</h2>
        <p>为了显示内容，本网站会从以下外部服务读取数据。读取时，你设备的IP地址等连接信息会被发送到各服务。</p>
        <ul>
          <li>Riot Games「Data Dragon」（英雄・头像・皮肤图片）</li>
          <li>Community Dragon（段位徽章・位置图标・召唤师头像图片）</li>
          <li>Google Fonts（网页字体）</li>
          <li>GitHub Pages（本网站的托管）</li>
        </ul>
      </section>

      <section>
        <h2>5. 免责声明</h2>
        <p>对于因使用本网站而产生的损失，运营者不承担责任。详情请参阅<a href="/terms/">使用条款</a>。</p>
      </section>

      <section>
        <h2>6. 联系方式</h2>
        <p>关于本政策的咨询，请通过 ${X} 联系。</p>
      </section>

      <section>
        <h2>7. 修订</h2>
        <p>本政策可能会根据需要在不事先通知的情况下修订。修订后的内容自在本页面发布之时起生效。</p>
        <p class="note">制定日期：${UPDATED}</p>
      </section>`,
  },

  terms: {
    title: '使用条款・免责声明｜SUMMONER CARD',
    description: 'SUMMONER CARD（召唤师卡片生成器）的使用条款和免责声明：制作图片的使用范围、禁止事项以及 Riot Games 的权利。',
    h1: '使用条款・免责声明',
    body: `
      <p>本使用条款（以下简称「本条款」）规定了 SUMMONER CARD（以下简称「本网站」）的使用条件。使用本网站即视为同意本条款。</p>

      <section>
        <h2>1. 服务内容</h2>
        <p>本网站是一个可以制作英雄联盟自我介绍卡（召唤师卡片）图片的免费网页工具，无需注册会员。</p>
      </section>

      <section>
        <h2>2. 制作图片的使用</h2>
        <ul>
          <li>制作的图片可以<strong>在个人活动范围内自由</strong>使用，例如发布到社交媒体（X、Discord、Instagram 等）、个人资料、直播画面、Twitch面板、博客等。在已开通收益的直播或频道中使用也没有问题。</li>
          <li><strong>不得出售或有偿分发</strong>制作的图片本身或其中包含的游戏素材。</li>
          <li>图片右下角的网站名称・网址可以在设置中隐藏。</li>
        </ul>
      </section>

      <section>
        <h2>3. 关于 Riot Games 的权利</h2>
        <p>卡片上显示的英雄、皮肤、头像、段位徽章等图片的权利归 Riot Games, Inc. 所有。本网站是依据 Riot Games「<a href="https://www.riotgames.com/en/legal" target="_blank" rel="noopener">Legal Jibber Jabber</a>」制作的粉丝内容，并非 Riot Games 认可或赞助。</p>
        <p class="legal">${LEGAL}</p>
      </section>

      <section>
        <h2>4. 关于上传的图片</h2>
        <p>用作头像或背景上传的图片，仅限用户本人拥有使用权的图片。上传的图片只会在你的浏览器中处理，不会发送到运营者的服务器。</p>
      </section>

      <section>
        <h2>5. 禁止事项</h2>
        <ul>
          <li>制作或公开冒充他人的卡片，或擅自使用他人名称・账号的卡片</li>
          <li>制作或公开含有诽谤他人、歧视或淫秽内容的卡片</li>
          <li>侵犯第三方著作权、肖像权等权利的行为</li>
          <li>妨碍本网站运营的行为，或冒充本网站官方的行为</li>
          <li>其他违反法律法规或公序良俗的行为</li>
        </ul>
      </section>

      <section>
        <h2>6. 免责声明</h2>
        <ul>
          <li>本网站按现状提供，不保证显示内容的准确性、在所有设备・浏览器上的运行以及持续提供。</li>
          <li>保存在浏览器中的输入内容可能会因浏览器设置或操作而丢失。</li>
          <li>对于因使用本网站或使用所制作的图片而产生的纠纷或损失，运营者不承担责任。</li>
          <li>本网站可能会在不事先通知的情况下变更内容、中断或终止服务。</li>
        </ul>
      </section>

      <section>
        <h2>7. 条款的变更</h2>
        <p>本条款可能会根据需要在不事先通知的情况下变更。变更后的条款自在本页面发布之时起生效。</p>
        <p class="note">制定日期：${UPDATED}</p>
      </section>`,
  },

  about: {
    title: '关于・联系｜SUMMONER CARD',
    description: 'SUMMONER CARD（召唤师卡片生成器）的运营者信息、联系方式以及使用的素材。',
    h1: '关于・联系',
    body: `
      <section>
        <h2>关于 SUMMONER CARD</h2>
        <p>SUMMONER CARD 是一个个人运营的免费工具，目的是让英雄联盟玩家能轻松制作用于找队友和自我介绍的「召唤师卡片」。目标是不用编辑模板图片，只要填写内容就能做出卡片。</p>
      </section>

      <section>
        <h2>运营者</h2>
        <table class="doc-table">
          <tbody>
            <tr><th>网站名称</th><td>SUMMONER CARD（召唤师卡片生成器）</td></tr>
            <tr><th>网址</th><td><a href="/">${HOME}</a></td></tr>
            <tr><th>运营者</th><td>hotaka（个人）</td></tr>
            <tr><th>联系方式</th><td>${X}</td></tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>联系</h2>
        <p>问题反馈、功能建议、有关内容的联络等，欢迎通过 ${X} 的私信或回复随时联系。运营者在日本，但也欢迎用中文留言（我会翻译后阅读）。如果是问题反馈，请附上你使用的设备・浏览器（例如 iPhone 的 Safari、X应用内等）以及在什么操作时发生，这会很有帮助。</p>
      </section>

      <section>
        <h2>使用的素材</h2>
        <ul>
          <li>英雄・皮肤・头像图片：Riot Games「Data Dragon」</li>
          <li>段位徽章・位置图标・召唤师头像：<a href="https://www.communitydragon.org/" target="_blank" rel="noopener">Community Dragon</a></li>
          <li>字体：Google Fonts（M PLUS 1p、M PLUS Rounded 1c、Cinzel、Dancing Script、Noto Sans SC）</li>
        </ul>
        <p class="legal">${LEGAL}</p>
      </section>`,
  },
});
