// tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // この設定により、srcフォルダ内のすべてのファイルが
    // Tailwind CSSの監視対象になります。
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
