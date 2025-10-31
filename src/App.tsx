import { Routes, Route } from 'react-router-dom';
import { AppRoute } from './routes';
import { HomePage } from './pages/HomePage';
import { OfferPage } from './pages/OfferPage';

export function App() {

  return (
    <div className="container">
      <header className="header">
        <h1>Пошук турів</h1>
      </header>
      <Routes>
        <Route path={AppRoute.Home} element={<HomePage />} />
        <Route path={AppRoute.Offer} element={<OfferPage />} />
      </Routes>
    </div>
  );
}
