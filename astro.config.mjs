// astro.config.mjs
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel"; // vercelをインポート
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://monologger.dev", // 新しいドメインに変更
  output: "server", // outputは"server"のまま
  adapter: vercel(), // adapterをvercel()に変更
  integrations: [tailwind(), sitemap(), react()],
  image: {
    domains: ["images.microcms-assets.io"],
  },
});
