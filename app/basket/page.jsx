'use client';

import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft } from 'react-icons/fi';
import { useRosesData } from '@/hooks/useRosesData';
import { Basket } from '@/components/Basket';
import { Navbar } from '@/components/Navbar';
import { ClientInfoForm } from '@/components/ClientInfoForm';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { selectTotalItems, selectItems } from '@/store/basketSlice';
import { useSelector } from 'react-redux';
import { useStoreHydrated } from '@/context/StoreHydrationContext';

export default function BasketPage() {
  const router = useRouter();
  const { roses } = useRosesData();
  const storeHydrated = useStoreHydrated();
  const totalItems = useSelector(selectTotalItems);
  const items = useSelector(selectItems);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const rosesById = useMemo(() => {
    const map = {};
    for (const rose of roses) {
      map[rose.id] = rose;
    }
    return map;
  }, [roses]);

  const totalVarieties = Object.keys(items).length;

  const basketItems = useMemo(() => {
    return Object.values(items)
      .map((item) => {
        const rose = rosesById[item.id];
        if (!rose) return null;
        return {
          id: item.id,
          number: rose.number || rose.id,
          slug: rose.slug || rose.name_en || `product-${item.id}`,
          name: rose.name_ru || rose.name || rose.name_en || `Rose #${item.id}`,
          color: rose.color || '',
          height: rose.height || '',
          quantity: item.quantity,
        };
      })
      .filter(Boolean);
  }, [items, rosesById]);

  if (!storeHydrated) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <Navbar />
        <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-32 pt-24">
          <p className="text-sm text-slate-500">Загрузка корзины...</p>
        </div>
      </div>
    );
  }

  if (totalItems === 0) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <Navbar />
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-6 px-4 py-20 pt-32 text-center">
          <div className="rounded-full bg-slate-100 p-6">
            <svg className="h-16 w-16 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Корзина пуста</h2>
            <p className="mt-1 text-sm text-slate-500">Добавьте товары из каталога</p>
          </div>
          <button
            type="button"
            onClick={() => router.push('/catalog')}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            <FiArrowLeft size={16} />
            <span>Перейти в каталог</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {isSubmitting && <LoadingOverlay message="Отправка заказа..." />}

      <Navbar />

      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 pt-20 md:py-8 md:pt-24">
        <header className="mb-2 flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <button
            type="button"
            onClick={() => router.push('/catalog')}
            className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-rose-500 hover:text-rose-600 focus:outline-none focus:ring-1 focus:ring-rose-500"
          >
            <FiArrowLeft size={14} />
            <span>Вернуться к каталогу</span>
          </button>
          <div className="text-right">
            <h1 className="text-xl font-semibold text-slate-900">В корзине</h1>
            <p className="text-xs text-slate-500">
              Товаров: <span className="font-semibold">{totalItems}</span>
            </p>
          </div>
        </header>

       

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Basket rosesById={rosesById} />
          </div>

          <div className="lg:col-span-1">
            <ClientInfoForm
              totalVarieties={totalVarieties}
              basketItems={basketItems}
              onSubmitting={setIsSubmitting}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
