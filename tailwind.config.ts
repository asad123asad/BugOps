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
        bugops: {
          green: "#2E7D32",
          brown: "#6D4C41",
          black: "#111111",
          white: "#FFFFFF",
          "brown-light": "#8D6E63",
          "green-light": "#4CAF50",
        },
      },
    },
  },
  plugins: [],
};
export default config;
