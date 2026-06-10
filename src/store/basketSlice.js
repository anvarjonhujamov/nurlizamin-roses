import { createSlice } from '@reduxjs/toolkit';

// Shape of state: { items: { [id]: { id, quantity } } }
const initialState = {
  items: {},
};

const basketSlice = createSlice({
  name: 'basket',
  initialState,
  reducers: {
    setQuantity(state, action) {
      const { id, quantity } = action.payload;
      const safeQty = Number.isFinite(quantity) && quantity >= 1 ? quantity : 1;
      state.items[id] = { id, quantity: safeQty };
    },
    addOne(state, action) {
      const id = action.payload;
      const current = state.items[id]?.quantity ?? 0;
      const nextQty = current > 0 ? current + 1 : 1;
      state.items[id] = { id, quantity: nextQty };
    },
    removeItem(state, action) {
      const id = action.payload;
      delete state.items[id];
    },
    clear(state) {
      state.items = {};
    },
    hydrate(state, action) {
      const items = action.payload?.items;
      if (items && typeof items === 'object') state.items = items;
    },
  },
});

export const { setQuantity, addOne, removeItem, clear, hydrate } = basketSlice.actions;

export const selectItems = (state) => state.basket.items;
export const selectQuantityById = (state, id) =>
  state.basket.items[id]?.quantity ?? 0;
export const selectTotalItems = (state) =>
  Object.values(state.basket.items).reduce(
    (sum, item) => sum + (item.quantity ?? 0),
    0,
  );

export default basketSlice.reducer;


