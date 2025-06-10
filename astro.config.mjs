// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  // このintegrationsにTailwindの設定を追加します。
  integrations: [
    tailwind({
      // `global.css`へのパスを指定します。
      // これにより、AstroがTailwindの基本スタイルを読み込めるようになります。
      applyBaseStyles: false,
    }),
  ],
});