import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import RenderHtml from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';

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

interface AudioOption {
  id: string;
  name: string;
  url: string;
}

export default function SurahDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [surahDetail, setSurahDetail] = useState<SurahDetail | null>(null);
  const [sound, setSound] = useState<Audio.Sound>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { width } = useWindowDimensions();
  const [selectedAudio, setSelectedAudio] = useState<string>('01');
  const [isLoadingAudio, setIsLoadingAudio] = useState<boolean>(false);
  const [audioOptions] = useState<AudioOption[]>([
    { id: '01', name: 'Abdullah Al-Juhany', url: '' },
    { id: '02', name: 'Abdul Muhsin Al-Qasim', url: '' },
    { id: '03', name: 'Abdurrahman as-Sudais', url: '' },
    { id: '04', name: 'Ibrahim Al-Dossari', url: '' },
    { id: '05', name: 'Misyari Rasyid Al-Afasi', url: '' },
  ]);

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
    if (surahDetail?.audioFull[selectedAudio] && !sound) {
      setIsLoading(true);
      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: surahDetail.audioFull[selectedAudio] },
          { shouldPlay: true }
        );
        setSound(newSound);
        setIsPlaying(true);
        
        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded) {
            setIsPlaying(status.isPlaying);
            if (status.didJustFinish) {
              setIsPlaying(false);
              setIsLoading(false);
            }
          }
        });
      } catch (error) {
        console.error('Error loading sound:', error);
        setIsLoading(false);
      }
    }
  }

  async function handlePlayPause() {
    if (!sound && !isLoadingAudio) {
      setIsLoadingAudio(true);
      await loadSound();
      setIsLoadingAudio(false);
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
      try {
        await sound.stopAsync();
        await sound.setPositionAsync(0);
        setIsPlaying(false);
        setIsLoading(false);
      } catch (error) {
        console.error('Error stopping audio:', error);
      }
    }
  }

  const baseStyle = {
    fontSize: 16,
    color: '#4A148C',
    lineHeight: 24,
  };

  if (!surahDetail) {
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
          <Text style={styles.title}>{surahDetail.nama}</Text>
          <Text style={styles.arabicTitle}>{surahDetail.namaLatin}</Text>
          <View style={styles.divider} />
          
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>Arti: {surahDetail.arti}</Text>
            <Text style={styles.infoText}>Jumlah Ayat: {surahDetail.jumlahAyat}</Text>
            <Text style={styles.infoText}>Diturunkan: {surahDetail.tempatTurun}</Text>
          </View>

          <View style={styles.audioSelectorContainer}>
            <Text style={styles.audioSelectorTitle}>Pilih Qari:</Text>
            <Picker
              selectedValue={selectedAudio}
              onValueChange={async (itemValue) => {
                // Stop and cleanup current audio
                if (sound) {
                  await sound.stopAsync();
                  await sound.unloadAsync();
                  setSound(undefined);
                }
                setIsPlaying(false);
                setSelectedAudio(itemValue);
              }}
              style={styles.picker}
              dropdownIconColor="#4A148C"
            >
              {audioOptions.map((option) => (
                <Picker.Item 
                  key={option.id} 
                  label={option.name} 
                  value={option.id} 
                  color="#4A148C"
                />
              ))}
            </Picker>
          </View>

          <View style={styles.audioControlContainer}>
          <TouchableOpacity 
            style={styles.playButton} 
            onPress={handlePlayPause}
            disabled={isLoadingAudio}
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
              disabled={!isPlaying}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A148C',
    textAlign: 'center',
  },
  arabicTitle: {
    fontSize: 32,
    color: '#7E57C2',
    textAlign: 'center',
    marginTop: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#7E57C2',
    marginVertical: 15,
  },
  infoContainer: {
    backgroundColor: 'rgba(126, 87, 194, 0.1)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  infoText: {
    fontSize: 16,
    color: '#4A148C',
    marginBottom: 5,
  },
  audioSelectorContainer: {
    backgroundColor: 'rgba(126, 87, 194, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  audioSelectorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A148C',
    marginBottom: 10,
  },
  picker: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
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
    backgroundColor: '#7E57C2',
    padding: 12,
    borderRadius: 10,
    flex: 1,
    marginRight: 8,
  },
  stopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7E57C2',
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
    color: '#4A148C',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#4A148C',
    lineHeight: 24,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});
