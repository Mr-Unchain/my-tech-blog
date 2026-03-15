# Unit Test Execution

## Test Framework
- **Runner**: Vitest v3.2
- **Environment**: jsdom
- **Setup**: `vitest.setup.ts`
- **Coverage**: `@vitest/coverage-v8`

## Run Unit Tests

### 1. Execute All Unit Tests
```bash
npm test -- --run
```

### 2. Watch Mode (Development)
```bash
npm run test:watch
```

### 3. Coverage Report
```bash
npm run test:coverage
```

## Test Files Overview

| Test File | Tests | Description |
|-----------|-------|-------------|
| `src/lib/__tests__/theme.test.ts` | 14 | テーマ切替ロジック（getTheme, setTheme, toggleTheme, watchSystemTheme, clearThemePreference） |
| `tests/utils/readingTime.test.ts` | 4 | 読了時間計算ユーティリティ |
| `tests/pages/api/bookmarks.test.ts` | 2 | ブックマーク API エンドポイント |
| `tests/pages/api/reactions.test.ts` | 2 | リアクション API エンドポイント |
| `tests/lib/microcms.test.ts` | 1 | microCMS クライアント |
| `tests/hooks/useBookmarks.test.tsx` | 1 | useBookmarks フック（LocalStorage フォールバック） |
| `tests/hooks/useReactions.test.tsx` | 1 | useReactions フック |
| `tests/components/ReactionButtons.test.tsx` | 1 | ReactionButtons コンポーネント |

### Expected Results
- **Total**: 26 tests
- **Passed**: 26
- **Failed**: 0
- **Duration**: ~1.2s

### Known Warnings
- `useBookmarks.test.tsx` で jsdom 環境の相対URL解決エラーが stderr に出力されるが、これは想定どおりの動作。テストは LocalStorage フォールバックの検証が目的であり、API 呼び出しの失敗は正常なフォールバックパスをテストしている。

## Fix Failing Tests
1. テスト出力のエラーメッセージを確認
2. 該当テストファイルを特定
3. `npx vitest run <test-file>` で個別実行して再現確認
4. コードまたはテストを修正
5. 全テスト再実行で回帰がないことを確認
