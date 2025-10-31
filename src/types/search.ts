export type StartSearchOk = { token: string; waitUntil: string };

export type PriceItem = {
  id: string;
  amount: number;
  currency: string;
  startDate: string;
  endDate: string;
  hotelID: string | number;
};

export type PricesOk = { prices: Record<string, PriceItem> };


