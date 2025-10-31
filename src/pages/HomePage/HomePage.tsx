import { useState } from 'react';
import { SearchForm } from '../../components/SearchForm/SearchForm';
import { ResultsList } from '../../components/Results';
import type { OfferItem } from '../../types/types';

export function HomePage() {
  const [offers, setOffers] = useState<OfferItem[]>([]);
  return (
    <>
      <SearchForm offers={offers} setOffers={setOffers} />
      {offers.length > 0 && <ResultsList items={offers} />}
    </>
  );
}


