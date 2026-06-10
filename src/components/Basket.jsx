'use client';

import { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IoTrashOutline } from 'react-icons/io5';
import toast from 'react-hot-toast';
import { BasketCard } from './BasketCard.jsx';
import { selectItems, selectTotalItems, clear } from '../store/basketSlice.js';

export function Basket({ rosesById }) {
  const dispatch = useDispatch();
  const items = useSelector(selectItems);
  const totalItems = useSelector(selectTotalItems);

  const entries = useMemo(
    () =>
      Object.values(items).map((item) => {
        const rose = rosesById[item.id];
        return {
          ...item,
          rose,
        };
      }),
    [items, rosesById],
  );

  const handleClearAll = () => {
    if (entries.length === 0) return;

    if (window.confirm('Вы уверены, что хотите очистить всю корзину?')) {
      dispatch(clear());
      toast.success('Корзина очищена');
    }
  };

  return (
    <section className="flex h-full flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <header className="flex items-center justify-between gap-2">
        
        <div>
          <h2 className="text-base font-semibold text-slate-900">Корзина</h2>
          <p className="text-xs text-slate-500">
            Товаров: <span className="font-semibold">{totalItems}</span>
          </p>
        </div>
        {entries.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="flex items-center gap-2 rounded-lg border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:border-red-400 active:scale-95"
            title="Очистить корзину"
          >
            <IoTrashOutline className="h-4 w-4" />
            <span>Очистить все</span>
          </button>
        )}
      </header>

      {entries.length === 0 ? (
        <div className="flex flex-1 items-center justify-center text-xs text-slate-500">
          Корзина пуста.
        </div>
      ) : (
        <ul className="flex flex-1 flex-col gap-3 text-sm">
          {entries.map((entry) => (
            <BasketCard key={entry.id} item={entry} />
          ))}
        </ul>
      )}
    </section>
  );
}
