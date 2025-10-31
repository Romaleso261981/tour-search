import { useEffect, useMemo, useRef, useState } from 'react';
import inputStyles from '../Input/input.module.css';
import styles from './geo-search-input.module.css';
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
  const [countriesCache, setCountriesCache] = useState<Array<GeoEntity>>([]);
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
      setCountriesCache(list);
    } catch (e) {
      setError('Не вдалося завантажити країни');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!open) return;
    const trimmed = query.trim();
    if (trimmed.length === 0) {
      setItems(countriesCache);
      return;
    }
    setLoading(true);
    setError(null);
    const t = setTimeout(async () => {
      try {
        const res = await searchGeo(trimmed);
        if (!res.ok) throw new Error('Failed search');
        const map = (await res.json()) as Record<string, GeoEntity>;
        const q = trimmed.toLowerCase();
        const filteredFromSearch = Object.values(map)
          .filter((e) => e.name.toLowerCase().startsWith(q));
        const filteredFromCache = countriesCache.filter((e) => e.name.toLowerCase().startsWith(q));
        const result = filteredFromSearch.length > 0 ? filteredFromSearch : filteredFromCache;
        setItems(result);
      } catch {
        setError('Помилка пошуку');
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [query, open, countriesCache]);
  function TypeIcon({ type }: { type: GeoEntity['type'] }) {
    if (type === 'country') {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
          <path fill="currentColor" d="M12 2a10 10 0 1 0 0 20a10 10 0 0 0 0-20Zm-1 2.07A8 8 0 0 0 4.07 11H7c.55 0 1-.45 1-1V8c0-.55.45-1 1-1h2V4.07ZM4.07 13A8 8 0 0 0 11 19.93V16H9c-.55 0-1-.45-1-1v-2H4.07ZM13 19.93A8 8 0 0 0 19.93 13H17c-.55 0-1 .45-1 1v2h-3v3.93ZM19.93 11A8 8 0 0 0 13 4.07V7h2c.55 0 1 .45 1 1v2h3.93Z"/>
        </svg>
      );
    }
    if (type === 'city') {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
          <path fill="currentColor" d="M3 21V8l6-3l6 3v13H3Zm8-2h2v-2h-2v2Zm-4 0h2v-2H7v2Zm4-4h2v-2h-2v2Zm-4 0h2v-2H7v2Zm12 6V10h2v11h-2Z"/>
        </svg>
      );
    }
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
        <path fill="currentColor" d="M3 21V5a2 2 0 0 1 2-2h9a5 5 0 0 1 5 5v13h-2v-3H5v3H3Zm2-5h12V8a3 3 0 0 0-3-3H5Zm2-6h3V7H7Zm0 4h3v-2H7Zm5-4h3V7h-3Zm0 4h3v-2h-3Z"/>
      </svg>
    );
  }

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
              <span className={styles.icon}><TypeIcon type={item.type} /></span>
              <span className={styles.text}>{item.name}</span>
            </div>
          ))}
          {hint && <div className={styles.hint}>{hint}</div>}
        </div>
      )}
    </div>
  );
}


