# Technology Stack

## Programming Languages
- **TypeScript** - v5.9.2 - アプリケーション全体の型安全なコード
- **SCSS** - v1.97.0 - グローバルスタイル定義（main.scss）
- **HTML (Astro)** - Astro テンプレート構文（.astro ファイル）
- **CSS (Tailwind)** - v3.4.17 - ユーティリティファーストCSS

## Frameworks
- **Astro** - v5.10.2 - SSR対応静的サイトジェネレーター（コアフレームワーク）
- **React** - v19.2.0 - インタラクティブUIコンポーネント（Islands Architecture）
- **Tailwind CSS** - v3.4.17 - ユーティリティファーストCSSフレームワーク

## Astro Integrations
- **@astrojs/react** - v4.4.0 - React コンポーネント統合
- **@astrojs/tailwind** - v6.0.2 - Tailwind CSS 統合
- **@astrojs/sitemap** - v3.7.0 - サイトマップ自動生成
- **@astrojs/vercel** - v8.0.4 - Vercel デプロイアダプター
- **@astrojs/partytown** - v2.1.0 - サードパーティスクリプトのWeb Worker化

## Backend Services
- **Firebase** - v11.9.0 - Firestore（閲覧数、リアクション、統計）
- **microCMS** - microcms-js-sdk v3.3.0 - ヘッドレスCMS（記事管理）

## Infrastructure
- **Vercel** - ホスティング + SSR + Edge Network + Serverless Functions
- **Firebase Firestore** - NoSQL ドキュメントデータベース
- **microCMS** - Headless CMS（日本語対応）
- **Google Analytics 4** - アクセス解析

## Build Tools
- **Vite** - v7.0.0 - ビルドツール（Astro内蔵）
- **npm** - パッケージマネージャー
- **Critters** - v0.0.23 - Critical CSS inlining（プロダクションビルド時）
- **Sharp** - v0.33.4 - 画像最適化（WebP変換、リサイズ）

## UI Libraries
- **Swup** - v4.8.2 - SPA ライクなページ遷移
- **@swup/scripts-plugin** - v2.1.0 - Swup スクリプト再実行プラグイン
- **@tailwindcss/typography** - v0.5.19 - 記事本文のリッチテキストスタイリング
- **@uiw/react-md-editor** - v4.0.11 - Markdown エディター（管理用？）
- **Cheerio** - v1.2.0 - サーバーサイドHTML解析（目次生成、OGP取得）

## Testing Tools
- **Vitest** - v3.2.4 - ユニットテストフレームワーク
- **@testing-library/react** - v16.3.2 - React コンポーネントテスト
- **@testing-library/dom** - v10.4.1 - DOM テストユーティリティ
- **@testing-library/jest-dom** - v6.9.0 - カスタムマッチャー
- **@testing-library/user-event** - v14.6.1 - ユーザーイベントシミュレーション
- **@vitest/coverage-v8** - v3.2.4 - カバレッジレポート
- **@playwright/test** - v1.54.2 - E2Eテストフレームワーク
- **jsdom** - v26.1.0 - テスト用DOM環境

## Code Quality
- **TypeScript** - v5.9.2 - 静的型チェック
- **ESLint** - v9.39.2 - リンター
- **eslint-plugin-astro** - v1.5.0 - Astro 用 ESLint プラグイン
- **eslint-plugin-react** - v7.37.5 - React 用 ESLint プラグイン
- **typescript-eslint** - v8.55.0 - TypeScript ESLint 統合
- **Prettier** - v3.8.1 - コードフォーマッター
- **prettier-plugin-astro** - v0.14.1 - Astro 用 Prettier プラグイン

## Deployment
- **Vercel CLI** - v50.17.0 - デプロイツール
- **@astrojs/vercel** - v8.0.4 - Vercel SSR アダプター
