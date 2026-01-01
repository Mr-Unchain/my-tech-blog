---
name: astro-blog-cms-firebase-maintainer
description: Maintain Monologger (Astro) data and analytics flows: microCMS blog/profile fetch/create, Firestore view/reaction/bookmark tracking with localStorage fallbacks, pagination/hero feeds, and SEO meta/canonical setup. Use when touching content loading, mutations, or telemetry tied to microCMS/Firebase in this repo.
---
# Quick start
- Data sources: microCMS (`src/lib/microcms.ts`) for blogs/profile; Firestore (`src/lib/firebase.ts`) for views/reactions/bookmarks; localStorage fallbacks in hooks.
- Env: set VITE_MICROCMS_SERVICE_DOMAIN, MICROCMS_API_KEY, VITE_MICROCMS_API_URL; Firebase vars VITE_FIREBASE_* required to initialize (hasValidConfig guards when undefined).

## Repo map (touch-points)
- microCMS types/clients: `src/lib/microcms.ts`; blog/profile schemas and createBlog payload.
- Firebase schema: `src/lib/firebase-collections.ts`; reaction/bookmark stats shape lives here.
- Hooks with fallbacks: `src/hooks/useReactions.ts`, `src/hooks/useBookmarks.ts` (localStorage keys noted below).
- UI consumers: `src/components/ReactionButtons.tsx`, pages `src/pages/index.astro` (pagination + hero), `src/pages/blog/[id].astro` (views increment, content render, TOC).
- Layout/meta: `src/layouts/BaseLayout.astro` (canonical/url/meta slots, preload/prefetch hints).

## microCMS patterns
- Fetch lists via `getBlogs(queries)`; categories normalized to arrays. Pagination example: `limit/offset` (`PAGE_SIZE=20` in `index.astro`).
- Fetch detail via `getBlogDetail(id)`; use when rendering `/blog/[id]`.
- Popular hero: read Firestore `views` ordered by `count`, map ids, then `getBlogs` with filter `id[equals]{id}[or]...` to preserve order.
- Create content via `createBlog({ title, category, content, status })`; categories pass as comma-separated string and are split; ensure `VITE_MICROCMS_API_URL` + `MICROCMS_API_KEY` are set.
- When adding microCMS fields: extend types in `microcms.ts`, thread through pages/components, and ensure HTML fragments remain sanitized where injected.

## Firestore + fallbacks
- Firebase config initializes only when all values are truthy; when missing, hooks fall back to localStorage (no Firestore writes).
- Views: `/blog/[id]` increments `views/{id}` via `setDoc(... increment(1))` on load.
- Reactions: `useReactions` keeps counts in `blog_stats/{blogId}.reactionCounts` and user state in `reactions`; offline/no Firebase uses `reactions_{userId}_{blogId}` + `reaction_counts_{blogId}` keys.
- Bookmarks: `useBookmarks` stores entries in `bookmarks` and bumps `blog_stats.bookmarkCount`; fallback key `bookmarks_{userId}`.
- When adding reaction types or blog stats fields, update `firebase-collections.ts`, `useReactions`, `ReactionButtons`, and any stats consumers together.
- SSR guardrails: window/localStorage access is gated; keep new code defensive to avoid SSR crashes when Firebase is absent.

## UI/SEO integration
- `ReactionButtons` hides zero-count items in compact mode and relies on `REACTIONS` map for labels/emojis; sync any new reaction types.
- `BaseLayout` builds canonical URLs automatically; override with `canonicalUrl` prop only when custom query params are needed.
- Hero/list pages preload key images and set structured data; keep `pageTitle/pageDescription/keywords` populated for SEO.

## Testing checklist
- With Firebase configured: reaction toggle adds/removes docs, bookmark toggle updates counts, views increment on article load; Firestore `blog_stats` reflects changes.
- Without Firebase vars: reactions/bookmarks function via localStorage (no errors), article pages render content/TOC without hydration warnings.
- microCMS changes: check `getBlogs` pagination and `createBlog` payload (categories array, status flag), and verify new fields render on `/blog/[id]` and listings.