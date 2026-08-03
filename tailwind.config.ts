import type { Config } from "tailwindcss";

// Los tokens en globals.css guardan tripletas RGB ("R G B", no hex) para que
// Tailwind pueda generar las variantes con opacidad (bg-andes/40, text-neutral/20, etc.)
// vía rgb(var(...) / <alpha-value>). Con un var() apuntando directo a un hex,
// Tailwind descarta esas clases en silencio (bug detectado: ver historial del proyecto).
// Tipado como string para que encaje con los tipos de Tailwind (Config['theme']['colors']
// solo declara `string`, aunque en runtime Tailwind sí acepta funciones aquí).
function withOpacity(variableName: string): string {
  const resolver = ({ opacityValue }: { opacityValue?: string }) =>
    opacityValue === undefined
      ? `rgb(var(${variableName}))`
      : `rgb(var(${variableName}) / ${opacityValue})`;
  return resolver as unknown as string;
}

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: withOpacity("--color-bg"),
        ink: withOpacity("--color-ink"),
        andes: withOpacity("--color-andes"),
        paja: withOpacity("--color-paja"),
        volcan: withOpacity("--color-volcan"),
        neutral: withOpacity("--color-neutral"),
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
