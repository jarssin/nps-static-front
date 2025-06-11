import { useSearchParams } from 'react-router-dom';

export const usePhoneNumber = () => {
  const [searchParams] = useSearchParams();
  return searchParams.get('phone') || '';
}; 