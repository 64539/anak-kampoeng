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
        gold: {
          DEFAULT: "#D4AF37",
          light: "#F1D592",
          dark: "#AA8A2E",
        },
        matte: {
          DEFAULT: "#0A0A0A",
          lighter: "#1A1A1A",
        },
      },
      backgroundImage: {
        "carbon-pattern": "radial-gradient(#1a1a1a 0.5px, transparent 0.5px), radial-gradient(#1a1a1a 0.5px, #0a0a0a 0.5px)",
      },
    },
  },
  plugins: [],
};
export default config;
