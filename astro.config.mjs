// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com', // TODO: あなたのサイトのドメインに変更してください
  output: 'server', // 'hybrid'から'server'に修正しました！
  integrations: [tailwind(), sitemap()],
  image: {
    domains: ["images.microcms-assets.io"],
  },
});