# Code Generation Plan - Unit 2: レイアウト・ナビゲーション（Layout & Navigation）

## Unit Context
- **Unit**: Unit 2 - レイアウト・ナビゲーション
- **Dependencies**: Unit 1（テーマ基盤）— 完了済み
- **Requirements**: FR-1.2, FR-1.3, NFR-2, NFR-4
- **Workspace Root**: C:\Git\my-tech-blog

## Generation Steps

### Step 1: Header.astro のテーマ対応 + ThemeToggle 配置
- [x] `src/components/Header.astro` のスタイルをテーマ対応に変更
- [x] ダーク固定のグラデーション背景をライト/ダーク切替対応に変更
- [x] ThemeToggle コンポーネントを import し、デスクトップナビの右端に配置
- [x] ナビゲーションリンクの簡素化（ホーム、ブログ、カテゴリ、プロフィール）
- [x] ロゴ・テキストのテーマ対応カラー
- [x] 要件: FR-1.2, FR-1.3

### Step 2: Header.astro モバイルメニューのテーマ対応
- [x] モバイルメニューオーバーレイ・サイドバーのテーマ対応スタイル
- [x] モバイルメニュー内に ThemeToggle を追加
- [x] メニュー項目のテーマ対応カラー
- [x] インラインスクリプトを外部モジュール `src/lib/mobile-menu.ts` に分離
- [x] 要件: FR-1.2, NFR-2, NFR-4

### Step 3: Footer.astro の Zenn 風リデザイン
- [x] `src/components/Footer.astro` を Zenn 風 4 セクション構成に変更
- [x] セクション: About（サイト説明）、Links（主要ナビ）、Legal（法務リンク）、Tech Stack（技術スタック）
- [x] ライト/ダーク両テーマ対応スタイル
- [x] 過度な装飾（tech-grid, グラデーション）の削減
- [x] 要件: FR-1.2

### Step 4: BaseLayout.astro のレイアウト調整
- [x] `<main>` の max-width とセンター配置を確認（各ページ独自の container 方式を維持）
- [x] `<body>` のフォント設定確認（Inter + Noto Sans JP — 既に設定済み）
- [x] `transition-colors` のグローバル適用確認（Unit 1 で設定済み）
- [x] `theme-color` meta タグをライト/ダーク対応（media クエリ）に変更
- [x] 要件: FR-1.2

### Step 5: TabNavigation.astro の新規作成
- [x] `src/components/TabNavigation.astro` を新規作成
- [x] Props: `activeTab: string`, `categories: string[]`
- [x] タブ項目: Latest（最新）、Popular（人気）、カテゴリ（動的）
- [x] アクティブタブのハイライト表示
- [x] タブクリックで `?tab={value}` クエリパラメータ更新（リンクベース）
- [x] ライト/ダーク両テーマ対応
- [x] モバイルでの横スクロール対応
- [x] `data-testid="tab-navigation"` 属性追加
- [x] 要件: FR-1.3

### Step 6: コード生成サマリー作成
- [x] `aidlc-docs/construction/layout-navigation/code/code-summary.md` を生成
- [x] 生成/変更したファイルの一覧
- [x] 次ユニットへの引き継ぎ事項

---

## File Operations Summary

### New Files (2)
| File | Type |
|------|------|
| `src/components/TabNavigation.astro` | Astro Component |
| `src/lib/mobile-menu.ts` | Utility Module |

### Modified Files (3)
| File | Change |
|------|--------|
| `src/components/Header.astro` | ThemeToggle 追加、ナビ簡素化、テーマ対応スタイル、スクリプト分離 |
| `src/components/Footer.astro` | Zenn 風 4 セクション構成、テーマ対応 |
| `src/layouts/BaseLayout.astro` | レイアウト調整（max-width、センター配置） |
