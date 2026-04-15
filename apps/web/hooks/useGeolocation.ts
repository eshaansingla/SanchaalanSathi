"use client";

export type Coords = { lat: number; lng: number };

export function useGeolocation() {
  const requestLocation = (): Promise<Coords | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => resolve(null),
        { timeout: 8000, maximumAge: 0 }
      );
    });
  };

  return { requestLocation };
}
