'use client';

import Link from 'next/link';
import { useRosesData } from '@/hooks/useRosesData';
import { RoseCard } from '@/components/RoseCard';
import { RoseCardSkeleton } from '@/components/RoseCardSkeleton';
import { RoseDetailModal } from '@/components/RoseDetailModal';
import { useState } from 'react';

const PREVIEW_COUNT = 8;

export function FeaturedRosesPreview() {
  const { roses, loading } = useRosesData();
  const [selected, setSelected] = useState(null);
  const featured = roses.slice(0, PREVIEW_COUNT);

  return (
    <section className="py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="mb-8 text-center font-display text-2xl font-semibold text-nursery-900 sm:text-3xl">
          Популярные сорта
        </h2>

        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <RoseCardSkeleton key={i} delay={(i % 4 + 1) * 100} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
            {featured.map((rose, index) => (
              <RoseCard
                key={rose.id}
                rose={rose}
                onOpen={setSelected}
                animationIndex={index}
              />
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/catalog"
            className="inline-block text-lg font-semibold text-nursery-700 underline-offset-4 transition hover:text-nursery-900 hover:underline sm:text-xl"
          >
            Весь каталог →
          </Link>
        </div>
      </div>

      <RoseDetailModal rose={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
