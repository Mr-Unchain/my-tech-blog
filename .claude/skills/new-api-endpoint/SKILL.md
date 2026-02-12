---
name: new-api-endpoint
description: Astro サーバーエンドポイント (API) の新規作成。Firebase Firestore との連携パターンに従う。
argument-hint: endpoint-path
allowed-tools: Read, Glob, Grep, Write, Edit
---

## API エンドポイント新規作成

`src/pages/api/` 配下に `$ARGUMENTS` のエンドポイントを作成してください。

### 手順

1. 既存のエンドポイントを確認してパターンを把握:
   - `src/pages/api/bookmarks/[blogId].ts` — GET/POST/DELETE パターン
   - `src/pages/api/reactions/[blogId].ts` — GET/POST パターン
2. 要件に基づいてエンドポイントを作成
3. 対応するユニットテストを `tests/pages/api/` に作成

### 規約

1. **ファイル配置**: `src/pages/api/` 配下（Astro のファイルベースルーティング）
2. **エクスポート**: HTTP メソッド名の関数をエクスポート（`GET`, `POST`, `PUT`, `DELETE`）
3. **型**: `APIRoute` / `APIContext` を使用
4. **レスポンス**: `Response` オブジェクトを返す。JSON の場合は適切な Content-Type を設定
5. **エラーハンドリング**: try-catch で囲み、適切な HTTP ステータスコードを返す
6. **Firebase**: Firestore 操作が必要な場合は `src/lib/firebase.ts` と `src/lib/firebase-collections.ts` のパターンに従う
7. **セッション**: ユーザー識別が必要な場合は `sessionId`（リクエストパラメータまたはヘッダーから取得）
