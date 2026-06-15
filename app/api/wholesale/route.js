import { NextResponse } from 'next/server';
import { formatWholesaleMessage } from '@/lib/orderExcel';
import { sendTelegramMessage } from '@/lib/telegramServer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const formData = await request.json();

    if (!formData?.fullName || !formData?.phone) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 },
      );
    }

    const message = formatWholesaleMessage(formData);
    await sendTelegramMessage(message);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('POST /api/wholesale error:', err);
    return NextResponse.json(
      {
        success: false,
        error: 'Не удалось отправить заявку. Попробуйте позже или свяжитесь по телефону.',
        details: err.message || 'Unknown error',
      },
      { status: 500 },
    );
  }
}
