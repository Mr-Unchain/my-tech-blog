# Formatting remediation (2026-11-16)

## Scope
Build on PR #37 (JSON-LD) and PR #38 (dependency remediation). Normalize the existing 70 source files reported by the unchanged Prettier configuration. No dependency, article body, feature, API, permission or production workflow changes belong in this patch.

## Steps
- [x] Reproduce existing style drift after resolving parser errors.
- [x] Apply npm run format until output is stable, without changing formatter configuration or ignore rules.
- [x] Verify candidate run 43806859783: zero npm audit findings, 77 tests, lint, build, complete formatting and six Chromium route/viewport cases.
- [ ] Commit only formatted source and workflow records.
- [ ] Run the exact repository diagnostic script on committed source and assert healthy.
- [ ] Read the original diagnostic artifact and verify its archive digest for comparison.
- [ ] Verify JSON-LD, HMR, Tailwind, responsive widths and interactive React theme toggling.
- [ ] Remove temporary verifier and submit a formatting-only review PR against the dependency branch.

## Security
This is mechanical formatting of existing source. The temporary verifier is repository-scoped and read-only (contents/actions), with pinned actions and committed lockfile. No production permissions or diagnostics checks are weakened.
