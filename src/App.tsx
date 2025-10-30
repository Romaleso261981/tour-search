import { useEffect, useMemo, useState } from 'react';
import { Dropdown } from './components/Dropdown';
import { Input } from './components/Input';
import { Button } from './components/Button';
// використовуємо мок API з README
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { getCountries } from './api/api.js';

type Country = { id: string; name: string; flag: string };

export function App() {
  const [countriesMap, setCountriesMap] = useState<Record<string, Country>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [destinationCountryId, setDestinationCountryId] = useState<string | null>(null);
  const [departureCity, setDepartureCity] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getCountries();
        if (!res.ok) throw new Error('Failed to load countries');
        const data = (await res.json()) as Record<string, Country>;
        if (mounted) setCountriesMap(data);
      } catch (e) {
        if (mounted) setError('Не вдалося завантажити країни');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const countryOptions = useMemo(() => {
    return Object.values(countriesMap).map((c) => ({ label: `${c.name}`, value: c.id }));
  }, [countriesMap]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Поки що лише консоль: форма — єдиний контент сторінки
    // Надалі тут можна тригерити пошук цін
    // eslint-disable-next-line no-console
    console.log({ destinationCountryId, departureCity });
  }

  return (
    <div className="container">
      <header className="header">
        <h1>Пошук турів</h1>
      </header>

      <form className="col" onSubmit={onSubmit} style={{ gap: 12, maxWidth: 720 }}>
        <div className="col">
          <label className="muted">Напрямок подорожі</label>
          <Dropdown
            placeholder={loading ? 'Завантаження…' : 'Оберіть країну'}
            options={countryOptions}
            value={destinationCountryId}
            onChange={setDestinationCountryId}
          />
          {error && <small className="muted" style={{ color: '#b91c1c' }}>{error}</small>}
        </div>

        <div className="col">
          <label className="muted">Місто відправлення</label>
          <Input
            placeholder="Напр., Київ"
            value={departureCity}
            onChange={(e) => setDepartureCity(e.target.value)}
          />
        </div>

        <div className="row" style={{ justifyContent: 'flex-end' }}>
          <Button type="submit" disabled={!destinationCountryId || !departureCity.trim()}>Шукати</Button>
        </div>
      </form>
    </div>
  );
}


