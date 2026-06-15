/**
 * Sync variables from .env to Vercel (production, preview, development).
 * Usage: node scripts/sync-vercel-env.mjs
 * Requires: vercel CLI logged in, project linked via `npx vercel link`
 */
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const envPath = resolve(root, '.env');

function parseDotEnv(content) {
  const vars = {};
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    vars[key] = value;
  }
  return vars;
}

// Live site uses Production. Preview needs a git branch on this project.
const TARGET = 'production';

function addEnv(name, value, { sensitive = false } = {}) {
  const args = ['vercel', 'env', 'add', name, TARGET, '--yes', '--force'];
  if (sensitive) args.push('--sensitive');

  const useStdin = sensitive || value.includes('\n') || value.length > 200;
  if (!useStdin) args.push('--value', value);

  const result = spawnSync('npx', args, {
    cwd: root,
    encoding: 'utf8',
    shell: true,
    input: useStdin ? value : undefined,
    stdio: [useStdin ? 'pipe' : 'inherit', 'pipe', 'pipe'],
  });

  if (result.status !== 0) {
    console.error(`Failed to add ${name} (${TARGET}):`);
    console.error(result.stderr || result.stdout);
    process.exit(1);
  }
  console.log(`✓ ${name}`);
}

const content = readFileSync(envPath, 'utf8');
const vars = parseDotEnv(content);

if (vars.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN && !vars.TELEGRAM_BOT_TOKEN) {
  vars.TELEGRAM_BOT_TOKEN = vars.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
}
if (vars.NEXT_PUBLIC_TELEGRAM_CHAT_ID && !vars.TELEGRAM_CHAT_ID) {
  vars.TELEGRAM_CHAT_ID = vars.NEXT_PUBLIC_TELEGRAM_CHAT_ID;
}

const sensitiveKeys = new Set([
  'GOOGLE_PRIVATE_KEY',
  'TELEGRAM_BOT_TOKEN',
  'NEXT_PUBLIC_TELEGRAM_BOT_TOKEN',
]);

for (const [key, value] of Object.entries(vars)) {
  addEnv(key, value, { sensitive: sensitiveKeys.has(key) });
}

console.log('\nDone. Redeploy with: npx vercel --prod');
