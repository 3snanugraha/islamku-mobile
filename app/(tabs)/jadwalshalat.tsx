import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, View, Text, ScrollView, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';

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

interface City {
  id: string;
  lokasi: string;
}

export default function JadwalShalat() {
  const [schedule, setSchedule] = useState<PrayerTime | null>(null);
  const [currentCity, setCurrentCity] = useState<City | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Allow location access to get local prayer times');
        return;
      }
  
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      const geocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude
      });
  
      console.log('Location data:', geocode);
  
      if (geocode[0]) {
        // Try to get location name from different fields
        const locationName = 
          geocode[0].subregion?.replace(/(Kabupaten|Kota) /, '') || 
          geocode[0].city?.replace(/(Kabupaten|Kota) /, '') ||
          geocode[0].district?.replace(/(Kabupaten|Kota) /, '');
  
        if (locationName) {
          await findCity(locationName);
        }
      }
    } catch (error) {
      console.error('Error getting location:', error);
      setLoading(false);
    }
  };
  
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
  

  const findCity = async (cityName: string) => {
    try {
      const response = await fetch(`https://api.myquran.com/v2/sholat/kota/cari/${cityName}`);
      const data = await response.json();
      
      if (data.status && data.data.length > 0) {
        setCurrentCity(data.data[0]);
        await fetchPrayerTimes(data.data[0].id);
      }
    } catch (error) {
      console.error('Error finding city:', error);
      setLoading(false);
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

  const PrayerTimeCard = ({ title, time, icon }: { title: string; time: string; icon: keyof typeof MaterialCommunityIcons.glyphMap }) => (
    <View style={styles.prayerCard}>
      <MaterialCommunityIcons name={icon} size={32} color="#FFF" />
      <Text style={styles.prayerTitle}>{title}</Text>
      <Text style={styles.prayerTime}>{time}</Text>
    </View>
  );
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
        <TouchableOpacity 
            style={styles.downloadButton}
            onPress={downloadMonthlySchedule}
        >
            <MaterialCommunityIcons name="download" size={24} color="#FFF" />
            <Text style={styles.downloadText}>Download Jadwal Bulanan</Text>
        </TouchableOpacity>
        {schedule && (
          <Text style={styles.date}>{schedule.tanggal}</Text>
        )}
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
    backgroundColor: 'rgba(126, 87, 194, 0.3)',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  prayerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  prayerTime: {
    color: '#E1BEE7',
    fontSize: 16,
    marginTop: 5,
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
    marginTop: 10,
  },
  downloadText: {
    color: '#FFF',
    marginLeft: 8,
    fontSize: 14,
  }
});
