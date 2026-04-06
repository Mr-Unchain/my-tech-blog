# Code Generation Plan - Homepage Branding Improvement

## Unit Context

- **Unit**: Homepage Hero Branding (単一ユニット)
- **Requirements**: [branding-requirements.md](../../inception/requirements/branding-requirements.md)
- **Scope**: `src/pages/index.astro` + `src/styles/main.scss` の2ファイル変更
- **Dependencies**: 既存 Swup ページ遷移、CSS変数テーマシステム

## Code Generation Steps

### Step 1: h1 テキスト & pageTitle 変更
- [x] `src/pages/index.astro` line 122: `pageTitle` を `"Monologger"` に変更
- [x] `src/pages/index.astro` line 179-181: h1 テキストを `"Monologger"` に変更
- [x] h1 に `data-testid="hero-title"` を追加
- [x] h1 のフォントサイズを拡大（`text-3xl md:text-4xl lg:text-5xl`）で個人ブランド感を強化
- [x] h1 にタイピングアニメーション用クラス `hero-typing` を追加

### Step 2: 副題テキスト変更
- [x] `src/pages/index.astro` line 182-184: 副題テキストをミニマルな一言に変更
- [x] 候補: 「Build. Learn. Share.」（英語3単語、ミニマル、ブランド感あり）
- [x] 副題に `data-testid="hero-subtitle"` を追加
- [x] 副題にフェードイン用クラス `hero-fade-in` を追加

### Step 3: CSS タイピングアニメーション実装
- [x] `src/styles/main.scss` に `@keyframes hero-typing` を追加
  - `width: 0` → `width: 100%` の step アニメーション
- [x] `@keyframes hero-blink-caret` を追加（カーソル点滅）
- [x] `.hero-typing` クラスの定義:
  - `overflow: hidden`, `white-space: nowrap`, `border-right` (カーソル)
  - `animation: hero-typing 1.5s steps(10) forwards, hero-blink-caret 0.75s step-end 4`
  - `width: 0→100%` アプローチ（プロポーショナルフォント対応）
  - `.typing-done` クラスでカーソル非表示

### Step 4: CSS フェードインアニメーション実装
- [x] `.hero-fade-in` クラス: `opacity: 0` → `1` + `translateY(10px)` → `0`
- [x] `animation-delay: 1.8s`（タイピング完了後に開始）
- [x] `animation-fill-mode: forwards`
- [x] 検索フォームにも `.hero-fade-in--delay` を適用（delay 2.1s）

### Step 5: prefers-reduced-motion 対応
- [x] 既存の `@media (prefers-reduced-motion: reduce)` ブロック（main.scss line 1769）に
  `.hero-typing`, `.hero-fade-in` のアニメーション無効化を追加
- [x] reduced-motion 時は即座に表示（`width: 100%`, `opacity: 1` 初期状態）

### Step 6: Swup ページ遷移対応
- [x] `src/pages/index.astro` の既存スクリプトエリアに Swup 再トリガーロジック追加
- [x] `astro:page-load` + `swup:contentReplaced` イベントでアニメーションを再初期化
- [x] アニメーション再生: `style.animation = 'none'` → reflow → `style.animation = ''`
- [x] タイピング完了後にカーソルを非表示にする `animationend` リスナー追加

### Step 7: Code Summary 生成
- [x] `aidlc-docs/construction/branding/code/code-summary.md` に変更サマリーを生成

## Files Changed

| File | Action | Description |
|------|--------|-------------|
| `src/pages/index.astro` | Modify | h1/副題テキスト、pageTitle、アニメーションクラス、Swup対応JS |
| `src/styles/main.scss` | Modify | @keyframes typing/blink-caret/hero-fade-in、reduced-motion対応 |

## Estimated Scope

- **Modified files**: 2
- **New files**: 0 (code-summary.md のみ documentation)
- **Total steps**: 7
