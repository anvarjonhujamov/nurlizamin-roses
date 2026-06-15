export function getTelegramCredentials() {
  const botToken =
    process.env.TELEGRAM_BOT_TOKEN?.trim() ||
    process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN?.trim();
  const chatId =
    process.env.TELEGRAM_CHAT_ID?.trim() ||
    process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID?.trim();

  if (!botToken || !chatId) {
    throw new Error(
      'Telegram credentials not configured. Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in Vercel.',
    );
  }

  return { botToken, chatId };
}
