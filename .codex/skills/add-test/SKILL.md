---
name: add-test
description: このリポジトリの Vitest/Testing Library 構成に合わせてユニットテストを追加する。必要時のみ E2E を検討する。
---

# Add Test

指定されたファイルや機能に対して、既存の `tests/` パターンに沿ったテストを追加する時に使う。

## Choose The Test Type
- Vitest: component, hook, util, API endpoint の単体検証。
- E2E: ページ横断のユーザーフローやブラウザ統合が主目的の時だけ。
- この repo ではまず Vitest を優先する。

## Repo Rules
- `tests/` 配下で `src/` をおおむね mirror する。
- 命名は `*.test.ts` / `*.test.tsx`。
- 外部依存はモックする。特に Firebase、microCMS、`fetch`、`window` API。
- jsdom 前提の既存パターンを流用する。

## Local Patterns To Reuse
- hooks: `tests/hooks/useBookmarks.test.tsx`, `tests/hooks/useReactions.test.tsx`
- API: `tests/pages/api/bookmarks.test.ts`, `tests/pages/api/reactions.test.ts`
- utils: `tests/utils/readingTime.test.ts`
- components: `tests/components/ReactionButtons.test.tsx`

## Workflow
1. 対象ソースを読む。
2. 最も近い既存テストを 1 つ以上見つけて構造を合わせる。
3. 正常系だけでなく、分岐とエラー系も追加する。
4. 追加したテストを個別実行し、必要なら関連テストも回す。

## Verification
- まず対象ファイル単位で `npx vitest run <path>` を使う。
- API 変更時は入力バリデーションとフォールバック挙動も確認する。
- Firebase 非初期化時の分岐があるコードは、そのケースも最低 1 本入れる。
