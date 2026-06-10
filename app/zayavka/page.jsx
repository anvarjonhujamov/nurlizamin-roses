'use client';

import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { WholesaleApplicationForm } from '@/components/WholesaleApplicationForm';
import { SITE_CONTACTS } from '@/data/contacts';

export default function ZayavkaPage() {
  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 pb-8 pt-24 sm:pt-28">
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl font-semibold text-nursery-900 sm:text-4xl">
            Заявка на оптовые поставки
          </h1>
          <p className="mt-3 text-sm text-slate-600 sm:text-base">
            Для крупных клиентов: розы и растения оптом. Заполните форму — мы свяжемся с вами.
          </p>
        </div>

        <div className="rounded-sm border border-cream-200 bg-white p-5 shadow-sm sm:p-8">
          <WholesaleApplicationForm />
        </div>

        <div className="mt-8 flex flex-col items-center gap-4 text-center">
          <Link
            href="/catalog"
            className="inline-block bg-nursery-700 px-8 py-3 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-nursery-800"
          >
            Смотреть каталог
          </Link>
          <p className="text-xs text-slate-500">
            Telegram:{' '}
            <a
              href={SITE_CONTACTS.telegram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-nursery-700 hover:underline"
            >
              @{SITE_CONTACTS.telegram.username}
            </a>
            {' · '}
            Instagram:{' '}
            <a
              href={SITE_CONTACTS.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-nursery-700 hover:underline"
            >
              @{SITE_CONTACTS.instagram.username}
            </a>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
