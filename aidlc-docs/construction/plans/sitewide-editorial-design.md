# Sitewide Editorial Design

## Request and scope

The user approved the hybrid editorial direction in the protected preview and asked to apply the home and article styling to all pages. The existing homepage and article page establish the visual reference. This work covers the blog archive, category index and detail, search, bookmarks, contact, profile, portfolio, privacy, 404, and the development-only drafts page. API and RSS responses have no visual page to restyle.

## Implementation

- Share page title, eyebrow, description, colors, typography, spacing, borders, controls, and list patterns across interior pages.
- Keep existing content sources, query parameters, search highlighting, bookmark hydration, contact submission, CMS fallback behavior, and theme handling.
- Replace decorative gradients and heavy shadows on profile and portfolio with the approved editorial treatment.
- Correct the existing inline module scripts in the base layout so Swup and service worker handling execute in the browser.

## Verification

- Validate content, run production build, lint, and unit tests.
- Open every visual route in Chromium, inspect representative desktop and mobile screenshots, check for horizontal overflow, and exercise search, archive filters, theme, and contact controls without sending a message.
- Deploy only the protected preview branch and confirm the updated deployment serves the routes.

## Security compliance

This change adds no store, API, identity, dependency, or infrastructure resource. SECURITY-01 through SECURITY-09, SECURITY-11 through SECURITY-12, and SECURITY-14 through SECURITY-15 are unchanged or not applicable to this visual change. SECURITY-10 keeps the existing lockfile. SECURITY-13 applies to the search suggestions and highlighting: suggestions use DOM option nodes and highlighted text is HTML escaped before the trusted mark tag is inserted.

## Portfolio withdrawal (2026-11-09)

The user requested the portfolio be unpublished because it is not maintained and is not ready to show. Remove the Astro route so direct visits receive the site's 404 response; remove desktop, mobile, and footer links; and exclude the path from the sitemap. The old page remains recoverable from Git history. The historical article about building a portfolio remains published because it is a separate post.
