/**
 * Read and normalize Google service account env vars (local + Vercel).
 */
export function normalizePrivateKey(raw) {
  if (!raw) return '';

  let key = String(raw).trim();

  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1);
  }

  key = key.replace(/\\n/g, '\n');

  if (key.includes('BEGIN PRIVATE KEY') && !key.includes('\n')) {
    key = key
      .replace('-----BEGIN PRIVATE KEY-----', '-----BEGIN PRIVATE KEY-----\n')
      .replace('-----END PRIVATE KEY-----', '\n-----END PRIVATE KEY-----\n');
  }

  return key.trim();
}

function readServiceAccountFromJson() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim();
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    return {
      clientEmail: parsed.client_email?.trim() || '',
      privateKey: normalizePrivateKey(parsed.private_key),
    };
  } catch {
    throw new Error(
      'GOOGLE_SERVICE_ACCOUNT_JSON is invalid JSON. Paste the full service account key file.',
    );
  }
}

export function getGoogleSheetsConfig() {
  const fromJson = readServiceAccountFromJson();
  const clientEmail =
    fromJson?.clientEmail || process.env.GOOGLE_CLIENT_EMAIL?.trim() || '';
  const privateKey =
    fromJson?.privateKey || normalizePrivateKey(process.env.GOOGLE_PRIVATE_KEY);
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID?.trim();
  const sheetName = 'Sheet4';

  const missing = [];
  if (!clientEmail) missing.push('GOOGLE_CLIENT_EMAIL');
  if (!privateKey) missing.push('GOOGLE_PRIVATE_KEY');
  if (!spreadsheetId) missing.push('GOOGLE_SHEETS_ID');

  if (missing.length > 0) {
    throw new Error(
      `Missing env on server: ${missing.join(', ')}. Add them in Vercel → Settings → Environment Variables (or set GOOGLE_SERVICE_ACCOUNT_JSON + GOOGLE_SHEETS_ID).`,
    );
  }

  if (!privateKey.includes('BEGIN PRIVATE KEY')) {
    throw new Error(
      'GOOGLE_PRIVATE_KEY is invalid. Paste the full PEM key from the JSON file (with BEGIN/END lines).',
    );
  }

  return { clientEmail, privateKey, spreadsheetId, sheetName };
}
