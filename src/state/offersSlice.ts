import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { OfferItem } from '../types/types';
import { startCountrySearch, pollPricesUntilReady, fetchHotelsMap, stopActiveSearch } from '../services/search';
import { DEFAULT_POLL_INTERVAL_MS } from '../services/constants';

type OffersState = {
  items: OfferItem[];
  loading: boolean;
  error: string | null;
  activeToken: string | null;
  currentRequestId: string | null;
  hotelsCache: Record<string, any>;
};

const initialState: OffersState = {
  items: [],
  loading: false,
  error: null,
  activeToken: null,
  currentRequestId: null,
  hotelsCache: {},
};

export const searchOffersByCountry = createAsyncThunk<OfferItem[], { countryId: string }, { state: { offers: OffersState }, rejectValue: string }>(
  'offers/searchByCountry',
  async ({ countryId }, { getState, dispatch, rejectWithValue, requestId }) => {
    try {
      const prevToken = getState().offers.activeToken;
      if (prevToken) {
        try { await stopActiveSearch(prevToken); } catch {}
      }

      const { token, waitUntil } = await startCountrySearch(countryId);
      // зберегти активний токен для можливого скасування наступного пошуку
      dispatch(setActiveToken(token));
      const firstAskAt = new Date(waitUntil).getTime();
      const initialDelay = Math.max(0, firstAskAt - Date.now());
      const { prices } = await pollPricesUntilReady(token, initialDelay, DEFAULT_POLL_INTERVAL_MS);

      // кеш готелів за countryId
      let hotels = getState().offers.hotelsCache[countryId];
      if (!hotels) {
        hotels = await fetchHotelsMap(countryId);
        dispatch(setHotelsCache({ countryId, hotels }));
      }
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
      }).sort((a, b) => a.amount - b.amount);
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
    setActiveToken(state, action: PayloadAction<string | null>) {
      state.activeToken = action.payload;
    },
    setHotelsCache(state, action: PayloadAction<{ countryId: string; hotels: any }>) {
      state.hotelsCache[action.payload.countryId] = action.payload.hotels;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchOffersByCountry.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.items = [];
        state.currentRequestId = action.meta.requestId;
      })
      .addCase(searchOffersByCountry.fulfilled, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return; // ігноруємо запізнілі відповіді
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(searchOffersByCountry.rejected, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return;
        state.loading = false;
        state.error = (action.payload as string) || 'Помилка запиту';
      });
  }
});

export const { setOffers, clearOffers, setActiveToken, setHotelsCache } = offersSlice.actions;
export const offersReducer = offersSlice.reducer;


