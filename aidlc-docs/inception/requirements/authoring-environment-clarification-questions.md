# 執筆環境 要件追加確認

回答内容に複数の実装方向が残っているため、要件を確定する前に追加確認します。各質問の `[Answer]:` の後ろに、該当する選択肢の記号を入力してください。どの選択肢も合わない場合は `X` を選び、希望内容を `[Answer]:` の後ろに追記してください。

## 曖昧点 1: Git ベース執筆とデプロイ体験

Question 1 では Git ベース執筆に魅力を感じつつ、毎回デプロイが必要になる点を懸念しています。初回 MVP の方向性を決める必要があります。

### Clarification Question 1
初回 MVP の中核にする執筆方式はどれにしますか？

A) Git 管理の Markdown / MDX を中核にし、デプロイ操作の面倒さを自動化で減らす
B) microCMS は残し、Markdown ライクな外部・独自エディタから microCMS へ同期する
C) まずは microCMS 継続で、プレビューや下書き確認だけ改善する
X) その他（`[Answer]:` の後ろに内容を書いてください）

[Answer]:A

## 曖昧点 2: エディタ形式

Question 3 ではライブプレビュー付き Markdown エディタと、Obsidian / VS Code など外部アプリでの Markdown 編集の両方が候補になっています。

### Clarification Question 2
最初に優先する編集体験はどれにしますか？

A) ブログ上の見た目に近いライブプレビュー付き Markdown エディタを作る
B) Obsidian / VS Code など外部エディタで Markdown を書き、ブログ側はプレビューと公開連携を担う
C) A と B の両立を最初から狙う
X) その他（`[Answer]:` の後ろに内容を書いてください）

[Answer]:B

## 曖昧点 3: 公開フロー

Question 4 では Web UI 公開と Pull Request ベース公開の両方が候補になっています。コンテンツの正本をどこに置くかと強く結びつきます。

### Clarification Question 3
初回 MVP の公開フローはどれにしますか？

A) 下書き -> プレビュー -> Web UI から公開
B) Markdown / MDX を Pull Request でレビュー -> merge -> deploy
C) Git ベースで管理しつつ、記事公開用の操作は管理 UI で簡略化する
X) その他（`[Answer]:` の後ろに内容を書いてください）

[Answer]:B

## 曖昧点 4: 認証とアクセス制御

Question 7 ではホスティング / プロバイダ認証、GitHub OAuth、Git / 外部エディタ側の認証が候補になっています。実装範囲とセキュリティ設計に影響します。

### Clarification Question 4
初回 MVP の認証・アクセス制御はどれにしますか？

A) 管理画面を作る場合は、既存のホスティング / プロバイダ認証で保護する
B) 管理画面を作る場合は、GitHub OAuth などの専用ログインを実装する
C) 管理画面は作らず、GitHub / Git / 外部エディタ側の認証に任せる
X) その他（`[Answer]:` の後ろに内容を書いてください）

[Answer]:B
