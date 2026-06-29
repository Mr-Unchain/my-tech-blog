# Unit of Work: 執筆環境 / CMS 戦略

## Overview

この変更は単一の Astro + TypeScript アプリケーション内で実装する。Unit は独立デプロイ可能な service ではなく、実装・設計・テストを進めるための logical work package として扱う。

## Unit 1: Markdown / MDX Article Foundation

### Purpose

ブログ記事の正規取得元を Git 管理 Markdown / MDX に移すための基盤を作る。

### Responsibilities

- Article Domain Model を定義する。
- Markdown / MDX frontmatter schema を定義する。
- Markdown / MDX article repository を用意する。
- `draft` / `published` の公開状態を判定する。
- stable article ID を扱い、Firebase 連携の互換性を保つ。
- frontmatter validation を unit test 可能にする。

### Included Components

- C1 Article Domain Model
- C2 Article Frontmatter Schema
- C3 Markdown Article Repository
- C10 Security and Validation Boundary

### Primary Services

- S1 Article Source Service

### Inputs

- Markdown / MDX article files
- frontmatter metadata
- existing microCMS blog field expectations

### Outputs

- validated Article objects
- public / draft status
- category arrays
- stable article IDs
- validation errors safe for developer feedback

### Acceptance Focus

- 新規記事を Markdown / MDX として追加できる。
- 必須 frontmatter が欠けた記事は検出できる。
- invalid article は公開記事として扱われない。
- existing Firebase article ID compatibility を壊さない。

### Security Notes

- SECURITY-05: frontmatter input validation を集中させる。
- SECURITY-13: stable ID と article metadata の integrity を保つ。
- SECURITY-15: validation failure は fail closed にする。

## Unit 2: Public Article Query and Surface Integration

### Purpose

既存の公開ページ、RSS、sitemap、検索、関連記事、ブックマーク一覧を、新しい公開記事取得境界へ接続する。

### Responsibilities

- Public Article Service を導入する。
- Home、blog index、blog detail、category pages、search を新しい article source に接続する。
- RSS と sitemap から draft を除外する。
- Sidebar、portfolio recent blogs、bookmark article list API を更新する。
- ArticleCard、ArticleNavigation、recommend、reading time との互換性を保つ。

### Included Components

- C4 Public Article Query Service
- C7 Public Surface Integration
- C10 Security and Validation Boundary

### Primary Services

- S2 Public Article Service

### Inputs

- validated Article objects from Unit 1
- URL query parameters
- category names
- bookmark article IDs

### Outputs

- page view models
- RSS items
- sitemap entries
- search results
- bookmark article summaries

### Acceptance Focus

- 公開面に draft が混入しない。
- 既存 URL と ArticleCard 表示が壊れない。
- RSS、sitemap、検索、カテゴリ一覧が公開記事のみを扱う。
- bookmark list が microCMS blog dependency なしで記事情報を解決できる。

### Security Notes

- SECURITY-08: public / preview の access boundary を分ける。
- SECURITY-11: draft exclusion をページごとの ad hoc 実装にしない。
- SECURITY-15: query failure は draft を公開する方向に倒さない。

## Unit 3: Preview and PR Publishing Workflow

### Purpose

Obsidian / VS Code で書いた記事を local / Vercel Preview で確認し、PR review と merge で公開できる流れを整える。

### Responsibilities

- local preview の前提を定義する。
- Vercel Preview で公開前表示を確認できる範囲を整理する。
- PR review checklist を作る。
- draft の扱いと publish への切り替え手順を明文化する。
- 将来の GitHub OAuth / admin UI preview 拡張点を残す。

### Included Components

- C5 Preview Article Query Service
- C9 Publishing Workflow Documentation
- C10 Security and Validation Boundary

### Primary Services

- S3 Preview Service
- S6 Publishing Workflow Service

### Inputs

- local dev context
- Vercel Preview context
- draft article files
- PR diffs

### Outputs

- preview behavior
- authoring workflow documentation
- PR review checklist
- future admin UI extension notes

### Acceptance Focus

- 著者が PC で local preview できる。
- PR 上で表示確認できる導線がある。
- merge 後に Vercel deploy で公開される前提が明確である。
- secret 混入や draft 設定の確認ポイントがある。

### Security Notes

- SECURITY-06: GitHub / Vercel token scope は最小権限を前提にする。
- SECURITY-10: CI / dependency / lockfile 確認を workflow に含める。
- SECURITY-13: PR history と Git history で変更追跡できる。

## Unit 4: microCMS Blog Migration Support

### Purpose

既存 microCMS ブログ記事を Markdown / MDX へ移すための手順または支援スクリプトを設計・実装する。

### Responsibilities

- legacy microCMS blog fields を Markdown / MDX frontmatter と本文へ mapping する。
- ID / slug / publishedAt / updatedAt / category / eyecatch を維持する。
- Firebase stats compatibility を検証する。
- duplicate ID と invalid field を検出する。
- migration result を Unit 1 の validation に通す。

### Included Components

- C6 Legacy microCMS Content Repository
- C8 microCMS Blog Migration Support
- C10 Security and Validation Boundary

### Primary Services

- S4 Legacy CMS Service
- S5 Migration Service

### Inputs

- microCMS blog entries
- microCMS API credentials from environment
- existing URL / Firebase ID expectations

### Outputs

- Markdown / MDX article files or manual migration procedure
- migration report
- duplicate / invalid data report

### Acceptance Focus

- 既存記事の重要 metadata を維持できる。
- profile / projects は microCMS に残る。
- invalid migration result は公開記事にならない。
- ID 互換性の問題を検出できる。

### Security Notes

- SECURITY-05: migration input を validation する。
- SECURITY-13: migration result の integrity を検証する。
- SECURITY-15: migration failure は fail closed にする。

## Unit 5: Security, Validation, Tests, and Documentation

### Purpose

Security Baseline、draft leak 防止、validation、テスト、執筆ガイドを横断的に仕上げる。

### Responsibilities

- draft exclusion tests を追加する。
- frontmatter validation tests を追加する。
- migration validation tests を追加する。
- RSS / sitemap / search / category / bookmark list の公開面テストを整理する。
- secret 混入防止 checklist を作る。
- build / test / authoring guide を追加する。

### Included Components

- C9 Publishing Workflow Documentation
- C10 Security and Validation Boundary
- all public integration points

### Primary Services

- S6 Publishing Workflow Service
- cross-unit validation support

### Inputs

- implemented Units 1-4
- Security Baseline rules
- test suite
- build results

### Outputs

- tests
- authoring guide
- build / test instructions
- security checklist

### Acceptance Focus

- draft が公開面に混入しないことを検証できる。
- frontmatter の不正を検出できる。
- migration の破損を検出できる。
- 執筆者が Markdown / MDX 記事を作成し PR 公開できる。

### Security Notes

- SECURITY-05, SECURITY-10, SECURITY-11, SECURITY-13, SECURITY-15 を横断確認する。
- 将来 admin UI / OAuth を入れる場合の SECURITY-08 / SECURITY-12 は拡張課題として残す。

## Boundary Validation

| Check | Result |
|---|---|
| All stories assigned | Pass |
| Runtime public article path separated from migration path | Pass |
| profile / projects remain outside Markdown article source | Pass |
| Security-sensitive draft logic centralized | Pass |
| Unit dependency order supports incremental implementation | Pass |

## Security Compliance

| Rule | Units Generation Status | Notes |
|---|---|---|
| SECURITY-01 | N/A | 新規永続化ストアなし。 |
| SECURITY-02 | N/A | 新規 network intermediary なし。 |
| SECURITY-03 | Applicable later | migration / future admin API 実装時に扱う。 |
| SECURITY-04 | Applicable later | preview / admin UI 追加時に扱う。 |
| SECURITY-05 | Covered | Unit 1 と Unit 4 で validation を扱う。 |
| SECURITY-06 | Covered later | Unit 3 で GitHub / Vercel 権限を docs / checklist に含める。 |
| SECURITY-07 | N/A | network configuration 変更なし。 |
| SECURITY-08 | Covered later | Unit 2 / Unit 3 で public / preview boundary を扱う。 |
| SECURITY-09 | Covered later | Unit 5 で safe errors と不要露出を確認する。 |
| SECURITY-10 | Covered later | Unit 3 / Unit 5 で dependency / CI 観点を扱う。 |
| SECURITY-11 | Covered | Unit 1 / Unit 2 で validation と draft exclusion を分離する。 |
| SECURITY-12 | N/A for MVP | 新規認証なし。将来 admin UI で扱う。 |
| SECURITY-13 | Covered | Unit 3 / Unit 4 で PR history と migration integrity を扱う。 |
| SECURITY-14 | Applicable later | admin UI / auth monitoring は将来拡張。 |
| SECURITY-15 | Covered | Unit 1 / Unit 2 / Unit 4 で fail closed を扱う。 |

**Blocking Security Findings**: Units Generation 時点ではなし。

