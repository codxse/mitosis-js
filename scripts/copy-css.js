import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const srcDir = path.join(rootDir, 'src/styles');
const destDir = path.join(rootDir, 'dist/styles');

const files = ['editor.css', 'theme-light.css', 'theme-dark.css'];

fs.mkdirSync(destDir, { recursive: true });

for (const file of files) {
  const src = path.join(srcDir, file);
  const dest = path.join(destDir, file);

  execSync(`cleancss -o ${dest} ${src}`, { stdio: 'inherit' });
  console.log(`Minified: ${file}`);
}
