import { useEffect, useState } from "react";
import { getHotel, getPrice } from "../../api/api.js";
import styles from "./offer-details.module.css";
import { Button } from "../Button/Button";
import type { Hotel, Price } from "../../types/types";

interface Props {
  priceId: string;
  hotelId: string;
  onBack: () => void;
}

async function resolveResponse(p: Promise<Response>): Promise<Response> {
  try {
    return await p;
  } catch (rejected) {
    return rejected as Response;
  }
}

export function OfferDetails({ priceId, hotelId, onBack }: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [price, setPrice] = useState<Price | null>(null);

  useEffect(() => {
    let isCancelled = false;
    async function fetchOfferDetails() {
      setLoading(true);
      setError(null);
      try {
        const [hotelResponse, priceResponse] = await Promise.all([
          resolveResponse(getHotel(Number(hotelId))),
          resolveResponse(getPrice(priceId)),
        ]);
        if (!hotelResponse.ok) throw new Error("Не вдалося завантажити готель");
        if (!priceResponse.ok) throw new Error("Не вдалося завантажити ціну");
        const hotelData = (await hotelResponse.json()) as Hotel;
        const priceData = (await priceResponse.json()) as Price;
        if (!isCancelled) {
          setHotel(hotelData);
          setPrice(priceData);
          setLoading(false);
        }
      } catch (e: any) {
        if (!isCancelled) {
          setLoading(false);
          setError(e?.message || "Помилка завантаження");
        }
      }
    }
    fetchOfferDetails();
    return () => {
      isCancelled = true;
    };
  }, [priceId, hotelId]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.top}>
        <Button type="button" onClick={onBack}>
          Назад
        </Button>
      </div>
      {loading && <div className="muted">Завантаження…</div>}
      {error && (
        <div className={styles.error} role="alert">
          {error}
        </div>
      )}
      {!loading && !error && hotel && price && (
        <div className={styles.content}>
          <div className={styles.header}>
            {hotel.img && (
              <img className={styles.image} src={hotel.img} alt={hotel.name} />
            )}
            <div className={styles.info}>
              <h2 className={styles.title}>{hotel.name}</h2>
              <div className={styles.dates}>
                {price.startDate} — {price.endDate}
              </div>
              <div className={styles.price}>
                {price.amount} {price.currency.toUpperCase()}
              </div>
            </div>
          </div>
          {hotel.description && (
            <p className={styles.description}>{hotel.description}</p>
          )}
        </div>
      )}
    </div>
  );
}
