# SUMMONER CARD — LoL自己紹介カード作成

League of Legends の自己紹介カード（サモナーカード）をブラウザだけで作れるツールです。

- サモナーネーム / タグ / レベル / アイコン
- ランク（ティア・ディビジョン）
- ロール（メイン・サブ）
- 得意チャンピオン（最大5体）
- プレイスタイルタグ、活動時間、Discord / X
- テーマ6種 + 好きなスキンのスプラッシュアートを背景に
- PNG保存 / クリップボードにコピー / Xシェア（スマホは共有シートから画像ごと）

入力内容はブラウザの localStorage にだけ保存され、サーバーには送信されません。

## 仕組み

ビルド不要の静的サイト（HTML / CSS / ES Modules）です。カード画像は Canvas でブラウザ内で描画します。

- チャンピオン・アイコン・スプラッシュ: [Data Dragon](https://developer.riotgames.com/docs/lol#data-dragon)
- ランクエンブレム・ロールアイコン: [Community Dragon](https://www.communitydragon.org/)

## ローカルで動かす

ES Modules を使うため `file://` では動きません。適当な静的サーバーで開いてください。

```sh
npx serve .
```

## 免責

SUMMONER CARD isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.
