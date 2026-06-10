export const PREORDER_POLICY = {
  uz: {
    title: "🇺🇿 O'zbekcha",
    lines: [
      "May oyidan noyabr oyigacha ko'chatlarni oldindan band qilish (prezakaz) orqali xarid qilishingiz mumkin.",
      "Buyurtmani tasdiqlash uchun 50% oldindan to'lov amalga oshirilishi kerak.",
      "Agar 15 kun ichida oldindan to'lov amalga oshirilmasa, buyurtma avtomatik ravishda bekor qilinadi.",
    ],
  },
  ru: {
    title: '🇷🇺 Русский',
    lines: [
      'С мая по ноябрь вы можете приобрести саженцы по системе предзаказа (бронирования).',
      'Для подтверждения заказа необходимо внести предоплату в размере 50%.',
      'Если предоплата не будет внесена в течение 15 дней, заказ будет автоматически отменён.',
    ],
  },
};

export function formatPreorderPolicyForTelegram() {
  const block = (lang) => {
    const { title, lines } = PREORDER_POLICY[lang];
    return `<b>${title}</b>\n${lines.map((l) => `• ${l}`).join('\n')}`;
  };
  return `\n\n⚠️ <b>Prezakaz / Предзаказ</b>\n\n${block('uz')}\n\n${block('ru')}`;
}
