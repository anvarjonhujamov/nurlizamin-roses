import { getTelegramCredentials } from './telegramCredentials.js';

export async function sendTelegramMessage(message) {
  const { botToken, chatId } = getTelegramCredentials();

  const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
    }),
  });

  const data = await response.json();
  if (!data.ok) {
    throw new Error(data.description || 'Telegram sendMessage failed');
  }

  return true;
}

export async function sendTelegramDocument(buffer, filename, caption = '') {
  const { botToken, chatId } = getTelegramCredentials();

  const formData = new FormData();
  formData.append('chat_id', chatId);
  formData.append('document', new Blob([buffer]), filename);
  if (caption) {
    formData.append('caption', caption);
    formData.append('parse_mode', 'HTML');
  }

  const response = await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  if (!data.ok) {
    throw new Error(data.description || 'Telegram sendDocument failed');
  }

  return true;
}
