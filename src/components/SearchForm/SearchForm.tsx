import { useRef, useState } from "react";
import { GeoSearchInput } from "../GeoSearchInput/GeoSearchInput";
import { Input } from "../Input/Input";
import { Button } from "../Button/Button";
import styles from "./search-form.module.css"; 
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { searchOffersByCountry } from "../../state/offersSlice";

export function SearchForm() {
  const dispatch = useAppDispatch();
  const offers = useAppSelector((s) => s.offers.items);
  const [value, setValue] = useState<string>("");
  const [departureCity, setDepartureCity] = useState<string>("");
  const [countryId, setCountryId] = useState<string | null>(null);
  const [geoKey, setGeoKey] = useState<number>(0);
  const formRef = useRef<HTMLFormElement | null>(null);

  const loading = useAppSelector((s) => s.offers.loading);
  const error = useAppSelector((s) => s.offers.error);
  const [hasSearched, setHasSearched] = useState(false);

  async function handleSearchSubmit(payload: {
    countryId: string;
    countryName: string;
    departureCity: string;
  }) {
    const { countryId } = payload;
    setHasSearched(true);
    dispatch(searchOffersByCountry({ countryId }));
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
