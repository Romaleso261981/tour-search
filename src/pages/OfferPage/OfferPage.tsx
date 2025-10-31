import { useNavigate, useParams } from 'react-router-dom';
import { OfferDetails } from '../../components/OfferDetails';

export function OfferPage() {
  const params = useParams();
  const navigate = useNavigate();
  const priceId = params.priceId as string;
  const hotelId = params.hotelId as string;
  return (
    <OfferDetails priceId={priceId} hotelId={hotelId} onBack={() => navigate('/')} />
  );
}


