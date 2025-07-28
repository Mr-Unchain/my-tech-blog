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
        // Original colors (kept for compatibility)
        primary: "#1976D2",
        secondary: "#FFC107",
        background: "#FFFFFF",
        surface: "#FFFFFF",
        "on-primary": "#FFFFFF",
        "on-secondary": "#000000",
        "text-primary": "rgba(0, 0, 0, 0.87)",
        "text-secondary": "rgba(0, 0, 0, 0.6)",
        
        // Dark theme tech blog colors
        "dark-bg": {
          primary: "#0f172a",   // slate-900
          secondary: "#1e293b", // slate-800
          tertiary: "#334155",  // slate-700
        },
        "tech-accent": {
          cyan: {
            50: "#ecfeff",
            400: "#22d3ee",
            500: "#06b6d4",
            600: "#0891b2",
          },
          blue: {
            400: "#60a5fa",
            500: "#3b82f6",
            600: "#2563eb",
          },
        },
        "dark-text": {
          primary: "#f8fafc",   // slate-50
          secondary: "#cbd5e1", // slate-300
          tertiary: "#94a3b8",  // slate-400
          muted: "#64748b",     // slate-500
        }
      },
      fontFamily: {
        sans: ["Noto Sans JP", ...defaultTheme.fontFamily.sans],
        mono: ["JetBrains Mono", "Fira Code", ...defaultTheme.fontFamily.mono],
      },
      animation: {
        "fade-in": "fadeIn 0.7s ease-out forwards",
        "fade-out": "fadeOut 0.7s ease-out forwards",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeOut: {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(-20px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(34, 211, 238, 0.3)" },
          "100%": { boxShadow: "0 0 20px rgba(34, 211, 238, 0.6)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "tech-grid": `
          linear-gradient(rgba(34, 211, 238, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(34, 211, 238, 0.1) 1px, transparent 1px)
        `,
      },
      backgroundSize: {
        "tech-grid": "20px 20px",
      },
    },
  },
  plugins: [typography],
};
