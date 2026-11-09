# AIDLC State

## Project Info
- **Project**: my-tech-blog
- **Type**: Brownfield (existing codebase)
- **Created**: 2026-03-13
- **Current Workflow**: Portfolio Withdrawal (2026-11-09, implementation verification)

## Current Phase
- **Phase**: CONSTRUCTION
- **Stage**: Portfolio route and navigation removal - implementation verification

## Workspace State
- **Existing Code**: Yes
- **Programming Languages**: TypeScript, Astro, SCSS, CSS
- **Build System**: npm (Astro + Vite)
- **Project Structure**: Monolith (SSR Tech Blog)
- **Workspace Root**: C:\Git\my-tech-blog
- **Deployment**: Vercel (SSR mode)
- **CMS**: Git-managed Markdown articles; microCMS for profile and projects
- **Backend**: Firebase Firestore (reactions, views, bookmarks)
- **Styling**: Tailwind CSS + SCSS
- **Testing**: Vitest (unit) + Playwright (E2E)

## Extension Configuration
<!-- Extensions enabled/disabled status will be recorded here -->

| Extension | Enabled | Decided At |
|---|---|---|
| Security Baseline | Yes | Requirements Analysis |

## Current Workflow (2026-11-09, Implementation Verification)
- **Name**: Portfolio Withdrawal
- **Goal**: Stop publishing the unmaintained portfolio while preserving the rest of the live site.
- **Plan**: `aidlc-docs/construction/plans/portfolio-withdrawal.md`.
- **Deployment**: Main-based isolated change; the editorial redesign remains on its preview branch.

## Previous Workflow (2026-11-08, Locally Verified)
- **Name**: Markdown Authoring / CMS Cutover
- **Goal**: Write plain Markdown on PC in this repository and preview locally; smartphone authoring is out of scope.
- **Current Gate**: Review the local implementation before committing or deploying. No production deployment has been performed.
- **Active Plan**: `aidlc-docs/construction/plans/markdown-publishing-plan.md` supersedes the earlier MDX-only Unit 1 scope.
- **Draft Privacy**: Local drafts are Git-ignored, excluded from Vercel uploads and production collections, and previewed only in development. Committed content in this public repository is public regardless of the draft flag.
- **Migration**: Five publicly served articles imported; IDs, timestamps, text, links, and image references verified against the public site.
- **Verification**: 67 unit tests and 5 Chrome browser scenarios passed; production build, lint and TypeScript checks passed. Article body images were verified loading with the old CMS image host blocked. Existing dependency advisories remain outside this cutover scope.
- **Article Assets**: 16 local files (5 covers, 11 body images) under `public/images/articles/`. Article pages use Astro render()/Content to resolve image references.
- **Link Previews**: Standalone Spotify links use official embeds; standalone external HTTPS links use build-time metadata cards with a safe fallback. Inline links remain unchanged.
- **CMS Development Setup**: Development-only CMS settings restored to Git-ignored `.env.development.local`; profile and portfolio return200. Values are not stored in workflow artifacts.
- **Question File Language**: Japanese for this workflow and future AI-DLC question files.
- **Request Type**: Enhancement / possible migration
- **Initial Scope Estimate**: System-wide content management and publishing workflow
- **Initial Complexity Estimate**: Complex

## Previous Workflow (2026-03-13, Complete)
- All INCEPTION + CONSTRUCTION phases completed
- Code Generation: Unit 1-6 全完了
- Build and Test: Compilation OK, 26/26 tests pass

## Stage Progress (Current Workflow: Authoring Environment / CMS Strategy)

### INCEPTION PHASE

- [x] Workspace Detection
- [x] Reverse Engineering (SKIP - existing artifacts loaded)
- [x] Requirements Analysis
- [x] User Stories
- [x] Workflow Planning
- [x] Application Design
- [x] Units Generation

### CONSTRUCTION PHASE

- [x] Functional Design (Unit 1 approved)
- [x] NFR Requirements (Unit 1 approved)
- [x] NFR Design (Unit 1 approved)
- [x] Infrastructure Design (SKIP - existing GitHub / Vercel infrastructure is reused)
- [x] Code Generation (Markdown cutover scope, 2026-11-08)
- [x] Build and Test (67 tests, 5 browser scenarios and local HTTP verification, 2026-11-08)

### OPERATIONS PHASE

- [ ] Operations (placeholder)
