// astro.config.mjs
import node from "@astrojs/node";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://my-tech-blog.vercel.app",
  output: "server",
  adapter: node({ mode: "standalone" }),
  integrations: [tailwind(), sitemap(), react()],
  image: {
    domains: ["images.microcms-assets.io"],
  },
});
