import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import RenderHtml from 'react-native-render-html';


interface TafsirDetail {
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
  tafsir: {
    ayat: number;
    teks: string;
  }[];
  suratSelanjutnya: {
    nomor: number;
    nama: string;
    namaLatin: string;
    jumlahAyat: number;
  } | false;
  suratSebelumnya: {
    nomor: number;
    nama: string;
    namaLatin: string;
    jumlahAyat: number;
  } | false;
}

interface AudioOption {
  id: string;
  name: string;
  url: string;
}

export default function TafsirDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [tafsirDetail, setTafsirDetail] = useState<TafsirDetail | null>(null);
  const [sound, setSound] = useState<Audio.Sound>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState<string>('01');
  const [audioOptions] = useState<AudioOption[]>([
    { id: '01', name: 'Abdullah Al-Juhany', url: '' },
    { id: '02', name: 'Abdul Muhsin Al-Qasim', url: '' },
    { id: '03', name: 'Abdurrahman as-Sudais', url: '' },
    { id: '04', name: 'Ibrahim Al-Dossari', url: '' },
    { id: '05', name: 'Misyari Rasyid Al-Afasi', url: '' },
  ]);

  useEffect(() => {
    fetchTafsirDetail();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [id]);

  const fetchTafsirDetail = async () => {
    try {
      const response = await fetch(`https://equran.id/api/v2/tafsir/${id}`);
      const data = await response.json();
      setTafsirDetail(data.data);
    } catch (error) {
      console.error('Error fetching tafsir detail:', error);
    }
  };

  async function loadSound() {
    if (tafsirDetail?.audioFull[selectedAudio] && !sound) {
      setIsLoading(true);
      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: tafsirDetail.audioFull[selectedAudio] },
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
  const baseStyle = {
    fontSize: 16,
    color: '#4A148C',
    lineHeight: 24,
  };

  if (!tafsirDetail) {
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
          <Text style={styles.title}>{tafsirDetail.nama}</Text>
          <Text style={styles.arabicTitle}>{tafsirDetail.namaLatin}</Text>
          <View style={styles.divider} />
          
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>Arti: {tafsirDetail.arti}</Text>
            <Text style={styles.infoText}>Jumlah Ayat: {tafsirDetail.jumlahAyat}</Text>
            <Text style={styles.infoText}>Diturunkan: {tafsirDetail.tempatTurun}</Text>
          </View>

          <View style={styles.audioSelectorContainer}>
            <Text style={styles.audioSelectorTitle}>Pilih Qari:</Text>
            <Picker
              selectedValue={selectedAudio}
              onValueChange={(itemValue) => {
                setSelectedAudio(itemValue);
                if (sound) {
                  sound.unloadAsync();
                  setSound(undefined);
                }
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
                  source={{ html: tafsirDetail.deskripsi }}
                  baseStyle={baseStyle}
                />
          </View>

          <View style={styles.tafsirContainer}>
            <Text style={styles.tafsirTitle}>Tafsir Per Ayat:</Text>
            {tafsirDetail.tafsir.map((item, index) => (
              <View key={index} style={styles.tafsirItem}>
                <Text style={styles.ayatNumber}>Ayat {item.ayat}</Text>
                <Text style={styles.tafsirText}>{item.teks}</Text>
              </View>
            ))}
          </View>

          <View style={styles.navigationContainer}>
            {tafsirDetail.suratSebelumnya && (
              <TouchableOpacity 
                style={styles.navButton}
                onPress={() => tafsirDetail.suratSebelumnya && router.push(`/tafsir/${tafsirDetail.suratSebelumnya.nomor}`)}
              >
                <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                <View>
                  <Text style={styles.navLabel}>Sebelumnya</Text>
                  <Text style={styles.navText}>{tafsirDetail.suratSebelumnya.namaLatin}</Text>
                </View>
              </TouchableOpacity>
            )}
            {tafsirDetail.suratSelanjutnya && (
              <TouchableOpacity 
                style={[styles.navButton, styles.navButtonRight]}
                onPress={() => tafsirDetail.suratSelanjutnya && router.push(`/tafsir/${tafsirDetail.suratSelanjutnya.nomor}`)}
              >
                <View>
                  <Text style={[styles.navLabel, styles.navLabelRight]}>Selanjutnya</Text>
                  <Text style={[styles.navText, styles.navTextRight]}>
                    {tafsirDetail.suratSelanjutnya.namaLatin}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            )}
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
  descriptionContainer: {
    marginBottom: 20,
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
  tafsirContainer: {
    marginTop: 20,
  },
  tafsirTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A148C',
    marginBottom: 15,
  },
  tafsirItem: {
    backgroundColor: 'rgba(126, 87, 194, 0.1)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  ayatNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7E57C2',
    marginBottom: 8,
  },
  tafsirText: {
    fontSize: 16,
    color: '#4A148C',
    lineHeight: 24,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7E57C2',
    padding: 12,
    borderRadius: 10,
    flex: 1,
    marginRight: 8,
  },
  navButtonRight: {
    marginRight: 0,
    marginLeft: 8,
    justifyContent: 'flex-end',
  },
  navLabel: {
    fontSize: 12,
    color: '#E1BEE7',
  },
  navLabelRight: {
    textAlign: 'right',
  },
  navText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  navTextRight: {
    textAlign: 'right',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});
