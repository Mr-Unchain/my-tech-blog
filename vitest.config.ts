import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  resolve: {
    alias: {
      'astro:content': fileURLToPath(
        new URL('./tests/mocks/astro-content.ts', import.meta.url)
      ),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [fileURLToPath(new URL('./vitest.setup.ts', import.meta.url))],
    exclude: ['e2e/**', 'node_modules/**', '.cloud-schedule-worktree/**', 'dist/**'],
    coverage: {
      reporter: ['text', 'html'],
    },
  },
});
