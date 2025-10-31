import { SearchForm } from '../../components/SearchForm/SearchForm';
import { ResultsList } from '../../components/Results';
import { useAppSelector } from '../../state/hooks';

export function HomePage() {
  const offers = useAppSelector((s) => s.offers.items);
  return (
    <>
      <SearchForm />
      {offers.length > 0 && <ResultsList items={offers} />}
    </>
  );
}


