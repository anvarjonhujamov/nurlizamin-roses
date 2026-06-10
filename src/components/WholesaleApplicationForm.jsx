'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { sendWholesaleApplicationToTelegram } from '../utils/telegram.js';
import { SITE_CONTACTS } from '../data/contacts.js';

const INITIAL_FORM = {
  fullName: '',
  phone: '',
  email: '',
  company: '',
  minQuantity: '',
  maxQuantity: '',
  wantsFullCatalog: true,
  message: '',
};

export function WholesaleApplicationForm() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.fullName.trim()) {
      toast.error('Укажите полное имя');
      return;
    }
    if (!form.phone.trim()) {
      toast.error('Укажите номер телефона');
      return;
    }
    if (!form.minQuantity.trim() || !form.maxQuantity.trim()) {
      toast.error('Укажите минимальное и максимальное количество');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await sendWholesaleApplicationToTelegram(form);
      if (result.success) {
        toast.success('Заявка отправлена! Мы свяжемся с вами в ближайшее время.');
        setForm(INITIAL_FORM);
      } else {
        toast.error(result.error || 'Ошибка при отправке заявки');
      }
    } catch {
      toast.error('Ошибка при отправке заявки');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium text-slate-700">
            Полное имя <span className="text-red-500">*</span>
          </label>
          <input
            id="fullName"
            type="text"
            value={form.fullName}
            onChange={(e) => updateField('fullName', e.target.value)}
            placeholder="Иванов Иван Иванович"
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            required
          />
        </div>

        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-slate-700">
            Телефон <span className="text-red-500">*</span>
          </label>
          <input
            id="phone"
            type="text"
            value={form.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            placeholder="Введите номер телефона"
            autoComplete="tel"
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => updateField('email', e.target.value)}
            placeholder="email@example.com"
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="company" className="mb-1.5 block text-sm font-medium text-slate-700">
            Компания / бизнес
          </label>
          <input
            id="company"
            type="text"
            value={form.company}
            onChange={(e) => updateField('company', e.target.value)}
            placeholder="Название компании или тип бизнеса"
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
        </div>

        <div>
          <label htmlFor="minQuantity" className="mb-1.5 block text-sm font-medium text-slate-700">
            Минимальное количество <span className="text-red-500">*</span>
          </label>
          <input
            id="minQuantity"
            type="text"
            inputMode="numeric"
            value={form.minQuantity}
            onChange={(e) => updateField('minQuantity', e.target.value)}
            placeholder="Например: 100"
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            required
          />
        </div>

        <div>
          <label htmlFor="maxQuantity" className="mb-1.5 block text-sm font-medium text-slate-700">
            Максимальное количество <span className="text-red-500">*</span>
          </label>
          <input
            id="maxQuantity"
            type="text"
            inputMode="numeric"
            value={form.maxQuantity}
            onChange={(e) => updateField('maxQuantity', e.target.value)}
            placeholder="Например: 5000"
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            required
          />
        </div>

        <div className="sm:col-span-2">
          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <input
              type="checkbox"
              checked={form.wantsFullCatalog}
              onChange={(e) => updateField('wantsFullCatalog', e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
            <span>
              <span className="block text-sm font-medium text-slate-800">
                Интересует весь каталог
              </span>
              <span className="mt-0.5 block text-xs text-slate-500">
                Отметьте, если хотите получить полный ассортимент роз и растений
              </span>
            </span>
          </label>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-slate-700">
            Дополнительная информация
          </label>
          <textarea
            id="message"
            rows={4}
            value={form.message}
            onChange={(e) => updateField('message', e.target.value)}
            placeholder="Какие сорта интересуют, регион доставки, сроки и другие пожелания..."
            className="w-full resize-y rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-teal-600 py-3.5 text-base font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-10"
      >
        {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
      </button>

      <p className="text-xs text-slate-500">
        Или свяжитесь с нами напрямую:{' '}
        {SITE_CONTACTS.phones.map((phone, i) => (
          <span key={phone.href}>
            {i > 0 && ' · '}
            <a href={`tel:${phone.href}`} className="text-teal-700 hover:underline">
              {phone.display}
            </a>
          </span>
        ))}
        {' · '}
        <a
          href={SITE_CONTACTS.telegram.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-teal-700 hover:underline"
        >
          @{SITE_CONTACTS.telegram.username}
        </a>
      </p>
    </form>
  );
}
