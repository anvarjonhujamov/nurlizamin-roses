import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const content = readFileSync(resolve(root, '.env'), 'utf8');
const match = content.match(/GOOGLE_PRIVATE_KEY="([\s\S]*?)"/);
if (!match) {
  console.error('GOOGLE_PRIVATE_KEY not found in .env');
  process.exit(1);
}

const key = match[1].replace(/\\n/g, '\n');

const result = spawnSync(
  'npx',
  ['vercel', 'env', 'add', 'GOOGLE_PRIVATE_KEY', 'production', '--yes', '--force', '--sensitive'],
  { cwd: root, input: key, encoding: 'utf8', shell: true, stdio: ['pipe', 'inherit', 'inherit'] },
);

process.exit(result.status ?? 1);
