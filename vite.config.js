import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Copy CSS from src/styles to demo/public/styles before serve
const srcStyles = path.resolve(__dirname, 'src/styles')
const destStyles = path.resolve(__dirname, 'demo/public/styles')

if (fs.existsSync(srcStyles)) {
  fs.mkdirSync(destStyles, { recursive: true })
  fs.readdirSync(srcStyles).forEach(file => {
    if (file.endsWith('.css')) {
      fs.copyFileSync(path.join(srcStyles, file), path.join(destStyles, file))
    }
  })
}

export default defineConfig({
  root: 'demo',
  server: {
    port: 5175,
  },
})
