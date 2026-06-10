import categories from '../data/categories.js';

export function getCategoryNames(categoryValue) {
  if (!categoryValue) return null;

  const categoryIds = String(categoryValue)
    .split(',')
    .map((id) => parseInt(id.trim(), 10))
    .filter((id) => !Number.isNaN(id));

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
