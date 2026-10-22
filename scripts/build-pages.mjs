import { copyFile, mkdir, readdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, '.pages-dist');
const files = [
  'index.html',
  'styles.css',
  'src/app.mjs',
  'src/generator.mjs',
  'src/favorites-store.mjs',
  'src/favorites-view.mjs',
];
await mkdir(path.join(output, 'src'), { recursive: true });
for (const file of files) await copyFile(path.join(root, file), path.join(output, file));
await writeFile(path.join(output, '.nojekyll'), '');
const allowed = new Set([...files, '.nojekyll']);
async function audit(directory, prefix = '') {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const relative = `${prefix}${entry.name}`;
    if (entry.isDirectory() && relative === 'src') await audit(path.join(directory, entry.name), 'src/');
    else if (!entry.isFile() || !allowed.has(relative)) throw new Error(`Unexpected Pages artifact entry: ${relative}`);
  }
}
await audit(output);
console.log(`Pages artifact: ${output}\n${[...allowed].join('\n')}`);
