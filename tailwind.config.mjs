// tailwind.config.mjs
import typography from "@tailwindcss/typography";
import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // この設定により、srcフォルダ内のすべてのファイルが
    // Tailwind CSSの監視対象になります。
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue,scss}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1976D2",
        secondary: "#FFC107",
        background: "#FFFFFF",
        surface: "#FFFFFF",
        "on-primary": "#FFFFFF",
        "on-secondary": "#000000",
        "text-primary": "rgba(0, 0, 0, 0.87)",
        "text-secondary": "rgba(0, 0, 0, 0.6)",
      },
      fontFamily: {
        sans: ["Noto Sans JP", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [typography],
};
