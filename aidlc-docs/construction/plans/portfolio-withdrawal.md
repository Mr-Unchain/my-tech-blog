# Portfolio Withdrawal

The user requested that the portfolio be unpublished because it is not maintained and is not ready to show. Remove `src/pages/portfolio.astro` so the old URL returns the normal 404 page. Remove its desktop, mobile, and footer links and exclude `/portfolio` from the sitemap. Keep the historical blog post about creating the page, and keep its earlier implementation recoverable from Git history.

This patch is based on the production branch and contains no editorial redesign changes. Verify content, build, lint, the direct URL response, navigation links, and the generated sitemap. No new dependencies, APIs, stores, permissions, or data handling are introduced; the enabled Security Baseline is unchanged, and removing the route reduces exposed content.
