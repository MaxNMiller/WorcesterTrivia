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
        // Brand palette - same token names as the web app's index.css
        // @theme block, so ported components can reuse the same classes.
        // Raw hex values for SVG/icons live in src/theme/colors.ts.
        "worcester-red": "#E3202C",
        brick: "#B5121D",
        ink: "#1D1B1A",
        bone: "#FAF9F7",
        charcoal: "#2A2726",
        slate: "#3A3634",
        stone: "#A39D98",
        correct: "#3FA66B",
        incorrect: "#B5121D",
        gold: "#E8B04B",
      },
    },
  },
  plugins: [],
};
