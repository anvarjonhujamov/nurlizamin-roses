/**
 * Read and normalize Google service account env vars (local + Vercel).
 */
export function normalizePrivateKey(raw) {
  if (!raw) return '';

  let key = String(raw).trim();

  // Strip wrapping quotes from .env / Vercel paste
  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1);
  }

  // Vercel often stores literal \n — convert to real newlines
  key = key.replace(/\\n/g, '\n');

  // If pasted as one line without \n, re-wrap PEM body
  if (key.includes('BEGIN PRIVATE KEY') && !key.includes('\n')) {
    key = key
      .replace('-----BEGIN PRIVATE KEY-----', '-----BEGIN PRIVATE KEY-----\n')
      .replace('-----END PRIVATE KEY-----', '\n-----END PRIVATE KEY-----\n');
  }

  return key.trim();
}

export function getGoogleSheetsConfig() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL?.trim();
  const privateKey = normalizePrivateKey(process.env.GOOGLE_PRIVATE_KEY);
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID?.trim();

  const missing = [];
  if (!clientEmail) missing.push('GOOGLE_CLIENT_EMAIL');
  if (!privateKey) missing.push('GOOGLE_PRIVATE_KEY');
  if (!spreadsheetId) missing.push('GOOGLE_SHEETS_ID');

  if (missing.length > 0) {
    throw new Error(
      `Missing env on server: ${missing.join(', ')}. Add them in Vercel → Settings → Environment Variables.`,
    );
  }

  if (!privateKey.includes('BEGIN PRIVATE KEY')) {
    throw new Error(
      'GOOGLE_PRIVATE_KEY is invalid. Paste the full PEM key from the JSON file (with BEGIN/END lines).',
    );
  }

  return { clientEmail, privateKey, spreadsheetId };
}
