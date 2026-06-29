# Application Design Plan: 執筆環境 / CMS 戦略

## 前提

- Workflow Planning は承認済み。
- Application Design は実行対象。
- 対象は高レベルなコンポーネント境界、責務、サービス層、依存関係の定義まで。
- 詳細な business logic、validation rule、実装手順は後続の Functional Design / NFR Design / Code Generation で扱う。

## 設計ステップ

- [x] 要件、ユーザーストーリー、実行計画を読み直す。
- [x] 既存の microCMS 取得経路と公開ページ依存を確認する。
- [x] ブログ記事、profile/projects、Firebase 連携、公開ページの責務境界を定義する。
- [x] `components.md` を作成する。
- [x] `component-methods.md` を作成する。
- [x] `services.md` を作成する。
- [x] `component-dependency.md` を作成する。
- [x] `application-design.md` を作成する。
- [x] Security Baseline への適合を確認する。

## 追加質問

この段階で追加質問はありません。既に承認済みの要件とストーリーから、Application Design の判断に必要な情報は足りています。

後続の Functional Design では、frontmatter schema の厳密な型、slug / id の生成規則、migration の失敗時挙動などを詳細化します。

