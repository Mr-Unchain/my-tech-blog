# System Architecture

## System Overview

Monologger は Astro フレームワーク（SSR モード）をベースとした技術ブログシステムです。コンテンツ管理に microCMS、動的データの永続化に Firebase Firestore、ホスティングに Vercel を使用する JAMstack + Islands Architecture パターンで構築されています。

## Architecture Diagram

```mermaid
flowchart TB
    subgraph Client["Browser"]
        React["React Islands<br/>(TOC, Reactions, Slideshow)"]
        Astro_Client["Static HTML + Tailwind CSS"]
        SW["Service Worker (PWA)"]
        Swup["Swup Page Transitions"]
    end

    subgraph Vercel["Vercel Edge Network"]
        SSR["Astro SSR Runtime"]
        API["API Routes<br/>/api/reactions, /api/webhook"]
        Static["Static Assets<br/>CSS, JS, Images"]
    end

    subgraph External["External Services"]
        MicroCMS["microCMS<br/>(Headless CMS)"]
        Firebase["Firebase Firestore<br/>(Database)"]
        GA4["Google Analytics 4"]
    end

    Client --> Vercel
    SSR -->|"Fetch content"| MicroCMS
    SSR -->|"Read/Write data"| Firebase
    API -->|"CRUD operations"| Firebase
    MicroCMS -->|"Webhook (delete)"| API
    Client -->|"Analytics (Partytown)"| GA4
    React -->|"API calls"| API
```

## Component Descriptions

### Astro SSR Runtime
- **Purpose**: サーバーサイドレンダリングによるHTML生成
- **Responsibilities**: ページルーティング、コンテンツフェッチ、SEOメタタグ生成、構造化データ埋め込み
- **Dependencies**: microCMS SDK, Firebase SDK, Cheerio
- **Type**: Application

### React Islands
- **Purpose**: インタラクティブなUI機能（部分的ハイドレーション）
- **Responsibilities**: TOCスクロール連動、リアクションUI、ヒーロースライドショー、カテゴリフィルター
- **Dependencies**: React 19, Firebase（間接的にAPI経由）
- **Type**: Application (Client-side)

### API Routes
- **Purpose**: サーバーサイドAPI（Vercel Serverless Functions として実行）
- **Responsibilities**: リアクションCRUD、microCMS Webhook処理、Firebase データ操作
- **Dependencies**: Firebase Firestore SDK
- **Type**: Application (Server-side)

### microCMS Integration Layer
- **Purpose**: ヘッドレスCMSとのデータ連携
- **Responsibilities**: 記事取得、プロフィール取得、プロジェクト取得、データ正規化
- **Dependencies**: microcms-js-sdk
- **Type**: Shared (Library)

### Firebase Integration Layer
- **Purpose**: リアルタイムデータベースとの連携
- **Responsibilities**: Firestore初期化、コレクション定義、nullable安全なエクスポート
- **Dependencies**: Firebase SDK
- **Type**: Shared (Library)

## Data Flow

```mermaid
sequenceDiagram
    participant R as Reader
    participant B as Browser
    participant V as Vercel SSR
    participant MC as microCMS
    participant FB as Firebase

    Note over R,FB: 記事閲覧フロー
    R->>B: /blog/{id} アクセス
    B->>V: HTTP GET
    V->>MC: getBlogDetail(id)
    MC-->>V: 記事データ (HTML content)
    V->>FB: setDoc(views/{id}, increment(1))
    V-->>B: SSR HTML (SEO対応)
    B->>B: React Islands ハイドレーション

    Note over R,FB: リアクションフロー
    R->>B: リアクションボタンクリック
    B->>V: POST /api/reactions/{blogId}
    V->>FB: runTransaction (reactions, blog_stats)
    FB-->>V: 更新結果
    V-->>B: JSON レスポンス
    B->>B: UI更新（カウンタ表示）
```

## Integration Points

### External APIs
- **microCMS API**: 記事（blogs）、プロフィール（profile）、プロジェクト（projects）の取得。READ権限のみのAPIキーで運用
- **Google Analytics 4**: Partytownによるオフロード実行。Web Vitals監視を含む

### Databases
- **Firebase Firestore**: 4コレクション
  - `views`: 閲覧カウント（記事ID → count）
  - `reactions`: 個別リアクション記録（userId, blogId, reactionType）
  - `blog_stats`: 記事統計集約（reactionCounts, viewCount, bookmarkCount）
  - `bookmarks`: ブックマーク（プレースホルダー・実装途中）

### Third-party Services
- **Vercel**: SSR ホスティング + Edge Network + Serverless Functions
- **microCMS Webhook**: 記事削除時のFirebaseクリーンアップトリガー

## Infrastructure Components

### Deployment Model
- **Platform**: Vercel (Serverless)
- **SSR Adapter**: @astrojs/vercel
- **CDN**: Vercel Edge Network（グローバル配信）
- **Build**: Astro + Vite（Critters による Critical CSS inlining）

### Environment Variables
- `VITE_MICROCMS_SERVICE_DOMAIN`: microCMS サービスドメイン
- `MICROCMS_READ_API_KEY`: microCMS 読み取りAPIキー
- `VITE_FIREBASE_*`: Firebase 設定（7変数）
- `MICROCMS_WEBHOOK_SECRET`: Webhook署名検証用シークレット
