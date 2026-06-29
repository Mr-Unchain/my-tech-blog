# Component Dependency: 執筆環境 / CMS 戦略

## Dependency Matrix

| From | Depends On | Reason |
|---|---|---|
| C3 Markdown Article Repository | C1, C2, C10 | 記事型、frontmatter validation、fail closed が必要 |
| C4 Public Article Query Service | C3, C10 | 公開記事だけを返す統一窓口にするため |
| C5 Preview Article Query Service | C3, C10 | preview context と draft 制御が必要 |
| C6 Legacy microCMS Content Repository | microCMS SDK | profile / projects と migration source を取得するため |
| C7 Public Surface Integration | C4, C5, C6 | ページごとの view model を作るため |
| C8 microCMS Blog Migration Support | C1, C2, C6, C10 | legacy data を Article へ安全に変換するため |
| C9 Publishing Workflow Documentation | C2, C5, C10 | 執筆手順、preview、PR review の前提を説明するため |
| C10 Security and Validation Boundary | C1, C2 | 記事状態と validation result を検査するため |

## Communication Patterns

- 公開ページは C4 Public Article Query Service を経由する。
- preview は C5 Preview Article Query Service を経由する。
- profile / projects は C6 Legacy microCMS Content Repository を経由する。
- migration は C8 を経由し、通常公開経路とは分離する。
- Firebase reactions / views / bookmarks は Article Domain Model の stable ID を使う。

## Data Flow: Public Article

1. Markdown / MDX file
2. C2 Article Frontmatter Schema
3. C3 Markdown Article Repository
4. C4 Public Article Query Service
5. C7 Public Surface Integration
6. Astro pages / RSS / sitemap / API responses

## Data Flow: Preview Article

1. Markdown / MDX file
2. C2 Article Frontmatter Schema
3. C3 Markdown Article Repository
4. C5 Preview Article Query Service
5. preview route or local dev server

## Data Flow: Legacy microCMS

1. microCMS profile / projects
2. C6 Legacy microCMS Content Repository
3. existing profile / portfolio surfaces

## Data Flow: Migration

1. microCMS blogs
2. C6 Legacy microCMS Content Repository
3. C8 microCMS Blog Migration Support
4. Markdown / MDX article files
5. C3 Markdown Article Repository validation

## Public Surface Mapping

| Surface | Article Source | Notes |
|---|---|---|
| `/` | C4 | latest / popular / category tab must exclude draft |
| `/blog` | C4 | pagination, sort, category filtering |
| `/blog/[id]` | C4 for public, C5 for preview if later enabled | stable ID required for Firebase |
| `/category` | C4 | published article category counts only |
| `/category/[categoryName]` | C4 | published article list only |
| `/search` | C4 | published article search only |
| `/rss.xml` | C4 | no draft |
| `sitemap` | C4 | no draft |
| `/portfolio` recent blogs | C4 + C6 | profile/projects remain microCMS; recent blogs from C4 |
| bookmark article list API | C4 | resolve saved article IDs without microCMS blog dependency |

## Dependency Rules

- Page files must not parse Markdown files directly.
- Page files must not call microCMS blog APIs for normal blog article rendering after migration.
- `src/lib/microcms.ts` remains responsible for microCMS-backed non-blog content.
- Article validation must happen before any public surface mapping.
- Draft exclusion must be centralized, not duplicated ad hoc in each page.

