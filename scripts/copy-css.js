import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const srcDir = path.join(rootDir, 'src/styles');
const distDir = path.join(rootDir, 'dist/styles');
const demoDir = path.join(rootDir, 'demo/public/styles');

const files = ['editor.css', 'theme-light.css', 'theme-dark.css'];

fs.mkdirSync(distDir, { recursive: true });
fs.mkdirSync(demoDir, { recursive: true });

for (const file of files) {
  const src = path.join(srcDir, file);
  const baseName = file.replace('.css', '');

  // Minify to dist
  const distDest = path.join(distDir, `${baseName}.min.css`);
  execSync(`cleancss -o ${distDest} ${src}`, { stdio: 'inherit' });

  // Copy to demo/public for testing
  const demoDest = path.join(demoDir, `${baseName}.min.css`);
  fs.copyFileSync(distDest, demoDest);

  console.log(`Minified: ${baseName}.min.css`);
}
