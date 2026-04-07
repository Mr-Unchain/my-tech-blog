---
name: new-api-endpoint
description: Astro API エンドポイントを既存の Firestore 連携とエラーハンドリング方針に沿って追加する。入力検証とテスト追加を前提にする。
---

# New API Endpoint

`src/pages/api/` 配下に新しい API を追加する時に使う。

## Repo Rules
- Astro の file-based routing に従って `src/pages/api/` 配下へ置く。
- `APIRoute` を使う。
- `Response` を返し、JSON は `Content-Type: application/json` を明示する。
- `params`, `searchParams`, `request.json()` 由来の入力は必ず検証する。
- Firestore を使う場合は `src/lib/firebase.ts` と `src/lib/firebase-collections.ts` の既存 schema/pattern に従う。
- Firebase 未初期化時のフォールバックや 503 応答を意識する。

## Local Patterns To Reuse
- bookmark API: `src/pages/api/bookmarks/[blogId].ts`
- reaction API: `src/pages/api/reactions/[blogId].ts`
- related tests: `tests/pages/api/bookmarks.test.ts`, `tests/pages/api/reactions.test.ts`

## Security Expectations
- blogId や userId など ID 入力の存在チェックを行う。
- 列挙値は allowlist で検証する。
- 生のユーザー入力を DB クエリやレスポンスへ無加工で流さない。
- 失敗時に内部実装を漏らしすぎない。

## Workflow
1. 類似 API の HTTP method と response shape を確認する。
2. 新規 endpoint を作る。
3. 対応する Vitest を `tests/pages/api/` に追加する。
4. 対象 API テストを実行して通す。
