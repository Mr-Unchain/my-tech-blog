---
name: review-component
description: コンポーネントやページを、このブログの実装規約と Codex のレビュー基準に沿ってレビューする。必要に応じて `explorer` サブエージェントで読取りを分担する。
---

# Review Component

対象ファイルのコードレビューを行う時に使う。

## Codex Agent Mapping
- Claude 側の `agent: Explore` は、Codex では `explorer` サブエージェントに読み替える。
- 範囲が明確な read-only 調査なら `explorer` に探索を任せてよい。
- 最終レビューは必ず自分で統合し、 findings-first で返す。

## Review Priorities
- パフォーマンス: 不要 hydration、Astro で済む箇所の React 化、画像最適化。
- アクセシビリティ: セマンティクス、ラベル、キーボード操作、見出し階層。
- SEO: `BaseLayout` のメタ利用、canonical、構造化データ。
- セキュリティ: `set:html` や API 入力、環境変数境界、公開 API の検証不足。
- コード品質: 型、既存命名、カテゴリ配列正規化、SSR 安全性。

## Local Patterns To Check Against
- レイアウト/SEO: `src/layouts/BaseLayout.astro`
- 一覧 UI: `src/components/ArticleCard.astro`
- interactive UI: `src/components/BookmarkButton.tsx`
- API validation style: `src/pages/api/reactions/[blogId].ts`, `src/pages/api/bookmarks/[blogId].ts`

## Output Format
- Findings を重大度順に先に出す。
- 各 finding に対象ファイルと行参照を付ける。
- 問題がなければ明示的に no findings と書く。
- その後に残留リスクやテストギャップがあれば短く添える。
