import { NextResponse } from 'next/server';
import { processOrder } from '@/lib/processOrder';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const formData = body?.formData;
    const basketItems = body?.basketItems;

    const result = await processOrder(formData, basketItems);
    return NextResponse.json(result);
  } catch (err) {
    console.error('POST /api/orders error:', err);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process order',
        details: err.message || 'Unknown error',
      },
      { status: 500 },
    );
  }
}
