'use client';

import { useMemo } from 'react';
import categories from '../data/categories.js';

export { categories };

export function useFilteredRoses(roses, filters) {
  return useMemo(() => {
    const search = (filters.search || '').trim().toLowerCase();
    const categoryId = filters.category;

    return roses.filter((rose) => {
      // Filter by category: supports numeric ID or comma-separated IDs (e.g. "1,3")
      if (categoryId !== 'all') {
        const catId = parseInt(categoryId, 10);
        const roseCats = rose.category;
        if (roseCats == null || roseCats === '') return false;
        const catIds = typeof roseCats === 'string'
          ? roseCats.split(',').map((s) => parseInt(s.trim(), 10)).filter(Boolean)
          : [Number(roseCats)];
        if (!catIds.includes(catId)) return false;
      }

      if (!search) return true;

      const nameRu = (rose.name_ru || rose.name || '').toLowerCase();
      const nameEn = (rose.name_en || '').toLowerCase();
      const breeder = (rose.breeder || '').toLowerCase();
      return nameRu.includes(search) || nameEn.includes(search) || breeder.includes(search);
    });
  }, [roses, filters.search, filters.category]);
}
