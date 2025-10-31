import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { OfferItem } from '../types/types';

type OffersState = {
  items: OfferItem[];
};

const initialState: OffersState = {
  items: [],
};

const offersSlice = createSlice({
  name: 'offers',
  initialState,
  reducers: {
    setOffers(state, action: PayloadAction<OfferItem[]>) {
      state.items = action.payload;
    },
    clearOffers(state) {
      state.items = [];
    },
  },
});

export const { setOffers, clearOffers } = offersSlice.actions;
export const offersReducer = offersSlice.reducer;


