# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

**Astro 5 + React 19 + microCMS** で構築した個人技術ブログ。静的生成ベースに Islands パターンでインタラクティブ機能を追加。Vercel にデプロイ。日本語コンテンツ、ドメインは `monologger.dev`。

### 技術スタック
- **フレームワーク**: Astro 5.10（`output: "server"` モード、Vercel アダプター）
- **UI**: React 19（Islands）、Tailwind CSS 3.4
- **CMS**: microCMS（ヘッドレス）
- **DB**: Firebase Firestore（リアクション・ブックマーク・閲覧数）
- **ページ遷移**: Swup 4.8

## コマンド

```bash
npm run dev              # 開発サーバー起動（localhost:4321）
npm run build            # 本番ビルド
npm run preview          # ビルド済みサイトのプレビュー

npm run test             # Vitest ユニットテスト実行
npm run test:watch       # ウォッチモード
npm run test:coverage    # カバレッジ付き実行

# 単一テストファイルの実行
npx vitest run tests/lib/utils.test.ts

npm run e2e              # Playwright E2E テスト（開発サーバー自動起動）
npm run e2e:ui           # Playwright UI モード
```

## アーキテクチャ

### データフロー
- **ビルド時**: Astro が microCMS API からコンテンツを取得し静的ページを生成
- **ランタイム**: Firebase Firestore がリアクション・ブックマーク・閲覧数を管理
- **サイトマップ**: ビルド時に microCMS からブログ・カテゴリ URL を動的取得して生成（`/search`、`/404`、`/api/**` は除外）

### ディレクトリ構成

```
src/
├── components/    # Astro (.astro) と React Islands (.tsx) の混在
├── hooks/         # React カスタムフック（クライアント機能）
├── layouts/       # BaseLayout.astro（Swup の #swup コンテナを含む）
├── lib/           # API クライアント・ユーティリティ
├── pages/         # ファイルベースルーティング
│   ├── api/       # サーバーエンドポイント
│   └── blog/      # ブログ動的ルート
└── utils/         # ヘルパー関数

tests/             # Vitest ユニットテスト（jsdom 環境）
e2e/               # Playwright E2E テスト
```

### 主要ライブラリファイル（`src/lib/`）

| ファイル | 役割 |
|---------|------|
| `microcms.ts` | 型安全な microCMS クライアント、カテゴリ正規化処理 |
| `firebase.ts` | Firebase 初期化 |
| `firebase-collections.ts` | Firestore コレクション型定義、リアクション設定 |
| `blur.ts` | LQIP（低品質画像プレースホルダー）生成 |
| `utils.ts` | セッション ID 生成、配列正規化（`normalizeToArray()`） |
| `ogp.ts` | OGP メタデータ取得（ビルド時、キャッシュ付き） |

## コードパターン

### カテゴリ正規化
microCMS のカテゴリフィールドは `getBlogs()` / `getProjects()` で配列に正規化される。`category` と `techStack` は常に `string[]` として扱うこと。非配列値を扱う場合は `src/lib/utils.ts` の `normalizeToArray()` を使用。

### Astro Islands
React コンポーネント（`.tsx`）はクライアントサイドのインタラクティブ機能が必要な箇所のみで使用。静的な部分は Astro コンポーネント（`.astro`）で実装する。

### ページ遷移（Swup）
`BaseLayout.astro` の `#swup` コンテナ内でメインコンテンツをラップ。Swup がスムーズなページ遷移を処理する。

### セッション管理
匿名ユーザーは `localStorage` のセッション ID で追跡。`generateSessionId()`（`src/lib/utils.ts`）は SSR セーフ（サーバー側ではフォールバック値を返す）。

### リアクションシステム
4種類のリアクション（`REACTIONS` 定数で定義）:
- `like`（👍）、`helpful`（💡）、`insightful`（🎯）、`inspiring`（✨）

`useReactions` フックが状態管理とトグル機能を提供。

### 関連記事アルゴリズム
`src/utils/recommend.ts` が TF-IDF ベースのコサイン類似度で関連記事を算出。重み: カテゴリ(4) > タイトル(3) > 説明(2) > 本文(1)。

## API エンドポイント

| エンドポイント | メソッド | 用途 |
|-------------|---------|------|
| `/api/bookmarks/[blogId]` | GET/POST/DELETE | ブックマーク管理 |
| `/api/reactions/[blogId]` | GET/POST | リアクション管理 |
| `/api/webhook/microcms-sync` | POST | microCMS Webhook ハンドラー |
| `/api/sync/firebase-cleanup` | POST | Firebase データクリーンアップ |

## microCMS コンテンツ型

| 型 | 主なフィールド |
|----|-------------|
| `blogs` | `id`, `title`, `description`, `content`, `eyecatch`, `category[]` |
| `profile` | 単一プロフィール |
| `projects` | ポートフォリオ、`techStack[]` |

## Firebase コレクション

| コレクション | 用途 |
|------------|------|
| `bookmarks` | ブックマーク（メタデータ付き） |
| `blog_stats` | 集計統計（ブックマーク数・閲覧数・リアクション数） |
| `reactions` | 個別リアクション |
| `views` | ページビュー追跡 |

## テスト

### ユニットテスト（Vitest）
- テストファイル: `tests/` 配下（hooks, components, lib, pages/api, utils）
- 環境: jsdom、セットアップ: `vitest.setup.ts`
- カバレッジ: V8 プロバイダー

### E2E テスト（Playwright）
- テストファイル: `e2e/` 配下
- ブラウザ: Chromium, Firefox, WebKit
- 開発サーバー（port 4321）を自動起動

## ビルド最適化

- **Critical CSS**: Critters プラグインが本番ビルド時に CSS をインライン化（`astro.config.mjs` の rollup プラグイン）
- **画像最適化**: `images.microcms-assets.io` からの外部画像を許可、Sharp で処理、LQIP プレースホルダー生成
- **OGP リンクカード**: `src/lib/ogp.ts` が外部 URL の OGP メタデータをビルド時に取得・キャッシュ

## スタイルガイド

- **UI テキスト**: 日本語
- **コードコメント**: 複雑なロジックは日本語
- **変数・関数名**: 英語
- **コンポーネント命名**: PascalCase（Astro: `.astro`、React: `.tsx`）、フック: `use` プレフィックス
- **CSS**: Tailwind ユーティリティクラス優先、Astro コンポーネントでは `<style>` タグでスコープ付きスタイル

## 環境変数

```bash
# microCMS
VITE_MICROCMS_SERVICE_DOMAIN=
MICROCMS_READ_API_KEY=     # GET 権限のみ（コンテンツ取得専用・下書き除外のため必須）

# Firebase
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```
