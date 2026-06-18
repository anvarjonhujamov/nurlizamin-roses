import categories from '../data/categories.js';

/**
 * Parse category cell value like "5,7" or "6, 5" into numeric IDs.
 */
export function parseCategoryIds(categoryValue) {
  if (categoryValue == null || categoryValue === '') return [];

  return String(categoryValue)
    .split(/[,;]/)
    .map((part) => parseInt(part.trim(), 10))
    .filter((id) => Number.isInteger(id) && id > 0);
}

/**
 * Normalize sheet category value to comma-separated IDs, e.g. "5,7".
 */
export function normalizeCategoryValue(categoryValue) {
  const ids = parseCategoryIds(categoryValue);
  return ids.length > 0 ? ids.join(',') : '';
}

export function roseMatchesCategory(categoryValue, categoryFilter) {
  if (categoryFilter == null || categoryFilter === '' || categoryFilter === 'all') {
    return true;
  }

  const filterId = parseInt(String(categoryFilter), 10);
  if (!Number.isInteger(filterId) || filterId <= 0) return true;

  return parseCategoryIds(categoryValue).includes(filterId);
}

export function getCategoryNames(categoryValue) {
  const categoryIds = parseCategoryIds(categoryValue);
  if (categoryIds.length === 0) return null;

  const names = categoryIds
    .map((id) => categories.find((c) => c.id === id)?.nameRu)
    .filter(Boolean);

  return names.length > 0 ? names.join(', ') : null;
}

const AROMA_LEVELS = [
  { label: 'Слабый', clouds: 0 },
  { label: 'Средний', clouds: 1 },
  { label: 'Сильный', clouds: 2 },
  { label: 'Очень сильный', clouds: 3 },
];

export function getAromaInfo(smell) {
  if (smell == null || smell === '') return null;
  const n = Number(smell);
  if (Number.isNaN(n)) return null;

  const index = Math.min(Math.max(Math.floor(n), 0), AROMA_LEVELS.length - 1);
  return AROMA_LEVELS[index];
}

/** @deprecated use getAromaInfo */
export function getAromaLabel(num) {
  const info = getAromaInfo(num);
  return info ? `${info.label} аромат` : null;
}

export function getRoseDisplayName(rose) {
  const russianName = rose?.name_ru || rose?.name || '';
  const englishName = rose?.name_en || '';
  return englishName ? `${russianName} (${englishName})` : russianName;
}

export function isRoseInStock(rose) {
  return typeof rose?.stock === 'number' && rose.stock > 0;
}
