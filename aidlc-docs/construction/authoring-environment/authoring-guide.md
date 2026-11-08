# Markdown で記事を書く

## 下書きからローカルプレビューまで

```sh
npm run article:new -- my-article "記事タイトル"
npm run dev
```

`src/content/drafts/my-article.md` を Obsidian / VS Code などで編集し、`http://localhost:4321/blog/my-article/` で確認する。保存後は開発サーバーに反映される。下書き一覧は `/drafts`。

`npm run dev` だけでプレビューでき、ローカルでのデプロイは不要。プレビューは本番の閲覧数を更新しない。CMS の認証情報がなくても記事を表示できる（プロフィール・プロジェクトの取得は引き続き microCMS）。

## 公開する

1. 本文・タイトル・概要・カテゴリを仕上げる。
2. `publishedAt: "2026-11-08T09:00:00+09:00"` のような公開日を入れる。必要なら `updatedAt` を入れる。
3. `eyecatch` は `/placeholder.svg`、`public/` の画像への `/images/example.png`、または HTTPS URL を指定する。
4. `draft: false` にし、ファイルを `src/content/blog/my-article.md` へ移す。ファイル名と `id` は一致させる。
5. `npm run validate:content` と `npm run build` を実行する。
6. 公開してよい記事だけを Git に追加し、PR・merge で Vercel の既存デプロイを動かす。

本文は通常の Markdown。コードフェンス、見出し、リンク、画像、表を使える。JSX / MDX は今回の執筆形式に含めない。

## 画像とリンクのプレビュー

公開する記事の画像は `public/images/articles/<記事ID>/` に保存する。frontmatter と本文からは `public` を付けず、ルートからのパスで参照する。

```yaml
eyecatch: "/images/articles/my-article/cover.png"
```

```markdown
![画面の説明](/images/articles/my-article/screenshot.png)

https://open.spotify.com/track/0Lr4kGOYn9l83EjuK6cZFQ

https://docs.astro.build/en/guides/markdown-content/
```

- 空行で区切った単独行の Spotify URL（`open.spotify.com` の曲・アルバム・プレイリスト・アーティスト・番組・エピソード）は公式プレイヤーとして表示する。
- その他の外部 HTTPS URL は OGP のタイトル・説明・画像を使ったカードにする。取得先の制限・通信失敗時は簡易カードへ戻す。
- 文章中の `[リンク](https://example.com)` は通常のインラインリンクとして残す。
- リンクプレビューは Markdown の同期・ビルド時に生成する。訪問者から任意URLを受け取ってサーバーが取得する API は追加しない。
- `public/` の画像は下書きフラグに関係なく公開される。未公開画像は Git 管理外の `src/content/drafts/images/` に置き、下書きから `./images/file.png` として参照する。公開時に画像も公開用ディレクトリへ移す。

## 下書きと公開リポジトリ

- `src/content/drafts/` は `.gitignore` と `.vercelignore` で除外し、本番の Content Collection にも含めない。
- 下書きは開発サーバーの詳細ページでだけ表示する。一覧・検索・RSS・サイトマップ・ブックマークには出さない。
- 公開フォルダーに `draft: true` を置いても本番の記事 URL では読めないが、GitHub に push すればソースは誰でも読める。
- 公開ブランチ・PR の内容と Git 履歴も公開される。機密・トークン・個人情報を入れず、下書きを `git add -f` しない。
- ローカル下書きは Git でバックアップされない。必要なら個人用の非公開バックアップを使う。

## 既存記事

公開済み5記事の本文と日付を維持し、記事のサムネイル5点・本文画像11点を `public/images/articles/` へコピーした。既存記事は microCMS の記事画像ホストへ接続せず表示できる。再インポート等で CMS 画像 URL が入った場合は `npm run articles:assets` で画像を取り込める（既存ファイルを異なる内容で上書きしない）。

旧 microCMS のブログ削除 Webhook と Firebase cleanup API は `410 Gone` にする。Vercel へ反映した後に microCMS 側の該当 Webhook 設定を解除する。プロフィール・プロジェクトの microCMS API は継続利用する。

## プロフィール・ポートフォリオの開発環境

これらのデータ取得には引き続き `VITE_MICROCMS_SERVICE_DOMAIN` と `MICROCMS_READ_API_KEY` が必要。Development 用の値を `.env.development.local` に置く。同ファイルは Git 管理外で、共有用ドキュメントやログに値を記載しない。

Vercel CLI のログインとリンク先を確認済みの場合は、`vercel env pull .env.development.local --environment=development` で取得できる。既存のローカル設定を上書きしないよう注意する。設定変更後は開発サーバーの自動再起動を待つか再起動する。
