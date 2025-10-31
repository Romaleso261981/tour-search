import { useState } from "react";
import { SearchForm } from "./components/SearchForm/SearchForm";
import { OfferItem } from "./types/search";
import { ResultsList } from "./components/Results";

export function App() {
  const [offers, setOffers] = useState<OfferItem[]>([]);

  return (
    <div className="container">
      <header className="header">
        <h1>Пошук турів</h1>
      </header>
      <SearchForm setOffers={setOffers} />

      {offers.length > 0 && <ResultsList items={offers} />}
    </div>
  );
}
