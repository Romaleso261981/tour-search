import { useRef, useState } from 'react';
import { GeoSearchInput } from '../GeoSearchInput/GeoSearchInput';
import { Input } from '../Input/Input';
import { Button } from '../Button/Button';
import styles from './search-form.module.css';

export function SearchForm() {
  const [value, setValue] = useState<string>('');
  const [departureCity, setDepartureCity] = useState<string>('');
  const formRef = useRef<HTMLFormElement | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // eslint-disable-next-line no-console
    console.log('Submit search with:', {
      countryOrQuery: value.trim(),
      departureCity: departureCity.trim(),
    });
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
        placeholder="Оберіть країну або введіть запит"
        onSelect={(item) => setValue(item.name)}
      />
      <div className={`row ${styles.actions}`}>
        <Button type="submit">Знайти</Button>
      </div>
    </form>
  );
}


