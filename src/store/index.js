import { configureStore } from '@reduxjs/toolkit';
import basketReducer, { hydrate } from './basketSlice.js';

const STORAGE_KEY = 'rose-basket-v1';

export function loadBasketFromStorage() {
  if (typeof window === 'undefined') return undefined;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && parsed.items) {
      return { basket: parsed };
    }
  } catch {
    // ignore
  }
  return undefined;
}

export const store = configureStore({
  reducer: { basket: basketReducer },
});

export function hydrateStoreFromStorage() {
  const persisted = loadBasketFromStorage();
  if (persisted?.basket) {
    store.dispatch(hydrate(persisted.basket));
  }
}

if (typeof window !== 'undefined') {
  store.subscribe(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(store.getState().basket),
      );
    } catch {
      // ignore
    }
  });
}
