# Code Generation Plan - Unit 3: 記事カード・ホームページ（Article Cards & Home）

## Unit Context
- **Unit**: Unit 3 - 記事カード・ホームページ
- **Dependencies**: Unit 1（テーマ基盤）, Unit 2（レイアウト・ナビゲーション）— 両方完了済み
- **Requirements**: FR-1.2, FR-1.3, FR-2.1, FR-2.2, FR-6.1, NFR-4
- **Workspace Root**: C:\Git\my-tech-blog

## Generation Steps

### Step 1: ArticleCard.astro のテーマ対応 + Zenn 風デザイン
- [x] `src/components/ArticleCard.astro` のスタイルをライト/ダーク対応に変更
- [x] SCSS クラス（`.article-card` 等）に CSS 変数（`--color-bg-card`, `--color-text-heading` 等）を活用
- [x] Props に `viewCount?: number`, `reactionCount?: number`, `bookmarkCount?: number` を追加
- [x] メタ情報エリアにカウンター表示（アイコン + 数値）を追加
- [x] 過度な装飾の削減（Zenn 風コンパクトデザイン）— グラデーション・バックドロップブラー・シアングロー削除
- [x] 要件: FR-2.1, FR-2.2

### Step 2: HeroSlideshowReact.tsx → HeroRecommendations.tsx に簡素化
- [x] `src/components/HeroSlideshowReact.tsx` を HeroRecommendations に変更
- [x] 自動スライドショー → 静的な推薦カード群（サムネイル + タイトル + カテゴリ）に簡素化
- [x] テーマ対応スタイル（CSS 変数ベース）
- [x] 要件: FR-6.1

### Step 3: index.astro のレイアウト全面改修
- [x] ファーストビューの簡素化（大きなヒーロー → 検索バー + シンプルなヘッダー）
- [x] TabNavigation コンポーネントの統合（`?tab=` パラメータ対応）
- [x] `<main>` のテーマ対応（CSS 変数 `--color-bg-primary` ベース）
- [x] Sidebar の配置維持（ただしテーマ対応）
- [x] ページネーションのテーマ対応
- [x] ビュー切替ボタンのテーマ対応
- [x] 「すべての記事を見る」リンクのテーマ対応
- [x] 要件: FR-1.2, FR-1.3, FR-6.1

### Step 4: Sidebar.astro のテーマ対応
- [x] `src/components/Sidebar.astro` のスタイルをライト/ダーク対応に変更（CSS 変数 + scoped style）
- [x] Firebase `db` null チェック追加（`if (db)` ガード）
- [x] `bg-custom-text-bg`/`text-custom-heading` 等のカスタムクラスを CSS 変数ベースに置換
- [x] main.scss のサイドバーオーバーライド（約190行）を削除
- [x] 要件: FR-1.2

### Step 5: CategoryList.tsx のテーマ対応
- [x] `src/components/CategoryList.tsx` のスタイルをテーマ対応に変更（CSS 変数 inline style）
- [x] `bg-custom-button` → `var(--color-accent-light)` + `var(--color-accent)` に置換
- [x] 要件: FR-1.2

### Step 6: コード生成サマリー作成
- [x] `aidlc-docs/construction/article-cards-home/code/code-summary.md` を生成
- [x] 生成/変更したファイルの一覧
- [x] 次ユニットへの引き継ぎ事項

---

## File Operations Summary

### New Files (0)
（HeroSlideshowReact.tsx はリネーム/変更扱い）

### Modified Files (5)
| File | Change |
|------|--------|
| `src/components/ArticleCard.astro` | テーマ対応、メタ情報カウンター追加、Zenn風コンパクトデザイン |
| `src/components/HeroSlideshowReact.tsx` | HeroRecommendations に簡素化、スライドショー削除、テーマ対応 |
| `src/pages/index.astro` | レイアウト全面改修、TabNavigation統合、テーマ対応 |
| `src/components/Sidebar.astro` | テーマ対応、db null チェック追加 |
| `src/components/CategoryList.tsx` | テーマ対応スタイル |
