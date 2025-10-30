import { useEffect, useMemo, useRef, useState } from 'react';
import inputStyles from '../Input/input.module.css';
import styles from './geo-search-input.module.css';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { getCountries, searchGeo } from '../../api/api.js';

type Country = { id: string; name: string; flag: string };
type City = { id: number; name: string };
type Hotel = { id: number; name: string };
type GeoEntity =
  | (Country & { type: 'country' })
  | (City & { type: 'city' })
  | (Hotel & { type: 'hotel' });

interface GeoSearchInputProps {
  placeholder?: string;
  onSelect?: (value: GeoEntity) => void;
}

export function GeoSearchInput({ placeholder = 'Куди поїхати?', onSelect }: GeoSearchInputProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<GeoEntity[]>([]);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const target = e.target as Node;
      if (!wrapperRef.current?.contains(target)) setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  async function loadCountries() {
    setLoading(true);
    setError(null);
    try {
      const res = await getCountries();
      if (!res.ok) throw new Error('Failed to load');
      const map = (await res.json()) as Record<string, Country>;
      const list: Array<GeoEntity> = Object.values(map).map((c) => ({ ...c, type: 'country' as const }));
      setItems(list);
    } catch (e) {
      setError('Не вдалося завантажити країни');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!open) return;
    const trimmed = query.trim();
    if (trimmed.length === 0) return;
    setLoading(true);
    setError(null);
    const t = setTimeout(async () => {
      try {
        const res = await searchGeo(trimmed);
        if (!res.ok) throw new Error('Failed search');
        const map = (await res.json()) as Record<string, GeoEntity>;
        setItems(Object.values(map));
      } catch {
        setError('Помилка пошуку');
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [query, open]);

  const hint = useMemo(() => {
    if (loading) return 'Завантаження…';
    if (error) return error;
    if (open && items.length === 0) return 'Нічого не знайдено';
    return null;
  }, [loading, error, open, items.length]);

  function handleFocus() {
    setOpen(true);
    if (query.trim().length === 0) {
      void loadCountries();
    }
  }

  function handleSelect(item: GeoEntity) {
    setQuery(item.name);
    setOpen(false);
    onSelect?.(item);
  }

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <input
        ref={inputRef}
        className={inputStyles.input}
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={handleFocus}
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls="geo-menu"
      />
      {open && (
        <div id="geo-menu" className={styles.menu} role="listbox">
          {items.map((item) => (
            <div key={`${item.type}-${item.id}`} className={styles.item} role="option" onClick={() => handleSelect(item)}>
              <span className={styles.badge}>{item.type === 'country' ? 'Країна' : item.type === 'city' ? 'Місто' : 'Готель'}</span>
              <span>{item.name}</span>
            </div>
          ))}
          {hint && <div className={styles.hint}>{hint}</div>}
        </div>
      )}
    </div>
  );
}


