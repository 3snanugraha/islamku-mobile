import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  LOCATION: '@islamku_location',
  CITY: '@islamku_city'
};

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  timestamp: number;
  city?: {
    id: string;
    lokasi: string;
  };
}

export const LocationService = {
  async initializeLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Location permission denied');
    }

    // Get current position
    const location = await Location.getCurrentPositionAsync({});
    
    // Get city data
    const geocode = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    });

    let cityData;
    if (geocode[0]) {
      const locationName = 
        geocode[0].subregion?.replace(/(Kabupaten|Kota) /, '') || 
        geocode[0].city?.replace(/(Kabupaten|Kota) /, '') ||
        geocode[0].district?.replace(/(Kabupaten|Kota) /, '');

      if (locationName) {
        const response = await fetch(`https://api.myquran.com/v2/sholat/kota/cari/${locationName}`);
        const data = await response.json();
        if (data.status && data.data.length > 0) {
          cityData = data.data[0];
        }
      }
    }

    const locationData: LocationData = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy,
      timestamp: Date.now(),
      city: cityData
    };

    await AsyncStorage.setItem(STORAGE_KEYS.LOCATION, JSON.stringify(locationData));
    return locationData;
  },

  async getStoredLocation(): Promise<LocationData | null> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.LOCATION);
    return data ? JSON.parse(data) : null;
  }
};
