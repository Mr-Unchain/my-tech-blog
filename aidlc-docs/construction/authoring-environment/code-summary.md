# Markdown 執筆への切替結果

記事の正本を `src/content/blog/*.md` に移し、共通の公開記事クエリでトップ・一覧・詳細・検索・カテゴリ・RSS・ブックマークを接続した。サイトマップも同じ記事検証境界を利用する。公開済み5記事を取り込み、ID と URL、日付、本文、リンク、画像参照を確認した。

既存 Unit 1 のスキーマ・検証・Repository は再利用し、Markdown と Astro が生成する HTML を扱うよう拡張した。新規の `src/lib/blogs.ts` は従来のページ向け Blog shape を提供する。プロフィール・プロジェクトは microCMS を維持する。

`npm run article:new -- article-id "タイトル"` で Git 管理外の下書きを作り、`npm run dev` で表示する。開発サーバーは localhost に限定する。下書きは本番コレクション・Vercel アップロードから除外し、全公開クエリでも除外する。

旧 CMS 削除 Webhook / cleanup API は、Markdown 記事に対応する Firebase データを誤って削除しないよう410にした。記事表示の閲覧数更新は本番だけで行い、更新失敗で記事表示を止めない。

初回切替後に本文画像の中間HTML参照とCMS設定欠落を修正した。記事画像16点は `public/images/articles/` に保存し、記事本文を正規の `render()` / `Content` で描画する。単独行のSpotifyリンクは公式プレイヤー、一般URLはビルド時OGPカードに変換する。プロフィール・ポートフォリオのDevelopment用設定をGit管理外へ復元し、取得失敗時のnull参照も処理した。

テスト67件・ブラウザー5シナリオ・型検査・Lint・本番ビルド・開発/本番HTTP確認が成功。詳細は `aidlc-docs/construction/plans/markdown-assets-previews-plan.md` に記録。既存依存の脆弱性修正と本番デプロイは未実施。プロフィール・プロジェクトの画像は引き続きmicroCMSを参照する。
