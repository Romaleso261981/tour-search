import type { Tour } from '../types';
import styles from './tour-card.module.css';
import { Button } from './Button';

interface TourCardProps {
  tour: Tour;
}

export function TourCard({ tour }: TourCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.media} aria-hidden>
        <img src={tour.imageUrl} alt="" />
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>{tour.title}</h3>
        <div className={styles.meta}>
          <span>{tour.destination}</span>
          <span className={styles.dot}>·</span>
          <span>⭐ {tour.rating.toFixed(1)}</span>
        </div>
        <p className={styles.desc}>{tour.description}</p>
        <div className={styles.footer}>
          <div className={styles.price}><strong>{tour.price.toLocaleString('uk-UA')}</strong> ₴</div>
          <Button variant="primary">Деталі</Button>
        </div>
      </div>
    </article>
  );
}


