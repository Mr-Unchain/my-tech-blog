// tailwind.config.mjs
import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // この設定により、srcフォルダ内のすべてのファイルが
    // Tailwind CSSの監視対象になります。
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
  ],
  theme: {
    extend: {
      colors: {
        "custom-header": "#316C82",
        "custom-button": "#FFD266",
        "custom-text-bg": "#FFFFFF",
        "custom-bg": "#F4F4F4",
        "custom-heading": "#13B2AA",
      },
      fontFamily: {
        sans: ["Noto Sans JP", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
