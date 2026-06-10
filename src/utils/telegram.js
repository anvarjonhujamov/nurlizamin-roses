import ExcelJS from 'exceljs';
import { formatPreorderPolicyForTelegram } from '../lib/orderPolicy.js';

/**
 * Convert a Blob to a base64 data URL string
 * @param {Blob} blob - The blob to convert
 * @returns {Promise<string>} - Base64 data URL string
 */
async function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

/**
 * Send a text message to Telegram bot
 * @param {string} message - The message to send
 * @returns {Promise<boolean>} - Whether the message was sent successfully
 */
export async function sendTelegramMessage(message) {
    const botToken = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
    const chatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
        console.error('Telegram credentials not configured');
        return false;
    }

    try {
        const response = await fetch(
            `https://api.telegram.org/bot${botToken}/sendMessage`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                    parse_mode: 'HTML',
                }),
            }
        );

        const data = await response.json();

        if (!data.ok) {
            console.error('Telegram API error:', data.description);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Failed to send Telegram message:', error);
        return false;
    }
}

/**
 * Send a document (Excel file) to Telegram bot
 * @param {Blob} fileBlob - The file blob to send
 * @param {string} filename - The filename
 * @param {string} caption - Optional caption for the document
 * @returns {Promise<boolean>} - Whether the file was sent successfully
 */
export async function sendTelegramDocument(fileBlob, filename, caption = '') {
    const botToken = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
    const chatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
        console.error('Telegram credentials not configured');
        return false;
    }

    try {
        const formData = new FormData();
        formData.append('chat_id', chatId);
        formData.append('document', fileBlob, filename);
        if (caption) {
            formData.append('caption', caption);
            formData.append('parse_mode', 'HTML');
        }

        const response = await fetch(
            `https://api.telegram.org/bot${botToken}/sendDocument`,
            {
                method: 'POST',
                body: formData,
            }
        );

        const data = await response.json();

        if (!data.ok) {
            console.error('Telegram API error:', data.description);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Failed to send Telegram document:', error);
        return false;
    }
}

/**
 * Generate styled Excel file from order data using ExcelJS
 * @param {Object} formData - Customer form data
 * @param {Array} basketItems - Array of basket items with product details
 * @returns {Promise<Blob>} - Excel file as blob
 */
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

    return new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
}

/**
 * Normalize phone for Telegram profile link (no spaces).
 */
function normalizePhoneForTelegram(phone) {
    if (!phone) return '';
    let cleaned = String(phone).replace(/[\s\-()]/g, '');
    if (!cleaned.startsWith('+') && /^\d/.test(cleaned)) {
        cleaned = `+${cleaned}`;
    }
    return cleaned;
}

/**
 * Format phone as clickable Telegram profile link.
 */
function formatPhoneTelegramLink(phone) {
    const normalized = normalizePhoneForTelegram(phone);
    if (!normalized) return '';
    return `<a href="https://t.me/${normalized}">${normalized}</a>`;
}

/**
 * Format order caption for Telegram
 * @param {Object} formData - Customer form data
 * @param {number} totalItems - Total number of items
 * @param {number} totalVarieties - Total number of varieties
 * @returns {string} - Formatted caption
 */
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
    caption += `📍 ${formData.address}\n\n`;
    caption += `📊 Сортов: ${totalVarieties} | Штук: ${totalItems}`;
    caption += formatPreorderPolicyForTelegram();
    return caption;
}

/**
 * Update stock quantities in Google Sheets via API
 *
 * @param {Array} basketItems - Array of basket items with number/id and quantity
 * @returns {Promise<{success: boolean, error?: string}>} - Result with success status
 */
export async function updateStockInGoogleSheets(basketItems) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api/sheets';

    try {
        console.log(`🔄 Updating stock for ${basketItems.length} products...`);
        const startTime = performance.now();

        const items = basketItems.map(item => ({
            number: item.number || item.id || item.slug,
            quantity: item.quantity || 0,
        }));

        const res = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            throw new Error(data.error || `HTTP ${res.status}`);
        }

        const duration = (performance.now() - startTime).toFixed(0);
        console.log(`✅ Updated ${data.updated ?? basketItems.length} products in ${duration}ms`);

        return { success: true, updated: data.updated };
    } catch (error) {
        console.error('❌ Failed to update stock:', error);
        return { success: false, error: error.message };
    }
}



/**
 * Send complete order to Telegram (message + Excel file) and update stock
 * 
 * OPTIMIZED FLOW:
 * 1. Generate Excel (local, instant)
 * 2. Send to Telegram (1 API call)
 * 3. Update all stock via RPC (1 API call)
 * 4. Invalidate cache (local, instant)
 * 
 * Total: Only 2 network requests regardless of order size!
 * 
 * @param {Object} formData - Customer form data
 * @param {Array} basketItems - Array of basket items with product details
 * @returns {Promise<{success: boolean, orderId?: string, clientName?: string, createdAt?: string, fileUrl?: string, excelBlob?: Blob, filename?: string, error?: string}>}
 */
/**
 * Send wholesale application to Telegram
 * @param {Object} formData - Application form data
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function sendWholesaleApplicationToTelegram(formData) {
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

    const success = await sendTelegramMessage(message);
    return success
        ? { success: true }
        : { success: false, error: 'Не удалось отправить заявку. Попробуйте позже или свяжитесь по телефону.' };
}

export async function sendOrderToTelegram(formData, basketItems) {
    const startTime = performance.now();

    try {
        const totalItems = basketItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalVarieties = basketItems.length;

        console.log(`Processing order: ${totalVarieties} varieties, ${totalItems} items`);

        // Step 1: Generate styled Excel file (instant - runs locally)
        const excelBlob = await generateOrderExcel(formData, basketItems);

        // Step 2: Generate filename and order metadata
        const now = new Date();
        const createdAt = now.toISOString();
        const timestamp = createdAt.slice(0, 10);
        const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const filename = `Заказ_${formData.name.replace(/\s+/g, '_')}_${timestamp}.xlsx`;

        // Step 3: Format caption
        const caption = formatOrderCaption(formData, totalItems, totalVarieties);

        // Step 4: Send Excel file with caption (1 Telegram API call)
        const telegramSuccess = await sendTelegramDocument(excelBlob, filename, caption);

        if (!telegramSuccess) {
            return { success: false, error: 'Failed to send order to Telegram' };
        }

        // Step 5: Update stock via Google Sheets API
        const stockResult = await updateStockInGoogleSheets(basketItems);

        if (!stockResult.success) {
            // Order was sent but stock update failed
            console.warn('Order sent but stock update failed:', stockResult.error);
            // Still consider it success - order went through
        }

        // Step 6: Invalidate cache to force data refresh
        const { invalidateRosesCache } = await import('../hooks/useRosesData.js');
        invalidateRosesCache();

        const duration = (performance.now() - startTime).toFixed(0);
        console.log(`✓ Order completed in ${duration}ms`);

        // Convert blob to base64 for persistent storage in localStorage
        // Blob URLs are temporary and get invalidated on page refresh
        const fileDataUrl = await blobToBase64(excelBlob);

        // Return success with order data for history
        return {
            success: true,
            orderId,
            clientName: formData.name,
            createdAt,
            fileDataUrl, // base64 data URL that persists across refreshes
            excelBlob,   // original blob for immediate download
            filename
        };

    } catch (error) {
        console.error('Failed to process order:', error);
        return { success: false, error: error.message };
    }
}



