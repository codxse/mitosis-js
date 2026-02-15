import { defineConfig } from 'vite'

export default defineConfig({
  root: 'demo',
  publicDir: '../dist',
  server: {
    port: 5175,
  },
})
