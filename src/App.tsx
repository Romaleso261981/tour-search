import { Routes, Route } from 'react-router-dom';
import { AppRoute } from './routes';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { OfferPage } from './pages/OfferPage';

export function App() {

  return (
    <div className="container">
      <Header />
      <Routes>
        <Route path={AppRoute.Home} element={<HomePage />} />
        <Route path={AppRoute.Offer} element={<OfferPage />} />
      </Routes>
    </div>
  );
}
