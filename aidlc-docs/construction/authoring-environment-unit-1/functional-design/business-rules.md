# Unit 1 Functional Design: Business Rules

## Rule Summary

These rules define when a Markdown / MDX article file is valid and how it becomes an Article domain object.

## Article Source Rules

### BR-1: Article Source Location

Article source files must be located under `src/content/blog/`.

- Accept canonical MVP files matching `src/content/blog/*.mdx`.
- Reject or ignore files outside this directory as non-article files.
- Nested directory layouts are outside Unit 1.

### BR-2: MDX Primary Format

New article files must use the `.mdx` extension.

- Markdown syntax is allowed inside `.mdx`.
- MDX-specific syntax is allowed only if the renderer used later can render it safely.
- `.md` extension support is not required for the MVP.

## Identity Rules

### BR-3: Stable Article ID

Every article must define a non-empty `id`.

- `id` must be a string.
- `id` must be stable after publication.
- `id` must be URL-safe.
- Recommended pattern: `^[A-Za-z0-9_-]+$`.

### BR-4: Filename and ID Consistency

The filename stem should match `id` in the MVP.

- `src/content/blog/my-article.mdx` with `id: my-article` is valid.
- A filename / `id` mismatch is a validation error unless a later migration rule explicitly permits aliases.

### BR-5: Public URL Derivation

The public URL is derived from `id`.

- `id: abc123` becomes `/blog/abc123/`.
- No separate `slug` field controls routing in Unit 1.

## Metadata Rules

### BR-6: Title

`title` is required.

- Must be a non-empty string after trimming.
- Must not contain HTML or script content.
- Recommended maximum length: 120 characters.

### BR-7: Description

`description` is required.

- Must be a non-empty string after trimming.
- Must not contain HTML or script content.
- Recommended maximum length: 240 characters.

### BR-8: Category

`category` is required as `string[]`.

- Must contain at least one category.
- Every category must be a non-empty string after trimming.
- Duplicate category values are normalized away.
- No category allowlist is required in the MVP.

### BR-9: Eyecatch

`eyecatch` is a URL string in frontmatter.

- Public articles must provide `eyecatch`.
- Draft articles may omit `eyecatch`.
- Allowed URL forms are project-relative paths beginning with `/` and HTTPS URLs.
- Reject `javascript:`, `data:`, empty strings, and malformed URLs.
- Internally, the URL string may be normalized to a common image reference object for existing display compatibility.

### BR-10: Body Content

An article must contain body content.

- Body content must not be empty after trimming.
- Secrets and credentials are not validated exhaustively in Unit 1, but future Unit 5 must add explicit checks.

## Publication Rules

### BR-11: Draft Always Private

`draft: true` always means the article is private.

- A draft article is never returned as a public article.
- `publishedAt` does not override `draft: true`.

### BR-12: Public Article Requires Published Date

An article is public only when `draft` is `false` or omitted and `publishedAt` is valid.

- `draft: false` without `publishedAt` is invalid.
- omitted `draft` without `publishedAt` is invalid.
- invalid date strings are validation errors.

### BR-13: Updated Date

`updatedAt` is optional.

- If present, it must be a valid date-time string.
- If both `publishedAt` and `updatedAt` exist, `updatedAt` must not be earlier than `publishedAt`.

## Validation and Error Rules

### BR-14: Build / Test Failure

Frontmatter validation errors fail build and test.

- Development, test, and build use the same validation rules.
- Validation cannot silently downgrade an invalid public article into a valid public result.

### BR-15: Fail Closed

Any uncertainty in publication state fails closed.

- Invalid `draft` type is a validation error.
- Invalid or missing `publishedAt` for non-drafts is a validation error.
- Repository failures do not expose draft articles as a fallback.

### BR-16: Safe Error Messages

Validation errors are developer-facing but must not leak sensitive values.

- Include file path, field name, and concise reason.
- Do not include environment variable values, tokens, API keys, or raw secret-like strings.

## Security Compliance

| Rule | Status | Notes |
|---|---|---|
| SECURITY-05 | Compliant by design | Rules define type, length, format, and URL validation for frontmatter input. |
| SECURITY-11 | Compliant by design | Draft handling is centralized and not left to individual pages. |
| SECURITY-13 | Compliant by design | Stable ID and filename matching guard article identity. |
| SECURITY-15 | Compliant by design | Invalid metadata fails closed during build / test / dev. |

**Blocking Security Findings**: None.
