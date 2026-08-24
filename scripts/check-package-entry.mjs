import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const packageJson = JSON.parse(readFileSync(path.join(packageRoot, 'package.json'), 'utf8'));
const failures = [];
const entryFields = ['main', 'module', 'react-native'];

for (const field of entryFields) {
  if (packageJson[field] !== 'dist/main.js') {
    failures.push(`${field} must resolve to dist/main.js`);
    continue;
  }
  if (!existsSync(path.join(packageRoot, packageJson[field]))) {
    failures.push(`${field} target is missing: ${packageJson[field]}`);
  }
}
if (packageJson.types !== 'dist/types/main.d.ts') {
  failures.push('types must resolve to dist/types/main.d.ts');
} else if (!existsSync(path.join(packageRoot, packageJson.types))) {
  failures.push(`types target is missing: ${packageJson.types}`);
}

const packed = spawnSync('npm.cmd', ['pack', '--dry-run', '--json'], {
  cwd: packageRoot,
  encoding: 'utf8',
  windowsHide: true,
  shell: process.platform === 'win32',
  env: {
    ...process.env,
    npm_config_cache: path.join(packageRoot, 'node_modules', '.cache', 'npm-pack'),
  },
});
if (packed.status !== 0) {
  failures.push(`npm pack --dry-run failed: ${packed.error?.message || packed.stderr?.trim() || packed.stdout?.trim() || 'no diagnostic'}`);
} else {
  try {
    const archive = JSON.parse(packed.stdout)[0];
    const files = new Set((archive.files ?? []).map((file) => file.path));
    for (const entry of ['dist/main.js', 'dist/types/main.d.ts', 'package.json']) {
      if (!files.has(entry)) failures.push(`packed archive omits ${entry}`);
    }
  } catch (error) {
    failures.push(`npm pack --dry-run returned unreadable JSON: ${error.message}`);
  }
}

console.log('MediaSFU React Native package entry check');
console.log(`- Package: ${packageJson.name}@${packageJson.version}`);
console.log(`- JavaScript entry: ${packageJson.main}`);
console.log(`- Declaration entry: ${packageJson.types}`);
console.log(`- Failures: ${failures.length}`);
if (failures.length) {
  for (const failure of failures) console.log(`- ${failure}`);
  process.exitCode = 1;
}
