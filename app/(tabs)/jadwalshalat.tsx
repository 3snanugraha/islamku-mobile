import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, View, Text, ScrollView, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import { LocationService } from '@/services/LocationService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Switch } from 'react-native';
import { PrayerTimeHelpers } from '@/helpers/PrayerTimeHelpers';
import * as Notifications from 'expo-notifications';

interface PrayerTime {
  tanggal: string;
  imsak: string;
  subuh: string;
  terbit: string;
  dhuha: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
}

// Add this interface for the response type
interface NotificationResponse {
  actionIdentifier: string;
  notification: Notifications.Notification;
}

interface NotificationPreference {
  prayerName: string;
  isEnabled: boolean;
  soundType: 'regular' | 'fajr';
  minutesBefore: number;
}

interface PrayerNotificationState {
  [key: string]: boolean;
}

interface City {
  id: string;
  lokasi: string;
}

export default function JadwalShalat() {
  const [schedule, setSchedule] = useState<PrayerTime | null>(null);
  const [currentCity, setCurrentCity] = useState<City | null>(null);
  const [loading, setLoading] = useState(true);
  const [notificationStates, setNotificationStates] = useState<PrayerNotificationState>({});

  // Add this new useEffect alongside existing useEffect
  useEffect(() => {
    async function setupNotifications() {
      const permissionGranted = await PrayerTimeHelpers.setupNotifications();
      if (permissionGranted) {
        const savedPrefs = await AsyncStorage.getItem('notificationPreferences');
        if (savedPrefs) {
          const prefs = JSON.parse(savedPrefs);
          const states: PrayerNotificationState = {};
          prefs.forEach((pref: NotificationPreference) => {
            states[pref.prayerName] = pref.isEnabled;
          });
          setNotificationStates(states);
        }
      }
    }
    setupNotifications();
  }, []);

  useEffect(() => {
    async function setupLocation() {
      try {
        const locationData = await LocationService.getStoredLocation();
        if (locationData && locationData.city) {
          setCurrentCity(locationData.city);
          await fetchPrayerTimes(locationData.city.id);
        }
      } catch (error) {
        console.error('Error setting up location:', error);
        setLoading(false);
      }
    }
  
    setupLocation();
  }, []);

  // Update the useEffect with proper typing
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener((response: NotificationResponse) => {
      if (response.actionIdentifier === 'STOP_SOUND') {
        Notifications.dismissAllNotificationsAsync();
      }
    });

    return () => subscription.remove();
  }, []);
  

  const handleNotificationToggle = async (prayerName: string, enabled: boolean) => {
      const newStates = { ...notificationStates, [prayerName]: enabled };
      setNotificationStates(newStates);

      const preferences: NotificationPreference[] = Object.keys(newStates).map(name => ({
          prayerName: name,
          isEnabled: newStates[name],
          soundType: name === 'Subuh' ? 'fajr' : 'regular',
          minutesBefore: 10
      }));

      await AsyncStorage.setItem('notificationPreferences', JSON.stringify(preferences));
      if (schedule) {
          await PrayerTimeHelpers.scheduleNotifications(schedule, preferences);
      }
  };


  // const testNotification = async () => {
  //   const testTime = new Date();
  //   const adzan = require('@/assets/audio/adzan.mp3');
  //   testTime.setSeconds(testTime.getSeconds() + 10); // Will trigger in 5 seconds
    
  //   await PrayerTimeHelpers.scheduleNotification({
  //     title: "Test Adzan",
  //     body: "Testing prayer notification sound",
  //     time: testTime,
  //     sound: adzan
  //   });
  // };
  
  
  const downloadMonthlySchedule = async () => {
    if (!currentCity) return;
  
    try {
      const date = new Date();
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  
      const response = await fetch(
        `https://api.myquran.com/v2/sholat/jadwal/${currentCity.id}/${year}/${month}`
      );
      const data = await response.json();
  
      let htmlContent = `
        <html>
          <head>
            <style>
              @page { 
                margin: 15px;
                size: A4;
              }
              body { 
                font-family: 'Arial', sans-serif;
                padding: 15px;
                background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
                color: #333;
                height: 100vh;
                display: flex;
                flex-direction: column;
              }
              .header {
                text-align: center;
                padding: 15px 0;
                background: linear-gradient(45deg, #7E57C2, #4A148C);
                color: white;
                border-radius: 10px;
                margin-bottom: 10px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              }
              h1 { 
                margin: 0;
                font-size: 14pt;
                text-transform: uppercase;
                letter-spacing: 2px;
              }
              .subtitle {
                font-size: 9pt;
                color: #e0e0e0;
                margin-top: 3px;
              }
              .footer { 
                text-align: center; 
                padding: 10px;
                background: #f8f9fa;
                border-radius: 8px;
                margin-top: 10px;
                font-size: 7pt;
                color: #666;
              }
              table { 
                width: 100%; 
                border-collapse: separate;
                border-spacing: 0;
                margin-top: 10px;
                background: white;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                font-size: 8pt;
              }
              th, td { 
                padding: 6px; 
                text-align: center;
                border: 1px solid #eee;
              }
              th { 
                background: linear-gradient(45deg, #7E57C2, #4A148C);
                color: white;
                font-weight: bold;
                font-size: 8pt;
              }
              tr:nth-child(even) {
                background-color: #f8f9fa;
              }
              .watermark {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) rotate(-45deg);
                font-size: 40pt;
                color: rgba(126, 87, 194, 0.05);
                z-index: -1;
              }
            </style>
          </head>
          <body>
            <div class="watermark">ISLAMKU</div>
            <div class="header">
              <h1>Jadwal Shalat</h1>
              <div class="subtitle">${currentCity.lokasi} - ${monthNames[date.getMonth()]} ${year}</div>
            </div>
            <table>
              <tr>
                <th>Tanggal</th>
                <th>Imsak</th>
                <th>Subuh</th>
                <th>Dzuhur</th>
                <th>Ashar</th>
                <th>Maghrib</th>
                <th>Isya</th>
              </tr>
      `;
  
      data.data.jadwal.forEach((day: any) => {
        htmlContent += `
          <tr>
            <td><strong>${day.tanggal}</strong></td>
            <td>${day.imsak}</td>
            <td>${day.subuh}</td>
            <td>${day.dzuhur}</td>
            <td>${day.ashar}</td>
            <td>${day.maghrib}</td>
            <td>${day.isya}</td>
          </tr>
        `;
      });
  
      htmlContent += `
            </table>
            <div class="footer">
              <p>📱 Download Islamku Apps di Playstore untuk informasi jadwal shalat lebih lengkap</p>
              <p>📍 Data bersumber dari Kementerian Agama Republik Indonesia</p>
              <p>© ${year} Islamku Apps - Jadwal Shalat Digital</p>
            </div>
          </body>
        </html>
      `;
  
      const file = await Print.printToFileAsync({
        html: htmlContent,
        base64: false
      });
  
      await Sharing.shareAsync(file.uri);
  
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'Failed to generate PDF schedule');
    }
  };

  const fetchPrayerTimes = async (cityId: string) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(`https://api.myquran.com/v2/sholat/jadwal/${cityId}/${today}`);
      const data = await response.json();
      setSchedule(data.data.jadwal);
    } catch (error) {
      console.error('Error fetching prayer times:', error);
    } finally {
      setLoading(false);
    }
  };

  const PrayerTimeCard = ({ title, time, icon }: { title: string; time: string; icon: keyof typeof MaterialCommunityIcons.glyphMap }) => {
    const nextPrayer = PrayerTimeHelpers.calculateNextPrayer(schedule);
    const isNextPrayer = nextPrayer?.name === title;
    
    return (
      <TouchableOpacity 
        style={[styles.prayerCard, isNextPrayer && styles.nextPrayerCard]}
        accessible={true}
        accessibilityLabel={`Waktu ${title} pukul ${time}`}
      >
        <LinearGradient
          colors={isNextPrayer ? ['#4A148C', '#7E57C2'] : ['#9575CD', '#7E57C2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.prayerGradient}
        >
          <MaterialCommunityIcons 
            name={icon} 
            size={32} 
            color="#FFF" 
            style={styles.prayerIcon}
          />
          <Text style={styles.prayerTitle}>{title}</Text>
          <Text style={styles.prayerTime}>{time}</Text>
          
          {isNextPrayer && (
            <View style={styles.nextPrayerBadge}>
              <Text style={styles.nextPrayerText}>Waktu Shalat Berikutnya</Text>
            </View>
          )}
  
          <View style={styles.notificationToggle}>
            <Switch
              value={notificationStates[title] || false}
              onValueChange={(enabled) => handleNotificationToggle(title, enabled)}
              trackColor={{ false: '#767577', true: '#4A148C' }}
              thumbColor={notificationStates[title] ? '#7E57C2' : '#f4f3f4'}
              accessibilityLabel={`Aktifkan notifikasi ${title}`}
            />
          </View>
  
          <View style={styles.reminderInfo}>
            <MaterialCommunityIcons name="bell-outline" size={16} color="#E1BEE7" />
            <Text style={styles.reminderText}>
              30, 15, 5 menit sebelum waktu {title}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };
  
  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.loadingText}>Sedang memuat data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#7E57C2', '#4A148C']}
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 1.0, y: 1.0 }}
        style={styles.gradientBackground}
      />

      <View style={styles.header}>
        <View style={styles.headerContent}>
          <MaterialCommunityIcons name="clock-outline" size={48} color="#FFF" />
          <View>
            <Text style={styles.title}>Jadwal Shalat</Text>
            <Text style={styles.subtitle}>{currentCity?.lokasi || 'Lokasi tidak ditemukan'}</Text>
          </View>
        </View>

        {schedule && (
          <Text style={styles.date}>{schedule.tanggal}</Text>
        )}
      </View>

      <View>
      {/* Test Purpose */}
      {/* <TouchableOpacity 
        style={styles.testButton}
        onPress={testNotification}
      >
        <Text style={styles.buttonText}>Test Notification (5s)</Text>
      </TouchableOpacity> */}
      
      </View>

      <ScrollView style={styles.content}>
        {schedule && (
          <View style={styles.prayerGrid}>
            <PrayerTimeCard title="Imsak" time={schedule.imsak} icon="weather-night" />
            <PrayerTimeCard title="Subuh" time={schedule.subuh} icon="weather-sunset-up" />
            <PrayerTimeCard title="Terbit" time={schedule.terbit} icon="weather-sunny" />
            <PrayerTimeCard title="Dhuha" time={schedule.dhuha} icon="sun-wireless" />
            <PrayerTimeCard title="Dzuhur" time={schedule.dzuhur} icon="weather-sunny" />
            <PrayerTimeCard title="Ashar" time={schedule.ashar} icon="weather-sunset" />
            <PrayerTimeCard title="Maghrib" time={schedule.maghrib} icon="weather-sunset-down" />
            <PrayerTimeCard title="Isya" time={schedule.isya} icon="weather-night" />
          </View>
        )}
                <TouchableOpacity 
                    style={styles.downloadButton}
                    onPress={downloadMonthlySchedule}
                >
                    <MaterialCommunityIcons name="download" size={24} color="#FFF" />
                    <Text style={styles.downloadText}>Download Jadwal Bulanan (PDF)</Text>
                </TouchableOpacity>
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2E003E',
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
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    backgroundColor: 'rgba(126, 87, 194, 0.8)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
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
  date: {
    fontSize: 18,
    color: '#FFF',
    textAlign: 'center',
    marginTop: 10,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  prayerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  prayerCard: {
    width: '48%',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 3,
    height: 120,
  },
  notificationToggle: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  prayerGradient: {
    padding: 15,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    position: 'relative',
  },
  prayerTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
  prayerTime: {
    color: '#E1BEE7',
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFF',
    fontSize: 18,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 50,
  },
  downloadText: {
    color: '#FFF',
    marginLeft: 8,
    fontSize: 14,
  },
  // Test Purposes
  testButton: {
    backgroundColor: '#7E57C2',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center'
  },
  buttonText: {
    color: '#FFF',
    fontSize: 14
  },
  // End Test
  nextPrayerCard: {
  transform: [{scale: 1.02}],
  elevation: 8,
  },
  prayerIcon: {
    marginBottom: 8,
  },
  nextPrayerBadge: {
    backgroundColor: '#4A148C',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  nextPrayerText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  reminderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    padding: 4,
    borderRadius: 8,
  },
  reminderText: {
    color: '#E1BEE7',
    fontSize: 10,
    marginLeft: 4,
  },
});
