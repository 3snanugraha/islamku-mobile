import React, { useState, useEffect } from 'react';
import {
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Text,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Font from 'expo-font'; // Import untuk memuat font
import { useFonts } from 'expo-font';
import { Amiri_400Regular } from '@expo-google-fonts/amiri'; // Import font Amiri

const { width, height } = Dimensions.get('window');

// Data doa, dzikir, dan Al-Qur'an
const slides = [
  {
    id: '1',
    image: require('@/assets/images/islamku.png'),
    title: 'Doa Harian',
    description: 'Kumpulan doa-doa yang dibaca setiap hari.',
  },
  {
    id: '2',
    image: require('@/assets/images/islamku_2.png'),
    title: 'Dzikir Pagi dan Petang',
    description: 'Dzikir yang bisa dibaca pada pagi dan petang hari.',
  },
  {
    id: '3',
    image: require('@/assets/images/islamku.png'),
    title: 'Al-Qur\'an',
    description: 'Membaca dan memahami ayat-ayat Al-Qur\'an.',
  },
];

export default function StartScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Muat font
  const [fontsLoaded] = useFonts({
    Amiri_400Regular, // Font Amiri
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>; // Menunggu font dimuat
  }

  const handleGetStarted = (route: string) => {
    router.push('/(tabs)');
  };

  const renderItem = ({ item }: { item: typeof slides[0] }) => (
    <View style={styles.slide}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#7E57C2', '#4A148C']} // Gradient ungu dengan #7E57C2 sebagai warna utama
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 1.0, y: 1.0 }}
        style={styles.gradientBackground}
      />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Islamku</Text>
        <MaterialCommunityIcons name="book-open-page-variant" size={48} color="#FFF" />
      </View>
      <FlatList
        data={slides}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        style={styles.slider}
      />
      <View style={styles.dotsContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index && styles.activeDot,
            ]}
          />
        ))}
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleGetStarted('/doa')} // Rute ke halaman doa
      >
        <MaterialCommunityIcons name="chevron-right-circle" size={24} color="#FFF" />
        <Text style={styles.buttonText}>Yuk Masuk</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2E003E', // Warna latar belakang utama
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    marginTop: '30%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFF',
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: 10,
    fontFamily: 'Amiri_400Regular', // Gunakan font Arab di sini
  },
  slider: {
    flexGrow: 0,
    marginTop: 20,
    marginBottom: 30,
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: height * 0.3,
    width: width * 0.8,
    resizeMode: 'contain',
    borderRadius: 20,
    marginBottom: 20,
    borderColor: '#FFF',
    borderWidth: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF', // Menjaga agar judul tetap terlihat kontras dengan background
    textAlign: 'center',
    marginTop: 10,
    fontFamily: 'Amiri_400Regular', // Font Arab untuk judul
  },
  description: {
    fontSize: 18,
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: '#FFF', // Menjaga keterbacaan teks deskripsi
    textAlign: 'center',
    marginHorizontal: 30,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    fontFamily: 'Amiri_400Regular', // Font Arab untuk deskripsi
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#B39DDB', // Warna titik yang lebih cerah
    marginHorizontal: 6,
  },
  activeDot: {
    backgroundColor: '#FFF',
    width: 14,
    height: 14,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#7E57C2', // Tombol dengan warna ungu cerah
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 25,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  buttonText: {
    color: '#FFF', // Warna teks tombol tetap putih agar kontras
    marginLeft: 10,
    fontWeight: 'bold',
    fontSize: 18,
    textTransform: 'uppercase',
  },
});

