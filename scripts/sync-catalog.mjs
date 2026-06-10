/**
 * Fetch products from Google Sheets and save to data/products-cache.json.
 * Run: npm run sync-catalog
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function loadLocalEnvIfNeeded() {
  if (process.env.GOOGLE_SHEETS_ID) return;

  const envPath = path.join(root, '.env');
  if (!fs.existsSync(envPath)) return;

  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;

    const key = trimmed.slice(0, eq).trim();
    if (process.env[key]) continue;

    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

loadLocalEnvIfNeeded();

const { fetchProductsFromSheet } = await import('../lib/sheets.js');
const { saveProductsToCache } = await import('../lib/productCache.js');

try {
  const products = await fetchProductsFromSheet();
  saveProductsToCache(products);
  console.log(`Synced ${products.length} products to data/products-cache.json`);
} catch (err) {
  console.error('Catalog sync failed:', err.message);
  process.exit(1);
}
