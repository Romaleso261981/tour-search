import { useMemo } from 'react';
import { Input } from './Input';
import { Dropdown } from './Dropdown';
import { Button } from './Button';
import styles from './search-bar.module.css';

interface SearchBarProps {
  query: string;
  onQueryChange: (v: string) => void;
  destinations: string[];
  destination: string | null;
  onDestinationChange: (v: string | null) => void;
  maxPrice: number | null;
  onMaxPriceChange: (v: number | null) => void;
  sort: 'price-asc' | 'price-desc' | 'rating-desc';
  onSortChange: (v: 'price-asc' | 'price-desc' | 'rating-desc') => void;
}

export function SearchBar(props: SearchBarProps) {
  const { query, onQueryChange, destinations, destination, onDestinationChange, maxPrice, onMaxPriceChange, sort, onSortChange } = props;

  const destinationOptions = useMemo(() => destinations.map((d) => ({ label: d, value: d })), [destinations]);
  const sortOptions = [
    { label: 'За рейтингом', value: 'rating-desc' as const },
    { label: 'Ціна: від дешевих', value: 'price-asc' as const },
    { label: 'Ціна: від дорогих', value: 'price-desc' as const },
  ];

  return (
    <div className={styles.bar}>
      <div className={styles.row}>
        <div className={styles.cell}>
          <Input
            placeholder="Пошук по назві або опису"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
          />
        </div>
        <div className={styles.cell}>
          <Dropdown
            label="Напрямок"
            options={destinationOptions}
            value={destination}
            onChange={onDestinationChange}
            placeholder="Будь-який"
          />
        </div>
        <div className={styles.cell}>
          <Input
            type="number"
            placeholder="Макс. ціна"
            value={maxPrice ?? ''}
            onChange={(e) => onMaxPriceChange(e.target.value ? Number(e.target.value) : null)}
            min={0}
          />
        </div>
        <div className={styles.cell}>
          <Dropdown
            label="Сортування"
            options={sortOptions}
            value={sort}
            onChange={(v) => onSortChange(v as any)}
          />
        </div>
        <div className={styles.cell}>
          <Button variant="secondary" onClick={() => { onQueryChange(''); onDestinationChange(null); onMaxPriceChange(null); onSortChange('rating-desc'); }}>Скинути</Button>
        </div>
      </div>
    </div>
  );
}


