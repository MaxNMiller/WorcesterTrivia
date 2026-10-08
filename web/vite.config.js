import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Relative asset URLs, so the build works when served from a GitHub Pages
  // project subpath (maxnmiller.github.io/WorcesterTrivia/) as well as locally.
  base: './',
})
