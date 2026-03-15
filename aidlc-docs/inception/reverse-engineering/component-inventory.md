# Component Inventory

## Application Packages

### Pages (13 files)
- `src/pages/index.astro` - ホームページ（ヒーロー + 最新記事 + ページネーション）
- `src/pages/blog/index.astro` - ブログ一覧（フィルター・ソート機能）
- `src/pages/blog/[id].astro` - 記事詳細（TOC、リアクション、関連記事）
- `src/pages/blog/[id]/[draftKey].astro` - 下書きプレビュー
- `src/pages/category/index.astro` - カテゴリ一覧
- `src/pages/category/[categoryName].astro` - カテゴリ別記事一覧
- `src/pages/search.astro` - 検索ページ
- `src/pages/profile.astro` - 著者プロフィール
- `src/pages/portfolio.astro` - ポートフォリオ
- `src/pages/contact.astro` - お問い合わせ
- `src/pages/privacy.astro` - プライバシーポリシー
- `src/pages/404.astro` - エラーページ
- `src/pages/rss.xml.ts` - RSSフィード

### API Endpoints (4 files)
- `src/pages/api/reactions/[blogId].ts` - リアクションAPI（GET/POST）
- `src/pages/api/webhook/microcms-sync.ts` - microCMS Webhook
- `src/pages/api/bookmarks/[blogId].ts` - ブックマークAPI（プレースホルダー）
- `src/pages/api/sync/firebase-cleanup.ts` - Firebase クリーンアップ

### UI Components (19 files)

**Astro Components (14 files):**
- `src/components/ArticleCard.astro` - 記事カード
- `src/components/ArticleNavigation.astro` - 前後記事ナビ
- `src/components/AuthorCard.astro` - 著者カード
- `src/components/Breadcrumb.astro` - パンくず
- `src/components/CodeBlockEnhancer.astro` - コードブロック強化
- `src/components/Comments.astro` - コメントセクション
- `src/components/Footer.astro` - フッター
- `src/components/Header.astro` - ヘッダー
- `src/components/ImageOptimizer.astro` - 画像最適化
- `src/components/KeyboardNavigation.astro` - キーボードナビ
- `src/components/LinkCard.astro` - リンクカード
- `src/components/LinkStyleEnhancer.astro` - リンクスタイル
- `src/components/ProjectCard.astro` - プロジェクトカード
- `src/components/Sidebar.astro` - サイドバー

**React Components (5 files):**
- `src/components/HeroSlideshowReact.tsx` - ヒーロースライドショー
- `src/components/TableOfContents.tsx` - 目次（scrollspy）
- `src/components/ReactionButtons.tsx` - リアクションボタン
- `src/components/StickyReactionBar.tsx` - 固定リアクションバー
- `src/components/CategoryList.tsx` - カテゴリフィルター

## Shared Packages

### Core Libraries (5 files)
- `src/lib/microcms.ts` - microCMS API クライアント
- `src/lib/firebase.ts` - Firebase 初期化
- `src/lib/firebase-collections.ts` - Firestore コレクション定義
- `src/lib/utils.ts` - 共通ユーティリティ
- `src/lib/ogp.ts` - OGP スクレイピング

### Utilities (3 files)
- `src/utils/categoryColors.ts` - カテゴリカラーマッピング
- `src/utils/readingTime.ts` - 読了時間計算
- `src/utils/recommend.ts` - 関連記事推薦

### Layout (1 file)
- `src/layouts/BaseLayout.astro` - グローバルレイアウト

### Styles (1 file)
- `src/styles/main.scss` - グローバルスタイルシート

## Test Packages

### Unit Tests (tests/)
- Vitest + Testing Library (React)
- カバレッジレポート対応

### E2E Tests (e2e/)
- Playwright
- UI テストモード対応

## Static Assets (public/)
- `logo.svg` - サイトロゴ
- `placeholder.svg` - プレースホルダー画像
- `manifest.webmanifest` - PWA マニフェスト
- `sw.js` - Service Worker
- `robots.txt` - クロール制御

## Total Count
- **Total Source Files**: ~46
- **Pages**: 13
- **API Endpoints**: 4
- **UI Components**: 19 (14 Astro + 5 React)
- **Libraries**: 5
- **Utilities**: 3
- **Layout**: 1
- **Styles**: 1
