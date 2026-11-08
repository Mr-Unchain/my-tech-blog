---
name: diagnose-repository
description: Run repeatable, read-only health diagnostics for the my-tech-blog Astro and TypeScript repository. Use when Codex is asked to inspect repository health, perform a scheduled maintenance check, investigate build or test regressions, audit dependency risk, or produce a prioritized diagnostic report without changing application code.
---

# Diagnose Repository

Run diagnostics from the repository root. Treat the run as read-only: do not fix files, update dependencies, edit configuration, commit, push, or open a pull request unless the user separately asks for remediation.

## Prepare

1. Read `AGENTS.md` and the current `package.json` before running checks.
2. Record the current commit or branch when Git is available and note whether the checkout already contains changes.
3. Install dependencies with `npm ci` only when `node_modules` is absent or unusable. Do not regenerate `package-lock.json`.
4. Never print environment-variable values, credentials, tokens, or suspected secret contents.

## Run deterministic checks

Execute:

```text
node .codex/skills/diagnose-repository/scripts/run-diagnostics.mjs
```

The script runs the repository's available content validation, lint, formatting, unit-test, production-build, and dependency-audit checks. A dependency-audit network failure is `inconclusive`, not proof that the repository is safe or unsafe.

If the script cannot start, run the same commands directly from `package.json` and preserve the same classification rules.

## Inspect repository-specific risks

After the deterministic checks:

1. Inspect relevant configuration files for obvious unsafe defaults, unpinned CI actions or runtime images, and committed secret files. Report paths and categories only; redact secret-like values.
2. Review failed-command output and trace each failure to the smallest useful file or subsystem.
3. Distinguish a new regression from an existing dirty-worktree change whenever the evidence permits.
4. Do not claim a security vulnerability from a pattern match alone. Label unverified concerns as `needs review`.

## Report

Return a concise report with:

- Overall status: `healthy`, `degraded`, or `inconclusive`.
- Check table: check, status, duration, and short evidence.
- Findings ordered by severity: critical, high, medium, low.
- Exact next actions, including commands when useful.
- Scope limits, skipped checks, and network-dependent checks that could not complete.

Use `healthy` only when all required local checks pass and no high-or-critical finding exists. Use `degraded` when a required check fails or a confirmed high-or-critical finding exists. Use `inconclusive` when prerequisites or infrastructure prevent enough checks to reach a reliable conclusion.

Do not create a persistent report file during scheduled runs unless the automation prompt or user explicitly asks for one; the task result is the report of record.
