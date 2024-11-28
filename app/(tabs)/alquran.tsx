import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

interface Surah {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
}

export default function AlQuranScreen() {
  const [loading, setLoading] = useState(true);
  const [surahList, setSurahList] = useState<Surah[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSurahList, setFilteredSurahList] = useState<Surah[]>([]);

  const fetchSurahData = async () => {
    try {
      const response = await fetch('https://equran.id/api/v2/surat');
      const data = await response.json();
      setSurahList(data.data);
      setFilteredSurahList(data.data);
    } catch (error) {
      console.error('Error fetching surah data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    const filtered = surahList.filter((item) => 
      item.namaLatin.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredSurahList(filtered);
  };

  useEffect(() => {
    fetchSurahData();
  }, []);

  const renderSurahItem = ({ item }: { item: Surah }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => router.push(`/(tabs)/alquran/${item.nomor}`)}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.surahNumber}>{item.nomor}</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.namaLatin}</Text>
        <Text style={styles.cardSubtitle}>{item.arti} • {item.jumlahAyat} Ayat</Text>
      </View>
      <Text style={styles.arabicName}>{item.nama}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#7E57C2', '#4A148C']}
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 1.0, y: 1.0 }}
        style={styles.gradientBackground}
      />
      <View style={styles.header}>
        <Text style={styles.headerText}>Al-Qur'an</Text>
        <Text style={styles.headerSubText}>Baca dan Dengarkan</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari surah..."
          placeholderTextColor="#B39DDB"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#7E57C2" style={styles.loading} />
      ) : (
        <FlatList
          data={filteredSurahList}
          keyExtractor={(item) => item.nomor.toString()}
          renderItem={renderSurahItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    paddingTop: 30,
    backgroundColor: 'rgba(126, 87, 194, 0.8)',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    fontSize: 16,
    color: '#FFF',
    borderWidth: 1,
    borderColor: '#7E57C2',
  },
  loading: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 16,
    marginBottom: 12,
    borderRadius: 15,
    elevation: 3,
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#7E57C2',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  surahNumber: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardContent: {
    flex: 1,
    marginLeft: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A148C',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#7E57C2',
  },
  arabicName: {
    fontSize: 20,
    color: '#7E57C2',
    marginLeft: 10,
  },
});
