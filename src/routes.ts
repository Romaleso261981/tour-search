export enum AppRoute {
  Home = '/',
  Offer = '/offer/:priceId/:hotelId',
}

export function toOfferRoute(priceId: string | number, hotelId: string | number) {
  return `/offer/${priceId}/${hotelId}`;
}


