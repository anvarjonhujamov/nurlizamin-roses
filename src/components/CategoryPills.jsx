'use client';

import { useEffect, useRef } from 'react';

export function CategoryPills({ categories, value, onChange }) {
  const scrollRef = useRef(null);
  const activeRef = useRef(null);

  useEffect(() => {
    if (activeRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const pill = activeRef.current;
      const left = pill.offsetLeft - container.offsetWidth / 2 + pill.offsetWidth / 2;
      container.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
    }
  }, [value]);

  const allCategories = [{ id: 'all', nameRu: 'Все сорта' }, ...categories];

  return (
    <div
      ref={scrollRef}
      className="category-scroll flex gap-2 overflow-x-auto px-3 py-4 sm:px-4 md:px-0"
    >
      {allCategories.map((cat) => {
        const isActive = String(value) === String(cat.id);
        return (
          <button
            key={cat.id}
            ref={isActive ? activeRef : null}
            type="button"
            onClick={() => onChange(String(cat.id))}
            className={`shrink-0 rounded-sm border px-3.5 py-1.5 text-xs font-medium transition sm:px-4 sm:text-sm ${
              isActive
                ? 'border-nursery-700 bg-nursery-700 text-white'
                : 'border-cream-200 bg-white text-slate-600 hover:border-nursery-300 hover:text-nursery-800'
            }`}
          >
            {cat.nameRu}
          </button>
        );
      })}
    </div>
  );
}
