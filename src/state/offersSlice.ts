import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { OfferItem } from '../types/types';
import { startCountrySearch, pollPricesUntilReady, fetchHotelsMap } from '../services/search';
import { DEFAULT_POLL_INTERVAL_MS } from '../services/constants';

type OffersState = {
  items: OfferItem[];
  loading: boolean;
  error: string | null;
};

const initialState: OffersState = {
  items: [],
  loading: false,
  error: null,
};

export const searchOffersByCountry = createAsyncThunk<OfferItem[], string, { rejectValue: string }>(
  'offers/searchByCountry',
  async (countryId, { rejectWithValue }) => {
    try {
      const { token, waitUntil } = await startCountrySearch(countryId);
      const firstAskAt = new Date(waitUntil).getTime();
      const initialDelay = Math.max(0, firstAskAt - Date.now());
      const { prices } = await pollPricesUntilReady(token, initialDelay, DEFAULT_POLL_INTERVAL_MS);
      const hotels = await fetchHotelsMap(countryId);
      const mapped: OfferItem[] = Object.values(prices).map((p) => {
        const hotel = Object.values(hotels).find((h) => String(h.id) === String(p.hotelID));
        return {
          id: p.id,
          hotelId: Number(p.hotelID),
          hotelName: hotel?.name ?? 'Готель',
          hotelImg: hotel?.img,
          countryName: (hotel as any)?.countryName,
          cityName: (hotel as any)?.cityName,
          startDate: p.startDate,
          endDate: p.endDate,
          amount: p.amount,
          currency: p.currency,
        };
      });
      return mapped;
    } catch (e: any) {
      return rejectWithValue(e?.message || 'Не вдалося отримати результати');
    }
  }
);

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
  extraReducers: (builder) => {
    builder
      .addCase(searchOffersByCountry.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.items = [];
      })
      .addCase(searchOffersByCountry.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(searchOffersByCountry.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Помилка запиту';
      });
  }
});

export const { setOffers, clearOffers } = offersSlice.actions;
export const offersReducer = offersSlice.reducer;


