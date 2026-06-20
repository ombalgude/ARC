/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f5f8ff",
          100: "#ebf1ff",
          200: "#d6e4ff",
          300: "#b3ccff",
          400: "#80abff",
          500: "#4d80ff",
          600: "#1a4eff",
          700: "#0033cc",
          800: "#002799",
          900: "#001a66",
        },
      },
    },
  },
  plugins: [],
};
