---
name: new-page
description: Astro ページを `BaseLayout.astro` 前提で新規作成し、このブログの SEO と data-fetch パターンに沿って組み込む。
---

# New Page

`src/pages/` 配下に新しいページを追加する時に使う。

## Repo Rules
- ファイル名は lower-case。動的ルートは `[param].astro`。
- `src/layouts/BaseLayout.astro` を基本レイアウトとして使う。
- `pageTitle`, `pageDescription`, `canonicalUrl` などの SEO props を適切に埋める。
- 既存コンポーネントを優先再利用し、インタラクティブ部分だけ React island にする。
- microCMS のカテゴリは `string[]` として扱う前提を崩さない。

## Local Patterns To Reuse
- ホーム: `src/pages/index.astro`
- 記事詳細: `src/pages/blog/[id].astro`
- レイアウト: `src/layouts/BaseLayout.astro`

## Workflow
1. 近い既存ページを読んで frontmatter と head slot の使い方を合わせる。
2. ルーティング要件に応じて静的ルートか動的ルートか決める。
3. データ取得が必要なら `src/lib/` 既存 client を使う。
4. 新規ページを作成し、必要なら関連 component/test も追加する。

## Checklist
- title/description/canonical を設定したか。
- island を最小化したか。
- 一覧や記事導線の URL 末尾スラッシュ運用を壊していないか。
