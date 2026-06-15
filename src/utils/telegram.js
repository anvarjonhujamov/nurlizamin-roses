/**
 * Client-side order API wrappers (Telegram + stock run on server).
 */

async function dataUrlToBlob(dataUrl) {
  const res = await fetch(dataUrl);
  return res.blob();
}

export async function sendOrderToTelegram(formData, basketItems) {
  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ formData, basketItems }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      return {
        success: false,
        error: data.details || data.error || 'Failed to send order',
      };
    }

    let excelBlob = null;
    if (data.fileDataUrl) {
      excelBlob = await dataUrlToBlob(data.fileDataUrl);
    }

    const { invalidateRosesCache } = await import('../hooks/useRosesData.js');
    invalidateRosesCache();

    return {
      ...data,
      excelBlob,
    };
  } catch (error) {
    console.error('Failed to process order:', error);
    return { success: false, error: error.message };
  }
}

export async function sendWholesaleApplicationToTelegram(formData) {
  try {
    const res = await fetch('/api/wholesale', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      return {
        success: false,
        error: data.details || data.error || 'Не удалось отправить заявку',
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to send wholesale application:', error);
    return {
      success: false,
      error: 'Не удалось отправить заявку. Попробуйте позже или свяжитесь по телефону.',
    };
  }
}
