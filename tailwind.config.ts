import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        ink: "var(--color-ink)",
        andes: "var(--color-andes)",
        paja: "var(--color-paja)",
        volcan: "var(--color-volcan)",
        neutral: "var(--color-neutral)",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-public-sans)", "sans-serif"],
      },
      spacing: {
        "safe-bottom": "env(safe-area-inset-bottom)",
      },
      minHeight: {
        dvh: "100dvh",
      },
    },
  },
  plugins: [],
};
export default config;
