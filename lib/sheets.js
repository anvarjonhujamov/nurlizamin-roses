/**
 * Google Sheets read/write logic for product catalog
 * Uses service account auth via env: GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEETS_ID
 * Returns image filenames only; frontend adds baseUrl for display.
 */

import { google } from 'googleapis';
import { getGoogleSheetsConfig } from './googleEnv.js';
import { saveProductsToCache } from './productCache.js';

function createSheetsClient(scopes) {
    const { clientEmail, privateKey } = getGoogleSheetsConfig();

    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: clientEmail,
            private_key: privateKey,
        },
        scopes,
    });

    return google.sheets({ version: 'v4', auth });
}

/**
 * Parse sheet rows into product objects
 * Expected columns: number, name_ru, name_en, quantity, breeder, category, smell, height, color, petal, price
 * Image columns at indices 4, 5, 6 (or by header name)
 */
function parseSheetToProducts(rows) {
    if (!rows || rows.length < 2) return [];

    const headers = rows[0].map((h) => (h || '').toString().toLowerCase().trim());
    const headerIndex = (name) => {
        const idx = headers.indexOf(name);
        return idx >= 0 ? idx : -1;
    };

    const idx = {
        number: headerIndex('number'),
        name_ru: headerIndex('name_ru'),
        name_en: headerIndex('name_en'),
        quantity: headerIndex('quantity'),
        breeder: headerIndex('breeder'),
        category: headerIndex('category'),
        smell: headerIndex('smell'),
        height: headerIndex('height'),
        color: headerIndex('color'),
        petal: headerIndex('petal'),
        price: headerIndex('price'),
    };

    // Image columns: image1, image2, image3, image4 (as in your Google Sheet)
    const imgIndices = [];
    for (const name of ['image1', 'image2', 'image3', 'image4', 'img1', 'img2', 'img3']) {
        const i = headerIndex(name);
        if (i >= 0) imgIndices.push(i);
    }
    if (imgIndices.length === 0) {
        imgIndices.push(4, 5, 6);
    }

    const products = [];

    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row || row.length === 0) continue;

        const get = (key) => {
            const k = idx[key];
            if (k < 0 || k >= row.length) return null;
            const val = row[k];
            return val != null && val !== '' ? String(val).trim() : null;
        };

        const num = get('number') || `row-${i + 1}`;
        const qty = idx.quantity >= 0 && row[idx.quantity] != null
            ? parseInt(String(row[idx.quantity]).replace(/\D/g, ''), 10) || 0
            : 0;

        const images = [];
        for (const j of imgIndices) {
            if (j < row.length && row[j]) {
                let img = String(row[j]).trim();
                if (img) {
                    if (img.startsWith('http')) {
                        img = img.split('/').pop() || img;
                    } else {
                        // Normalize: strip trailing hyphen (e.g. "1749548079-" from sheet)
                        img = img.replace(/-+$/, '');
                    }
                    images.push(img);
                }
            }
        }
        if (images.length === 0) {
            images.push('1730913009-1.jpg');
        }

        const rawCategory = get('category') || '';
        const category = rawCategory; // Keep as string for comma-separated "1,3"

        products.push({
            number: num,
            id: num,
            slug: get('name_en') || num,
            name_ru: get('name_ru') || '',
            name_en: get('name_en') || '',
            name: get('name_ru') || get('name_en') || num,
            images,
            quantity: qty,
            stock: qty,
            breeder: get('breeder') || '',
            category,
            smell: get('smell') != null ? parseInt(get('smell'), 10) : null,
            height: get('height') != null ? parseFloat(get('height')) : null,
            color: get('color') || '',
            petal: get('petal') != null ? parseFloat(get('petal')) : null,
            price: get('price') != null ? parseFloat(get('price')) : null,
        });
    }

    // Sort A–Z by name (Russian, then English)
    products.sort((a, b) => {
        const nameA = (a.name_ru || a.name_en || a.name || '').toLowerCase();
        const nameB = (b.name_ru || b.name_en || b.name || '').toLowerCase();
        return nameA.localeCompare(nameB, 'ru');
    });

    return products;
}

/**
 * Fetch all products from Google Sheets
 */
export async function fetchProductsFromSheet() {
    const { spreadsheetId, sheetName } = getGoogleSheetsConfig();
    const sheets = createSheetsClient(['https://www.googleapis.com/auth/spreadsheets.readonly']);

    const res = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!A:Z`,
    });

    const rows = res.data.values || [];
    const products = parseSheetToProducts(rows);

    if (products.length > 0) {
        try {
            saveProductsToCache(products);
        } catch (err) {
            console.warn('Could not write products cache:', err.message);
        }
    }

    return products;
}

/**
 * Decrease product quantities in Google Sheets
 * @param {Array<{number: string, quantity: number}>} items
 */
export async function updateQuantitiesInSheet(items) {
    const { spreadsheetId, sheetName } = getGoogleSheetsConfig();
    const sheets = createSheetsClient(['https://www.googleapis.com/auth/spreadsheets']);

    // Get current data to find row numbers and quantities
    const res = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!A:Z`,
    });

    const rows = res.data.values || [];
    if (rows.length < 2) {
        throw new Error('Sheet has no data');
    }

    const headers = rows[0].map((h) => (h || '').toString().toLowerCase().trim());
    const numberIdx = headers.indexOf('number');
    const quantityIdx = headers.indexOf('quantity');

    if (numberIdx < 0 || quantityIdx < 0) {
        throw new Error('Sheet must have "number" and "quantity" columns');
    }

    const numberToRow = new Map();
    const numberToCurrentQty = new Map();

    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row && row[numberIdx]) {
            const num = String(row[numberIdx]).trim();
            numberToRow.set(num, i + 1);
            const qty = row[quantityIdx] != null ? parseInt(String(row[quantityIdx]).replace(/\D/g, ''), 10) || 0 : 0;
            numberToCurrentQty.set(num, qty);
        }
    }

    const updates = [];

    for (const item of items) {
        const num = String(item.number || item.id || item.slug).trim();
        const rowNum = numberToRow.get(num);
        if (rowNum == null) continue;

        const currentQty = numberToCurrentQty.get(num) ?? 0;
        const decrease = Math.min(item.quantity || 0, currentQty);
        const newQty = Math.max(0, currentQty - decrease);

        numberToCurrentQty.set(num, newQty);

        updates.push({
            range: `${sheetName}!${columnLetter(quantityIdx + 1)}${rowNum}`,
            values: [[newQty]],
        });
    }

    if (updates.length === 0) {
        return { success: true, updated: 0 };
    }

    await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId,
        requestBody: {
            valueInputOption: 'USER_ENTERED',
            data: updates,
        },
    });

    return { success: true, updated: updates.length };
}
function columnLetter(col) {
    let letter = '';
    while (col > 0) {
        const remainder = (col - 1) % 26;
        letter = String.fromCharCode(65 + remainder) + letter;
        col = Math.floor((col - 1) / 26);
    }
    return letter || 'A';
}

