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
            {/* Generate Kaaba markers every 45 degrees */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <FontAwesome5
                key={angle}
                name="kaaba"
                size={20}
                color="rgba(255, 215, 0, 0.3)"
                style={[
                styles.compassMarker,
                {
                    transform: [
                    { rotate: `${angle}deg` },
                    { translateY: -140 } // Half of compass size minus some padding
                    ]
                }
                ]}
            />
            ))}
        </View>
            {/* Main Compass */}
            <MaterialCommunityIcons
              name="compass-outline"
              size={250}
              color="#FFF"
              style={[styles.compass, { transform: [{ rotate: `${360 - degree}deg` }] }]}
            />

            {/* Cardinal Points */}
            <Text style={[styles.cardinalPoint, styles.north]}>U</Text>
            <Text style={[styles.cardinalPoint, styles.east]}>T</Text>
            <Text style={[styles.cardinalPoint, styles.south]}>S</Text>
            <Text style={[styles.cardinalPoint, styles.west]}>B</Text>
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
  compassContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 300,
    height: 300,
    position: 'relative',
  },
  compass: {
    position: 'absolute',
  },
  compassCircle: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 48,
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
  }
});
