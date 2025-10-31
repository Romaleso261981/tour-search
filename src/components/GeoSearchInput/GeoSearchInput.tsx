import { useEffect, useMemo, useRef, useState } from 'react';
import inputStyles from '../Input/input.module.scss';
import styles from './geo-search-input.module.scss';
import { getCountries, searchGeo } from '../../api/api.js';
import { Country, GeoEntity } from '../../types/types';
import { TypeIcon } from './TypeIcon';

 

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
    function onDocClick(mouseEvent: MouseEvent) {
      const target = mouseEvent.target as Node;
      if (!wrapperRef.current?.contains(target)) setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  async function loadCountries() {
    setLoading(true);
    setError(null);
    try {
      const response = await getCountries();
      if (!response.ok) throw new Error('Failed to load');
      const countriesById = (await response.json()) as Record<string, Country>;
      const countriesList: Array<GeoEntity> = Object.values(countriesById).map((country) => ({ ...country, type: 'country' as const }));
      setItems(countriesList);
      setCountriesCache(countriesList);
    } catch {
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
    const debounceTimeout = setTimeout(async () => {
      try {
        const response = await searchGeo(trimmed);
        if (!response.ok) throw new Error('Failed search');
        const searchResultsById = (await response.json()) as Record<string, GeoEntity>;
        const normalizedQuery = trimmed.toLowerCase();
        const filteredFromSearch = Object.values(searchResultsById)
          .filter((entity) => entity.name.toLowerCase().startsWith(normalizedQuery));
        const filteredFromCache = countriesCache.filter((entity) => entity.name.toLowerCase().startsWith(normalizedQuery));
        const result = filteredFromSearch.length > 0 ? filteredFromSearch : filteredFromCache;
        setItems(result);
      } catch {
        setError('Помилка пошуку');
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(debounceTimeout);
  }, [query, open, countriesCache]);
  

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
        onChange={(event) => setQuery(event.target.value)}
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


