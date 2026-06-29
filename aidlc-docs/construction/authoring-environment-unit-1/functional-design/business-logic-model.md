# Unit 1 Functional Design: Business Logic Model

## Scope

Unit 1 defines the business logic for treating Git-managed Markdown / MDX files as the canonical blog article source.

This unit covers article identity, source discovery, frontmatter validation, draft / published state decisions, Article domain object creation, and validation failures that fail closed during build, test, and development.

This unit does not cover public page integration, RSS / sitemap / search wiring, preview access control, microCMS migration execution, or authoring workflow documentation.

## Decisions Applied

| Topic | Decision |
|---|---|
| Canonical article ID | Keep the existing microCMS `id` as the article `id`. |
| Public URL | Keep `/blog/{id}/`. |
| Article file location | Store article files under `src/content/blog/{id-or-slug}.mdx`. |
| Primary content format | Use MDX as the primary format. Markdown-only syntax is valid because it is a compatible subset of MDX. |
| Publication state | `draft: true` is always private. `draft: false` or omitted plus valid `publishedAt` is public. |
| Category | `category` is required as `string[]`; multiple categories are allowed. |
| Validation timing | Validation failures fail build / test. Development uses the same validation. |
| Eyecatch | `eyecatch` frontmatter is a URL string in the MVP. |

## Business Flow

1. Discover article source files under `src/content/blog/`.
2. Read each `.mdx` file and split it into frontmatter metadata and body content.
3. Validate frontmatter against the article schema.
4. Validate identity consistency between file path and frontmatter.
5. Normalize frontmatter into a canonical Article domain object.
6. Determine publication state from `draft` and `publishedAt`.
7. Return validated articles or a deterministic validation failure.

## Article Discovery Logic

The article repository scans `src/content/blog/` for MDX article files.

Rules:

- `.mdx` is the canonical file extension for newly authored articles.
- Markdown-only content is allowed inside `.mdx` files.
- `.md` files are not required for the MVP unless a later unit explicitly extends compatibility.
- Nested year directories are outside the MVP.
- Files outside `src/content/blog/` are not article source files.

## Identity Logic

The frontmatter `id` is the canonical identity. It must be stable because existing Firebase reactions, views, and bookmarks depend on it.

Identity flow:

1. Read frontmatter `id`.
2. Validate that `id` exists and uses the allowed ID format.
3. Compare the article filename stem with `id`.
4. Treat mismatch as a validation error for the MVP.
5. Generate public URL as `/blog/{id}/`.

The design intentionally avoids separate `slug` routing in Unit 1. A future slug migration can be added only if it preserves the canonical `id` for Firebase compatibility.

## Frontmatter Normalization

Raw frontmatter is converted into the Article domain model.

Required for every article:

- `id`
- `title`
- `description`
- `category`
- body content

Required for public articles:

- valid `publishedAt`
- valid `eyecatch`

Optional for drafts:

- `publishedAt`
- `updatedAt`
- `eyecatch`

Normalization output:

- trimmed text fields
- category values trimmed and deduplicated
- date strings parsed as valid date-time values
- `draft` normalized to boolean with default `false`
- `eyecatch` normalized into an internal image reference shape for downstream display compatibility

## Publication State Logic

Publication state is derived, not manually stored as a separate status field.

| Input | Result |
|---|---|
| `draft: true` | `draft`, never public |
| `draft: false` + valid `publishedAt` | `published` |
| omitted `draft` + valid `publishedAt` | `published` |
| `draft: false` without `publishedAt` | validation error |
| omitted `draft` without `publishedAt` | validation error |
| invalid `publishedAt` | validation error |

This fail-closed rule prevents an invalid or ambiguous article from entering public query results.

## Validation Failure Logic

Validation failures are collected as developer-facing errors and cause build / test failure.

Failure behavior:

- Invalid articles are not returned as public articles.
- The repository fails closed instead of silently dropping invalid data in production build.
- Error messages include article file identity and field names.
- Error messages must not include secrets, tokens, full environment values, or unnecessary internal details.
- Development uses the same validation path as build / test to avoid environment drift.

## Security Compliance

| Rule | Status | Notes |
|---|---|---|
| SECURITY-05 | Compliant by design | Frontmatter is treated as untrusted input and validated before use. |
| SECURITY-11 | Compliant by design | Draft / published decision is centralized in the article source layer. |
| SECURITY-13 | Compliant by design | Stable `id` and filename consistency preserve article identity integrity. |
| SECURITY-15 | Compliant by design | Validation errors fail closed and do not publish ambiguous content. |

**Blocking Security Findings**: None.
