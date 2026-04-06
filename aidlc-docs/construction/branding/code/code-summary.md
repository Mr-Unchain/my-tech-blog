# Code Summary - Homepage Branding Improvement

## Modified Files

### `src/pages/index.astro`

| Change | Before | After |
|--------|--------|-------|
| pageTitle | `"気づきメモ - 最新の記事"` | `"Monologger"` |
| h1 text | `気づきメモ` | `Monologger` |
| h1 font size | `text-2xl md:text-3xl` | `text-3xl md:text-4xl lg:text-5xl` |
| h1 class | (none) | `hero-typing` + `data-testid="hero-title"` |
| subtitle text | `ITに触れて生まれた日々の気づきや備忘録をゆるくまとめています。` | `Build. Learn. Share.` |
| subtitle class | (none) | `hero-fade-in` + `data-testid="hero-subtitle"` |
| search form class | (none) | `hero-fade-in hero-fade-in--delay` |
| script | view-toggle + search-history | + `initHeroAnimation()` (typing done + Swup re-trigger) |

### `src/styles/main.scss`

| Addition | Description |
|----------|-------------|
| `.hero-typing` | Typing animation: `width: 0→100%`, `steps(10)`, accent-colored caret |
| `.hero-typing.typing-done` | Transparent caret after animation completes |
| `@keyframes hero-typing` | Width expansion from 0 to 100% |
| `@keyframes hero-blink-caret` | Caret blink using accent color |
| `.hero-fade-in` | Fade-in + slide-up, delay 1.8s (after typing) |
| `.hero-fade-in--delay` | Extended delay 2.1s for search form |
| `@keyframes hero-fade-in` | Opacity 0→1, translateY 10px→0 |
| `prefers-reduced-motion` | `.hero-typing`: full width, no border; `.hero-fade-in`: opacity 1, no transform |

## Animation Sequence

1. **0.3s**: Typing animation starts (h1 "Monologger")
2. **1.8s**: Typing completes, caret blinks 4 times then hides
3. **1.8s**: Subtitle "Build. Learn. Share." fades in
4. **2.1s**: Search form fades in

## Accessibility

- `prefers-reduced-motion: reduce` disables all animations
- h1 semantics preserved (SEO unaffected)
- `data-testid` attributes for automation testing
