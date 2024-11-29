import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function DoaScreen() {
  const [loading, setLoading] = useState(true);
  const [doaList, setDoaList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDoaList, setFilteredDoaList] = useState([]);

  const fetchDoaData = async () => {
    try {
      const response = await fetch('https://doa-doa-api-ahmadramadhan.fly.dev/api');
      const data = await response.json();
      setDoaList(data);
      setFilteredDoaList(data);
    } catch (error) {
      console.error('Error fetching doa data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    const filtered = doaList.filter((item: { doa: string }) => 
      item.doa.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredDoaList(filtered);
  };

  const handlePress = (menu: string) => {
    router.push(`/(tabs)/${menu}` as any);
  };

  useEffect(() => {
    fetchDoaData();
  }, []);

  const renderDoaItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.card} onPress={() => handlePress(`doa/${item.id}`)}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name="bookmark-outline" size={30} color="#7E57C2" />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.doa}</Text>
        <Text style={styles.cardSubtitle}>{item.ayat}</Text>
      </View>
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
        <Text style={styles.headerText}>Kumpulan Do'a</Text>
        <Text style={styles.headerSubText}>Pelajari dan Amalkan</Text>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari doa..."
          placeholderTextColor="#B39DDB"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#7E57C2" style={styles.loading} />
      ) : (
        <FlatList
          data={filteredDoaList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderDoaItem}
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
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: '#F3E5F5',
    padding: 10,
    borderRadius: 12,
  },
  cardContent: {
    flex: 1,
    marginLeft: 15,
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
