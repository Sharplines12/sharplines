import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sora)", "sans-serif"],
        display: ["var(--font-barlow)", "sans-serif"]
      },
      colors: {
        ink: "#08111f",
        slate: "#0d1728",
        mist: "#dbe7ff",
        line: "#1b2a42",
        neon: "#b7ff4a",
        ember: "#ff8d41",
        aqua: "#7ce2ff"
      },
      boxShadow: {
        panel: "0 30px 80px rgba(1, 8, 19, 0.35)"
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;
