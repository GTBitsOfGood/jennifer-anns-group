import type { Config } from "tailwindcss";

const config = {
  important: true,
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
        "blue-hover": "#4F75B3",
        "orange-primary": "#FC9300",
        "orange-bg": "#FFDFB3",
        "orange-light-bg": "#FFF4E5",
        "input-bg": "#FAFBFC",
        "input-border": "#D9D9D9",
        "input-stroke": "#6D758F",
        "delete-red": "#8B0000",
        grey: "#666666",
        "gray-500": "#667085",
        "gray-hover": "#EAEAEA",
        "gray-text": "#6D758F",
        "light-gray": "#F4F4F4",
        placeholder: "#A3AED0",
        "stone-primary": "#535353",
        black: "#4C4B4B",
        "gray-tab": "#F1F3F7",
        "gray-tab-hover": "#E1E4ED",
        "black-title": "#38414B",
        "gray-table-head": "#7A8086",
        "font-1000": "#1A222B",
        border: "#E1E4ED",
        unselected: "#7A8086",
        "menu-item-hover": "#F1F3F7",
        "font-600": "#7A8086",
        "font-900": "#38414B",
        "light-red-hover": "#F3E5E5",
        "dark-red-hover": "#A23333",
      },
      fontSize: {
        "5.5xl": "56px",
        "2.5xl": "34px",
        "14pt": "14pt",
      },
      height: {
        game: "600px",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"], // Default `Poppins` font family to sans
        "open-sans-cond": ['"Open Sans Condensed"', "sans-serif"],
        "open-sans": ['"Open Sans"', "sans-serif"],
        "dm-sans": ['"DM Sans"', "sans-serif"],
        inter: ["Inter", "sans-serif"],
        rubik: ["Rubik", "Poppins", "sans-serif"],
      },
      margin: {
        "18": "72px",
        "30": "120px",
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
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;

export default config;
