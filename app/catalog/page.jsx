'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useRosesData } from '@/hooks/useRosesData';
import { useDebounce } from '@/hooks/useDebounce';
import { useFilteredRoses, categories } from '@/utils/filtering';
import { RoseCard } from '@/components/RoseCard';
import { RoseCardSkeleton } from '@/components/RoseCardSkeleton';
import { RoseDetailModal } from '@/components/RoseDetailModal';
import { CategoryPills } from '@/components/CategoryPills';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const GRID_CLASSES = {
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
};

const DESKTOP_PIN_SCROLL = 150;

function CatalogContent() {
  const searchParams = useSearchParams();
  const { roses, loading, error } = useRosesData();
  const [filters, setFilters] = useState({ search: '', category: 'all' });
  const [selected, setSelected] = useState(null);
  const [gridCols, setGridCols] = useState(4);
  const [isDesktopPinned, setIsDesktopPinned] = useState(false);
  const [categoryBarHeight, setCategoryBarHeight] = useState(0);
  const productsRef = useRef(null);
  const categoryBarRef = useRef(null);

  useEffect(() => {
    const cat = searchParams.get('category');
    setFilters((prev) => ({ ...prev, category: cat || 'all' }));
  }, [searchParams]);

  const debouncedSearch = useDebounce(filters.search, 300);
  const debouncedFilters = { ...filters, search: debouncedSearch };
  const filtered = useFilteredRoses(roses, debouncedFilters);
  const gridClass = GRID_CLASSES[gridCols];
  const skeletonCount = gridCols * 3;

  const scrollToProducts = () => {
    requestAnimationFrame(() => {
      productsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const setCategory = (category) => {
    setFilters((prev) => ({ ...prev, category }));
    if (category === 'all') {
      const url = new URL(window.location.href);
      url.searchParams.delete('category');
      window.history.replaceState({}, '', url);
    } else {
      const url = new URL(window.location.href);
      url.searchParams.set('category', category);
      window.history.replaceState({}, '', url);
    }
    scrollToProducts();
  };

  useEffect(() => {
    const updatePinState = () => {
      const isDesktop = window.matchMedia('(min-width: 768px)').matches;
      if (!isDesktop) {
        setIsDesktopPinned(false);
        return;
      }
      setIsDesktopPinned(window.scrollY > DESKTOP_PIN_SCROLL);
    };

    updatePinState();
    window.addEventListener('scroll', updatePinState, { passive: true });
    window.addEventListener('resize', updatePinState);
    return () => {
      window.removeEventListener('scroll', updatePinState);
      window.removeEventListener('resize', updatePinState);
    };
  }, []);

  useEffect(() => {
    const el = categoryBarRef.current;
    if (!el) return undefined;

    const measure = () => setCategoryBarHeight(el.offsetHeight);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Navbar
        searchValue={filters.search}
        onSearchChange={(value) => setFilters({ ...filters, search: value })}
      />

      <div className="pt-16">
     

        {isDesktopPinned && (
          <div className="hidden md:block" style={{ height: categoryBarHeight }} aria-hidden />
        )}
        <div
          ref={categoryBarRef}
          className={`z-40 border-b border-cream-200 bg-cream-50/95 backdrop-blur-sm sticky top-16 md:transition-shadow ${
            isDesktopPinned
              ? 'md:fixed md:left-0 md:right-0 md:top-16 md:z-40 md:shadow-sm'
              : 'md:static md:border-b-0 md:bg-transparent md:shadow-none md:backdrop-blur-none'
          }`}
        >
          <div className="mx-auto max-w-7xl md:px-4">
            <CategoryPills
              categories={categories}
              value={filters.category}
              onChange={setCategory}
            />
          </div>
        </div>

        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 md:py-8">
          <header
            ref={productsRef}
            className="mb-2 flex scroll-mt-28 flex-col gap-3 border-b border-cream-200 pb-4 md:flex-row md:items-end md:justify-between"
          >
            <div>
              <h1 className="font-display text-2xl font-semibold text-nursery-900 sm:text-3xl">
                Каталог роз
              </h1>
            </div>

            <div className="hidden items-center gap-1 rounded-sm border border-cream-200 bg-white p-1 md:flex">
              {[2, 3, 4].map((cols) => (
                <button
                  key={cols}
                  type="button"
                  onClick={() => setGridCols(cols)}
                  className={`flex h-8 w-8 items-center justify-center rounded-sm transition-all ${
                    gridCols === cols
                      ? 'bg-nursery-100 text-nursery-800'
                      : 'text-slate-400 hover:bg-cream-100'
                  }`}
                  title={`${cols} columns`}
                >
                  <GridIcon cols={cols} />
                </button>
              ))}
            </div>
          </header>

          {loading && (
            <section>
              <div className={`grid grid-cols-2 gap-4 lg:gap-6 ${gridClass}`}>
                {Array.from({ length: skeletonCount }).map((_, index) => (
                  <RoseCardSkeleton key={index} delay={(index % 8 + 1) * 100} />
                ))}
              </div>
            </section>
          )}

          {error && !loading && (
          <div className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            <p className="font-semibold">Не удалось загрузить каталог.</p>
            <p className="mt-1 text-xs text-red-700/80">{error}</p>
            {error?.includes('Missing env') && (
              <p className="mt-2 text-xs text-red-700">
                Добавьте GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY и GOOGLE_SHEETS_ID в Vercel → Settings → Environment Variables, затем перезапустите деплой.
              </p>
            )}
          </div>
          )}

          {!loading && !error && (
            <section>
              {filtered.length === 0 ? (
                <div className="flex min-h-[200px] items-center justify-center text-sm text-slate-500">
                  Нет роз по заданным фильтрам.
                </div>
              ) : (
                <div className={`grid grid-cols-2 gap-4 lg:gap-6 ${gridClass}`}>
                  {filtered.map((rose, index) => (
                    <RoseCard
                      key={`${rose.id}-${index}`}
                      rose={rose}
                      onOpen={(r) => setSelected(r)}
                      animationIndex={index}
                    />
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </div>

      <RoseDetailModal rose={selected} onClose={() => setSelected(null)} />
      <Footer />
    </>
  );
}

export default function CatalogPage() {
  return (
    <div className="min-h-screen bg-cream-50">
      <Suspense fallback={<div className="pt-24 text-center text-sm text-slate-500">Загрузка...</div>}>
        <CatalogContent />
      </Suspense>
    </div>
  );
}

function GridIcon({ cols }) {
  if (cols === 2) {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden>
        <rect x="0" y="0" width="6" height="14" rx="1" opacity="0.8" />
        <rect x="8" y="0" width="6" height="14" rx="1" opacity="0.8" />
      </svg>
    );
  }
  if (cols === 3) {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden>
        <rect x="0" y="0" width="4" height="14" rx="1" opacity="0.8" />
        <rect x="5" y="0" width="4" height="14" rx="1" opacity="0.8" />
        <rect x="10" y="0" width="4" height="14" rx="1" opacity="0.8" />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden>
      <rect x="0" y="0" width="2.5" height="14" rx="0.5" opacity="0.8" />
      <rect x="3.8" y="0" width="2.5" height="14" rx="0.5" opacity="0.8" />
      <rect x="7.6" y="0" width="2.5" height="14" rx="0.5" opacity="0.8" />
      <rect x="11.4" y="0" width="2.5" height="14" rx="0.5" opacity="0.8" />
    </svg>
  );
}
