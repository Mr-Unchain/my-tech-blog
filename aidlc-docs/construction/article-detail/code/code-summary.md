# Code Summary - Unit 4: 記事詳細ページ（Article Detail）

## 概要
記事詳細ページ全体をCSS変数ベースのテーマ対応に移行。ダークテーマ固定のハードコード値を排除し、ライト/ダークの両テーマで適切に表示されるようにした。

## 変更ファイル一覧

### 修正ファイル（8件）

| ファイル | 変更内容 |
|---------|---------|
| `src/pages/blog/[id].astro` | メインレイアウト全体のCSS変数化（`<main>`, 記事コンテナ, アイキャッチ, プレビューバナー, コメントセクション, モバイルTOC, 関連記事見出し） |
| `src/styles/main.scss` | 記事本文タイポグラフィ（`.blog-article-content`, `.prose`, `.article-content`）、リアクション/シェアボタン群（`.bookmark-btn`, `.reaction-buttons`, `.share-buttons-container`, `.sticky-reaction-bar`, `.reading-progress-container`）、目次スタイル（`.toc-list`, `.toc-h2`, `.toc-h3`, `.toc-active`）のCSS変数化 |
| `src/components/Breadcrumb.astro` | `text-slate-*` → CSS変数（`--color-text-muted`, `--color-text-secondary`）、ホバーカラーを`--color-accent`に |
| `src/components/ArticleNavigation.astro` | `bg-slate-800/50` → `--color-bg-secondary`、`border-slate-700/50` → `--color-border`、ホバーカラーを`--color-accent`に |
| `src/components/AuthorCard.astro` | 全カラーをCSS変数化。`bg-slate-700/60` → `--color-bg-secondary`、SNSリンクのホバーを`--color-accent`系に |
| `src/components/Comments.astro` | コンテナのCSS変数化。Giscusテーマを`transparent_dark`固定から動的切替に変更（`MutationObserver` + `postMessage`） |

### 未変更ファイル（テーマ非依存のため）

| ファイル | 理由 |
|---------|------|
| `src/components/TableOfContents.tsx` | CSSクラスベース。main.scssの`.toc-*`更新で自動的にテーマ対応 |
| `src/components/ReactionButtons.tsx` | CSSクラスベース。main.scssの`.reaction-*`更新で自動的にテーマ対応 |
| `src/components/StickyReactionBar.tsx` | CSSクラスベース。main.scssの`.sticky-*`更新で自動的にテーマ対応 |

## テーマ戦略

- **CSS変数一元管理**: `:root`（ライト）と `:root.dark`（ダーク）で定義済みの変数を参照
- **リアクション種別カラー**: like=blue, helpful=yellow, insightful=purple, inspiring=pink はセマンティックカラーとして両テーマ共通維持
- **コードブロック**: `--color-bg-code-block` で常にダーク系を維持（可読性のため）
- **Giscus動的テーマ**: `MutationObserver`で`<html>`の`class`変更を検知し、`postMessage`でiframe内テーマを即座に切替
- **`color-mix()`関数**: TOCアクティブ状態やプログレスバーの`box-shadow`でCSS変数ベースの半透明色を生成

## 次ユニットへの引き継ぎ

- Unit 5（ブックマーク機能）: `.bookmark-btn`のテーマ対応は完了済み。ブックマーク一覧ページのUIテーマ対応が必要
- 全コンポーネントがCSS変数ベースに移行済みのため、テーマトグル実装後はライト/ダーク切替が即座に反映される
