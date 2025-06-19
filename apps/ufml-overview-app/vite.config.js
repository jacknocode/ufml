import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  server: {
    host: '0.0.0.0',
    port: 3001,
    open: false,
    strictPort: true
  },
  preview: {
    host: '0.0.0.0',
    port: 3001,
    open: false,
    strictPort: true
  }
})