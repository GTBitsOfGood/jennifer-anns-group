import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        "blue-primary": "#2352A0",
        "blue-bg": "#A9CBEB",
        "orange-primary": "#FC9300",
        "input-bg": "#FAFBFC",
        "input-border": "#D9D9D9",
        "delete-red": "#8B0000",
        grey: "#666666",
        "gray-500": "#667085",
        placeholder: "#A3AED0",
        "stone-primary": "#535353",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"], // Default `Poppins` font family to sans
        "open-sans-cond": ['"Open Sans Condensed"', "sans-serif"],
        "open-sans": ['"Open Sans"', "sans-serif"],
        inter: ["Inter", "sans-serif"],
        rubik: ["Rubik", "Poppins", "sans-serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
