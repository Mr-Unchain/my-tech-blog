---
name: review-component
description: コンポーネントやページのコードレビュー。パフォーマンス、アクセシビリティ、SEO、セキュリティの観点から改善点を提案する。
argument-hint: file-path
context: fork
agent: Explore
allowed-tools: Read, Glob, Grep
---

## コードレビュー

`$ARGUMENTS` のコードレビューを以下の観点で実施してください。

### レビュー観点

1. **パフォーマンス**
   - 不要な再レンダリングがないか
   - Islands パターンが適切か（静的にできる部分が React になっていないか）
   - `client:load` vs `client:visible` vs `client:idle` の選択が適切か
   - 画像の最適化（ImageOptimizer 使用、LQIP プレースホルダー）

2. **アクセシビリティ（a11y）**
   - セマンティック HTML の使用
   - ARIA 属性の適切な使用
   - キーボード操作対応
   - カラーコントラスト

3. **SEO**
   - メタタグ（title, description, OGP）
   - 構造化データ
   - 適切な見出し階層

4. **セキュリティ**
   - XSS 対策（ユーザー入力のサニタイズ）
   - API エンドポイントの入力バリデーション
   - 環境変数の適切な使用（`VITE_` プレフィックスの使い分け）

5. **コード品質**
   - TypeScript 型の適切な使用
   - プロジェクトの規約への準拠
   - カテゴリの配列正規化パターンの遵守

### 出力フォーマット

各観点ごとに:
- 問題点（あれば）
- 改善提案（具体的なコード例付き）
- 良い点（あれば）

最後に優先度順の改善アクションリストをまとめる。
