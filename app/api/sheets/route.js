import { NextResponse } from 'next/server';
import { fetchProductsFromSheet, updateQuantitiesInSheet } from '@/lib/sheets';

// googleapis requires Node.js runtime (not Edge)
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const products = await fetchProductsFromSheet();
    return NextResponse.json(products || []);
  } catch (err) {
    console.error('GET /api/sheets error:', err);
    return NextResponse.json(
      {
        error: 'Failed to fetch data',
        details: err.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const items = body?.items || [];

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request. Expected items array.' },
        { status: 400 }
      );
    }

    const result = await updateQuantitiesInSheet(items);
    return NextResponse.json({
      success: true,
      message: `Updated quantities for ${result.updated} products`,
      ...result,
    });
  } catch (err) {
    console.error('POST /api/sheets error:', err);
    return NextResponse.json(
      {
        error: 'Failed to update quantities',
        details: err.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
