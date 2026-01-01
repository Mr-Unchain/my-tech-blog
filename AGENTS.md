# Repository Guidelines

This repository is an Astro + TypeScript tech blog. Use this guide to navigate the codebase, run the project, and contribute consistently.

## Project Structure & Module Organization
- `src/pages`: Route-driven pages (`.astro`, lower-case filenames).
- `src/components`: UI components in `PascalCase` (Astro/React).
- `src/hooks`: Reusable React hooks (prefix with `use`).
- `src/lib`, `src/utils`: Shared logic, helpers, clients.
- `public`: Static assets served as-is.
- `tests`: Mirrors `src` (e.g., `tests/components/ArticleCard.test.tsx`).
- Key config: `astro.config.mjs`, `tailwind.config.mjs`, `postcss.config.mjs`, `vitest.config.ts`, `vercel.json`.

## Build, Test, and Development Commands
- `npm ci`: Install exact dependencies from lockfile.
- `npm run dev`: Start Astro dev server with HMR.
- `npm run build`: Production build to `dist/`.
- `npm run preview`: Serve the built site locally.
- `npm run test`: Run Vitest (JSDOM) unit/component tests.
- `npm run test:watch`: Watch mode for rapid feedback.
- `npm run test:coverage`: Generate coverage report.

## Coding Style & Naming Conventions
- Language: TypeScript (strict via `astro/tsconfigs/strict`).
- Style: 2-space indent, semicolons, single quotes in TS/TSX.
- Names: Components `PascalCase` (e.g., `ArticleCard.astro`); hooks `camelCase` starting with `use` (e.g., `useBookmarks.ts`); pages lower-case route names (e.g., `contact.astro`).
- Keep modules small; colocate tests (and stories if present) near related code.

## Testing Guidelines
- Framework: Vitest + Testing Library (`@testing-library/*`) with JSDOM.
- Location: `tests/**` mirroring `src/**`.
- Naming: `*.test.ts` / `*.test.tsx`.
- Example: `tests/utils/readingTime.test.ts`.
- Coverage: No hard threshold; add tests for new logic, hooks, and utils.

## Commit & Pull Request Guidelines
- Commits: Conventional style (`feat:`, `fix:`, `chore:`); clear, scoped messages (EN/JA ok).
- PRs: Concise description, link related issues, screenshots/GIFs for UI changes, note env/config impacts, and summarize test coverage.
- Scope: Keep PRs focused and small; update docs when APIs/behavior change.

## Security & Configuration Tips
- Env: Use `.env.development` / `.env.production`; prefer `VITE_`-prefixed vars for client use.
- Secrets: Do not commit credentials; rotate if exposure is suspected.
- Deploy: Vercel via `vercel.json` and `@astrojs/vercel` adapter.

