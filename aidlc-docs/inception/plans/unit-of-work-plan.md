# Unit of Work Plan: 執筆環境 / CMS 戦略

## 目的

Application Design を、実装と後続の Construction 設計で扱いやすい Unit of Work に分割する。

このリポジトリは Astro + TypeScript のモノリス構成であり、今回の変更も独立デプロイ可能な microservice 分割ではなく、同一アプリケーション内の logical module / work package として扱う。

## 入力成果物

- `aidlc-docs/inception/requirements/authoring-environment-requirements.md`
- `aidlc-docs/inception/user-stories/stories.md`
- `aidlc-docs/inception/user-stories/personas.md`
- `aidlc-docs/inception/plans/authoring-environment-execution-plan.md`
- `aidlc-docs/inception/application-design/application-design.md`
- `aidlc-docs/inception/application-design/components.md`
- `aidlc-docs/inception/application-design/component-methods.md`
- `aidlc-docs/inception/application-design/services.md`
- `aidlc-docs/inception/application-design/component-dependency.md`

## 分割方針

1. まず記事の型・schema・取得境界を作る。
2. 取得境界が安定してから公開ページを置き換える。
3. draft 除外と公開面の安全性を各 surface で検証する。
4. microCMS からの移行支援は runtime の公開経路と分ける。
5. 最後に執筆手順、PR 公開手順、Security Baseline、テストをまとめる。

## Proposed Units

### Unit 1: Markdown / MDX Article Foundation

**目的**: ブログ記事の正規取得元を Git 管理 Markdown / MDX に移すための基盤を作る。

**含む範囲**

- Article Domain Model
- frontmatter schema
- Markdown / MDX article repository
- `draft` / `published` 判定
- stable article ID の設計
- validation unit tests

**主な stories**

- US-1
- US-2
- US-9

### Unit 2: Public Article Query and Surface Integration

**目的**: 既存の公開ページ、RSS、sitemap、検索、関連記事、ブックマーク一覧を新しい公開記事取得境界へ接続する。

**含む範囲**

- Public Article Service
- Home / blog index / blog detail
- category pages
- search
- RSS
- sitemap
- portfolio recent blogs
- Sidebar
- bookmark article list API
- ArticleCard / ArticleNavigation / recommend compatibility

**主な stories**

- US-3
- US-5
- US-7
- US-9

### Unit 3: Preview and PR Publishing Workflow

**目的**: Obsidian / VS Code で書いた記事を local / Vercel Preview で確認し、PR で公開できる流れを整える。

**含む範囲**

- local preview 前提
- Vercel Preview compatibility
- PR review checklist
- draft の preview 方針
- authoring workflow documentation
- 将来の GitHub OAuth / admin UI 拡張点

**主な stories**

- US-3
- US-4
- US-10

### Unit 4: microCMS Blog Migration Support

**目的**: 既存 microCMS ブログ記事を Markdown / MDX へ移すための手順または支援スクリプトを設計・実装する。

**含む範囲**

- legacy microCMS blog mapping
- Markdown / MDX file generation or manual procedure
- ID / slug / publishedAt / updatedAt / category / eyecatch preservation
- Firebase stats compatibility
- duplicate ID detection
- migration validation

**主な stories**

- US-6
- US-7
- US-8
- US-9

### Unit 5: Security, Validation, Tests, and Documentation

**目的**: Security Baseline、draft leak 防止、validation、テスト、執筆ガイドを横断的に仕上げる。

**含む範囲**

- draft exclusion tests
- frontmatter validation tests
- migration validation tests
- RSS / sitemap / search の公開面テスト
- secret 混入防止 checklist
- build / test instructions
- authoring guide

**主な stories**

- US-2
- US-4
- US-5
- US-10

## Dependency Plan

| Unit | Depends On | Reason |
|---|---|---|
| Unit 1 | none | 取得境界と型の基盤 |
| Unit 2 | Unit 1 | 公開ページは新しい記事取得 API が必要 |
| Unit 3 | Unit 1, Unit 2 | preview と PR review は表示面の接続が必要 |
| Unit 4 | Unit 1 | 移行先 schema と stable ID が必要 |
| Unit 5 | Unit 1, Unit 2, Unit 3, Unit 4 | 横断検証と docs は実装単位を参照する |

## Generation Steps

- [x] Generate `aidlc-docs/inception/application-design/unit-of-work.md` with unit definitions and responsibilities.
- [x] Generate `aidlc-docs/inception/application-design/unit-of-work-dependency.md` with dependency matrix.
- [x] Generate `aidlc-docs/inception/application-design/unit-of-work-story-map.md` mapping stories to units.
- [x] Validate unit boundaries and dependencies.
- [x] Ensure all stories are assigned to units.

## Additional Questions

追加質問はありません。

理由: 分割方針は Requirements、User Stories、Application Design で既に十分に決まっています。今回は単一 Astro アプリ内の logical unit 分割であり、チーム所有権や独立 deployment model の追加判断は不要です。

## Security Considerations

- Unit 1 は SECURITY-05 / SECURITY-15 の基盤になる。
- Unit 2 は draft leak 防止の中心であり、SECURITY-08 / SECURITY-11 / SECURITY-15 を意識する。
- Unit 3 は PR 履歴、preview、secret 混入防止として SECURITY-06 / SECURITY-10 / SECURITY-13 を扱う。
- Unit 4 は migration input validation と integrity として SECURITY-05 / SECURITY-13 / SECURITY-15 を扱う。
- Unit 5 は Security Baseline 全体の確認と documentation を扱う。

**Blocking Security Findings**: Units Planning 時点ではなし。

## Approval Gate

この計画を承認後、上記 Generation Steps に従って Unit of Work 成果物を生成する。
