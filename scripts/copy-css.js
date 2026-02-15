import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const srcDir = path.join(rootDir, 'src/styles');
const distDir = path.join(rootDir, 'dist/styles');
const demoDir = path.join(rootDir, 'demo/styles');

const files = ['editor.css', 'theme-light.css', 'theme-dark.css'];

// Copy to dist
fs.mkdirSync(distDir, { recursive: true });
for (const file of files) {
  const src = path.join(srcDir, file);
  const dest = path.join(distDir, file);
  fs.copyFileSync(src, dest);
  console.log(`Copied: ${file} to dist`);
}

// Copy to demo
fs.mkdirSync(demoDir, { recursive: true });
for (const file of files) {
  const src = path.join(srcDir, file);
  const dest = path.join(demoDir, file);
  fs.copyFileSync(src, dest);
  console.log(`Copied: ${file} to demo`);
}
