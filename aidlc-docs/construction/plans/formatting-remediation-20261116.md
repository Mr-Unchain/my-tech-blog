# Formatting remediation (2026-11-16)

## Scope
Build on PR #37 (JSON-LD) and PR #38 (dependency remediation). Normalize the existing 70 source files reported by the unchanged Prettier configuration. No dependency, article body, feature, API, permission or production workflow changes belong in this patch.

## Steps
- [x] Reproduce existing style drift after resolving parser errors.
- [x] Apply npm run format until output is stable, without changing formatter configuration or ignore rules.
- [x] Verify candidate run 43806859783: zero npm audit findings, 77 tests, lint, build, complete formatting and six Chromium route/viewport cases.
- [x] Commit only formatted source and workflow records.
- [x] Run the exact repository diagnostic script on committed source and assert healthy.
- [x] Read the original diagnostic artifact and verify its archive digest for comparison.
- [x] Verify JSON-LD, HMR, Tailwind, responsive widths and interactive React theme toggling.
- [x] Remove temporary verifier and submit a formatting-only review PR against the dependency branch.

## Security
This is mechanical formatting of existing source. The temporary verifier is repository-scoped and read-only (contents/actions), with pinned actions and committed lockfile. No production permissions or diagnostics checks are weakened.

## Final evidence
Run 43807869408 verified application commit cbac13d53ffa3781d9bc45077c99b83aeb42f48c. The unchanged repository diagnostic script returned healthy at 2026-11-16T05:05:24.811Z; all six checks passed, including 77 tests and zero npm audit findings. Browser verification passed on three routes at 1440/390 px, including real React theme toggles, HMR, Tailwind and JSON-LD. Original artifact 13650912486 from run 42564755361 was downloaded, its SHA-256 verified, and its degraded JSON parsed for comparison. Final cleanup changes only this record, state, audit and the temporary verifier; verified application source is unchanged.
