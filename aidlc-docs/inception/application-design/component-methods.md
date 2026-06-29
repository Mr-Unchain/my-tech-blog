# Component Methods: 執筆環境 / CMS 戦略

## C1: Article Domain Model

```ts
type ArticleId = string;
type ArticleSlug = string;

type ArticleStatus = 'draft' | 'published';

type ArticleImage = {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
};

type Article = {
  id: ArticleId;
  slug: ArticleSlug;
  title: string;
  description: string;
  content: string;
  category: string[];
  eyecatch?: ArticleImage;
  status: ArticleStatus;
  publishedAt?: string;
  updatedAt?: string;
};
```

| Method | Purpose | Input | Output |
|---|---|---|---|
| `toPublicArticle(raw)` | 内部表現を公開用記事へ変換する | validated raw article | `Article` |
| `toArticleCardProps(article)` | ArticleCard 互換の props を作る | `Article` | ArticleCard props |
| `toFirebaseArticleId(article)` | Firebase 連携用の安定 ID を返す | `Article` | `string` |

## C2: Article Frontmatter Schema

| Method | Purpose | Input | Output |
|---|---|---|---|
| `validateFrontmatter(frontmatter, sourcePath)` | frontmatter を検証する | unknown metadata, file path | validated metadata or validation error |
| `normalizeCategory(value)` | category を `string[]` に正規化する | unknown category value | `string[]` |
| `normalizeArticleStatus(value)` | draft / published 状態を判定する | unknown status fields | `ArticleStatus` |
| `normalizeImage(value)` | eyecatch 参照を共通表現にする | unknown image value | `ArticleImage | undefined` |

## C3: Markdown Article Repository

| Method | Purpose | Input | Output |
|---|---|---|---|
| `getAllArticles(options)` | Markdown / MDX 記事を取得する | query options | `Article[]` |
| `getArticleById(id, options)` | ID で記事詳細を取得する | `ArticleId`, query options | `Article | null` |
| `getArticleBySlug(slug, options)` | slug で記事詳細を取得する | `ArticleSlug`, query options | `Article | null` |
| `getCategories(options)` | 記事カテゴリ一覧を取得する | query options | category summary |
| `assertValidArticles()` | build / test 用に全記事を検証する | none | validation result |

## C4: Public Article Query Service

| Method | Purpose | Input | Output |
|---|---|---|---|
| `listPublishedArticles(query)` | 公開記事だけを一覧取得する | pagination, sort, category | paged result |
| `getPublishedArticle(idOrSlug)` | 公開記事詳細を取得する | ID or slug | `Article | null` |
| `searchPublishedArticles(query)` | 公開記事だけを検索する | keyword, category | `Article[]` |
| `listPublishedCategories()` | 公開記事に紐づくカテゴリを集計する | none | category summary |
| `listRssArticles(limit)` | RSS 対象の記事を取得する | limit | `Article[]` |
| `listSitemapEntries()` | sitemap 対象 URL を取得する | none | URL entries |

## C5: Preview Article Query Service

| Method | Purpose | Input | Output |
|---|---|---|---|
| `listPreviewArticles(context)` | preview context で記事一覧を返す | local / preview context | `Article[]` |
| `getPreviewArticle(idOrSlug, context)` | preview context で記事詳細を返す | ID or slug, context | `Article | null` |
| `isPreviewAllowed(context)` | preview が許可されるか判定する | request / environment context | `boolean` |

## C6: Legacy microCMS Content Repository

| Method | Purpose | Input | Output |
|---|---|---|---|
| `getProfile(queries)` | profile を microCMS から取得する | microCMS queries | profile or null |
| `getProjects(queries)` | projects を microCMS から取得する | microCMS queries | project list |
| `getLegacyBlogForMigration(queries)` | migration 用に旧ブログ記事を取得する | microCMS queries | legacy blog list |

## C7: Public Surface Integration

| Method | Purpose | Input | Output |
|---|---|---|---|
| `loadHomeArticles(tabQuery)` | Home 用の記事一覧を取得する | active tab query | article view model |
| `loadBlogIndex(query)` | `/blog` 用の記事一覧を取得する | page, sort, category | paged view model |
| `loadBlogDetail(idOrSlug)` | `/blog/[id]` 用の記事詳細を取得する | ID or slug | detail view model |
| `loadCategoryPage(categoryName)` | category page 用の記事一覧を取得する | category name | category view model |
| `loadSearchPage(query)` | search page 用の記事一覧を取得する | keyword, category | search view model |
| `loadBookmarkArticles(ids)` | bookmark list 用の記事概要を取得する | article IDs | article summaries |

## C8: microCMS Blog Migration Support

| Method | Purpose | Input | Output |
|---|---|---|---|
| `mapLegacyBlogToArticle(legacyBlog)` | microCMS 記事を Article metadata へ対応付ける | legacy blog | article draft data |
| `renderArticleFile(articleData)` | Markdown / MDX ファイル内容を生成する | article draft data | file content |
| `validateMigrationResult(articleData)` | 移行後の互換性を検証する | article draft data | validation result |
| `detectDuplicateIds(articles)` | 重複 ID を検出する | article data list | duplicate report |

## C9: Publishing Workflow Documentation

| Method | Purpose | Input | Output |
|---|---|---|---|
| `documentAuthoringSteps()` | 執筆手順を定義する | none | markdown docs |
| `documentPreviewSteps()` | preview 手順を定義する | none | markdown docs |
| `documentPrPublishingSteps()` | PR 公開手順を定義する | none | markdown docs |

## C10: Security and Validation Boundary

| Method | Purpose | Input | Output |
|---|---|---|---|
| `assertNoDraftLeak(surfaceName, articles)` | 公開面に draft が混入していないことを検証する | surface name, articles | assertion result |
| `redactValidationError(error)` | エラー表示から secret / 内部詳細を除く | error | safe message |
| `assertNoSecretInArticle(article)` | 記事 metadata / 本文に secret らしき値がないか検査する | article | finding list |

