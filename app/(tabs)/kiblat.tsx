import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { Magnetometer } from 'expo-sensors';
import { LocationService } from '@/services/LocationService';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number | null;
}

export default function KiblatScreen() {
  const [degree, setDegree] = useState(0);
  const [qiblaDirection, setQiblaDirection] = useState(0);
  const [locationData, setLocationData] = useState<LocationData | null>(null);

  useEffect(() => {
    loadLocation();
    setupCompass();
    
    return () => {
      Magnetometer.removeAllListeners();
    };
  }, []);

  const loadLocation = async () => {
    try {
      const savedLocation = await LocationService.getStoredLocation();
      if (savedLocation) {
        setLocationData({
          latitude: savedLocation.latitude,
          longitude: savedLocation.longitude,
          accuracy: savedLocation.accuracy
        });
        calculateQiblaDirection(savedLocation.latitude, savedLocation.longitude);
      }
    } catch (error) {
      console.error('Error loading location:', error);
      Alert.alert('Error', 'Failed to load location data');
    }
  };

  const setupCompass = () => {
    Magnetometer.setUpdateInterval(100);
    Magnetometer.addListener(data => {
      let angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
      angle = angle < 0 ? angle + 360 : angle;
      setDegree(angle);
    });
  };

  const calculateQiblaDirection = (latitude: number, longitude: number) => {
    const KAABA_LAT = 21.422487;
    const KAABA_LNG = 39.826206;
  
    const φ1 = toRadians(latitude);
    const φ2 = toRadians(KAABA_LAT);
    const Δλ = toRadians(KAABA_LNG - longitude);
  
    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
    
    let qibla = toDegrees(Math.atan2(y, x));
    qibla = (qibla + 360) % 360;
  
    setQiblaDirection(qibla);
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
    const difference = Math.abs(currentDirection - qiblaDirection);
    
    if (difference <= 2) {
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

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#7E57C2', '#4A148C']} style={styles.gradient}>
        <View style={styles.content}>
          <View style={styles.compassContainer}>
            <View style={styles.compassCircle}>
              <View style={styles.innerCircle} />
              
              <LinearGradient
                colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.05)']}
                style={styles.compassRing}
              />
              
              <View style={[styles.arrowContainer, { transform: [{ rotate: `${360 - degree}deg` }] }]}>
                <FontAwesome5 name="long-arrow-alt-up" size={32} color="#FFD700" />
                <FontAwesome5
                  name="kaaba"
                  size={20}
                  color="#FFD700"
                  style={[styles.qiblaMarker, { transform: [{ translateY: -90 }] }]}
                />
              </View>

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
            {locationData && (
              <>
                <Text style={styles.locationText}>
                  Lokasi: {locationData.latitude.toFixed(4)}, {locationData.longitude.toFixed(4)}
                </Text>
                <Text style={styles.qiblaText}>
                  Arah Kiblat: {Math.round(qiblaDirection)}°
                </Text>
                {locationData.accuracy !== null && (
                  <Text style={[
                    styles.locationText, 
                    {
                      color: locationData.accuracy > 100 ? '#FF6B6B' : 
                             locationData.accuracy > 50 ? '#FFD93D' : '#4BB543'
                    }
                  ]}>
                    Akurasi GPS: {Math.round(locationData.accuracy)}m 
                    {locationData.accuracy > 100 ? ' (Rendah)' : 
                     locationData.accuracy > 50 ? ' (Sedang)' : ' (Baik)'}
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
