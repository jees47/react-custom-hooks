import { useState, useCallback } from 'react';

// Define the types for the returned data
export interface Location {
  latitude: number;
  longitude: number;
}

interface UseLocationResult {
  location: Location | null;
  error: string | null;
  getLocation: () => void;
  isLoading: boolean;
}

export function useGeoLocation(): UseLocationResult {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getLocation = useCallback(() => {
    // Check if the browser supports geolocation
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        setIsLoading(false);
      },
      (err) => {
        // Handle various error cases
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError(
              'Permission to access location was denied. Please enable location permissions in your browser or device settings.'
            );
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Location information is unavailable.');
            break;
          case err.TIMEOUT:
            setError('The request to get user location timed out.');
            break;
          default:
            setError('An unknown error occurred while fetching location.');
        }
        setIsLoading(false);
      }
    );
  }, []);

  return { location, error, getLocation, isLoading };
}
