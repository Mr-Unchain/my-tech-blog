# Build Instructions

## Prerequisites
- **Build Tool**: Astro v5.10 + Vite v7
- **Runtime**: Node.js 20+
- **Package Manager**: npm
- **Dependencies**: `npm install` で全依存を解決
- **Environment Variables**: 以下を `.env.local` に設定

### Required Environment Variables
| Variable | Description | Required For |
|----------|-------------|--------------|
| `VITE_MICROCMS_SERVICE_DOMAIN` | microCMS サービスドメイン | ビルド・ランタイム |
| `MICROCMS_READ_API_KEY` | microCMS 読み取り API キー | ビルド・ランタイム |
| `MICROCMS_WRITE_API_KEY` | microCMS 書き込み API キー | Webhook API |
| `FIREBASE_PROJECT_ID` | Firebase プロジェクト ID | ランタイム（リアクション・ブックマーク） |
| `FIREBASE_CLIENT_EMAIL` | Firebase サービスアカウント | ランタイム |
| `FIREBASE_PRIVATE_KEY` | Firebase 秘密鍵 | ランタイム |
| `VITE_FIREBASE_API_KEY` | Firebase Web API キー | クライアントサイド |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth ドメイン | クライアントサイド |
| `VITE_FIREBASE_PROJECT_ID` | Firebase プロジェクト ID（クライアント） | クライアントサイド |
| `MICROCMS_WEBHOOK_SECRET` | Webhook 署名検証用シークレット | Webhook API |

## Build Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
# .env.local が存在し、上記の環境変数が設定されていることを確認
# Vercel デプロイ時は Vercel Dashboard で設定済み
```

### 3. Build All Units
```bash
npm run build
```

Astro SSR ビルドが以下を実行:
1. **Server entrypoints** のビルド（Vite）
2. **Client bundles** のビルド（Vite）— React Islands を含む
3. **Static routes** のプリレンダリング（microCMS API 呼び出し含む）

### 4. Verify Build Success
- **Expected Output**: `✓ Completed` メッセージが表示される
- **Build Artifacts**: `dist/` ディレクトリに出力
  - `dist/client/` — 静的アセット（JS, CSS, images）
  - `dist/server/` — サーバーサイドエントリポイント
- **Client Bundle サイズ目安**:
  - `client.js` (React runtime): ~187 kB
  - `useReactions.js` (Firebase SDK): ~473 kB
  - `BookmarkButton.js`: ~2.2 kB
  - `BookmarkListClient.js`: ~3.6 kB
  - `ThemeToggle.js`: ~2.3 kB

## Troubleshooting

### Build Fails: "parameter is required (check serviceDomain and apiKey)"
- **Cause**: microCMS 環境変数が未設定
- **Solution**: `.env.local` に `VITE_MICROCMS_SERVICE_DOMAIN` と `MICROCMS_READ_API_KEY` を設定

### Build Fails: TypeScript Errors
- **Cause**: 型定義の不整合
- **Solution**: `npx astro check` で詳細なエラーを確認し修正

### Build Warns: Large Bundle Size
- **Cause**: Firebase SDK がクライアントバンドルに含まれる（`useReactions.js` ~473kB）
- **Note**: これは既知の技術的負債。将来的に dynamic import で分割可能
