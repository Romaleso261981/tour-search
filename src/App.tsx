import { useState } from "react";
import { SearchForm } from "./components/SearchForm/SearchForm";
import { OfferItem } from "./types/search";
import { ResultsList } from "./components/Results";
import { OfferDetails } from "./components/OfferDetails";
import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { AppRoute } from './routes';

export function App() {
  const [offers, setOffers] = useState<OfferItem[]>([]);

  function OfferRoute() {
    const params = useParams();
    const navigate = useNavigate();
    const priceId = params.priceId as string;
    const hotelId = params.hotelId as string;
    return (
      <OfferDetails priceId={priceId} hotelId={hotelId} onBack={() => navigate('/')} />
    );
  }

  return (
    <div className="container">
      <header className="header">
        <h1>Пошук турів</h1>
      </header>
      <Routes>
        <Route path={AppRoute.Home} element={
          <>
            <SearchForm offers={offers} setOffers={setOffers} />
            {offers.length > 0 && <ResultsList items={offers} />}
          </>
        } />
        <Route path={AppRoute.Offer} element={<OfferRoute />} />
      </Routes>
    </div>
  );
}
