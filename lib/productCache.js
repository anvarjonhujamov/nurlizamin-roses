import fs from 'fs';
import path from 'path';

const CACHE_FILE = path.join(process.cwd(), 'data', 'products-cache.json');

export function getProductsCachePath() {
  return CACHE_FILE;
}

export function loadProductsFromCache() {
  if (!fs.existsSync(CACHE_FILE)) {
    return null;
  }

  const raw = fs.readFileSync(CACHE_FILE, 'utf8');
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed : null;
}

export function saveProductsToCache(products) {
  const dir = path.dirname(CACHE_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(CACHE_FILE, JSON.stringify(products, null, 2), 'utf8');
}
