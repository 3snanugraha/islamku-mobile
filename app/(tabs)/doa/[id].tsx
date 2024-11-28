import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Clipboard from 'expo-clipboard';

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

  const copyToClipboard = async () => {
    const textToCopy = `${doaDetail.doa}\n\n${doaDetail.ayat}\n\n${doaDetail.latin}\n\nArtinya:\n${doaDetail.artinya}`;
    await Clipboard.setStringAsync(textToCopy);
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
      <LinearGradient
        colors={['#7E57C2', '#4A148C']}
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 1.0, y: 1.0 }}
        style={styles.gradientBackground}
      />
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
          <View style={styles.copyButtonContainer}>
            <TouchableOpacity 
              style={styles.copyButton}
              onPress={copyToClipboard}
            >
              <Ionicons name="copy-outline" size={20} color="#FFFFFF" />
              <Text style={styles.copyButtonText}>Salin</Text>
            </TouchableOpacity>
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
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    elevation: 5,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(126, 87, 194, 0.8)',
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#FFFFFF',
  },
  divider: {
    height: 1,
    backgroundColor: '#7E57C2',
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
    color: '#4A148C',
    marginBottom: 10,
    textAlign: 'center',
  },
  ayat: {
    fontSize: 26,
    color: '#4A148C',
    textAlign: 'right',
    marginBottom: 15,
    lineHeight: 45,
    fontFamily: 'System',
  },
  latin: {
    fontSize: 16,
    color: '#7E57C2',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  meaningContainer: {
    backgroundColor: 'rgba(126, 87, 194, 0.1)',
    padding: 15,
    borderRadius: 10,
  },
  meaningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A148C',
    marginBottom: 5,
  },
  meaning: {
    fontSize: 16,
    color: '#4A148C',
    lineHeight: 24,
  },
  copyButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7E57C2',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  copyButtonText: {
    color: '#FFFFFF',
    marginLeft: 5,
    fontSize: 14,
  },
});