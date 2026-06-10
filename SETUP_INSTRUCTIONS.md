# Setup Instructions: Google Sheets Integration

## Overview

This catalog uses **Google Sheets** as the data source for products and inventory. When customers place orders, product quantities are automatically decremented in the sheet.

## Prerequisites

1. A Google Cloud project with Google Sheets API enabled
2. A service account with access to your spreadsheet

## Setup Steps

### Step 1: Create Google Cloud Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable **Google Sheets API**:
   - APIs & Services → Library → search "Google Sheets API" → Enable
4. Create a Service Account:
   - APIs & Services → Credentials → Create Credentials → Service Account
   - Give it a name (e.g. `zamin-catalog`) and create
   - Click the service account → Keys tab → Add Key → Create new key → JSON
   - Download the JSON file (keep it secret!)

### Step 2: Create Your Google Sheet

1. Create a new Google Sheet
2. Name the first sheet **Sheet1**
3. Add headers in row 1 (exact names matter):

| number | name_ru | name_en | image1 | image2 | image3 | image4 | quantity | breeder | category | smell | height | color | petal | price |
|--------|---------|---------|--------|--------|--------|--------|---------|---------|----------|-------|--------|-------|-------|-------|
| 1 | Роза Красная | Red Rose | 1731948717-1 | 1749548 | | | 50 | Breeder Co | 1,3 | 2 | 80 | red | 8 | 1500 |

**Column notes:**
- `number`: Unique product ID (string)
- `name_ru`, `name_en`: Product names
- `image1`–`image4`: Image filenames (e.g. `1731948717-1` or `1749548`). No extension needed – `.webp` is added automatically. Images from `https://host32.firstcoders.uz/images/products/`
- `quantity`: Stock quantity (integer)
- `category`: Comma-separated category IDs (e.g. `1,3` for multiple)
- `smell`: 0–3 (weak to very strong)
- `height`: Plant height in cm
- `color`, `petal`, `price`: Optional

### Step 3: Share the Sheet with the Service Account

1. Open your spreadsheet
2. Click **Share**
3. Add the **service account email** (from the JSON: `client_email`) as an Editor

### Step 4: Set Environment Variables

Create `.env.local` (or `.env`) with:

```env
# Google Sheets (required for API)
GOOGLE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_ID=your-spreadsheet-id-from-url

# Telegram (for order notifications) - NEXT_PUBLIC_ for client-side
NEXT_PUBLIC_TELEGRAM_BOT_TOKEN=your_bot_token
NEXT_PUBLIC_TELEGRAM_CHAT_ID=your_chat_id

# Optional: Override API URL
# NEXT_PUBLIC_API_URL=https://your-app.vercel.app/api/sheets
```

**Getting `GOOGLE_SHEETS_ID`:** From the sheet URL  
`https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit` — use the long ID between `/d/` and `/edit`.

**`GOOGLE_PRIVATE_KEY`:** Copy the full `private_key` from the JSON, including `-----BEGIN` and `-----END`.

**Vercel (important):** In Project → Settings → Environment Variables, add all three `GOOGLE_*` vars for **Production**, **Preview**, and **Development**:

| Variable | Value |
|----------|--------|
| `GOOGLE_CLIENT_EMAIL` | `client_email` from JSON |
| `GOOGLE_SHEETS_ID` | Spreadsheet ID from URL |
| `GOOGLE_PRIVATE_KEY` | Full private key — either paste multiline PEM, or one line with `\n` between lines |

After saving env vars, go to **Deployments → Redeploy** (env changes do not apply to old deployments automatically).

Share the Google Sheet with the service account email as **Editor**.

### Step 5: Local Development

```bash
npm install
npm run dev
```

This runs the Next.js app with the `/api/sheets` endpoint locally at http://localhost:3000.

For production build: `npm run build` then `npm start`.

### Step 6: Deploy to Vercel

1. In **Vercel → Project Settings → General**:
   - **Framework Preset:** Next.js
   - **Root Directory:** (leave empty)
   - **Build Command:** `npm run build`
   - **Output Directory:** (leave empty — do **not** use `dist` or `out`)
   - **Install Command:** `npm install`
2. Add env vars in **Environment Variables** (see Step 4)
3. Deploy: push to the linked Git repo or run `vercel --prod`

If you see **404: NOT_FOUND** on `*.vercel.app`, the project is usually set to the wrong framework or output folder (`dist` from an old Vite setup). Clear **Output Directory** and redeploy.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sheets` | Fetch all products |
| POST | `/api/sheets` | Update quantities. Body: `{ items: [{ number, quantity }, ...] }` |

## Troubleshooting

- **"Missing Google Sheets env"**: The app uses **only Google Sheets** (no fallback). Ensure `GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `GOOGLE_SHEETS_ID` are set in `.env` for local dev and in Vercel for production.
- **401 / 403**: Verify the sheet is shared with the service account email.
- **Empty products**: Check that row 1 has correct headers and row 2+ has data.
- **Quantities not updating**: Ensure the `number` column matches product IDs in the basket.
