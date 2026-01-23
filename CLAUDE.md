# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal tech blog built with Astro + React + microCMS. Static-first architecture with Islands for interactivity, deployed on Vercel. Japanese content with SEO optimization.

## Commands

```bash
# Development
npm run dev              # Start dev server at localhost:4321

# Build
npm run build            # Production build
npm run preview          # Preview production build locally

# Testing
npm run test             # Run Vitest unit tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage report
npm run e2e              # Run Playwright E2E tests (starts dev server)
npm run e2e:ui           # Run E2E tests with Playwright UI
```

## Architecture

### Data Flow
- **Build time**: Astro fetches content from microCMS API and generates static pages
- **Runtime**: Firebase Firestore handles reactions, bookmarks, and view counts
- **Deployment**: Vercel with Edge Network distribution

### Key Directories
- `src/lib/` - API clients and utilities
  - `microcms.ts` - Type-safe microCMS client with category normalization
  - `firebase.ts` - Firebase initialization
  - `firebase-collections.ts` - Firestore collection types and constants
  - `blur.ts` - LQIP (Low Quality Image Placeholder) generation
- `src/pages/api/` - Server endpoints for bookmarks, reactions, webhooks
- `src/hooks/` - React hooks for client-side features (useBookmarks, useReactions)
- `src/components/` - Mixed Astro and React components (React `.tsx` for interactive Islands)

### Content Types (microCMS)
- `blogs` - Blog posts with `id`, `title`, `description`, `content`, `eyecatch`, `category[]`
- `profile` - Single profile entry
- `projects` - Portfolio projects with `techStack[]`

### Environment Variables
```bash
# microCMS
VITE_MICROCMS_SERVICE_DOMAIN=
MICROCMS_API_KEY=
VITE_MICROCMS_API_URL=

# Firebase
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

## Code Patterns

### Category Normalization
microCMS category fields are normalized to arrays in `getBlogs()` and `getProjects()`. Always treat `category` and `techStack` as `string[]`.

### Astro Islands
React components (`.tsx`) are used only where client-side interactivity is needed:
- `HeroSlideshowReact.tsx` - Homepage slideshow
- `ReactionButtons.tsx` - Article reactions
- `CategoryList.tsx` - Dynamic category filtering

### Page Transitions
Swup handles smooth page transitions. Main content is wrapped in `#swup` container in `BaseLayout.astro`.

## Testing

- **Unit tests**: `tests/` directory, uses Vitest with jsdom environment
- **E2E tests**: `e2e/` directory, uses Playwright (Chromium, Firefox, WebKit)
- Test setup in `vitest.setup.ts`, Playwright config expects dev server on port 4321
