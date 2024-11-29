import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { asmaulHusna } from '@/utils/asmaul';

interface AsmaulHusna {
  urutan: number;
  latin: string;
  arab: string;
  arti: string;
}

export default function AsmaulScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAsmaulList, setFilteredAsmaulList] = useState<AsmaulHusna[]>(asmaulHusna);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    const filtered = asmaulHusna.filter((item) => 
      item.latin.toLowerCase().includes(text.toLowerCase()) ||
      item.arti.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredAsmaulList(filtered);
  };

  const renderAsmaulItem = ({ item }: { item: AsmaulHusna }) => (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Text style={styles.numberText}>{item.urutan}</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.arabText}>{item.arab}</Text>
        <Text style={styles.cardTitle}>{item.latin}</Text>
        <Text style={styles.cardSubtitle}>{item.arti}</Text>
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
        <Text style={styles.headerText}>Asmaul Husna</Text>
        <Text style={styles.headerSubText}>99 Nama Allah Yang Mulia</Text>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari nama Allah..."
          placeholderTextColor="#B39DDB"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      <FlatList
        data={filteredAsmaulList}
        keyExtractor={(item) => item.urutan.toString()}
        renderItem={renderAsmaulItem}
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 16,
    marginBottom: 12,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    backgroundColor: '#7E57C2',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardContent: {
    flex: 1,
    marginLeft: 15,
  },
  arabText: {
    fontSize: 24,
    color: '#4A148C',
    textAlign: 'right',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A148C',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#7E57C2',
    lineHeight: 20,
  },
});
