import React from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ImageBackground } from 'react-native';
import { LocationService } from '@/services/LocationService';
import { useEffect, useState } from 'react';
import { PrayerTimeHelpers } from '@/helpers/PrayerTimeHelpers';
import { useAdConfig } from '@/hooks/useAdConfig';
import { InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';

// Add these interfaces
interface PrayerTime {
  name: string;
  time: string;
}

interface LocationState {
  isPermitted: boolean;
  city?: string;
  nextPrayer?: PrayerTime;
  countdown?: string;
}

export default function LayarMenuUtama() {
  const [locationState, setLocationState] = useState<LocationState>({
    isPermitted: false
  });
  const [countdown, setCountdown] = useState<string>('');
  const adConfig = useAdConfig();
  
  useEffect(() => {
    if (adConfig?.ads.enabled && adConfig.ads.units.interstitial.enabled) {
      const interstitial = InterstitialAd.createForAdRequest(adConfig.ads.units.interstitial.id);
      
      const unsubscribe = interstitial.addAdEventListener(AdEventType.LOADED, () => {
        interstitial.show();
      });
      
      interstitial.load();
      
      return unsubscribe;
    }
  }, [adConfig]);

  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    try {
      const locationData = await LocationService.getStoredLocation();
      if (locationData?.city) {
        const prayerTimes = await PrayerTimeHelpers.fetchPrayerTimes(locationData.city.id);
        const nextPrayer = PrayerTimeHelpers.calculateNextPrayer(prayerTimes);
        const timeLeft = PrayerTimeHelpers.calculateCountdown(nextPrayer.time);
        const countdown = timeLeft ? PrayerTimeHelpers.formatCountdown(timeLeft) : '';
        
        setLocationState({
          isPermitted: true,
          city: locationData.city.lokasi,
          nextPrayer: nextPrayer,
          countdown: countdown
        });

        // Start countdown timer
        const timer = setInterval(() => {
          const newTimeLeft = PrayerTimeHelpers.calculateCountdown(nextPrayer.time);
          if (newTimeLeft) {
            setLocationState(prev => ({
              ...prev,
              countdown: PrayerTimeHelpers.formatCountdown(newTimeLeft)
            }));
          }
        }, 60000); // Update every minute

        return () => clearInterval(timer);
      } else {
        setLocationState({ isPermitted: false });
      }
    } catch (error) {
      setLocationState({ isPermitted: false });
    }
  };

  const requestLocation = async () => {
    try {
      await LocationService.initializeLocation();
      checkLocationPermission();
    } catch (error) {
      console.error('Failed to get location permission');
    }
  };
  
  const handlePress = (menu: string) => {
    router.push(`/(tabs)/${menu}` as any);
  };

  return (
    <View style={styles.container}>
        <LinearGradient
          colors={['#7E57C2', '#4A148C']}
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 1.0, y: 1.0 }}
          style={styles.gradientBackground}
        />
      <ImageBackground 
              source={require('@/assets/images/overlay.jpeg')}
              style={styles.headerOverlay}
              imageStyle={styles.headerImage}
            >
              <LinearGradient
                colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.3)']}
                style={styles.overlay}
              >
                {!locationState.isPermitted ? (
                  <>
                    <Text style={styles.warningText}>
                      Lokasi tidak diizinkan, tidak dapat menentukan lokasi & Jadwal
                    </Text>
                    <TouchableOpacity 
                      style={styles.permissionButton}
                      onPress={requestLocation}
                    >
                      <Text style={styles.buttonText}>Izinkan Lokasi</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <View style={styles.locationInfo}>
                    <View style={styles.cityContainer}>
                      <View style={styles.locationWrapper}>
                        <Text style={styles.cityText}>{locationState.city}</Text>
                        <MaterialCommunityIcons name="check-circle" size={20} color="#FFF" />
                      </View>
                      <TouchableOpacity 
                        style={styles.updateButton}
                        onPress={checkLocationPermission}
                      >
                        <MaterialCommunityIcons name="refresh" size={16} color="#FFF" />
                        <Text style={styles.updateButtonText}>Update</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.dateText}>
                      {new Date().toLocaleDateString('id-ID', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </Text>
                    {locationState.nextPrayer && (
                      <TouchableOpacity 
                        style={styles.prayerInfo}
                        onPress={() => router.push('/(tabs)/jadwalshalat')}
                      >
                        <Text style={styles.nextPrayerText}>
                          {locationState.nextPrayer.name}
                        </Text>
                        <Text style={styles.countdownText}>
                          {locationState.countdown}
                        </Text>
                        <Text style={styles.viewScheduleText}>
                          Lihat Waktu →
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </LinearGradient>
            </ImageBackground>

            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeTitle}>السَّلامُ عَلَيْكُمْ</Text>
              <Text style={styles.welcomeSubtitle}>Silahkan pilih menu di bawah ini</Text>
            </View>

      <View style={styles.menuContainer}>
      <ScrollView 
        style={styles.menuContainer}
        showsVerticalScrollIndicator={false} // Optional: menyembunyikan scrollbar
      >
        {/* Menu untuk al-Qur'an */}
        <View style={styles.menuRow}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handlePress('bacaquran')}
          >
            <LinearGradient
              colors={['#9575CD', '#7E57C2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.menuGradient}
            >
              <MaterialCommunityIcons name="book-open-page-variant" size={40} color="#FFF" />
              <Text style={styles.menuText}>Baca Al-Qur'an & Terjemahannya</Text>
              <Text style={styles.menuDescription}>Baca Al-Qur'an dengan Terjemahannya</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handlePress('alquran')}
          >
            <LinearGradient
              colors={['#9575CD', '#7E57C2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.menuGradient}
            >
              <MaterialCommunityIcons name="book-music" size={40} color="#FFF" />
              <Text style={styles.menuText}>Audio Al-Qur'an & Tafsir</Text>
              <Text style={styles.menuDescription}>Dengarkan bacaan yang indah dengan tafsir</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        {/* Doa dan Asma'ul Husna */}
        <View style={styles.menuRow}>
          
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handlePress('doa')}
          >
            <LinearGradient
              colors={['#9575CD', '#7E57C2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.menuGradient}
            >
              <MaterialCommunityIcons name="book-open-variant" size={40} color="#FFF" />
              <Text style={styles.menuText}>Kumpulan Do'a</Text>
              <Text style={styles.menuDescription}>Do'a sehari-hari untuk berbagai situasi</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handlePress('asmaul')}
            >
              <LinearGradient
                colors={['#9575CD', '#7E57C2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.menuGradient}
              >
                <MaterialCommunityIcons name="format-list-numbered" size={40} color="#FFF" />
                <Text style={styles.menuText}>Asmaul Husna</Text>
                <Text style={styles.menuDescription}>99 Nama Allah Yang Maha Indah</Text>
              </LinearGradient>
            </TouchableOpacity>
        </View>
        {/* Dzikir dan Donasi */}
        <View style={styles.menuRow}>
          {/* Dizkr */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handlePress('dzikir')}
          >
            <LinearGradient
              colors={['#9575CD', '#7E57C2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.menuGradient}
            >
              <MaterialCommunityIcons name="hand-heart" size={40} color="#FFF" />
              <Text style={styles.menuText}>Dzikir & Tasbih</Text>
              <Text style={styles.menuDescription}>Selalu mengingat Allah SWT</Text>
            </LinearGradient>
          </TouchableOpacity>

            <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handlePress('donasi')}
          >
            <LinearGradient
              colors={['#9575CD', '#7E57C2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.menuGradient}
            >
              <MaterialCommunityIcons name="hand-coin" size={40} color="#FFF" />
              <Text style={styles.menuText}>Donasi Pengembangan</Text>
              <Text style={styles.menuDescription}>Dukung pengembangan aplikasi ini</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerContent} onPress={() => handlePress('kiblat')}>
          <MaterialCommunityIcons name="compass" size={24} color="#FFF" />
          <Text style={styles.footerText}>Arah Kiblat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerContent} onPress={() => handlePress('jadwalshalat')}>
          <MaterialCommunityIcons name="clock-outline" size={24} color="#FFF" />
          <Text style={styles.footerText}>Waktu Sholat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerContent} onPress={() => handlePress('pengaturan')}>
          <MaterialCommunityIcons name="cog" size={24} color="#FFF" />
          <Text style={styles.footerText}>Pengaturan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2E003E', // Fallback color
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    padding: 20,
    paddingTop: 45,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    backgroundColor: 'rgba(126, 87, 194, 0.8)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeContainer: {
    paddingHorizontal: 15,
    paddingVertical: 3,
    alignItems: 'center',
  },
  welcomeTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  welcomeSubtitle: {
    color: '#E1BEE7',
    fontSize: 11,
    textAlign: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    marginLeft: 15,
  },
  subtitle: {
    fontSize: 16,
    color: '#E1BEE7',
    marginLeft: 15,
  },
  welcomeText: {
    fontSize: 24,
    color: '#FFF',
    textAlign: 'center',
    marginTop: 15,
    fontStyle: 'italic',
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: 8, // Reduced padding
    paddingVertical: 4,
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10, // Reduced margin
  },
  menuItem: {
    flex: 1,
    marginHorizontal: 4, // Reduced margin
    borderRadius: 12, // Slightly smaller radius
    overflow: 'hidden',
    elevation: 3,
    height: 140, // Reduced height
  },
  menuGradient: {
    padding: 10, // Reduced padding
    alignItems: 'center',
    aspectRatio: 1,
  },
  menuText: {
    color: '#FFF',
    fontSize: 14, // Smaller font
    marginTop: 8,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  menuDescription: {
    color: '#E1BEE7',
    fontSize: 11, // Smaller font
    marginTop: 4,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: 'rgba(126, 87, 194, 0.8)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  footerContent: {
    alignItems: 'center',
  },
  footerText: {
    color: '#FFF',
    fontSize: 12,
    marginTop: 5,
  },
  headerOverlay: {
    height: 220,
    width: '100%',
  },
  headerImage: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  overlay: {
    flex: 1,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    padding: 20,
    paddingTop: 45,
  },
  warningText: {
    color: '#FFF',
    fontSize: 14,
    width: '70%',
  },
  permissionButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#7E57C2',
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 14,
  },
  locationInfo: {
    flex: 1,
  },
  cityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  updateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(126, 87, 194, 0.6)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  updateButtonText: {
    color: '#FFF',
    fontSize: 12,
  },
  cityText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateText: {
    color: '#FFF',
    fontSize: 14,
    marginTop: 4,
  },
  prayerInfo: {
    marginTop: 'auto',
  },
  nextPrayerText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  countdownText: {
    color: '#FFF',
    fontSize: 16,
    marginTop: 4,
  },
  viewScheduleText: {
    color: '#FFF',
    fontSize: 14,
    marginTop: 8,
  }
});
