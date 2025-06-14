import { useState, useEffect } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

export const useVisitorId = () => {
  const [visitorId, setVisitorId] = useState<string>('no-id');

  useEffect(() => {
    const getVisitorId = async () => {
      try {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        setVisitorId(result.visitorId);
      } catch (error) {
        console.error('Error generating visitor ID:', error);
        setVisitorId('no-id');
      }
    };

    getVisitorId();
  }, []);

  return visitorId;
}; 