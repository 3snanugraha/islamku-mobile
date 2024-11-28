import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import RenderHtml from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';

interface SurahDetail {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  audioFull: {
    [key: string]: string;
  };
}

export default function SurahDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [surahDetail, setSurahDetail] = useState<SurahDetail | null>(null);
  const [sound, setSound] = useState<Audio.Sound>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { width } = useWindowDimensions();

  useEffect(() => {
    fetchSurahDetail();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [id]);

  const fetchSurahDetail = async () => {
    try {
      const response = await fetch(`https://equran.id/api/v2/surat/${id}`);
      const data = await response.json();
      setSurahDetail(data.data);
    } catch (error) {
      console.error('Error fetching surah detail:', error);
    }
  };

  async function loadSound() {
    if (surahDetail?.audioFull['01'] && !sound) {
      setIsLoading(true);
      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: surahDetail.audioFull['01'] },
          { shouldPlay: false }
        );
        setSound(newSound);
        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded) {
            setIsPlaying(status.isPlaying);
            if (status.didJustFinish) {
              setIsPlaying(false);
            }
          }
        });
      } catch (error) {
        console.error('Error loading sound:', error);
      }
      setIsLoading(false);
    }
  }

  async function handlePlayPause() {
    if (!sound) {
      await loadSound();
    }
    
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
    }
  }

  async function handleStop() {
    if (sound) {
      await sound.stopAsync();
      await sound.setPositionAsync(0);
    }
  }

  if (!surahDetail) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const baseStyle = {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
  };

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
          <Text style={styles.title}>{surahDetail.nama}</Text>
          <Text style={styles.arabicTitle}>{surahDetail.namaLatin}</Text>
          <View style={styles.divider} />
          
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>Arti: {surahDetail.arti}</Text>
            <Text style={styles.infoText}>Jumlah Ayat: {surahDetail.jumlahAyat}</Text>
            <Text style={styles.infoText}>Diturunkan: {surahDetail.tempatTurun}</Text>
          </View>

          <View style={styles.audioControlContainer}>
            <TouchableOpacity 
              style={styles.playButton} 
              onPress={handlePlayPause}
              disabled={isLoading}
            >
              <Ionicons 
                name={isPlaying ? "pause-circle" : "play-circle"} 
                size={30} 
                color="#FFFFFF" 
              />
              <Text style={styles.playButtonText}>
                {isLoading ? "Loading..." : isPlaying ? "Pause" : "Play"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.stopButton} 
              onPress={handleStop}
              disabled={!sound || isLoading}
            >
              <Ionicons name="stop-circle" size={30} color="#FFFFFF" />
              <Text style={styles.playButtonText}>Stop</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>Keterangan:</Text>
            <RenderHtml
              contentWidth={width}
              source={{ html: surahDetail.deskripsi }}
              baseStyle={baseStyle}
            />
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  arabicTitle: {
    fontSize: 32,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#FFFFFF',
    marginVertical: 15,
  },
  infoContainer: {
    backgroundColor: '#4E2E5C',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  infoText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  audioControlContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 15,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6A1B9A',
    padding: 12,
    borderRadius: 10,
    flex: 1,
    marginRight: 8,
  },
  stopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6A1B9A',
    padding: 12,
    borderRadius: 10,
    flex: 1,
    marginLeft: 8,
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 8,
  },
  descriptionContainer: {
    marginTop: 15,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});