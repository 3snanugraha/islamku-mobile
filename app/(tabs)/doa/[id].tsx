import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function DoaDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [doaDetail, setDoaDetail] = useState<any>(null);

  useEffect(() => {
    fetchDoaDetail();
  }, [id]);

  const fetchDoaDetail = async () => {
    try {
      const response = await fetch(`https://doa-doa-api-ahmadramadhan.fly.dev/api/${id}`);
      const data = await response.json();
      setDoaDetail(data[0]);
    } catch (error) {
      console.error('Error fetching doa detail:', error);
    }
  };

  if (!doaDetail) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        <Text style={styles.backButtonText}>Kembali</Text>
      </TouchableOpacity>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>{doaDetail.doa}</Text>
          <View style={styles.divider} />
          <Text style={styles.ayat}>{doaDetail.ayat}</Text>
          <Text style={styles.latin}>{doaDetail.latin}</Text>
          <View style={styles.meaningContainer}>
            <Text style={styles.meaningTitle}>Artinya:</Text>
            <Text style={styles.meaning}>{doaDetail.artinya}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2E003E',
    paddingTop: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2E003E',
  },
  scrollContainer: {
    flex: 1,
  },
  card: {
    margin: 16,
    padding: 20,
    backgroundColor: '#3E1E4C',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#6A1B9A',
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#FFFFFF',
  },
  divider: {
    height: 1,
    backgroundColor: '#FFFFFF',
    marginVertical: 15,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  ayat: {
    fontSize: 26,
    color: '#FFFFFF',
    textAlign: 'right',
    marginBottom: 15,
    lineHeight: 45,
    fontFamily: 'System',
  },
  latin: {
    fontSize: 16,
    color: '#FFFFFF',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  meaningContainer: {
    backgroundColor: '#4E2E5C',
    padding: 15,
    borderRadius: 10,
  },
  meaningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  meaning: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
  },
});
