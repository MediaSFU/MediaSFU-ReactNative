import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(packageRoot, 'dist');
mkdirSync(dist, { recursive: true });
writeFileSync(resolve(dist, 'package.json'), '{\n  "type": "module"\n}\n');
