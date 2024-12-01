const GIST_URL = 'https://gist.githubusercontent.com/3snanugraha/8f7bcce3f27dd9ee99e243769dc49870/raw/e6c6d192788d9bac5b5eb3b1669893efcf9c1fa4/IslamkuAdConfig.json';

export interface AdConfig {
  version: string;
  lastUpdated: string;
  appId: string;
  ads: {
    enabled: boolean;
    testMode: boolean;
    units: {
      appOpen: AdUnit;
      banner: AdUnit;
      interstitial: AdUnit;
    }
  }
}

interface AdUnit {
  id: string;
  enabled: boolean;
  frequency?: number;
}

export const getAdConfig = async (): Promise<AdConfig> => {
  const response = await fetch(GIST_URL);
  return response.json();
};
