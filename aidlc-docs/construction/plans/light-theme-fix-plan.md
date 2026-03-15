# Code Generation Plan - ライトテーマ対応修正

## Context
- ホームページ (`index.astro`) と記事詳細 (`blog/[id].astro`)、ブックマーク (`bookmarks.astro`) は対応済み
- 残り9ページにハードコード済みダークテーマカラーが残存
- CSS変数 (`var(--color-*)`) への置換が必要

## CSS Variable Mapping
| Hardcoded (Dark) | CSS Variable | Light Value | Dark Value |
|---|---|---|---|
| `bg-slate-900/950` | `var(--color-bg-primary)` | #ffffff | #0f172a |
| `bg-slate-800` | `var(--color-bg-secondary)` | #f8fafc | #1e293b |
| `bg-slate-700` | `var(--color-bg-tertiary)` | #f1f5f9 | #334155 |
| `bg-slate-800` (cards) | `var(--color-bg-card)` | #ffffff | #1e293b |
| `text-white/slate-100` | `var(--color-text-heading)` | #0f172a | #f1f5f9 |
| `text-slate-200/300` | `var(--color-text-secondary)` | #475569 | #cbd5e1 |
| `text-slate-400` | `var(--color-text-muted)` | #94a3b8 | #64748b |
| `border-slate-700/600` | `var(--color-border)` | #e2e8f0 | #334155 |
| `text-cyan-400/300` | `var(--color-accent)` | #3b82f6 | #22d3ee |
| `from-cyan-500 to-blue-500` | `var(--color-accent)` → `var(--color-accent-hover)` | blue gradient | cyan gradient |

## Team Structure (3 Agents)

### Agent 1: simple-pages
- [x] 404.astro
- [x] privacy.astro
- [x] contact.astro

### Agent 2: listing-pages
- [x] blog/index.astro (最大: 大量のハードコード)
- [x] category/index.astro
- [x] category/[categoryName].astro

### Agent 3: feature-pages
- [x] portfolio.astro (最大: 大量のハードコード)
- [x] profile.astro
- [x] search.astro
