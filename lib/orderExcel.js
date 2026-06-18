import ExcelJS from 'exceljs';

function normalizePhoneForTelegram(phone) {
  if (!phone) return '';
  let cleaned = String(phone).replace(/[\s\-()]/g, '');
  if (!cleaned.startsWith('+') && /^\d/.test(cleaned)) {
    cleaned = `+${cleaned}`;
  }
  return cleaned;
}

function formatPhoneTelegramLink(phone) {
  const normalized = normalizePhoneForTelegram(phone);
  if (!normalized) return '';
  return `<a href="https://t.me/${normalized}">${normalized}</a>`;
}

export function formatOrderCaption(formData, totalItems, totalVarieties) {
  const now = new Date();
  const dateStr = now.toLocaleString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  let caption = `🌹 <b>НОВЫЙ ЗАКАЗ</b> 🌹\n\n`;
  caption += `📅 ${dateStr}\n`;
  caption += `👤 ${formData.name}\n`;
  caption += `📞 ${formatPhoneTelegramLink(formData.phone)}\n`;
  caption += `📍 ${formData.address}\n`;
  if (formData.email) {
    caption += `✉️ ${formData.email}\n`;
  }
  caption += `\n📊 Сортов: ${totalVarieties} | Штук: ${totalItems}`;
  return caption;
}

export function formatWholesaleMessage(formData) {
  const now = new Date();
  const dateStr = now.toLocaleString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  let message = `🌿 <b>ЗАЯВКА НА ОПТ (B2B)</b> 🌿\n\n`;
  message += `📅 ${dateStr}\n`;
  message += `👤 <b>ФИО:</b> ${formData.fullName}\n`;
  message += `📞 ${formatPhoneTelegramLink(formData.phone)}\n`;
  if (formData.email) {
    message += `✉️ ${formData.email}\n`;
  }
  if (formData.company) {
    message += `🏢 <b>Компания:</b> ${formData.company}\n`;
  }
  message += `\n📦 <b>Мин. количество:</b> ${formData.minQuantity}\n`;
  message += `📦 <b>Макс. количество:</b> ${formData.maxQuantity}\n`;
  message += `📋 <b>Весь каталог:</b> ${formData.wantsFullCatalog ? 'Да' : 'Нет'}\n`;
  if (formData.message) {
    message += `\n💬 <b>Комментарий:</b>\n${formData.message}`;
  }
  return message;
}

export async function generateOrderExcel(formData, basketItems) {
  let totalQuantity = 0;
  basketItems.forEach((item) => {
    totalQuantity += item.quantity;
  });

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Заказ');

  worksheet.columns = [
    { key: 'number', width: 8 },
    { key: 'name', width: 40 },
    { key: 'quantity', width: 10 },
  ];

  const thinBorder = {
    top: { style: 'thin', color: { argb: 'FF000000' } },
    left: { style: 'thin', color: { argb: 'FF000000' } },
    bottom: { style: 'thin', color: { argb: 'FF000000' } },
    right: { style: 'thin', color: { argb: 'FF000000' } },
  };

  const headerRow = worksheet.addRow(['№', formData.name, 'шт']);
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4CAF50' },
    };
    cell.font = {
      bold: true,
      color: { argb: 'FFFFFFFF' },
      size: 12,
    };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = thinBorder;
  });
  headerRow.height = 25;

  basketItems.forEach((item, index) => {
    const rowNumber = index + 1;
    const row = worksheet.addRow([rowNumber, item.name, item.quantity]);

    row.eachCell((cell, colNumber) => {
      if (index % 2 === 0) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };
      } else {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F5F5' } };
      }
      cell.font = { size: 11 };
      cell.border = thinBorder;
      if ([1, 3].includes(colNumber)) {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      } else {
        cell.alignment = { vertical: 'middle' };
      }
    });
    row.height = 22;
  });

  worksheet.addRow([]);

  const totalQtyRow = worksheet.addRow(['', 'Общее количество', totalQuantity]);
  totalQtyRow.eachCell((cell, colNumber) => {
    cell.font = { bold: true, size: 12 };
    cell.border = thinBorder;
    if ([1, 3].includes(colNumber)) {
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    }
  });
  totalQtyRow.height = 25;

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
