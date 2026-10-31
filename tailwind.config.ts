import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: {
    colors: { blood: "#e11d48", violet: "#7c3aed", bone: "#f4f4f5" },
    fontFamily: { display: ["var(--font-display)"], body: ["var(--font-body)"] },
  } },
  plugins: [],
} satisfies Config;
