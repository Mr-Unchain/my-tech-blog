# Code Summary - Unit 3: 記事カード・ホームページ（Article Cards & Home）

## Generated/Modified Files

### New Files (0)
（HeroSlideshowReact.tsx はリライト扱い）

### Modified Files (5)
| File | Change |
|------|--------|
| `src/components/ArticleCard.astro` | Props追加（viewCount/reactionCount/bookmarkCount）、メタ情報カウンター表示、テーマ対応 |
| `src/components/HeroSlideshowReact.tsx` | HeroRecommendations に簡素化（自動スライドショー→静的カード群）、テーマ対応 |
| `src/pages/index.astro` | レイアウト全面改修：ヒーロー簡素化→検索バー+タイトル、TabNavigation統合、テーマ対応、装飾削減 |
| `src/components/Sidebar.astro` | テーマ対応（CSS変数+scoped style）、db null チェック追加、カスタムクラス削除 |
| `src/components/CategoryList.tsx` | テーマ対応（CSS変数 inline style）、`bg-custom-button` 削除 |

### SCSS Changes (main.scss)
| Section | Change |
|---------|--------|
| `.article-card` (base) | グラデーション・バックドロップブラー削除→CSS変数ベースシンプルカード |
| `.article-card.list-view` | テーマ対応、装飾削減 |
| `.article-card:not(.list-view)` | テーマ対応、グラデーション削除 |
| `.article-card` hover effects | `::before`光るボーダー削除、シンプルな`shadow-md`ホバー |
| `.hero-slideshow` 関連 | 全削除→`.hero-rec-card` 新規追加 |
| スライドショーアニメーション | 大部分削除（slide-in/out-left/right等） |
| `aside` サイドバーオーバーライド | 約190行を全削除（コンポーネント内scoped styleに移行） |

## Requirements Coverage
| Requirement | Status |
|-------------|--------|
| FR-1.2 (クリーンなレイアウト) | Implemented - 全コンポーネントのテーマ対応 + 装飾削減 |
| FR-1.3 (ナビゲーション改善) | Implemented - TabNavigation をホームに統合 |
| FR-2.1 (閲覧数・リアクション表示) | Implemented - ArticleCard に viewCount/reactionCount/bookmarkCount Props |
| FR-2.2 (メタ情報カウンター) | Implemented - SVG アイコン + 数値のコンパクト表示 |
| FR-6.1 (ヒーロー簡素化) | Implemented - スライドショー→推薦カード群 |
| NFR-4 (レスポンシブ) | Maintained - 既存のレスポンシブ対応を維持 |

## Design Changes Summary

### ArticleCard: Before → After
- **Background**: `bg-gradient-to-b from-slate-800` → `var(--color-bg-card)`
- **Title color**: `text-white` → `var(--color-text-heading)`
- **Hover**: `shadow-cyan-500/20` + `::before` glow → `shadow-md` + `border-color: accent`
- **Meta area**: date + reading time → date + reading time + counters (view/reaction/bookmark)

### HeroSlideshow → HeroRecommendations: Before → After
- **Component**: 211行の自動スライドショー（React useState/useEffect×4） → 72行の静的カード群
- **Layout**: フルスクリーン背景画像 + オーバーレイ → 3カラムグリッドカード
- **Animation**: slide-in/out + dots + prev/next → hover scale のみ

### index.astro: Before → After
- **First view**: 2カラムグリッド（タイトル+検索+4記事プレビュー） → シンプルなタイトル+説明+検索バー
- **Navigation**: なし → TabNavigation（最新/人気/カテゴリタブ）
- **Background**: `bg-slate-900` 固定 → `var(--color-bg-primary)` テーマ対応
- **Section titles**: グラデーションテキスト → プレーンテキスト
- **View toggle**: グラデーションボタン → シンプルアイコンボタン
- **Pagination**: グラデーションアクティブ → `var(--color-accent)` ソリッド

### Sidebar: Before → After
- **Cards**: `bg-custom-text-bg` + SCSS 190行オーバーライド → `sidebar-card` scoped style
- **Headings**: `text-custom-heading` + グラデーントテキスト → `var(--color-text-heading)` プレーン
- **Search**: グロー `::before` + グラデーションボタン → シンプルなボーダー + ソリッドボタン
- **Security**: db null チェックなし → `if (db)` ガード追加

## Notes for Next Units
- **Unit 4**: `blog/[id].astro` のテーマ対応。記事本文 `.article-content` のライト/ダーク対応が必要
- **Unit 5**: ブックマーク機能。ArticleCard の `bookmarkCount` Props は追加済み
- HeroRecommendations は `client:idle` で引き続き React Island として動作
- CategoryList.tsx は CSS 変数を inline style で使用（SSR 時もテーマ切替に対応）
