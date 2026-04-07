---
name: new-component
description: Astro/React コンポーネントをこのブログの既存パターンに合わせて新規作成する。静的 UI は `.astro`、状態やイベントがある UI は `.tsx` を優先する。
---

# New Component

`src/components/` に新しいコンポーネントを追加する時に使う。

## Inputs
- 想定引数: `ComponentName`, `astro|react`
- 種別指定があれば従う。未指定なら既存コードを見て自分で決める。

## Decide The File Type
- `.astro`: 静的表示主体。Props で完結し、状態管理やイベント処理が不要。
- `.tsx`: `useState` / `useEffect` / API 呼び出し / ブラウザイベント / localStorage 利用などが必要。
- 迷う場合は Astro を先に検討し、必要な島だけ React に切り出す。

## Repo Rules
- 命名は PascalCase。
- 配置は `src/components/` 直下を優先する。
- Props は TypeScript で明示する。
- スタイルは既存の Tailwind と CSS 変数を優先し、既存テーマ変数を壊さない。
- React を追加する場合、呼び出し元で `client:load` / `client:idle` / `client:visible` を用途に応じて選ぶ。
- 必要なフックは `src/hooks/use*.ts` に切り出す。

## Local Patterns To Reuse
- Astro カード系: `src/components/ArticleCard.astro`
- React ボタン系: `src/components/BookmarkButton.tsx`
- レイアウト前提: `src/layouts/BaseLayout.astro`

## Workflow
1. `rg` で類似コンポーネントを探し、Props とスタイル方針を確認する。
2. 新規コンポーネントを作る。
3. 必要なら hook / util / test を追加する。
4. 利用側で island 指定や Props 受け渡しを接続する。
5. 影響範囲があれば `npm run test` または対象テストで確認する。

## Output Expectations
- 生成物だけでなく、どこから使う前提かも最終回答で短く示す。
- 新規 React コンポーネントを作った場合は hydration 戦略も明記する。
