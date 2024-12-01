import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useAdConfig } from '@/hooks/useAdConfig';
import mobileAds from 'react-native-google-mobile-ads';
import { LocationService } from '@/services/LocationService';
import { Alert } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const adConfig = useAdConfig();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    async function initializeApp() {
      try {
        if (loaded && adConfig) {
          // Initialize Mobile Ads
          await mobileAds().initialize();
          // Initialize Location
          await LocationService.initializeLocation();
          await SplashScreen.hideAsync();
        }
      } catch (error) {
        Alert.alert('Initialization Error', 'Please check your settings and try again');
        await SplashScreen.hideAsync();
      }
    }

    initializeApp();
  }, [loaded, adConfig]);

  if (!loaded || !adConfig) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(start)" options={{ headerShown: false }} /> 
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
