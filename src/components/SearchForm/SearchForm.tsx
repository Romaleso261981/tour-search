import { useRef, useState } from 'react';
import { GeoSearchInput } from '../GeoSearchInput/GeoSearchInput';
import { Input } from '../Input/Input';
import { Button } from '../Button/Button';
import styles from './search-form.module.css';
import { startCountrySearch, getSearchPricesOnce, stopActiveSearch, pollPricesUntilReady } from '../../services/search';
import { DEFAULT_POLL_INTERVAL_MS } from '../../services/constants';

export function SearchForm() {
  const [value, setValue] = useState<string>('');
  const [departureCity, setDepartureCity] = useState<string>('');
  const [countryId, setCountryId] = useState<string | null>(null);
  const [geoKey, setGeoKey] = useState<number>(0);
  const [activeToken, setActiveToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedCountryName = value.trim();
    if (!countryId || trimmedCountryName.length === 0) {
      setError('Оберіть країну для пошуку');
      return;
    }
    setError(null);
    setLoading(true);

    const run = async () => {
      try {
        if (activeToken) { await stopActiveSearch(activeToken); }
        const { token, waitUntil } = await startCountrySearch(countryId);
        setActiveToken(token);

        setDepartureCity('');
        setValue('');
        setCountryId(null);
        setGeoKey((k) => k + 1);

        const firstAskAt = new Date(waitUntil).getTime();
        const initialDelay = Math.max(0, firstAskAt - Date.now());
        const { prices } = await pollPricesUntilReady(token, initialDelay, DEFAULT_POLL_INTERVAL_MS);
        setLoading(false);
      } catch (err: any) {
        setLoading(false);
        setError(err?.message || 'Не вдалося запустити пошук');
      }
    };

    void run();
  }

  

  return (
    <form ref={formRef} className={`col ${styles.form}`} onSubmit={handleSubmit}>
      <label className="muted">Місто відправлення</label>
      <Input
        placeholder="Введіть місто відправлення"
        value={departureCity}
        onChange={(e) => setDepartureCity(e.target.value)}
        autoComplete="off"
      />
      <label className="muted">Напрямок подорожі</label>
      <GeoSearchInput
        key={geoKey}
        placeholder="Оберіть країну або введіть запит"
        onSelect={(item) => {
          setValue(item.name);
          if (item.type === 'country') setCountryId(String(item.id));
          else setCountryId(null);
        }}
      />
      <div className={`row ${styles.actions}`}>
        <Button type="submit">Знайти</Button>
      </div>
      {loading && <div className="muted">Завантаження результатів…</div>}
      {error && <div className="muted" role="alert">{error}</div>}
      
    </form>
  );
}


