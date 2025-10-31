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

export type Country = { id: string; name: string; flag: string };
export type City = { id: number; name: string };
export type GeoEntity =
  | (Country & { type: "country" })
  | (City & { type: "city" })
  | (Pick<Hotel, "id" | "name"> & { type: "hotel" });
