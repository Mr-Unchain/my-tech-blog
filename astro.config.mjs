// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  output: 'server', // 'hybrid'から'server'に修正しました！
  integrations: [tailwind()]
});