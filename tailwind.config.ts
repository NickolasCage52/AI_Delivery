import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        xs: ["0.8125rem", { lineHeight: "1.35" }],   /* 13px → более читабельно */
        sm: ["0.9375rem", { lineHeight: "1.5" }],    /* 15px вместо 14px */
        base: ["1.0625rem", { lineHeight: "1.6" }],   /* 17px вместо 16px */
      },
      colors: {
        primary: "#070A0F",
        "neon-cyan": "#56F0FF",
        "neon-violet": "#9B7BFF",
        "accent-cyan": "#56F0FF",
        "accent-lime": "#B6FF5C",
        elevated: "#0E131C",
        surface: "#141922",
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          '"SF Pro Display"',
          '"SF Pro Text"',
          "Inter",
          "Arial",
          "sans-serif",
        ],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        glow: "0 0 20px rgba(34, 211, 238, 0.3)",
        "glow-violet": "0 0 24px rgba(167, 139, 250, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
