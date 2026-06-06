import { useState, useEffect } from 'react';

export const useIsVerified = () => {
  const [isVerified, setIsVerified] = useState(
    localStorage.getItem('facility_verified') === 'true' || 
    localStorage.getItem('role') === 'INTERNAL_ADMIN'
  );

  useEffect(() => {
    // Optional: listen for changes in localStorage if needed
    const checkStatus = () => {
      setIsVerified(
        localStorage.getItem('facility_verified') === 'true' || 
        localStorage.getItem('role') === 'INTERNAL_ADMIN'
      );
    };

    window.addEventListener('storage', checkStatus);
    return () => window.removeEventListener('storage', checkStatus);
  }, []);

  return isVerified;
};
