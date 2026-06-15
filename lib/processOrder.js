import { generateOrderExcel, formatOrderCaption } from './orderExcel.js';
import { sendTelegramDocument } from './telegramServer.js';
import { updateQuantitiesInSheet } from './sheets.js';
import { saveProductsToCache, loadProductsFromCache } from './productCache.js';

function bufferToDataUrl(buffer) {
  const base64 = buffer.toString('base64');
  return `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64}`;
}

export async function processOrder(formData, basketItems) {
  if (!formData?.name || !formData?.phone || !formData?.address) {
    throw new Error('Missing required customer fields');
  }

  if (!Array.isArray(basketItems) || basketItems.length === 0) {
    throw new Error('Basket is empty');
  }

  const totalItems = basketItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const totalVarieties = basketItems.length;

  const excelBuffer = await generateOrderExcel(formData, basketItems);

  const now = new Date();
  const createdAt = now.toISOString();
  const timestamp = createdAt.slice(0, 10);
  const orderId = `order_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
  const filename = `Заказ_${String(formData.name).replace(/\s+/g, '_')}_${timestamp}.xlsx`;
  const caption = formatOrderCaption(formData, totalItems, totalVarieties);

  await sendTelegramDocument(excelBuffer, filename, caption);

  try {
    await updateQuantitiesInSheet(
      basketItems.map((item) => ({
        number: item.number || item.id || item.slug,
        quantity: item.quantity || 0,
      })),
    );

    try {
      const { fetchProductsFromSheet } = await import('./sheets.js');
      const products = await fetchProductsFromSheet();
      if (products.length > 0) {
        saveProductsToCache(products);
      }
    } catch {
      const cached = loadProductsFromCache();
      if (cached?.length) {
        const byNumber = new Map(cached.map((p) => [String(p.number || p.id), p]));
        for (const item of basketItems) {
          const key = String(item.number || item.id || item.slug);
          const product = byNumber.get(key);
          if (product) {
            const decrease = Math.min(item.quantity || 0, product.stock ?? product.quantity ?? 0);
            product.stock = Math.max(0, (product.stock ?? product.quantity ?? 0) - decrease);
            product.quantity = product.stock;
          }
        }
        saveProductsToCache([...byNumber.values()]);
      }
    }
  } catch (stockErr) {
    console.warn('Order sent but stock update failed:', stockErr.message);
  }

  return {
    success: true,
    orderId,
    clientName: formData.name,
    createdAt,
    fileDataUrl: bufferToDataUrl(excelBuffer),
    filename,
  };
}
