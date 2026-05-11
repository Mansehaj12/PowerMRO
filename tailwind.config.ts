import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: "#070F1A",
          800: "#0D1B2A",
          700: "#112236",
          600: "#162A42",
          500: "#1C344F",
        },
        electric: {
          DEFAULT: "#00A3E0",
          dark: "#007AB8",
          light: "#33B8E8",
          glow: "#00A3E033",
        },
        amber: {
          DEFAULT: "#F59E0B",
          dark: "#D97706",
          glow: "#F59E0B33",
        },
        danger: {
          DEFAULT: "#EF4444",
          dark: "#DC2626",
          glow: "#EF444433",
        },
        success: {
          DEFAULT: "#10B981",
          dark: "#059669",
          glow: "#10B98133",
        },
        muted: "#4B5563",
        "muted-fg": "#9CA3AF",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(0,163,224,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,163,224,0.05) 1px, transparent 1px)",
        "glass-gradient":
          "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
      },
      backgroundSize: {
        grid: "40px 40px",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
        "glass-lg": "0 16px 64px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
        electric: "0 0 20px rgba(0, 163, 224, 0.3)",
        "electric-lg": "0 0 40px rgba(0, 163, 224, 0.4)",
        danger: "0 0 20px rgba(239, 68, 68, 0.3)",
        amber: "0 0 20px rgba(245, 158, 11, 0.3)",
      },
      animation: {
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
        ticker: "ticker 30s linear infinite",
        shimmer: "shimmer 2s linear infinite",
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
