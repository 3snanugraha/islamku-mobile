import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { Magnetometer } from 'expo-sensors';

export default function KiblatScreen() {
  const [degree, setDegree] = useState(0);
  const [qiblaDirection, setQiblaDirection] = useState(0);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required for Qibla direction');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      
      // console.log('=== Current Position ===');
      // console.log(`Latitude: ${location.coords.latitude}°`);
      // console.log(`Longitude: ${location.coords.longitude}°`);
      // console.log(`Altitude: ${location.coords.altitude}m`);
      // console.log(`Accuracy: ${location.coords.accuracy}m`);
      // console.log('=====================');

      // Check location accuracy and show appropriate alert
      if (location.coords.accuracy !== null) {
        if (location.coords.accuracy > 100) {
          Alert.alert(
            'Akurasi Rendah',
            'Akurasi lokasi sangat rendah (>100m). Mohon pindah ke area terbuka atau tunggu GPS lebih akurat.'
          );
        } else if (location.coords.accuracy > 50) {
          Alert.alert(
            'Akurasi Sedang',
            'Akurasi lokasi cukup (>50m). Untuk hasil lebih baik, mohon pindah ke area terbuka.'
          );
        }
      }

      calculateQiblaDirection(location.coords.latitude, location.coords.longitude);
    })();

    Magnetometer.setUpdateInterval(100);
    const subscription = Magnetometer.addListener(data => {
      let angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
      angle = angle < 0 ? angle + 360 : angle;
      setDegree(angle);
    });

    return () => subscription.remove();
  }, []);

  const calculateQiblaDirection = (latitude: number, longitude: number) => {
    const KAABA_LAT = 21.422487;
    const KAABA_LNG = 39.826206;

    const φ1 = toRadians(latitude);
    const φ2 = toRadians(KAABA_LAT);
    const Δλ = toRadians(KAABA_LNG - longitude);

    const y = Math.sin(Δλ);
    const x = Math.cos(φ1) * Math.tan(φ2) - Math.sin(φ1) * Math.cos(Δλ);
    
    let qibla = toDegrees(Math.atan2(y, x));
    qibla = (qibla + 360) % 360;

    setQiblaDirection(qibla);
  };

  const calculateQiblaDirection_test = (latitude: number, longitude: number) => {
      // Kiblat Latitud jeung longitude
      const KAABA_LAT = 21.422487; // 21° 25' 21" LU
      const KAABA_LNG = 39.826206; // 39° 49' 34" BT
      
      
      const φ1 = toRadians(latitude);
      const φk = toRadians(KAABA_LAT);
      const Δλ = toRadians(longitude - KAABA_LNG);
      
      const y = Math.sin(Δλ);
      const x = Math.cos(φ1) * Math.tan(φk) - Math.sin(φ1) * Math.cos(Δλ);
      
      let qibla = toDegrees(Math.atan2(y, x));
      
      // Normalize to 0-360 degrees
      qibla = (qibla + 360) % 360;
      
      // Calculate UTSB (Utara-Timur-Selatan-Barat) direction
      const utsbDirection = 270 + (90 - qibla);
      const normalizedUTSB = (utsbDirection + 360) % 360;
      
      setQiblaDirection(normalizedUTSB);
  };

  const toRadians = (degrees: number) => degrees * (Math.PI / 180);
  const toDegrees = (radians: number) => radians * (180 / Math.PI);

  const getCompassDirection = (degree: number) => {
    const directions = ['U', 'TL', 'T', 'TG', 'S', 'BD', 'B', 'BL'];
    const index = Math.round(degree / 45) % 8;
    return directions[index];
  };

  const getQiblaAccuracy = () => {
    const currentDirection = (degree + qiblaDirection) % 360;
    const difference = Math.abs(currentDirection - 295);
    
    if (difference <= 5) {
      return {
        text: 'Tepat mengarah ke Ka\'bah!',
        color: '#00FF00'
      };
    }
    if (difference <= 15) {
      return {
        text: 'Hampir tepat, sedikit sesuaikan',
        color: '#FFD700'
      };
    }
    return {
      text: 'Putarkan arah ke Ka\'bah',
      color: '#E1BEE7'
    };
  };

  const getQiblaAccuracy_test = () => {
    const currentDirection = (degree + qiblaDirection) % 360;
    const difference = Math.abs(currentDirection - 292.142); // Using the example's result of 292° 08' 32.74"
    
    if (difference <= 5) {
        return {
            text: 'Tepat mengarah ke Ka\'bah!',
            color: '#00FF00'
        };
    }
    if (difference <= 15) {
        return {
            text: 'Hampir tepat, sedikit sesuaikan',
            color: '#FFD700'
        };
    }
    return {
        text: 'Sesuaikan arah ke Ka\'bah',
        color: '#E1BEE7'
    };
};


  return (
    <View style={styles.container}>
      <LinearGradient colors={['#7E57C2', '#4A148C']} style={styles.gradient}>
        <View style={styles.content}>
        <View style={styles.compassContainer}>
  <View style={styles.compassCircle}>
    {/* Inner decorative circle */}
    <View style={styles.innerCircle} />
    
    {/* Compass ring with gradient */}
    <LinearGradient
      colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.05)']}
      style={styles.compassRing}
    />
    
    {/* Direction arrow and Kaaba marker */}
    <View style={[styles.arrowContainer, { transform: [{ rotate: `${360 - degree}deg` }] }]}>
      <FontAwesome5 name="long-arrow-alt-up" size={32} color="#FFD700" />
      <FontAwesome5
        name="kaaba"
        size={20}
        color="#FFD700"
        style={[styles.qiblaMarker, { transform: [{ translateY: -90 }] }]}
      />
    </View>

    {/* Cardinal Points with decorative boxes */}
    {['U', 'T', 'S', 'B'].map((direction, index) => (
      <View
        key={direction}
        style={[
          styles.cardinalBox,
          { transform: [{ rotate: `${index * 90}deg` }, { translateY: -110 }] }
        ]}
      >
        <Text style={styles.cardinalText}>{direction}</Text>
      </View>
    ))}
  </View>
</View>


          <View style={styles.infoContainer}>
            <Text style={styles.degreeText}>
              {Math.round(degree)}° {getCompassDirection(degree)}
            </Text>
            <Text style={[
                styles.accuracyText,
                { 
                    color: getQiblaAccuracy().color,
                    fontWeight: getQiblaAccuracy().color !== '#E1BEE7' ? 'bold' : 'normal'
                }
                ]}>
                {getQiblaAccuracy().text}
            </Text>
            {location && (
                <>
                  <Text style={styles.locationText}>
                    Lokasi: {location.coords.latitude.toFixed(4)}, {location.coords.longitude.toFixed(4)}
                  </Text>
                  <Text style={styles.qiblaText}>
                    Arah Kiblat: {Math.round(qiblaDirection)}°
                  </Text>
                  {location.coords.accuracy !== null && (
                    <Text style={[styles.locationText, 
                      {color: location.coords.accuracy > 100 ? '#FF6B6B' : 
                            location.coords.accuracy > 50 ? '#FFD93D' : '#4BB543'}]}>
                      Akurasi GPS: {Math.round(location.coords.accuracy)}m 
                      {location.coords.accuracy > 100 ? ' (Rendah)' : 
                      location.coords.accuracy > 50 ? ' (Sedang)' : ' (Baik)'}
                    </Text>
                  )}
                </>
              )}

          </View>

            <View style={styles.instructionContainer}>
                <Text style={styles.instructionTitle}>Cara Menggunakan:</Text>
                <View style={styles.instructionItem}>
                <Text style={styles.instructionNumber}>1.</Text>
                <Text style={styles.instructionText}>
                    Kalibrasi kompas HP dengan gerakan angka 8
                </Text>
                </View>
                <View style={styles.instructionItem}>
                <Text style={styles.instructionNumber}>2.</Text>
                <Text style={styles.instructionText}>
                    Pastikan HP dalam posisi datar dan sejajar
                </Text>
                </View>
            </View>
        </View>
      </LinearGradient>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compass: {
    position: 'absolute',
  },
  compassMarker: {
    position: 'absolute',
    opacity: 0.3,
  },
  infoContainer: {
    alignItems: 'center',
    marginTop: 40,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    width: '80%',
  },
  degreeText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  accuracyText: {
    fontSize: 18,
    marginTop: 10,
    textAlign: 'center',
  },
  locationText: {
    color: '#E1BEE7',
    fontSize: 14,
    marginTop: 10,
  },
  cardinalPoint: {
    position: 'absolute',
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  north: {
    top: 10,
  },
  east: {
    right: 10,
  },
  south: {
    bottom: 10,
  },
  west: {
    left: 10,
  },
  qiblaText: {
    color: '#FFD700',
    fontSize: 16,
    marginTop: 5,
    fontWeight: 'bold',
  },
  instructionContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 10,
    width: '80%',
  },
  instructionTitle: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  instructionNumber: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 8,
  },
  instructionText: {
    color: '#E1BEE7',
    fontSize: 14,
  },
  compassContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 240,
    height: 240,
    position: 'relative',
  },
  compassCircle: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  innerCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    position: 'absolute',
  },
  compassRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    opacity: 0.5,
  },
  arrowContainer: {
    alignItems: 'center',
    position: 'absolute',
  },
  cardinalBox: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 4,
    borderRadius: 4,
    minWidth: 24,
    alignItems: 'center',
  },
  cardinalText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
  },
  qiblaMarker: {
    position: 'absolute',
    opacity: 0.9,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  
});
