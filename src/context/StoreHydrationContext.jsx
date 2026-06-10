'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { hydrateStoreFromStorage } from '../store/index.js';

const StoreHydrationContext = createContext(false);

export function StoreHydrationProvider({ children }) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    hydrateStoreFromStorage();
    setHydrated(true);
  }, []);

  return (
    <StoreHydrationContext.Provider value={hydrated}>
      {children}
    </StoreHydrationContext.Provider>
  );
}

export function useStoreHydrated() {
  return useContext(StoreHydrationContext);
}
