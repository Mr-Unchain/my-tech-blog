---
name: new-page
description: Astro ページの新規作成。BaseLayout を使用し、Swup ページ遷移に対応する。
argument-hint: page-name
allowed-tools: Read, Glob, Grep, Write, Edit
---

## ページ新規作成

`src/pages/` 配下に `$ARGUMENTS` ページを作成してください。

### 手順

1. 既存ページの構造を確認（特に `src/pages/index.astro` や `src/pages/blog/[id].astro`）
2. `src/layouts/BaseLayout.astro` の使い方を確認
3. ページを作成

### 規約

1. **レイアウト**: `BaseLayout.astro` を使用（Swup の `#swup` コンテナが含まれている）
2. **メタデータ**: `<title>` と `description` を適切に設定
3. **動的ルート**: パラメータが必要な場合は `[param].astro` 形式
4. **データ取得**:
   - microCMS からのデータ: `src/lib/microcms.ts` のクライアントを使用
   - カテゴリは常に `string[]` として扱う
5. **スタイル**: Tailwind ユーティリティクラス優先
6. **コンポーネント**: 既存コンポーネント（`src/components/`）を積極的に再利用
7. **Islands**: インタラクティブ機能が必要な箇所のみ React コンポーネントを使用
