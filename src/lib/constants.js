/**
 * Image base URL for product images from Google Sheets.
 * Frontend uses: baseUrl + product.images[0]
 */
export const IMAGE_BASE_URL = 'https://host32.firstcoders.uz/images/products/';

export const PLACEHOLDER_IMAGE = '1730913009-1.jpg';

/**
 * Build full image URL from filename (API returns filenames only).
 * Format: https://host32.firstcoders.uz/images/products/{filename}
 * If filename has no extension (e.g. "1731948717-1"), appends .webp
 * @param {string} filename - From product.images[0]
 * @returns {string} Full URL
 */
export function getProductImageUrl(filename) {
  if (!filename) return `${IMAGE_BASE_URL}${PLACEHOLDER_IMAGE}`;
  if (filename.startsWith('http')) return filename;
  // Strip trailing hyphen (e.g. "1749548079-" from sheet)
  const clean = String(filename).replace(/-+$/, '');
  // If no extension, use .webp (e.g. 1731948717-1 → 1731948717-1.webp)
  const hasExtension = /\.(webp|jpg|jpeg|png|gif)$/i.test(clean);
  const resolved = hasExtension ? clean : `${clean}.webp`;
  return `${IMAGE_BASE_URL}${resolved}`;
}
