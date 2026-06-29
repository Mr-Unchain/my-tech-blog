# Unit 1 Functional Design: Domain Entities

## Entity Overview

Unit 1 uses these domain entities to convert Markdown / MDX source files into validated article objects.

## Article

Canonical domain object used by downstream article services.

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | `ArticleId` | Yes | Stable microCMS-compatible ID. |
| `urlPath` | `ArticlePath` | Yes | Derived as `/blog/{id}/`. |
| `title` | `string` | Yes | Trimmed display title. |
| `description` | `string` | Yes | Trimmed summary. |
| `content` | `ArticleBody` | Yes | MDX body content. |
| `category` | `CategoryList` | Yes | Non-empty array. |
| `eyecatch` | `ArticleImageReference` | Public only | Derived from frontmatter URL. |
| `publicationState` | `PublicationState` | Yes | Derived from `draft` and `publishedAt`. |
| `publishedAt` | `DateTime` | Public only | Required for public articles. |
| `updatedAt` | `DateTime` | No | Optional, must be valid if present. |
| `sourcePath` | `ArticleSourcePath` | Yes | File path for traceability and validation errors. |

## ArticleFrontmatter

Raw metadata parsed from the MDX file before normalization.

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | `unknown` | Yes | Validated into `ArticleId`. |
| `title` | `unknown` | Yes | Validated into trimmed string. |
| `description` | `unknown` | Yes | Validated into trimmed string. |
| `category` | `unknown` | Yes | Validated into `CategoryList`. |
| `eyecatch` | `unknown` | Public only | URL string in MVP. |
| `draft` | `unknown` | No | Boolean if present; default is `false`. |
| `publishedAt` | `unknown` | Public only | Valid date-time string. |
| `updatedAt` | `unknown` | No | Valid date-time string if present. |

## ArticleId

Stable identifier for URLs and existing Firebase-related data.

- Source is frontmatter `id`.
- Public URL uses this value.
- Existing migrated articles keep their microCMS `id`.
- New articles must choose a stable ID before publication.
- Duplicate IDs across article files are invalid.

## ArticleSourcePath

Path to the article source file.

- Must be under `src/content/blog/`.
- Canonical file extension is `.mdx`.
- Filename stem should match `ArticleId`.

## ArticlePath

Derived public path.

- Derived from `ArticleId`.
- Shape: `/blog/{id}/`.
- Not manually authored in frontmatter.

## ArticleBody

MDX body content after frontmatter extraction.

- Must be non-empty.
- Markdown-only content is valid.
- Rendering behavior is handled by later public integration work.

## CategoryList

Normalized article categories.

- Non-empty `string[]`.
- Values are trimmed.
- Empty values are invalid.
- Duplicates are removed during normalization.
- No allowlist is enforced in the MVP.

## ArticleImageReference

Internal representation of the `eyecatch` URL.

Source frontmatter:

```yaml
eyecatch: "https://example.com/image.png"
```

Internal shape:

| Field | Type | Required | Notes |
|---|---|---|---|
| `url` | `string` | Yes | Original validated URL string. |
| `sourceType` | `local-path | remote-url` | Yes | Derived from URL shape. |

- Frontmatter remains a simple URL string for authoring.
- Object-style image metadata is outside the MVP.
- The internal shape preserves room for future width, height, and alt metadata.

## PublicationState

Derived state used to protect public surfaces.

| Value | Meaning |
|---|---|
| `draft` | Private article; never public. |
| `published` | Public article with valid `publishedAt`. |

Decision rules:

- `draft: true` becomes `draft`.
- `draft: false` plus valid `publishedAt` becomes `published`.
- omitted `draft` plus valid `publishedAt` becomes `published`.
- any ambiguous or invalid state becomes `ValidationError`.

## ValidationError

Developer-facing validation failure.

| Field | Type | Required | Notes |
|---|---|---|---|
| `sourcePath` | `ArticleSourcePath` | Yes | Identifies the article file. |
| `field` | `string` | Yes | Frontmatter or body field. |
| `code` | `string` | Yes | Stable error code for tests. |
| `message` | `string` | Yes | Safe human-readable message. |

- Must not include secrets or raw token-like values.
- Causes build / test / dev validation failure.
- Prevents invalid articles from entering the article repository result.

## ArticleRepositoryResult

Successful result:

- collection of validated Article objects
- duplicate ID check has passed
- every included article has valid source metadata

Failure result:

- one or more `ValidationError` values
- no invalid article is returned as public content
- caller must fail build / test / dev startup rather than publishing partial unsafe output

## Entity Relationships

| Relationship | Description |
|---|---|
| `ArticleSourcePath` contains `ArticleFrontmatter` and `ArticleBody` | Raw file source. |
| `ArticleFrontmatter.id` validates into `ArticleId` | Canonical identity. |
| `ArticleId` derives `ArticlePath` | Public URL compatibility. |
| `ArticleFrontmatter.category` normalizes into `CategoryList` | Public category surfaces use this later. |
| `ArticleFrontmatter.eyecatch` normalizes into `ArticleImageReference` | Existing UI can adapt without complex authoring metadata. |
| `ArticleFrontmatter.draft` and `publishedAt` derive `PublicationState` | Central public / private decision. |
| invalid fields create `ValidationError` | Fail-closed behavior. |

## Security Compliance

| Rule | Status | Notes |
|---|---|---|
| SECURITY-05 | Compliant by design | Domain boundaries validate untrusted frontmatter before creating Article. |
| SECURITY-11 | Compliant by design | Publication state is a central domain concept. |
| SECURITY-13 | Compliant by design | Article identity and source path consistency are modeled explicitly. |
| SECURITY-15 | Compliant by design | Validation errors stop unsafe publication. |

**Blocking Security Findings**: None.
