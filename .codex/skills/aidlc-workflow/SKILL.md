---
name: aidlc-workflow
description: Follow this repository's AI-DLC process from Codex by reusing `aidlc-docs/` state, `.aidlc-rule-details/` stage rules, and the existing audit trail instead of creating a separate workflow.
---

# AI-DLC Workflow For Codex

Use this skill when the user asks to work with AI-DLC, resume prior AI-DLC work, or make a change that should follow the repository's staged workflow.

## Startup

1. Read `aidlc-docs/aidlc-state.md` first to determine whether this is a resumed workflow.
2. Read `aidlc-docs/audit.md` to understand prior user intent and stage transitions.
3. Load these common rule files from `.aidlc-rule-details/common/`:
   - `process-overview.md`
   - `session-continuity.md`
   - `content-validation.md`
   - `question-format-guide.md`
4. If `.aidlc-rule-details/extensions/` exists, inspect the extension markdown files and treat enabled applicable rules as hard constraints.

## Execution

1. Adapt depth to the request. Small bug fixes may only need minimal INCEPTION work before code generation; larger changes should reuse the full staged approach.
2. Reuse the repository's existing artifacts. Prefer updating the relevant files under `aidlc-docs/inception/` or `aidlc-docs/construction/` instead of inventing new locations.
3. Put user questionnaires in markdown files under `aidlc-docs/` and use `[Answer]:` tags. Do not place multi-choice questionnaires directly in chat.
4. Before resuming a stage, load the earlier artifacts that `session-continuity.md` says are required for that stage.
5. Append concise timestamped history to `aidlc-docs/audit.md` whenever you materially advance the workflow.

## Repository Mapping

- Workflow state: `aidlc-docs/aidlc-state.md`
- Audit trail: `aidlc-docs/audit.md`
- Rule details: `.aidlc-rule-details/`
- App code: `src/`, `public/`, `tests/`
- Existing AI-DLC agent memory: `CLAUDE.md`

## Constraints

- Never move source code into `aidlc-docs/`.
- Never overwrite `aidlc-docs/audit.md`; append only.
- Keep AI-DLC artifacts small and task-specific.
- Prefer the existing repo conventions in `AGENTS.md` when AI-DLC guidance is silent.
