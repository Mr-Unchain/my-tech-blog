# Monologger – Tech Blog for Product-minded Engineers

Astro + React + microCMS で構築した個人技術ブログです。高速な表示と運用しやすい編集体験を両立し、記事を書くだけで SEO・分析・配信まで完結することを狙いました。技術選定理由や設計意図を明示し、採用担当や技術面接官にもプロダクト視点が伝わる構成に整理しています。

## プロジェクト概要（課題と解決アプローチ）
- **課題感**: 「記事更新のたびにビルドやデプロイを意識したくない」「速さとアクセシビリティを犠牲にしないでリッチな表現を使いたい」「読まれる・改善できるブログ運用を仕組み化したい」。
- **解決策**: Astro の静的生成をベースに、microCMS をヘッドレス CMS として採用し、Firebase でリアルタイム分析を付与。Swup による高速ページトランジションや LQIP によるプレースホルダー生成で体感速度を最適化。型安全な API クライアントとユニットテストで継続的な改善がしやすい基盤を用意しています。

## 機能一覧
- ブログ記事・プロフィール・プロジェクト紹介の **コンテンツ管理**（microCMS）
- **SEO 最適化**: OGP/Twitter カード、構造化データ、サイトマップ、自動 canonical
- **高速 UX**: Swup によるスムーズなページ遷移、画像の遅延読み込み、LQIP プレースホルダー生成
- **閲覧データ取得**: Firebase Firestore でビューカウントとエンゲージメントを追跡
- **レスポンシブ & アクセシブル**: ARIA 属性、キーボード操作考慮、Tailwind/SCSS での一貫したデザイン
- **コンポーネント分割**: Astro Islands + React コンポーネントで必要な箇所だけをインタラクティブ化

## アーキテクチャ概要
```
┌─────────────────────────────────────────┐
│                  Client (Astro)          │
│  - 静的生成された HTML/CSS/JS            │
│  - Islands: ArticleCard, HeroSlideshow    │
│  - Swup によるページトランジション       │
└───────────────▲─────────────────────────┘
                │ fetch (build & runtime)
┌───────────────┴─────────────────────────┐
│              Backend Services            │
│  microCMS: 記事/プロフィール/案件データ    │
│  Firebase Firestore: 閲覧数・コメント等    │
└───────────────▲─────────────────────────┘
                │ deploy (CI/CD)
┌───────────────┴─────────────────────────┐
│                 Vercel                   │
│  - Preview/Production デプロイ           │
│  - Edge Network 配信                     │
└─────────────────────────────────────────┘
```

### データフローの要点
- ビルド時に microCMS から記事・プロフィール・プロジェクト情報を取得し静的ページを生成。
- Firebase Firestore で閲覧数をリアルタイムに計測し、将来のコメント/リアクション機能に拡張可能。
- Swup + Astro Islands でページ遷移を高速化しつつ、必要最小限の JS だけを配信。

## 技術スタックと選定理由
- **Astro + React**: 静的生成による高速配信と、必要箇所のみのインタラクティブ化が可能。React 資産を再利用しつつ、SSR/SSG を場面に応じて選択できる柔軟性を重視。
- **microCMS**: 日本語ドキュメントと UI が優秀で、非エンジニアでも編集しやすい。Webhook/Preview 連携で運用コストを削減。
- **Firebase (Firestore)**: スキーマレスで小規模プロダクトに適したリアルタイム DB。将来的なコメント・リアクション機能をサーバーレスで追加しやすい。
- **Tailwind CSS + SCSS**: ユーティリティで初速を上げつつ、SCSS で共通トークン管理。ダークテーマやアクセントカラーの統一を容易に。
- **Swup**: 既存ページ構造を保ったまま、体感速度の高いトランジションを実現。SPA ほど複雑にせずに UX を向上。
- **Vercel**: Git 連携によるプレビュー環境、Edge Network 配信、Astro 公式アダプター対応でデプロイがシンプル。

## 実装で工夫したポイント
- **パフォーマンス**: `src/lib/blur.ts` で LQIP を生成し、ファーストビューのチラつきを低減。画像は `astro:assets` で最適化し、`sizes`/`loading="lazy"` を適切に設定。
- **型安全なデータ取得**: `src/lib/microcms.ts` でコンテンツ型を定義し、カテゴリフィールドをビルド時に正規化して UI 側の条件分岐を単純化。
- **アクセシビリティ**: `ArticleCard.astro` で `aria-labelledby` や `time` 要素を使用し、読み上げと SEO 両面をケア。
- **運用効率**: scripts と CI/CD を Vercel に集約し、環境変数だけでプレビューを切り替え可能。Tailwind プリセットでダークテーマを統一。

## 課題と今後の改善ロードマップ
1. **検索・レコメンド強化**: Algolia もしくは自前の全文検索インデックス導入。
2. **エンゲージメント機能**: Firestore を活用したリアクション・コメント・ブックマークの実装。
3. **パフォーマンス計測の自動化**: Lighthouse CI でのスコア計測と PR 時のレポート化。
4. **国際化対応**: Astro の i18n で英語版を追加し、ルーティング/OGP を多言語化。
5. **エディタ拡張**: microCMS のプレビュー・ドラフト連携を強化し、MD ベースの執筆体験を提供。

## セットアップ方法
### 前提
- Node.js 18+、npm
- microCMS プロジェクトと API キー
- Firebase プロジェクト（Firestore 有効）
- Vercel アカウント（デプロイ用）

### 手順
1. リポジトリを取得
   ```bash
   git clone https://github.com/your-username/my-tech-blog.git
   cd my-tech-blog
   ```
2. 依存関係をインストール
   ```bash
   npm install
   ```
3. 環境変数を設定（`.env`）
   ```bash
   # microCMS
   VITE_MICROCMS_SERVICE_DOMAIN=your-service-domain
   MICROCMS_API_KEY=your-api-key
   VITE_MICROCMS_API_URL=https://your-service-domain.microcms.io/api/v1

   # Firebase (client)
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
   ```
4. 開発サーバー起動
   ```bash
   npm run dev
   ```
   `http://localhost:4321` でプレビューできます。
5. 本番ビルド・プレビュー
   ```bash
   npm run build
   npm run preview
   ```

## プロジェクト構成
```
my-tech-blog/
├── public/                 # 静的アセット（OGP 画像・ロゴ等）
├── src/
│   ├── components/         # UI コンポーネント（Astro/React）
│   ├── layouts/            # ページ共通レイアウト
│   ├── lib/                # API クライアント・LQIP 生成などのユーティリティ
│   ├── pages/              # ルーティングページ（ブログ、検索、プロフィール等）
│   ├── styles/             # グローバルスタイル（Tailwind + SCSS）
│   └── utils/              # 共有ロジック（例: 読了時間計算）
├── tests/                  # Vitest ベースのユニット/コンポーネントテスト
├── astro.config.mjs        # Astro 設定（sitemap, vercel adapter など）
└── vercel.json             # Vercel デプロイ設定
```

## スクリーンショット / デモ
- `public/` にデモ画像を追加し、以下に貼り付けてください。
- 例: `![Home](./public/demo-home.png)`

## スクリプトと開発フロー
| Command | Description |
|---------|-------------|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | 本番ビルド |
| `npm run preview` | ビルド済みサイトをローカル確認 |
| `npm run test` | Vitest で単体・コンポーネントテスト |
| `npm run e2e` | Playwright による E2E テスト |

## ライセンス
MIT License

---
Astro / React / Tailwind による高速フロントエンドと、microCMS・Firebase を組み合わせた柔軟な運用を実践することで、**「書くこと」に集中できる開発体験**を実現しています。プロダクト視点と継続的改善を両立するワークフローを示すサンプルとしてご覧ください。
