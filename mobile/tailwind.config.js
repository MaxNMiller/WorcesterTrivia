/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.tsx",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Mirrors the felt/brass/parchment palette from the existing web app
        // (TriviaGame.jsx / worcester-pursuit.html) so ported components can
        // reuse the same utility-class names.
        felt: {
          1: "#234a3a",
          2: "#163025",
          3: "#0f231b",
        },
        parchment: "#f3e9d2",
        "parchment-soft": "#faf4e6",
        ink: "#241a10",
        brass: {
          DEFAULT: "#c9973f",
          dark: "#b5852f",
        },
      },
    },
  },
  plugins: [],
};
