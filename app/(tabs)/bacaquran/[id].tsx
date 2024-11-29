import React, { useRef } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';

interface QuranDetail {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  audioFull?: {
    [key: string]: string;
  };
  ayat: {
    nomorAyat: number;
    teksArab: string;
    teksLatin: string;
    teksIndonesia: string;
    audio: {
      [key: string]: string;
    };
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

export default function QuranDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const [quranDetail, setQuranDetail] = useState<QuranDetail | null>(null);
  const [selectedAyat, setSelectedAyat] = useState<number>(1);
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentAudio, setCurrentAudio] = useState<Audio.Sound>();
  const [playingAyat, setPlayingAyat] = useState<number | null>(null);
  const qariOptions = [
    { id: '01', name: 'Abdullah Al-Juhany' },
    { id: '02', name: 'Abdul Muhsin Al-Qasim' },
    { id: '03', name: 'Abdurrahman as-Sudais' },
    { id: '04', name: 'Ibrahim Al-Dossari' },
    { id: '05', name: 'Misyari Rasyid Al-Afasi' }
  ];
  
  const [selectedQari, setSelectedQari] = useState('01');

  const [isPlayingFull, setIsPlayingFull] = useState(false);

  const handleAudioFull = async (audioUrl?: string) => {
    try {
      // Stop and unload any existing audio
      if (currentAudio) {
        await currentAudio.stopAsync();
        await currentAudio.unloadAsync();
      }

      if (!audioUrl) {
        console.error('No audio URL provided');
        setIsPlayingFull(false);
        return;
      }

      if (isPlayingFull) {
        // If already playing, just stop
        setIsPlayingFull(false);
      } else {
        // Start playing new audio
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: audioUrl },
          { shouldPlay: true }
        );
        
        setCurrentAudio(newSound);
        setIsPlayingFull(true);

        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            setIsPlayingFull(false);
          }
        });
      }
    } catch (error) {
      console.error('Error playing full audio:', error);
      setIsPlayingFull(false);
    }
  };

  useEffect(() => {
    fetchQuranDetail();
    return () => {
      if (currentAudio) {
        currentAudio.unloadAsync();
      }
    };
  }, [id]);

  const fetchQuranDetail = async () => {
    try {
      const response = await fetch(`https://equran.id/api/v2/surat/${id}`);
      const data = await response.json();
      setQuranDetail(data.data);
    } catch (error) {
      console.error('Error fetching quran detail:', error);
    }
  };

  const scrollToAyat = (ayatNumber: number) => {
    setSelectedAyat(ayatNumber);
    if (scrollViewRef.current) {
      const yOffset = (ayatNumber - 1) * 200;
      scrollViewRef.current.scrollTo({
        y: yOffset,
        animated: true
      });
    }
  };

    const handleQariChange = async (itemValue: string) => {
      // Stop current full surah audio if playing
      if (currentAudio) {
        await currentAudio.stopAsync();
        await currentAudio.unloadAsync();
      }
      
      // Reset all audio states
      setCurrentAudio(undefined);
      setIsPlayingFull(false);
      setPlayingAyat(null);
      
      // Update selected qari
      setSelectedQari(itemValue);
    };
    

  const handleAyatAudio = async (ayat: any, qariId: string = "01") => {
    try {
      // Stop and unload any existing audio
      if (currentAudio) {
        await currentAudio.stopAsync();
        await currentAudio.unloadAsync();
      }

      // If already playing this ayat, just stop
      if (playingAyat === ayat.nomorAyat) {
        setPlayingAyat(null);
        return;
      }
      
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: ayat.audio[qariId] },
        { shouldPlay: true }
      );
      
      setCurrentAudio(newSound);
      setPlayingAyat(ayat.nomorAyat);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setPlayingAyat(null);
        }
      });
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  if (!quranDetail) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: height * 0.03 }]}>
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

      <ScrollView ref={scrollViewRef} style={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>{quranDetail.nama}</Text>
          <Text style={styles.arabicTitle}>{quranDetail.namaLatin}</Text>
          <View style={styles.divider} />
          
          <View style={styles.infoContainer}>
            <View style={styles.infoHeader}>
              <View>
                <Text style={styles.infoText}>Arti: {quranDetail.arti}</Text>
                <Text style={styles.infoText}>Jumlah Ayat: {quranDetail.jumlahAyat}</Text>
                <Text style={styles.infoText}>Diturunkan: {quranDetail.tempatTurun}</Text>
              </View>
              <TouchableOpacity 
                style={styles.fullAudioButton}
                onPress={() => handleAudioFull(quranDetail.audioFull?.[selectedQari])}
              >
                <Ionicons 
                  name={isPlayingFull ? "stop-circle" : "play-circle"} 
                  size={40} 
                  color="#7E57C2" 
                />
                <Text style={styles.fullAudioText}>
                  {isPlayingFull ? "Stop" : "Play Full"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.qariSelectorContainer}>
            <Text style={styles.ayatSelectorTitle}>Pilih Qari:</Text>
            <Picker
              selectedValue={selectedQari}
              onValueChange={handleQariChange}
              style={styles.picker}
            >
              {qariOptions.map((qari) => (
                <Picker.Item 
                  key={qari.id} 
                  label={qari.name} 
                  value={qari.id} 
                  color="#4A148C"
                />
              ))}
            </Picker>
          </View>

          <View style={styles.ayatSelectorContainer}>
            <Text style={styles.ayatSelectorTitle}>Pilih Ayat:</Text>
            <Picker
              selectedValue={selectedAyat}
              onValueChange={(itemValue) => scrollToAyat(itemValue)}
              style={styles.picker}
            >
              {Array.from({length: quranDetail.jumlahAyat}, (_, i) => i + 1).map((num) => (
                <Picker.Item 
                  key={num} 
                  label={`Ayat ${num}`} 
                  value={num} 
                  color="#4A148C"
                />
              ))}
            </Picker>
          </View>

          <View style={styles.ayatContainer}>
            {quranDetail.ayat.map((ayat, index) => (
              <View key={index} style={styles.ayatItem}>
                <View style={styles.ayatHeader}>
                  <Text style={styles.ayatNumber}>Ayat {ayat.nomorAyat}</Text>
                  <TouchableOpacity 
                    style={styles.audioButton}
                    onPress={() => handleAyatAudio(ayat, selectedQari)}
                  >
                    <Ionicons 
                      name={playingAyat === ayat.nomorAyat ? "stop-circle" : "play-circle"} 
                      size={24} 
                      color="#7E57C2" 
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles.arabicText}>{ayat.teksArab}</Text>
                <Text style={styles.latinText}>{ayat.teksLatin}</Text>
                <Text style={styles.indonesianText}>{ayat.teksIndonesia}</Text>
              </View>
            ))}
          </View>

          <View style={styles.navigationContainer}>
            {quranDetail.suratSebelumnya && (
              <TouchableOpacity 
                style={styles.navButton}
                onPress={() => quranDetail.suratSebelumnya && router.push(`/bacaquran/${quranDetail.suratSebelumnya.nomor}`)}
              >
                <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                <View>
                  <Text style={styles.navLabel}>Sebelumnya</Text>
                  <Text style={styles.navText}>{quranDetail.suratSebelumnya.namaLatin}</Text>
                </View>
              </TouchableOpacity>
            )}
            {quranDetail.suratSelanjutnya && (
              <TouchableOpacity 
                style={[styles.navButton, styles.navButtonRight]}
                onPress={() => quranDetail.suratSelanjutnya && router.push(`/bacaquran/${quranDetail.suratSelanjutnya.nomor}`)}
              >
                <View>
                  <Text style={[styles.navLabel, styles.navLabelRight]}>Selanjutnya</Text>
                  <Text style={[styles.navText, styles.navTextRight]}>
                    {quranDetail.suratSelanjutnya.namaLatin}
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
  ayatSelectorContainer: {
    backgroundColor: 'rgba(126, 87, 194, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  ayatSelectorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A148C',
    marginBottom: 10,
  },
  picker: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
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
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  infoText: {
    fontSize: 15,
    color: '#4A148C',
    marginBottom: 5,
  },
  ayatContainer: {
    marginTop: 20,
  },
  ayatItem: {
    backgroundColor: 'rgba(126, 87, 194, 0.1)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  ayatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  audioButton: {
    padding: 5,
  },
  ayatNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7E57C2',
    marginBottom: 8,
  },
  arabicText: {
    fontSize: 28,
    color: '#4A148C',
    textAlign: 'right',
    marginBottom: 10,
    lineHeight: 50,
  },
  latinText: {
    fontSize: 16,
    color: '#7E57C2',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  indonesianText: {
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
  qariSelectorContainer: {
    backgroundColor: 'rgba(126, 87, 194, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fullAudioButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  fullAudioText: {
    color: '#7E57C2',
    fontSize: 12,
    marginTop: 5,
  },
  
});
