'use client';

import { useMemo } from 'react';
import categories from '../data/categories.js';
import { roseMatchesCategory } from './roseInfo.js';

export { categories };

export function useFilteredRoses(roses, filters) {
  return useMemo(() => {
    const search = (filters.search || '').trim().toLowerCase();
    const categoryFilter = filters.category ?? 'all';

    return roses.filter((rose) => {
      if (!roseMatchesCategory(rose.category, categoryFilter)) {
        return false;
      }

      if (!search) return true;

      const nameRu = (rose.name_ru || rose.name || '').toLowerCase();
      const nameEn = (rose.name_en || '').toLowerCase();
      const breeder = (rose.breeder || '').toLowerCase();
      return nameRu.includes(search) || nameEn.includes(search) || breeder.includes(search);
    });
  }, [roses, filters.search, filters.category]);
}
