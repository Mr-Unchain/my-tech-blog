---
name: new-component
description: Astro/React コンポーネントの新規作成。Islands パターンに従い、静的部分は .astro、インタラクティブ部分は .tsx で作成する。
argument-hint: ComponentName, astro|react
allowed-tools: Read, Glob, Grep, Write, Edit
---

## コンポーネント新規作成

`$ARGUMENTS[0]` という名前のコンポーネントを `src/components/` に作成してください。

### 判断基準

種別の指定がある場合（`$ARGUMENTS[1]`）はそれに従い、ない場合は以下で判断:

- **Astro (`.astro`)**: 静的表示のみ、クライアントサイドの状態管理やイベントハンドリングが不要
- **React (`.tsx`)**: クライアントサイドのインタラクティブ機能が必要（状態管理、イベント、API 呼び出しなど）

### 規約

1. **命名**: PascalCase（例: `ArticleCard.astro`, `ReactionButtons.tsx`）
2. **配置**: `src/components/` 直下
3. **React の場合**:
   - フックが必要なら `src/hooks/` に `use` プレフィックスで作成
   - Astro 側で呼び出す際は `client:load` / `client:visible` / `client:idle` を適切に選択
4. **スタイル**:
   - Tailwind ユーティリティクラスを優先
   - Astro の場合はスコープ付き `<style>` タグも使用可
5. **Props**: TypeScript で型定義すること

### 手順

1. 既存の類似コンポーネントを確認してパターンを把握
2. コンポーネントを作成
3. 必要に応じてフックも作成
4. 作成後、使用例を説明
