import { useState, useEffect } from 'react';
import { getAdConfig, AdConfig } from '@/config/adConfig';

export const useAdConfig = () => {
  const [config, setConfig] = useState<AdConfig | null>(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const adConfig = await getAdConfig();
        setConfig(adConfig);
      } catch (error) {
        console.error('Failed to load ad config:', error);
        // Gunakan config default jika fetch gagal
      }
    };
    
    loadConfig();
    const interval = setInterval(loadConfig, 1800000); // Refresh setiap 30 menit
    
    return () => clearInterval(interval);
  }, []);

  return config;
};
