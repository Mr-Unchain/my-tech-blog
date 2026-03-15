# Code Generation Plan - Unit 1: テーマ基盤（Theme Foundation）

## Unit Context
- **Unit**: Unit 1 - テーマ基盤
- **Dependencies**: なし（最初に実装）
- **Requirements**: FR-1.1, TR-2, TR-3, NFR-1(FOUC防止)
- **Workspace Root**: C:\Git\my-tech-blog

## Generation Steps

### Step 1: Tailwind CSS darkMode 設定
- [x] `tailwind.config.mjs` に `darkMode: 'class'` を追加
- [x] 要件: TR-2

### Step 2: CSS変数によるテーマカラー定義
- [x] `src/styles/main.scss` の `:root` セクションにライト/ダークテーマ用CSS変数を定義
- [x] `:root`（ライトテーマ）と `.dark`（ダークテーマ）のカラーパレット
- [x] 変数: `--color-bg-primary`, `--color-bg-secondary`, `--color-text-primary`, `--color-text-secondary`, `--color-border`, `--color-accent` 等
- [x] 既存のハードコードカラー（`#0f172a`, `#1e293b`, `#e2e8f0` 等）をCSS変数に段階的に移行
- [x] 要件: FR-1.1, TR-2

### Step 3: テーマ管理サービス作成
- [x] `src/lib/theme.ts` を新規作成
- [x] `getTheme()`: localStorage → prefers-color-scheme → 'light' の優先順
- [x] `setTheme(theme)`: localStorage 保存 + DOM更新
- [x] `toggleTheme()`: テーマ切替
- [x] `watchSystemTheme(callback)`: prefers-color-scheme 変更監視
- [x] `clearThemePreference()`: localStorage クリア
- [x] 要件: TR-3, FR-1.1

### Step 4: FOUC防止 ThemeScript 追加
- [x] `src/layouts/BaseLayout.astro` の `<head>` 内に同期インラインスクリプト追加
- [x] DOM解析前にテーマクラスを `<html>` に適用
- [x] localStorage → prefers-color-scheme → フォールバックの優先順
- [x] `<html>` タグに動的 `class` 属性追加（is:inline で Astro のスクリプトバンドルを回避）
- [x] 要件: NFR-1(FOUC防止), TR-3

### Step 5: ThemeToggle React コンポーネント作成
- [x] `src/components/ThemeToggle.tsx` を新規作成
- [x] 太陽/月アイコン切替（SVGインライン）
- [x] `theme.ts` のメソッドを使用
- [x] `client:load` で即時ハイドレーション
- [x] `data-testid="theme-toggle-button"` 属性追加
- [x] アクセシビリティ: `aria-label`, キーボード操作対応
- [x] 要件: FR-1.1

### Step 6: BaseLayout テーマ対応修正
- [x] `<html lang="ja">` に動的 `class` を追加（ThemeScript が制御）
- [x] `<body>` の `bg-slate-900` を `bg-white dark:bg-slate-900` に変更
- [x] `<meta name="theme-color">` を動的テーマカラーに対応
- [x] スキップリンクのテーマ対応
- [x] 要件: FR-1.1, TR-2

### Step 7: テーマ管理サービスのユニットテスト
- [x] `src/lib/__tests__/theme.test.ts` を新規作成（Vitest）
- [x] getTheme: localStorage優先 → system preference → fallback
- [x] setTheme: localStorage + DOM class 更新
- [x] toggleTheme: light ↔ dark 切替
- [x] watchSystemTheme: メディアクエリ変更時のコールバック
- [x] 要件: テスト（14テスト全パス）

### Step 8: コード生成サマリー作成
- [x] `aidlc-docs/construction/theme-foundation/code/code-summary.md` を生成
- [x] 生成/変更したファイルの一覧
- [x] テスト概要
- [x] 次ユニットへの引き継ぎ事項

---

## File Operations Summary

### New Files (3)
| File | Type |
|------|------|
| `src/lib/theme.ts` | Service Module |
| `src/components/ThemeToggle.tsx` | React Component |
| `src/lib/__tests__/theme.test.ts` | Unit Test |

### Modified Files (3)
| File | Change |
|------|--------|
| `tailwind.config.mjs` | `darkMode: 'class'` 追加 |
| `src/styles/main.scss` | CSS変数定義追加、`:root` / `.dark` セレクタ |
| `src/layouts/BaseLayout.astro` | ThemeScript追加、`<html>` 動的class、`<body>` テーマ対応 |

### Unchanged Files
| File | Reason |
|------|--------|
| `src/components/Header.astro` | ThemeToggle配置は Unit 2 で実施 |
