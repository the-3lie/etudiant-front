import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#16233E",
          soft: "#2C3B5C",
        },
        paper: "#F4F6F5",
        gold: {
          DEFAULT: "#B8912F",
          soft: "#E8D9AE",
        },
        sage: {
          DEFAULT: "#3F7D58",
          soft: "#DCEBE1",
        },
        rust: {
          DEFAULT: "#B0442E",
          soft: "#F3DCD6",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      borderRadius: {
        card: "14px",
      },
    },
  },
  plugins: [],
};
export default config;
