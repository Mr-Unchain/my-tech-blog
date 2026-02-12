---
name: add-test
description: 指定されたファイルやコンポーネントに対するテストを追加する。Vitest ユニットテストまたは Playwright E2E テスト。
argument-hint: target-file-or-feature
allowed-tools: Read, Glob, Grep, Write, Edit, Bash
---

## テスト追加

`$ARGUMENTS` に対するテストを作成してください。

### テスト種別の判断

- **ユニットテスト（Vitest）**: コンポーネント、フック、ユーティリティ、API エンドポイントなど個別の単位
- **E2E テスト（Playwright）**: ページ全体の動作、ナビゲーション、ユーザーフロー

### ユニットテスト（Vitest）の規約

1. **配置**: `tests/` 配下にソースと同じディレクトリ構造で配置
   - `src/components/Foo.tsx` → `tests/components/Foo.test.tsx`
   - `src/hooks/useFoo.ts` → `tests/hooks/useFoo.test.tsx`
   - `src/lib/foo.ts` → `tests/lib/foo.test.ts`
   - `src/pages/api/foo.ts` → `tests/pages/api/foo.test.ts`
   - `src/utils/foo.ts` → `tests/utils/foo.test.ts`
2. **環境**: jsdom（`vitest.setup.ts` でセットアップ済み）
3. **パターン**: 既存テストを参考に（`tests/` 配下を確認）
4. **モック**: Firebase、microCMS、fetch などの外部依存はモック

### E2E テスト（Playwright）の規約

1. **配置**: `e2e/` 配下に `*.spec.ts` で配置
2. **ブラウザ**: Chromium, Firefox, WebKit
3. **サーバー**: 開発サーバー（port 4321）を自動起動

### 手順

1. テスト対象のソースコードを読んで理解
2. 既存の類似テストを参考にパターンを確認
3. テストを作成
4. `npx vitest run [テストファイルパス]` で実行して通ることを確認
