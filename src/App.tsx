import { GeoSearchInput } from './components/GeoSearchInput';

export function App() {
  return (
    <div className="container">
      <header className="header">
        <h1>Пошук турів</h1>
      </header>

      <div className="col" style={{ gap: 12, maxWidth: 720 }}>
        <label className="muted">Напрямок подорожі</label>
        <GeoSearchInput placeholder="Оберіть країну або введіть запит" />
      </div>
    </div>
  );
}


