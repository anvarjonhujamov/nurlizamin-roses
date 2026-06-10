// Deprecated: basket context has been replaced with Redux.
// File kept only to avoid import errors if something still references it.
export function BasketProvider({ children }) {
  return children;
}

export function useBasket() {
  throw new Error('useBasket is no longer used. Switch to Redux store hooks.');
}
