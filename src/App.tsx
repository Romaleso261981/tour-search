import { useMemo, useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { TourCard } from './components/TourCard';
import { tours as allTours } from './data/tours';
import type { Tour } from './types';

export function App() {
  const [query, setQuery] = useState('');
  const [destination, setDestination] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [sort, setSort] = useState<'price-asc' | 'price-desc' | 'rating-desc'>('rating-desc');

  const destinations = useMemo(
    () => Array.from(new Set(allTours.map((t) => t.destination))).sort(),
    []
  );

  const tours = useMemo(() => {
    let list: Tour[] = allTours;
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.destination.toLowerCase().includes(q)
      );
    }
    if (destination) {
      list = list.filter((t) => t.destination === destination);
    }
    if (maxPrice != null) {
      list = list.filter((t) => t.price <= maxPrice);
    }
    switch (sort) {
      case 'price-asc':
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
      default:
        list = [...list].sort((a, b) => b.rating - a.rating);
    }
    return list;
  }, [query, destination, maxPrice, sort]);

  return (
    <div className="container">
      <header className="header">
        <h1>Пошук турів</h1>
      </header>
      <SearchBar
        query={query}
        onQueryChange={setQuery}
        destinations={destinations}
        destination={destination}
        onDestinationChange={setDestination}
        maxPrice={maxPrice}
        onMaxPriceChange={setMaxPrice}
        sort={sort}
        onSortChange={setSort}
      />
      <main className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16, marginTop: 16 }}>
        {tours.map((t) => (
          <TourCard key={t.id} tour={t} />
        ))}
        {tours.length === 0 && (
          <div className="empty" style={{ padding: 24, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, textAlign: 'center' }}>Нічого не знайдено. Змініть фільтри.</div>
        )}
      </main>
    </div>
  );
}


