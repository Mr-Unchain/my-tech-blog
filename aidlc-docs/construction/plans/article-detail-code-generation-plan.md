# Code Generation Plan - Unit 4: 記事詳細ページ（Article Detail）

## Unit Context
- **Unit**: Unit 4 - 記事詳細ページ
- **Dependencies**: Unit 1（テーマ基盤）, Unit 2（レイアウト・ナビゲーション）, Unit 3（記事カード・ホーム）— すべて完了済み
- **Requirements**: FR-1.2, FR-3.1, FR-3.2, FR-4.1, NFR-2, NFR-4
- **Workspace Root**: C:\Git\my-tech-blog

## Generation Steps

### Step 1: blog/[id].astro のメインレイアウト テーマ対応
- [x] `<main>` の `bg-slate-900` → CSS 変数ベースに変更
- [x] 記事カードの `bg-gradient-to-b from-slate-800/90` → `var(--color-bg-card)` + ボーダー
- [x] アイキャッチ画像ヘッダーのテーマ対応（オーバーレイ色調整）
- [x] プレビューバナーのテーマ対応
- [x] コメントセクションのコンテナテーマ対応
- [x] 関連記事セクションの見出しテーマ対応
- [x] 目次（モバイル表示）のテーマ対応
- [x] 要件: FR-1.2, FR-3.1

### Step 2: main.scss の記事本文タイポグラフィ テーマ対応
- [x] `.blog-article-content` の `color: #e2e8f0` → CSS 変数に変更
- [x] `.article-content` の `prose` 関連スタイルをテーマ対応に変更
- [x] `.prose h2` / `.prose a` / `.prose strong` のダーク固定 → CSS 変数ベース
- [x] `blockquote` / `table` / `code` のカラーを CSS 変数に変更
- [x] `.bg-slate-900 .prose` のセレクタを `:root.dark` ベースに移行
- [x] 要件: FR-3.1

### Step 3: main.scss のリアクション・シェアボタン テーマ対応
- [x] `.bookmark-btn` のスタイルを CSS 変数ベースに変更
- [x] `.reaction-buttons` / `.reaction-btn` のスタイルをテーマ対応に変更
- [x] `.share-buttons-container` / `.share-btn` のスタイルをテーマ対応に変更
- [x] `.sticky-reaction-bar` のスタイルをテーマ対応に変更
- [x] `.reading-progress-container` のテーマ対応
- [x] 要件: FR-4.1

### Step 4: main.scss の目次スタイル テーマ対応
- [x] `.toc-list` / `.toc-h2` / `.toc-h3` のカラーを CSS 変数に変更
- [x] `.toc-active` のハイライト色をテーマ対応に変更
- [x] `.toc-container` / `.toc-scroll-area` のスクロールバーテーマ対応
- [x] 要件: FR-1.2

### Step 5: Breadcrumb.astro のテーマ対応
- [x] `text-slate-400` / `text-slate-300` → CSS 変数に変更
- [x] `hover:text-cyan-400` → `var(--color-accent)` に変更
- [x] 要件: FR-1.2

### Step 6: ArticleNavigation.astro のテーマ対応
- [x] `bg-slate-800/50` → CSS 変数ベースに変更
- [x] `text-slate-200` / `text-slate-400` → CSS 変数に変更
- [x] `hover:border-cyan-500/30` → `var(--color-accent)` に変更
- [x] 要件: FR-1.2

### Step 7: AuthorCard.astro のテーマ対応
- [x] `bg-slate-700/60` / `border-slate-600/50` → CSS 変数に変更
- [x] `text-white` / `text-slate-300` / `text-slate-400` → CSS 変数に変更
- [x] ソーシャルリンクのホバーカラーをテーマ対応に変更
- [x] 要件: FR-1.2

### Step 8: Comments.astro のテーマ対応
- [x] コンテナの `bg-slate-800/40` / `border-slate-700/50` → CSS 変数に変更
- [x] テキストカラーを CSS 変数に変更
- [x] Giscus テーマを `transparent_dark` 固定 → ライト/ダーク動的切替に変更
- [x] 要件: FR-1.2

### Step 9: コード生成サマリー作成
- [x] `aidlc-docs/construction/article-detail/code/code-summary.md` を生成
- [x] 生成/変更したファイルの一覧
- [x] 次ユニットへの引き継ぎ事項

---

## File Operations Summary

### New Files (0)

### Modified Files (8+)
| File | Change |
|------|--------|
| `src/pages/blog/[id].astro` | メインレイアウトのテーマ対応、CSS変数ベース |
| `src/styles/main.scss` | 記事本文タイポグラフィ、リアクション/シェア、目次のテーマ対応 |
| `src/components/Breadcrumb.astro` | テーマ対応 |
| `src/components/ArticleNavigation.astro` | テーマ対応 |
| `src/components/AuthorCard.astro` | テーマ対応 |
| `src/components/Comments.astro` | テーマ対応、Giscus テーマ動的切替 |

### Components NOT Modified (Already Theme-Agnostic)
| File | Reason |
|------|--------|
| `src/components/TableOfContents.tsx` | CSS クラスベース、テーマ非依存 |
| `src/components/ReactionButtons.tsx` | CSS クラスベース、テーマ非依存 |
| `src/components/StickyReactionBar.tsx` | CSS クラスベース、テーマ非依存 |

### Notes
- ShareButtons.astro は存在しない（シェアボタンは blog/[id].astro 内にインライン）
- TableOfContents / ReactionButtons / StickyReactionBar は SCSS でスタイル定義されており、Step 3-4 で SCSS をテーマ対応にすることで自動的にテーマ対応される
