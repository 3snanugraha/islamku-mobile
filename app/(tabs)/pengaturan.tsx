import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';

export default function PengaturanScreen() {
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [locationPermission, setLocationPermission] = useState(false);

  useEffect(() => {
    loadSettings();
    checkLocationPermission();
  }, []);

  const loadSettings = async () => {
    try {
      const value = await AsyncStorage.getItem('showStartScreen');
      setShowStartScreen(value === null ? true : JSON.parse(value));
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const checkLocationPermission = async () => {
    let { status } = await Location.getForegroundPermissionsAsync();
    setLocationPermission(status === 'granted');
  };

  const toggleStartScreen = async (value: boolean) => {
    try {
      await AsyncStorage.setItem('showStartScreen', JSON.stringify(value));
      setShowStartScreen(value);
    } catch (error) {
      console.error('Error saving setting:', error);
    }
  };

  const requestLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    setLocationPermission(status === 'granted');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#7E57C2', '#4A148C']}
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 1.0, y: 1.0 }}
        style={styles.gradientBackground}
      />

      <View style={styles.header}>
        <Text style={styles.headerText}>Pengaturan</Text>
        <Text style={styles.headerSubText}>Pengaturan aplikasi</Text>
      </View>

      <View style={styles.settingItem}>
        <View style={styles.settingContent}>
          <MaterialCommunityIcons name="presentation" size={24} color="#FFF" />
          <Text style={styles.settingText}>Tampilkan Start Screen</Text>
        </View>
        <Switch
          value={showStartScreen}
          onValueChange={toggleStartScreen}
          trackColor={{ false: '#767577', true: '#B39DDB' }}
          thumbColor={showStartScreen ? '#7E57C2' : '#f4f3f4'}
        />
      </View>

      <View style={styles.settingItem}>
        <View style={styles.settingContent}>
          <MaterialCommunityIcons name="map-marker" size={24} color="#FFF" />
          <Text style={styles.settingText}>Izin Lokasi</Text>
        </View>
        <Switch
          value={locationPermission}
          onValueChange={requestLocationPermission}
          trackColor={{ false: '#767577', true: '#B39DDB' }}
          thumbColor={locationPermission ? '#7E57C2' : '#f4f3f4'}
        />
      </View>
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
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  header: {
    padding: 20,
    paddingTop: 30,
    backgroundColor: 'rgba(126, 87, 194, 0.8)',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  headerSubText: {
    fontSize: 16,
    color: '#E1BEE7',
    textAlign: 'center',
    marginTop: 5,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(126, 87, 194, 0.3)',
    marginHorizontal: 15,
    marginTop: 20,
    borderRadius: 15,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    color: '#FFF',
    fontSize: 16,
    marginLeft: 15,
  }
});