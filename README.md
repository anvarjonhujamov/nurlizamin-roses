# Nurli Zamin

E-commerce catalog for premium roses in Uzbekistan. Built with Next.js, React, and Google Sheets for data.

## Tech Stack

- **Next.js 15** (App Router) – React framework with SEO, server components
- **React 19** – UI
- **Redux Toolkit** – Basket state
- **Tailwind CSS** – Styling
- **Google Sheets** – Product catalog & inventory
- **Vercel** – Deployment

## Scripts

```bash
npm run dev    # Start dev server (http://localhost:3000)
npm run build  # Production build
npm start      # Start production server
npm run lint   # Run ESLint
```

## Setup

See [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md) for Google Sheets and environment configuration.

## Project Structure

```
app/
  layout.jsx       # Root layout, metadata, providers
  page.jsx         # Redirects to /catalog
  catalog/         # Product catalog
  basket/          # Shopping cart & checkout
  history/         # Order history
  api/sheets/      # Google Sheets API route
src/
  components/      # React components
  hooks/           # useRosesData, useDebounce, useInView
  store/           # Redux basket slice
  utils/           # filtering, telegram, orderHistory
  context/         # OrderNotificationContext
  lib/             # constants (image URLs)
lib/
  sheets.js        # Google Sheets read/write
```
