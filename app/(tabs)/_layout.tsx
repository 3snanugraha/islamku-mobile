import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { Slot } from 'expo-router';

export default function Layout() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* Komponen Slot akan menggantikan konten layar berdasarkan rute */}
      <Slot />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6', // Warna latar belakang default
  },
});