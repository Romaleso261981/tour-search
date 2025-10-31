import { useRef, useState } from "react";
import { GeoSearchInput } from "../GeoSearchInput/GeoSearchInput";
import { Input } from "../Input/Input";
import { Button } from "../Button/Button";
import styles from "./search-form.module.css";
import { OfferItem } from "../../types/search";
import { DEFAULT_POLL_INTERVAL_MS } from "../../services/constants";
import {
  stopActiveSearch,
  startCountrySearch,
  pollPricesUntilReady,
  fetchHotelsMap,
} from "../../services/search";

interface Props {
  offers: OfferItem[];
  setOffers: (offers: OfferItem[]) => void;
}

export function SearchForm({ offers, setOffers }: Props) {
  const [value, setValue] = useState<string>("");
  const [departureCity, setDepartureCity] = useState<string>("");
  const [countryId, setCountryId] = useState<string | null>(null);
  const [geoKey, setGeoKey] = useState<number>(0);
  const formRef = useRef<HTMLFormElement | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeToken, setActiveToken] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  async function handleSearchSubmit(payload: {
    countryId: string;
    countryName: string;
    departureCity: string;
  }) {
    const { countryId } = payload;
    setError(null);
    setOffers([]);
    setHasSearched(true);
    setLoading(true);
    try {
      if (activeToken) await stopActiveSearch(activeToken);
      const { token, waitUntil } = await startCountrySearch(countryId);
      setActiveToken(token);

      const firstAskAt = new Date(waitUntil).getTime();
      const initialDelay = Math.max(0, firstAskAt - Date.now());
      const { prices } = await pollPricesUntilReady(
        token,
        initialDelay,
        DEFAULT_POLL_INTERVAL_MS
      );
      const hotels = await fetchHotelsMap(countryId);
      const mapped = Object.values(prices).map((p) => {
        const hotel = Object.values(hotels).find(
          (h) => String(h.id) === String(p.hotelID)
        );
        return {
          id: p.id,
          hotelId: Number(p.hotelID),
          hotelName: hotel?.name ?? "Готель",
          hotelImg: hotel?.img,
          startDate: p.startDate,
          endDate: p.endDate,
          amount: p.amount,
          currency: p.currency,
        };
      });
      setOffers(mapped);
      setLoading(false);
    } catch (e: any) {
      setLoading(false);
      setError(e?.message || "Не вдалося отримати результати");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedCountryName = value.trim();
    if (!countryId || trimmedCountryName.length === 0) {
      return;
    }

    handleSearchSubmit({
      countryId: countryId as string,
      countryName: value.trim(),
      departureCity: departureCity.trim(),
    });

    setDepartureCity("");
    setValue("");
    setCountryId(null);
    setGeoKey((k) => k + 1);
  }

  return (
    <form
      ref={formRef}
      className={`col ${styles.form}`}
      onSubmit={handleSubmit}
    >
      <label className="muted">Місто відправлення</label>
      <Input
        placeholder="Введіть місто відправлення"
        value={departureCity}
        onChange={(e) => setDepartureCity(e.target.value)}
        autoComplete="off"
      />
      <label className="muted">Напрямок подорожі</label>
      <GeoSearchInput
        key={geoKey}
        placeholder="Оберіть країну або введіть запит"
        onSelect={(item) => {
          setValue(item.name);
          if (item.type === "country") setCountryId(String(item.id));
          else setCountryId(null);
        }}
      />
      <div className={`row ${styles.actions}`}>
        <Button type="submit">Знайти</Button>
      </div>
      {loading && (
        <div className="muted" style={{ marginTop: 12 }}>
          Завантаження результатів…
        </div>
      )}
      {error && (
        <div className="muted" role="alert" style={{ marginTop: 12 }}>
          {error}
        </div>
      )}
      {!loading && !error && hasSearched && offers.length === 0 && (
        <div className={styles.empty}>За обраним напрямком пропозицій не знайдено. Спробуйте іншу країну.</div>
      )}
    </form>
  );
}
