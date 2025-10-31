import { OfferItem } from '../../types/types';
import styles from './results-list.module.css';
import { Link } from 'react-router-dom';
import { toOfferRoute } from '../../routes';


interface ResultsListProps {
  items: OfferItem[];
}

function HotelIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path fill="currentColor" d="M3 21V5a2 2 0 0 1 2-2h9a5 5 0 0 1 5 5v13h-2v-3H5v3H3Zm2-5h12V8a3 3 0 0 0-3-3H5Zm2-6h3V7H7Zm0 4h3v-2H7Zm5-4h3V7h-3Zm0 4h3v-2h-3Z" />
    </svg>
  );
}

function formatDate(dateString: string) {
  const [year, month, day] = dateString.split('-').map(Number);
  if (!year || !month || !day) return dateString;
  const dayPadded = String(day).padStart(2, '0');
  const monthPadded = String(month).padStart(2, '0');
  return `${dayPadded}.${monthPadded}.${year}`;
}

function formatPrice(amount: number, currency: string) {
  const formattedAmount = new Intl.NumberFormat('uk-UA').format(amount);
  return `${formattedAmount} ${currency.toUpperCase()}`;
}

export function ResultsList({ items }: ResultsListProps) {
  if (items.length === 0) return null;
  return (
    <div className={styles.list}>
      {items.map((offer) => (
        <div key={offer.id} className={styles.card}>
          <div className={styles.thumb}>
            {offer.hotelImg ? (
              <img src={offer.hotelImg} alt={offer.hotelName} />
            ) : (
              <div className={styles.iconWrap} aria-label="Готель">
                <HotelIcon />
              </div>
            )}
          </div>
          <div className={styles.body}>
            <div className={styles.title}>{offer.hotelName}</div>
            {(offer.countryName || offer.cityName) && (
              <div className={styles.meta}>{offer.countryName}{offer.cityName ? `, ${offer.cityName}` : ''}</div>
            )}
            <div className={styles.sub}>{formatDate(offer.startDate)}</div>
          </div>
          <div className={styles.price}>{formatPrice(offer.amount, offer.currency)}</div>
          <div className={styles.actions}>
            <Link className={styles.link} to={toOfferRoute(offer.id, offer.hotelId)}>Відкрити ціну</Link>
          </div>
        </div>
      ))}
    </div>
  );
}

export type { OfferItem };


