// Generates the static subpages (guide, templates, banner, FAQ, privacy, terms, about) in every
// language from one shared layout, the tool page copies for other languages, and sitemap.xml.
// Page texts live in tools/pages/<lang>.mjs.
// Run with: node tools/build-pages.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ja from './pages/ja.mjs';
import en from './pages/en.mjs';
import ko from './pages/ko.mjs';
import zhCn from './pages/zh-cn.mjs';
import zhTw from './pages/zh-tw.mjs';
import { THEMES } from '../js/data.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://summonercard.com';
const UPDATED = '2026-10-30';

const LEGAL = 'SUMMONER CARD isn\'t endorsed by Riot Games and doesn\'t reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.';

// prefix: URL folder ('' = Japanese at the root). cjk: extra Google Font for Hangul / Chinese.
const LANGS = [
  { prefix: '', hreflang: 'ja', label: '日本語', content: ja },
  { prefix: 'en', hreflang: 'en', label: 'English', content: en },
  { prefix: 'ko', hreflang: 'ko', label: '한국어', content: ko, cjk: 'Noto Sans KR' },
  { prefix: 'zh-cn', hreflang: 'zh-Hans', label: '简体中文', content: zhCn, cjk: 'Noto Sans SC' },
  { prefix: 'zh-tw', hreflang: 'zh-Hant', label: '繁體中文', content: zhTw, cjk: 'Noto Sans TC' },
];

// Seasonal themes stay hidden on the pages until their release date; js/page.js reveals them.
const RELEASE = Object.fromEntries(THEMES.filter((t) => t.from).map((t) => [t.id, t.from]));
const gate = (id) => (RELEASE[id] ? ` data-from="${RELEASE[id]}" hidden` : '');

const SLUGS = ['guide', 'templates', 'banner', 'faq', 'privacy', 'terms', 'about'];
const base = (lang) => (lang.prefix ? `/${lang.prefix}` : '');
const pageUrl = (lang, slug) => `${SITE}${base(lang)}/${slug ? `${slug}/` : ''}`;
const ogImage = (lang) => `${SITE}/og${lang.prefix ? `-${lang.prefix}` : ''}.jpg`;
const imgDir = (lang) => (lang.prefix ? `/img/${lang.prefix}` : '/img');

// Internal page links are written as Japanese paths; point them at the same language.
const PAGE_LINK = new RegExp(`href="/((?:${SLUGS.join('|')})/[^"]*)?(\\?[^"]*)?"`, 'g');
const localizeLinks = (html, lang) => html.replace(PAGE_LINK, (_, p = '', q = '') => `href="${base(lang)}/${p}${q}"`);

const fontsUrl = (lang) => `https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=M+PLUS+1p:wght@400;500;700;800${lang.cjk ? `&family=${lang.cjk.replace(/ /g, '+')}:wght@400;500;700;800` : ''}&display=swap`;

function header(lang, c, slug) {
  const nav = [['', c.nav.make], ['guide', c.nav.guide], ['templates', c.nav.templates], ['banner', c.nav.banner], ['faq', c.nav.faq]]
    .map(([s, label]) => `<a href="/${s ? `${s}/` : ''}"${s === slug ? ' aria-current="page"' : ''}>${label}</a>`).join('');
  const options = LANGS.map((l) => `<option value="${pageUrl(l, slug).replace(SITE, '')}" data-lang="${l.content === ja ? 'ja' : l.hreflang.replace('zh-Hans', 'zh-CN').replace('zh-Hant', 'zh-TW')}"${l === lang ? ' selected' : ''}>${l.label}</option>`).join('');
  return `<header class="site-header">
    <select class="lang-select" id="lang-pages" aria-label="Language">${options}</select>
    <a class="logo" href="/">SUMMONER CARD <span>${c.siteSub}</span></a>
    <nav class="site-nav" aria-label="${c.aria.menu}">${nav}</nav>
  </header>`;
}

function footer(c) {
  const f = c.footerNav;
  const links = [['guide', f.guide], ['templates', f.templates], ['banner', f.banner], ['faq', f.faq], ['about', f.about], ['privacy', f.privacy], ['terms', f.terms]]
    .map(([s, label]) => `<a href="/${s}/">${label}</a>`).join('');
  return `<footer class="site-footer">
    <nav class="footer-nav" aria-label="${c.aria.siteInfo}">${links}</nav>
    <p>${c.footer.storage}</p>
    <p>${c.footer.contact}</p>
    <p id="analytics-notice" hidden>${c.footer.analytics}</p>
    <p class="legal">${LEGAL}</p>
    <p class="legal">© 2026 SUMMONER CARD</p>
  </footer>`;
}

function layout(lang, c, slug, { title, description, h1, body, jsonld = [] }) {
  const url = pageUrl(lang, slug);
  const crumbs = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'SUMMONER CARD', item: pageUrl(lang, '') },
      { '@type': 'ListItem', position: 2, name: h1, item: url },
    ],
  };
  const ld = JSON.stringify({ '@context': 'https://schema.org', '@graph': [crumbs, ...jsonld] }, null, 2);
  const alternates = [...LANGS.map((l) => `  <link rel="alternate" hreflang="${l.hreflang}" href="${pageUrl(l, slug)}">`),
    `  <link rel="alternate" hreflang="x-default" href="${pageUrl(LANGS[0], slug)}">`].join('\n');
  const fonts = fontsUrl(lang);
  const htmlAttrs = lang.cjk ? ` style="--font-cjk: '${lang.cjk}'"` : '';
  const html = `<!doctype html>
<html lang="${c.htmlLang}"${htmlAttrs}>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script>
    if (location.protocol === 'http:' && location.hostname !== 'localhost') location.replace(\`https://\${location.host}\${location.pathname}\${location.search}\${location.hash}\`);
  </script>
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${url}">
${alternates}
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${ogImage(lang)}">
  <meta property="og:site_name" content="SUMMONER CARD">
  <meta property="og:locale" content="${c.locale}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="theme-color" content="#c8aa6e">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" as="style" href="${fonts}" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="${fonts}"></noscript>
  <link rel="stylesheet" href="/css/style.css">
  <script type="application/ld+json">
${ld}
  </script>
</head>
<body class="subpage" data-copied="${c.copied}" data-copy-failed="${c.copyFailed}">
  ${header(lang, c, slug)}

  <main class="doc">
    <nav class="breadcrumbs" aria-label="${c.aria.breadcrumbs}"><a href="/">${c.top}</a> › <span>${h1}</span></nav>
    <article class="guide">
      <h1>${h1}</h1>
${body.trim()}
      <p class="cta"><a class="btn primary" href="/">${c.cta}</a></p>
    </article>
  </main>

  ${footer(c)}

  <div class="toast" id="toast" role="status" aria-live="polite"></div>
  <script type="module" src="/js/page.js"></script>
</body>
</html>
`;
  return localizeLinks(html, lang);
}

function pagesFor(lang, c) {
  const IMG = imgDir(lang);
  const note = (body) => (c.translationNote ? `<p class="note translation-note">${c.translationNote}</p>\n${body}` : body);
  return {
    guide: c.guide,
    templates: {
      ...c.templates,
      body: `${c.templates.intro}
      <div class="theme-list">
${c.themes.map(([id, name, text]) => `        <section class="theme-item"${gate(id)}>
          <h2>${name}</h2>
          <img src="${IMG}/theme-${id}.jpg" width="600" height="338" loading="lazy" alt="${c.templates.alt(name)}">
          <p>${text}</p>
          <a class="btn small" href="/?theme=${id}">${c.templates.button}</a>
        </section>`).join('\n')}
      </div>`,
    },
    banner: {
      ...c.banner,
      body: c.banner.body.replace('<!--BANNERS-->', `<div class="gallery banners">
${c.themes.map(([id, name]) => `          <figure${gate(id)}><a href="${IMG}/banner-${id}.jpg" target="_blank" rel="noopener"><img src="${IMG}/banner-${id}.jpg" width="1800" height="600" loading="lazy" alt="SUMMONER CARD banner: ${name}"></a><figcaption>${name}</figcaption></figure>`).join('\n')}
        </div>`),
    },
    faq: {
      ...c.faq,
      body: `
      <dl class="faq">
${c.faq.items.map(([q, a]) => `        <dt>${q}</dt>\n        <dd>${a}</dd>`).join('\n')}
      </dl>`,
      jsonld: [{
        '@type': 'FAQPage',
        mainEntity: c.faq.items.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
      }],
    },
    privacy: { ...c.privacy, body: note(c.privacy.body) },
    terms: { ...c.terms, body: note(c.terms.body) },
    about: c.about,
  };
}

const sitemap = [];
for (const lang of LANGS) {
  const c = lang.content({ UPDATED, LEGAL, IMG: imgDir(lang), HOME: pageUrl(lang, '') });
  const pages = pagesFor(lang, c);
  for (const slug of SLUGS) {
    const dir = path.join(ROOT, lang.prefix, slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), layout(lang, c, slug, pages[slug]));
    sitemap.push({ loc: pageUrl(lang, slug) });
  }
  console.log('wrote', `${lang.prefix || '(ja)'}: ${SLUGS.join(', ')}`);
}

// ---------- Tool page in other languages ----------
// Copies of the top page with translated meta tags and a preview card in that language.
// The page text itself is translated in the browser by js/i18n.js.

const LANG_PAGES = [
  {
    slug: 'en', lang: 'en', locale: 'en_US',
    title: 'Summoner Card Maker | Free LoL Profile Card Generator - SUMMONER CARD',
    description: 'Make a League of Legends summoner card (profile card) for free. Pick your rank, roles, main champions and a skin background and the image is ready. No sign-up, works on phones. Great for finding duo partners on X and Discord.',
    ogTitle: 'Summoner Card Maker | Free LoL profile cards',
    ogDescription: 'Add your rank, roles and main champs to make a LoL profile card for free.',
    alt: 'Example LoL profile card made with SUMMONER CARD',
    name: 'SUMMONER CARD (Summoner Card Maker)',
    appDescription: 'A free web app for making League of Legends summoner cards (profile cards).',
  },
  {
    slug: 'ko', lang: 'ko', locale: 'ko_KR',
    title: '서머너 카드 메이커 | 롤 자기소개 카드 무료 제작 - SUMMONER CARD',
    description: '리그 오브 레전드(롤) 서머너 카드・자기소개 카드를 무료로 만들 수 있는 생성기. 랭크・포지션・주력 챔피언・스킨 배경만 고르면 이미지 완성. 가입 없이 휴대폰에서도 OK. 듀오 구하기나 디스코드 자기소개에.',
    ogTitle: '서머너 카드 메이커 | 롤 자기소개 카드 무료 제작',
    ogDescription: '랭크・포지션・주력 챔피언을 넣어서 롤 자기소개 카드를 무료로 만들어 보세요.',
    alt: 'SUMMONER CARD로 만든 롤 자기소개 카드 예시',
    name: 'SUMMONER CARD (서머너 카드 메이커)',
    appDescription: '리그 오브 레전드 서머너 카드・자기소개 카드를 무료로 만들 수 있는 웹 앱.',
  },
  {
    slug: 'zh-cn', lang: 'zh-CN', locale: 'zh_CN',
    title: '召唤师卡片生成器｜免费制作LoL自我介绍卡 - SUMMONER CARD',
    description: '免费制作英雄联盟（LoL）召唤师卡片・自我介绍卡。只要选择段位、位置、拿手英雄和皮肤背景，图片就完成了。无需注册，手机也能用。适合找队友开黑或在Discord自我介绍。',
    ogTitle: '召唤师卡片生成器｜免费制作LoL自我介绍卡',
    ogDescription: '填入段位、位置和拿手英雄，免费制作LoL自我介绍卡。',
    alt: '用SUMMONER CARD制作的LoL自我介绍卡示例',
    name: 'SUMMONER CARD（召唤师卡片生成器）',
    appDescription: '免费制作英雄联盟召唤师卡片・自我介绍卡的网页应用。',
  },
  {
    slug: 'zh-tw', lang: 'zh-TW', locale: 'zh_TW',
    title: '召喚師卡片產生器｜免費製作LoL自我介紹卡 - SUMMONER CARD',
    description: '免費製作英雄聯盟（LoL）召喚師卡片・自我介紹卡。只要選擇牌位、位置、拿手英雄和造型背景，圖片就完成了。不用註冊，手機也能用。適合找雙排隊友或在Discord自我介紹。',
    ogTitle: '召喚師卡片產生器｜免費製作LoL自我介紹卡',
    ogDescription: '填入牌位、位置和拿手英雄，免費製作LoL自我介紹卡。',
    alt: '用SUMMONER CARD製作的LoL自我介紹卡範例',
    name: 'SUMMONER CARD（召喚師卡片產生器）',
    appDescription: '免費製作英雄聯盟召喚師卡片・自我介紹卡的網頁應用。',
  },
];

const top = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const attr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
for (const p of LANG_PAGES) {
  let html = top;
  const set = (pattern, value) => {
    if (!pattern.test(html)) throw new Error(`index.html: ${pattern} not found`);
    html = html.replace(pattern, value);
  };
  set(/<html lang="ja">/, `<html lang="${p.lang}">`);
  set(/<title>.*<\/title>/, `<title>${p.title}</title>`);
  set(/(<meta name="description" content=")[^"]*/, `$1${attr(p.description)}`);
  set(/(<link rel="canonical" href=")[^"]*/, `$1${SITE}/${p.slug}/`);
  set(/(<meta property="og:title" content=")[^"]*/, `$1${attr(p.ogTitle)}`);
  set(/(<meta property="og:description" content=")[^"]*/, `$1${attr(p.ogDescription)}`);
  set(/(<meta property="og:url" content=")[^"]*/, `$1${SITE}/${p.slug}/`);
  set(/(<meta property="og:image" content=")[^"]*/, `$1${SITE}/og-${p.slug}.jpg`);
  set(/(<meta property="og:image:alt" content=")[^"]*/, `$1${attr(p.alt)}`);
  set(/(<meta property="og:locale" content=")[^"]*/, `$1${p.locale}`);
  set(/(<meta name="twitter:title" content=")[^"]*/, `$1${attr(p.ogTitle)}`);
  set(/(<meta name="twitter:description" content=")[^"]*/, `$1${attr(p.ogDescription)}`);
  set(/(<meta name="twitter:image" content=")[^"]*/, `$1${SITE}/og-${p.slug}.jpg`);
  set(/(<meta name="twitter:image:alt" content=")[^"]*/, `$1${attr(p.alt)}`);
  set(/"name": "SUMMONER CARD（サモナーカード作成メーカー）",\n\s*"alternateName": \[[^\]]*\],/, `"name": ${JSON.stringify(p.name)},`);
  set(/("url": ")https:\/\/summonercard\.com\/(",)/, `$1${SITE}/${p.slug}/$2`);
  set(/("description": ")[^"]*(",\n\s*"applicationCategory")/, `$1${p.appDescription}$2`);
  set(/"inLanguage": "ja"/, `"inLanguage": "${p.lang}"`);
  set(/"image": "https:\/\/summonercard\.com\/og\.jpg"/, `"image": "${SITE}/og-${p.slug}.jpg"`);
  // Static links on the tool page point at the same language's pages.
  html = localizeLinks(html, LANGS.find((l) => l.prefix === p.slug));
  const dir = path.join(ROOT, p.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  console.log('wrote', `${p.slug}/index.html`);
}

// ---------- Sitemap ----------

const topImages = (lang) => {
  const dir = imgDir(lang).slice(1);
  const themes = ja({ UPDATED, LEGAL, IMG: '', HOME: '' }).themes.map(([id]) => `${dir}/theme-${id}.jpg`);
  return [ogImage(lang).replace(`${SITE}/`, ''), `${dir}/banner.jpg`, `${dir}/banner-pastel.jpg`, ...themes];
};
const urls = [
  ...LANGS.map((lang) => `  <url>
    <loc>${pageUrl(lang, '')}</loc>
    <lastmod>${UPDATED}</lastmod>
${topImages(lang).map((i) => `    <image:image><image:loc>${SITE}/${i}</image:loc></image:image>`).join('\n')}
  </url>`),
  ...sitemap.map(({ loc }) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${UPDATED}</lastmod>
  </url>`),
];
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.join('\n')}
</urlset>
`);
console.log('wrote sitemap.xml');
