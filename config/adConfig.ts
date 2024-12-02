const GIST_URL = 'https://gist.githubusercontent.com/3snanugraha/8f7bcce3f27dd9ee99e243769dc49870/raw';

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
  };
  donations: {
    lastUpdated: string;
    donors: Donor[];
  }
}

interface Donor {
  name: string;
  amount: string;
  date: string;
  message: string;
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
