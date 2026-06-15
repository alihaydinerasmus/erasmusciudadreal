import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#FAF7F2",
          dark: "#F0EBE3",
        },
        "dark-bg": "#1C1917",
        "dark-text": "#E8E0D5",
        surface: "#292524",
        "dark-border": "#3D3530",
        "dark-muted": "#8A7F78",
        terracotta: {
          DEFAULT: "#C4705A",
          dark: "#A85A47",
          light: "#D4845A",
        },
        ink: "#2C2116",
        paper: {
          DEFAULT: "#FFFDF9",
          dark: "#F5F0E8",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-lato)", "system-ui", "sans-serif"],
        journal: ["var(--font-caveat)", "cursive"],
      },
      boxShadow: {
        soft: "0 2px 12px rgba(44, 33, 22, 0.06)",
        warm: "0 8px 24px rgba(196, 112, 90, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
