import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { dzikir } from '@/utils/dzikir';

interface Dzikir {
  arab: string;
  indo: string;
  type: string;
  ulang: string;
}

export default function DzikirScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDzikirList, setFilteredDzikirList] = useState<Dzikir[]>(dzikir);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    const filtered = dzikir.filter((item) => 
      item.indo.toLowerCase().includes(text.toLowerCase()) ||
      item.type.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredDzikirList(filtered);
  };

  const renderDzikirItem = ({ item }: { item: Dzikir }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.arabText}>{item.arab}</Text>
        <Text style={styles.cardTitle}>{item.indo}</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.typeText}>Waktu: {item.type}</Text>
          <Text style={styles.ulangText}>Dibaca: {item.ulang}</Text>
        </View>
      </View>
    </View>
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
        <Text style={styles.headerText}>Dzikir Harian</Text>
        <Text style={styles.headerSubText}>Pagi, Petang & Setelah Sholat</Text>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari dzikir..."
          placeholderTextColor="#B39DDB"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      <FlatList
        data={filteredDzikirList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderDzikirItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
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
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 16,
    marginBottom: 12,
    borderRadius: 15,
    elevation: 3,
  },
  cardContent: {
    flex: 1,
  },
  arabText: {
    fontSize: 24,
    color: '#4A148C',
    textAlign: 'right',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    color: '#4A148C',
    marginBottom: 8,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  typeText: {
    fontSize: 14,
    color: '#7E57C2',
    fontWeight: 'bold',
  },
  ulangText: {
    fontSize: 14,
    color: '#7E57C2',
    fontWeight: 'bold',
  },
});
