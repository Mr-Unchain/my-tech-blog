# Application Design: 執筆環境 / CMS 戦略

## Summary

この設計では、ブログ記事の正規取得元を Git 管理の Markdown / MDX に移し、profile / projects は初期 MVP では microCMS に残す。公開面は `Public Article Service` を通して記事を取得し、draft 除外を一元化する。既存の Firebase reactions / views / bookmarks は stable article ID を維持して継続利用する。

## Artifacts

- `components.md`: コンポーネント境界と責務
- `component-methods.md`: 高レベル method signatures
- `services.md`: サービス層と orchestration
- `component-dependency.md`: 依存関係、data flow、公開面 mapping

## Key Decisions

| Decision | Rationale |
|---|---|
| Blog articles use Markdown / MDX as the primary source | microCMS UI 依存を外し、Obsidian / VS Code で執筆できるようにする |
| profile / projects remain on microCMS for MVP | 初期 scope を小さくし、ブログ移行に集中する |
| Public article access is centralized | draft 漏えい、RSS / sitemap 混入、検索混入を防ぐ |
| Stable article ID remains mandatory | Firebase views / reactions / bookmarks 互換を保つ |
| Migration support is separated from runtime article reads | 通常公開経路に legacy microCMS blog dependency を残さない |

## Component Summary

| Component | Responsibility |
|---|---|
| C1 Article Domain Model | サイト共通の記事型と stable ID |
| C2 Article Frontmatter Schema | Markdown / MDX metadata validation |
| C3 Markdown Article Repository | Git 管理記事の読み込み |
| C4 Public Article Query Service | 公開記事だけを返す統一窓口 |
| C5 Preview Article Query Service | ローカル / preview 用の取得境界 |
| C6 Legacy microCMS Content Repository | profile / projects と migration source |
| C7 Public Surface Integration | 既存ページと view model の接続 |
| C8 microCMS Blog Migration Support | legacy blog から Markdown / MDX への移行 |
| C9 Publishing Workflow Documentation | 執筆から PR 公開までの手順 |
| C10 Security and Validation Boundary | draft leak 防止、safe error、secret 混入防止 |

## Service Summary

| Service | Responsibility |
|---|---|
| S1 Article Source Service | Markdown / MDX 記事の取得と validation |
| S2 Public Article Service | 公開面向け article query |
| S3 Preview Service | preview context の記事取得 |
| S4 Legacy CMS Service | microCMS に残す content の取得 |
| S5 Migration Service | microCMS blog migration support |
| S6 Publishing Workflow Service | authoring / preview / PR / deploy 手順 |

## Security Compliance

| Rule | Application Design Status | Notes |
|---|---|---|
| SECURITY-01 | N/A | 新規永続化ストアは設計しない。 |
| SECURITY-02 | N/A | 新規 network intermediary は設計しない。 |
| SECURITY-03 | Applicable later | migration / future admin API を実装する場合に structured logging を扱う。 |
| SECURITY-04 | Applicable later | preview / admin UI を追加する場合に headers を確認する。 |
| SECURITY-05 | Compliant at design level | frontmatter と migration input validation を C2 / C8 に分離した。 |
| SECURITY-06 | Applicable later | GitHub / Vercel / microCMS token scope は NFR Design と運用手順で扱う。 |
| SECURITY-07 | N/A | network configuration 変更なし。 |
| SECURITY-08 | Applicable later | 初期 MVP では admin UI なし。将来 preview / admin UI は C5 で認可境界を持つ。 |
| SECURITY-09 | Compliant at design level | error details を公開面に出さない方針を C10 に置いた。 |
| SECURITY-10 | Applicable later | 依存追加時に lockfile / vulnerability scan を確認する。 |
| SECURITY-11 | Compliant at design level | draft 判定、validation、legacy CMS、migration を分離した。 |
| SECURITY-12 | N/A for MVP | 新規認証は初期 MVP では追加しない。 |
| SECURITY-13 | Compliant at design level | PR / Git history と stable ID を前提にし、migration integrity を C8 に分離した。 |
| SECURITY-14 | Applicable later | admin UI / auth failure monitoring は将来拡張で扱う。 |
| SECURITY-15 | Compliant at design level | validation 失敗時は公開しない fail closed を C4 / C10 に置いた。 |

**Blocking Security Findings**: Application Design 時点ではなし。

## Open Items for Later Stages

- frontmatter schema の厳密な field 型と default rule。
- `id` と `slug` の併用方針。
- Markdown / MDX rendering pipeline の具体実装。
- migration を script にするか manual procedure にするか。
- bookmark list API と sitemap generation の置き換え順序。
- preview を local-only にするか Vercel Preview でも draft を確認可能にするか。

## Review Gate

Application Design は完了。次は Units Generation で、この設計を実装可能な作業単位へ分割する。

