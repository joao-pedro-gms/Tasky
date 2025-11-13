import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: process.env.ELECTRON_BUILD ? '../dist-electron' : 'dist',
    emptyOutDir: true,
  },
})
