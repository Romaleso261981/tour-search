export type StartSearchOk = { token: string; waitUntil: string };

export type PriceItem = {
  id: string;
  amount: number;
  currency: string;
  startDate: string;
  endDate: string;
  hotelID: string | number;
};

export type OfferItem = {
  id: string;
  hotelId: number;
  hotelName: string;
  hotelImg?: string;
  countryName?: string;
  cityName?: string;
  startDate: string;
  endDate: string;
  amount: number;
  currency: string;
};

export type PricesOk = { prices: Record<string, PriceItem> };

export type Hotel = {
  id: number;
  name: string;
  img?: string;
  countryName?: string;
  cityName?: string;
  description?: string;
  services?: Record<string, string>;
};

export type Price = {
  id: string;
  amount: number;
  currency: string;
  startDate: string;
  endDate: string;
};
