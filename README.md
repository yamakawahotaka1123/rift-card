# SUMMONER CARD — サモナーカード作成メーカー

https://summonercard.com/

League of Legends の自己紹介カード（サモナーカード）をブラウザだけで作れる無料ツールです。

- サモナーネーム / タグ / レベル / アイコン（サモナーアイコン・チャンピオン・画像アップ＋トリミング）
- ランク、ロール4段階（メイン / サブ / ノマなら可 / NG）
- 得意チャンピオン最大5体（ロール付き、スキン画像からアイコン切り抜き）
- プレイスタイルタグ（自作も可）、活動時間、Discord / X / Twitch / YouTube
- テーマ8種、スキンや自分の画像を背景に（位置・拡大・暗さを調整）
- PNG保存 / コピー / Xシェア、宣伝バナー（1800×600）の生成

入力内容はブラウザの localStorage にだけ保存され、サーバーには送信されません。

## 構成

ビルド不要の静的サイト（HTML / CSS / ES Modules）を GitHub Pages で配信しています。カード画像は Canvas でブラウザ内で描画します。

| パス | 内容 |
|---|---|
| `index.html`, `js/app.js` | カード作成ツール本体 |
| `js/card.js`, `js/fairy.js` | カードの描画（ゆめかわ系テーマの飾りは `fairy.js`） |
| `js/banner.js` | 宣伝バナーの描画 |
| `js/cropper.js` | 画像のトリミング |
| `js/analytics.js` | Google Analytics（`GA_ID` が空の間はオフ） |
| `guide/` `templates/` `banner/` `faq/` `privacy/` `terms/` `about/` | 説明ページ（生成物） |
| `tools/build-pages.mjs` | 説明ページと `sitemap.xml` の生成スクリプト |

説明ページの文章を変えるときは `tools/build-pages.mjs` を編集して、次を実行してください。

```sh
node tools/build-pages.mjs
```

素材：Riot Games「Data Dragon」、[Community Dragon](https://www.communitydragon.org/)、Google Fonts

## ローカルで動かす

ES Modules を使うため `file://` では動きません。静的サーバーで開いてください。

```sh
npx serve .
```

## 免責

SUMMONER CARD isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.
