# Diagnostic remediation (2026-11-16)

## Authorized scope
User request: 「では早速対応をお願い。」
Implement minimal fixes for confirmed diagnostics findings, test them and open review PRs. Never push to main or merge.

## Findings and scope
- Baseline main: 4f90c775e45f3db0112967baad9482143b10d33c.
- Scheduled run 42564755361 reported degraded; the latest-main reproduction also confirms JSON-LD/formatter parsing failures and 56 dependency advisories.
- Existing non-parsing format drift is separate maintenance work; do not hide it by weakening diagnostics.
- Keep dependency changes separate. Reject the unscoped audit-fix candidate (56 to 66 advisories and unnecessary tree expansion).

## Steps
- [x] Read repository state, audit history, common rules and enabled security baseline.
- [x] Reproduce checks on an isolated branch using read-only GitHub Actions because Cloud shell startup is unavailable.
- [x] Render JSON-LD through a shared serializer and Astro set:html; escape less-than characters to prevent script termination.
- [x] Remove the redundant HTML comment inside ArticleCard's conditional expression that breaks Prettier's JSX parser.
- [x] Add JSON round-trip and script-termination regression tests.
- [x] Verify committed source with npm ci, 77 unit tests, lint, build, changed-file formatting and rendered JSON-LD checks.
- [x] Remove temporary branch-only verification workflow; submit the verified patch for PR review.
- [ ] Prepare and test a separate dependency remediation PR.

## Security compliance
SECURITY-04/05/13/15: JSON-LD remains valid JSON and cannot inject a closing HTML script element; regression tests cover this boundary.
SECURITY-06/10: Verification uses read-only contents permission, pinned action SHAs and npm ci with the committed lockfile.
Other rules: N/A to this rendering/formatter patch; existing infrastructure, authorization and credentials are unchanged.

## Validation limits
Full format:check still reports pre-existing style drift outside this patch. Dependency audit remains degraded until separately addressed. Do not report the repository as healthy.

## Verified rendering patch
Run 43804711236 (application commit acdd7d1105ba9d949ef1dd48e985bfde51cd8130): npm ci, 77 tests, lint, production build, changed-file formatting and rendered JSON-LD on home/article/category passed. Temporary CI cleanup and documentation do not alter that verified application source.
