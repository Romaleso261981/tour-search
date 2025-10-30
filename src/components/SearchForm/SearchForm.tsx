import { useRef, useState } from 'react';
import { GeoSearchInput } from '../GeoSearchInput/GeoSearchInput';
import { Button } from '../Button/Button';
import styles from './search-form.module.css';

export function SearchForm() {
  const [value, setValue] = useState<string>('');
  const formRef = useRef<HTMLFormElement | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // eslint-disable-next-line no-console
    console.log('Submit search with:', value.trim());
  }

  return (
    <form ref={formRef} className={`col ${styles.form}`} onSubmit={handleSubmit}>
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


