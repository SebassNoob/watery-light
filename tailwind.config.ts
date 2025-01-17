import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/lib/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'selector',
  plugins: [],
};
export default config;
