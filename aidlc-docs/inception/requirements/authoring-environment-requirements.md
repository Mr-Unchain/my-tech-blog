# 執筆環境 / CMS 戦略 要件定義

## Intent Analysis Summary

- **User Request**: microCMS の UI では記事を書きづらいため、スマートフォン・PC から執筆しやすい環境を構築したい。必要であれば脱 microCMS も許容する。
- **Request Type**: Enhancement / Migration
- **Scope Estimate**: System-wide content management and publishing workflow
- **Complexity Estimate**: Complex
- **Project Context**: 既存の Astro + TypeScript 技術ブログ。現在は記事・プロフィール・プロジェクトを microCMS から取得し、Vercel SSR で配信している。
- **Primary Decision**: 初回 MVP では、ブログ記事を Git 管理の Markdown / MDX へ移行する方向を中核にする。プロフィール・プロジェクトは当面 microCMS に残す。

## Decisions From Questions

| Topic | Decision |
|---|---|
| 執筆方式 | Git 管理の Markdown / MDX を中核にし、デプロイ操作の面倒さは自動化で軽減する |
| デバイス優先度 | PC での本格執筆を優先し、スマートフォンは軽い修正や公開確認に使う |
| エディタ体験 | Obsidian / VS Code など外部エディタで Markdown を書き、ブログ側はプレビューと公開連携を担う |
| 公開フロー | Markdown / MDX を Pull Request でレビューし、merge 後に deploy する |
| microCMS 移行範囲 | ブログ記事のみ移行し、プロフィールやプロジェクトは microCMS に残す |
| 初回必須フィールド | タイトル、概要、本文、カテゴリ、アイキャッチ、下書きプレビュー |
| 認証・アクセス制御 | 管理画面を作る場合は GitHub OAuth などの専用ログインを実装する |
| 画像管理 | 初回 MVP では決定を後回しにし、本文の執筆体験改善を優先する |
| 初回スコープ | 小さな MVP を作り、執筆体験を素早く改善してから反復する |
| セキュリティ | Security Baseline をブロッキング制約として適用する |

## Functional Requirements

### FR-1: Markdown / MDX ベースの記事管理

- ブログ記事は Git 管理された Markdown / MDX ファイルとして保存できること。
- microCMS のブログ記事取得に依存しない記事取得経路を用意すること。
- 既存のブログ詳細、一覧、カテゴリ、検索、RSS、サイトマップの表示要件を壊さないこと。
- プロフィールとプロジェクトは当面 microCMS から取得し続けること。

### FR-2: 既存 microCMS 記事からの段階的移行

- 既存 microCMS のブログ記事を Markdown / MDX へ移行できる設計にすること。
- 初回 MVP では全自動移行が必須ではないが、記事 ID、slug、公開日、カテゴリ、アイキャッチ参照を維持できる移行方針を定義すること。
- 既存 URL が変わる場合はリダイレクトまたは互換 slug を検討すること。

### FR-3: 外部エディタでの執筆

- Obsidian / VS Code などの外部エディタで本文を書けるファイル構造にすること。
- frontmatter でタイトル、概要、カテゴリ、アイキャッチ、公開状態などを管理できること。
- Markdown / MDX の本文が本番ブログ表示に近い形で確認できること。

### FR-4: プレビュー

- Git 管理の記事を公開前に確認できるプレビュー導線を用意すること。
- PC での本格確認を優先し、スマートフォンでは軽い表示確認ができること。
- 下書き記事は公開記事一覧、RSS、サイトマップ、検索結果に混入しないこと。

### FR-5: Pull Request ベースの公開フロー

- 記事追加・更新は Pull Request としてレビューできること。
- merge 後に Vercel の通常デプロイで公開されること。
- 手動で「毎回デプロイ作業をする」体験にならないよう、既存の GitHub / Vercel 連携を前提に自動化すること。

### FR-6: 初回 MVP の記事フィールド

初回 MVP では、少なくとも次のフィールドを扱うこと。

- title
- description
- content
- category
- eyecatch
- draft / published 状態
- publishedAt / updatedAt

タグ、シリーズ、SEO メタデータ、予約投稿、画像キャプション、コールアウトなどは初回 MVP の必須範囲外とする。

### FR-7: 画像・添付ファイル管理の扱い

- 初回 MVP では画像管理方式を確定しない。
- 既存 microCMS アセット、`public/` 配下、外部画像サービスのいずれにも移行できる余地を残すこと。
- アイキャッチは既存記事表示を壊さない最小限の参照方式を維持すること。

## Non-Functional Requirements

### NFR-1: Usability

- PC で記事本文を効率よく書けることを最優先にする。
- スマートフォンでは軽い修正、プレビュー確認、公開状態確認ができることを目標にする。
- microCMS UI に依存しない執筆体験を提供すること。

### NFR-2: Maintainability

- 記事データ構造は TypeScript 型で扱えること。
- 既存の `src/lib/microcms.ts` と新しい記事取得層の責務を混在させすぎないこと。
- 移行期間中は「記事は Git、プロフィール・プロジェクトは microCMS」という分離を明確にすること。

### NFR-3: Reliability

- 下書き記事が公開ページやフィードに混入しないこと。
- 記事移行後も既存記事 URL、関連記事、カテゴリ導線、RSS、サイトマップが破綻しないこと。
- ビルド時に不正な frontmatter や欠落フィールドを検出できること。

### NFR-4: Security

- Security Baseline を有効化する。
- 管理画面を作る場合は、GitHub OAuth などの認証をサーバー側で検証すること。
- 下書きプレビューや記事管理機能は認可なしに閲覧・変更できないこと。
- GitHub / Vercel / 外部ストレージ連携に使うトークンは環境変数またはシークレット管理に限定し、リポジトリへコミットしないこと。

### NFR-5: Performance

- Markdown / MDX 化によって既存のページ表示速度を悪化させないこと。
- 記事一覧、カテゴリ、検索、RSS、サイトマップ生成で過度なランタイム負荷を増やさないこと。

### NFR-6: Testability

- Markdown / MDX 記事の frontmatter バリデーションをテスト可能にすること。
- 記事取得層、公開・下書きフィルタ、カテゴリ抽出、RSS / sitemap 対象判定にテストを追加できること。

## Technical Constraints

- Astro + TypeScript + Vercel SSR の既存構成を前提にする。
- Firebase のリアクション、閲覧数、ブックマーク機能は記事 ID との互換性を保つ。
- 初回 MVP ではプロフィール・プロジェクトの microCMS 管理は維持する。
- `aidlc-docs/` はワークフロー成果物のみを置き、アプリケーションコードは通常の source tree に配置する。

## Out Of Scope For MVP

- 全コンテンツの microCMS 脱却
- 複数著者のロール管理
- 予約投稿
- 高度な画像アセット管理
- Notion / WordPress 型ブロックエディタ
- 完全なスマートフォン執筆体験

## Security Compliance

| Rule | Status | Notes |
|---|---|---|
| SECURITY-01 | N/A at requirements stage | 新しい永続化ストアはまだ確定していない |
| SECURITY-02 | N/A at requirements stage | ネットワーク仲介層の追加はまだ確定していない |
| SECURITY-03 | Applicable later | 管理 API や同期処理を実装する場合に構造化ログ要件を設計する |
| SECURITY-04 | Applicable later | 管理画面やプレビュー画面を追加する場合に HTTP security headers を確認する |
| SECURITY-05 | Applicable later | 管理 API、プレビュー API、記事同期 API を作る場合に入力検証を必須にする |
| SECURITY-06 | Applicable later | GitHub / Vercel / CMS / ストレージ連携の権限は最小権限にする |
| SECURITY-07 | N/A at requirements stage | ネットワーク構成変更はまだ確定していない |
| SECURITY-08 | Applicable later | 管理画面、プレビュー、記事変更操作は認証・認可必須 |
| SECURITY-09 | Applicable later | エラー表示、公開設定、不要機能の露出を設計・実装時に確認する |
| SECURITY-10 | Applicable later | 依存追加時に lockfile、脆弱性確認、未使用依存を確認する |
| SECURITY-11 | Applicable later | 認証、公開状態判定、下書き除外を責務分離して設計する |
| SECURITY-12 | Applicable later | GitHub OAuth 等を実装する場合にセッション属性、MFA、ブルートフォース対策を確認する |
| SECURITY-13 | Applicable later | PR 履歴、Git 履歴、記事変更履歴をデータ完全性の基盤として扱う |
| SECURITY-14 | Applicable later | 管理操作や認可失敗の監視・ログ保持を設計時に検討する |
| SECURITY-15 | Applicable later | 外部 API、ファイル読み取り、記事変換処理は fail closed にする |

**Blocking Security Findings**: None at Requirements Analysis stage. 実装段階で認証付き管理画面または API を追加する場合、SECURITY-05、SECURITY-08、SECURITY-12、SECURITY-15 は特に重点的に検証する。

## Success Criteria

- 新規記事を Markdown / MDX として Git 管理できる。
- 外部エディタで本文を書き、PR 上またはローカルで公開前確認ができる。
- merge 後の Vercel 自動デプロイで公開できる。
- ブログ記事だけを microCMS から切り離し、プロフィール・プロジェクトは既存 microCMS 取得を維持できる。
- 下書き記事が公開ページ、RSS、サイトマップ、検索に混入しない。
- 初回 MVP の範囲が小さく、後続で画像管理や編集 UI を拡張できる。
