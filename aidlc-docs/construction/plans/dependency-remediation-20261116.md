# Dependency remediation (2026-11-16)

## Scope and authorization
The user authorized remediation, tests and review PRs. This patch builds on PR #37; main and production are never changed directly.

## Findings
Latest-main baseline: 56 npm audit findings (7 critical, 33 high, 12 moderate, 4 low).
An unscoped audit-fix candidate increased findings to 66 and was rejected.
Candidate run 43805364881 instead passed 75 tests, lint and production build with zero audit findings.

## Changes
- Upgrade Astro to 7.4.12, its React/Markdown/Vercel integrations, Vite 8.3.8, Firebase 13.3.0, Sharp 0.35.5, and Vitest/coverage 5.1.0.
- Keep Tailwind 3 and existing styling configuration. Replace its retired Astro integration with an explicit import of the existing global.css; declare autoprefixer directly.
- Remove the unused repository-local Vercel CLI dependency (no source/script references).
- Require Node 22.23.4 or newer within 22.x; record 22.23.4 in .nvmrc.
- Configure Vite's Oxc JSX automatic runtime for TSX tests.
- Pin transitive security fixes where upstream packages still pin vulnerable versions.

## Overrides and compatibility
| Package | Fixed version | Reason |
|---|---|---|
| @grpc/grpc-js | 1.13.6 | Patched certificate validation within the same major API |
| path-to-regexp | 6.3.0 | Patched backtracking within the same major API |
| zod | 4.6.7 | Patched constrained-collection validation within the same major API |
| postcss-selector-parser@6.0.10 | 6.1.6 | Patched selector parsing; preserve existing major-7 consumers |
| minimatch@9 | 11.0.8 | No patched major-9 release; development lint tooling uses the compatible named API, verified by full lint/tests |

Revisit overrides when upstream constraints are fixed; do not apply npm audit fix --force or accept suggested downgrades.

## Verification plan
- [x] Inspect official npm engine/peer metadata and existing imports.
- [x] Test the dependency candidate and achieve zero audit findings.
- [ ] Verify committed lockfile with fresh npm ci, strict npm audit, 77 unit tests, lint and production build.
- [ ] Verify rendered JSON-LD with PR #37 included.
- [ ] Verify Chromium rendering, Tailwind utilities and PC/mobile widths.
- [ ] Remove temporary branch-only CI and open the dependency PR against PR #37's branch.

## Security and limits
SECURITY-06/10/13: read-only pinned-action verifier, official npm registry, committed lockfile and explicit patch constraints.
Other infrastructure/authentication rules are N/A: no new endpoint, permission, credential, or production deployment configuration.
Existing global formatting drift is separate and must not be hidden or reported as healthy.
