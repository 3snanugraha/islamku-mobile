import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Slot } from 'expo-router';
import { useAdConfig } from '@/hooks/useAdConfig';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

export default function TabsLayout() {
  const adConfig = useAdConfig();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Slot />
      </View>
      
      {adConfig?.ads.enabled && adConfig.ads.units.banner.enabled && (
        <View style={styles.adContainer}>
          <BannerAd
            unitId={adConfig.ads.units.banner.id}
            size={BannerAdSize.BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  content: {
    flex: 1,
  },
  adContainer: {
    alignItems: 'center',
    backgroundColor: 'transparent',
  }
});
