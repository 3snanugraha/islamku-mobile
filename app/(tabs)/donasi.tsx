import { StyleSheet, StatusBar, TouchableOpacity, Clipboard, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useState, useEffect } from 'react';
import { useAdConfig } from '@/hooks/useAdConfig';

interface Donor {
  name: string;
  amount: string;
  date: string;
  message: string;
}

export default function DonasiScreen() {
  const [copied, setCopied] = useState(false);
  const rekeningNumber = '1770021679532';
  const adConfig = useAdConfig();

  const copyToClipboard = () => {
    Clipboard.setString(rekeningNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };


  const renderDonor = ({ item }: { item: Donor }) => (
    <ThemedView style={styles.donorCard}>
      <LinearGradient
        colors={['#9575CD', '#7E57C2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.donorGradient}
      >
        <ThemedView style={styles.donorHeader}>
          <ThemedText style={styles.donorName}>{item.name}</ThemedText>
          <ThemedText style={styles.donorAmount}>Rp {item.amount}</ThemedText>
        </ThemedView>
        <ThemedText style={styles.donorDate}>
          {new Date(item.date).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </ThemedText>
        <ThemedText style={styles.donorMessage}>"{item.message}"</ThemedText>
      </LinearGradient>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#7E57C2', '#4A148C']}
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 1.0, y: 1.0 }}
        style={styles.gradientBackground}
      />
      
      <MaterialCommunityIcons name="hand-heart" size={100} color="#FFFFFF" style={styles.icon} />
      
      <ThemedText style={styles.title}>
        Dukung Islamku Apps
      </ThemedText>
      
      <ThemedText style={styles.message}>
        Alhamdulillah, aplikasi ini kami hadirkan secara gratis untuk ummat. 
        Dengan dukungan Anda, kami dapat terus mengembangkan fitur-fitur bermanfaat 
        dan memberikan pengalaman terbaik dalam menjalankan ibadah sehari-hari.
      </ThemedText>

      <ThemedView style={styles.bankContainer}>
        <ThemedText style={styles.bankInfo}>Bank Mandiri</ThemedText>
        <ThemedText style={styles.bankInfo}>a.n Trisna Nugraha</ThemedText>
        <TouchableOpacity onPress={copyToClipboard} style={styles.rekeningContainer}>
          <ThemedText style={styles.rekeningText}>{rekeningNumber}</ThemedText>
          <MaterialCommunityIcons 
            name={copied ? "check" : "content-copy"} 
            size={24} 
            color="#FFFFFF" 
          />
        </TouchableOpacity>
        {copied && <ThemedText style={styles.copiedText}>Nomor rekening tersalin!</ThemedText>}
      </ThemedView>

      {adConfig?.donations?.donors && (
        <ThemedView style={styles.donorsContainer}>
          <ThemedText style={styles.donorsTitle}>
            Jazakumullah Khair untuk Para Donatur
          </ThemedText>
          <FlatList
            data={adConfig.donations.donors}
            renderItem={renderDonor}
            keyExtractor={(item, index) => index.toString()}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.donorsList}
          />
        </ThemedView>
      )}

      <ThemedText style={styles.footer}>
        Jazakumullah khairan katsiran atas dukungan Anda 🤲
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#2E003E',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  copiedText: {
    color: '#A5D6A7',
    marginTop: 10,
    fontSize: 14,
  },
  icon: {
    marginBottom: 12,
    opacity: 0.9,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 12,
    color: '#E1BEE7',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 18,
  },
  bankContainer: {
    backgroundColor: 'rgba(126, 87, 194, 0.8)',
    padding: 12,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  bankInfo: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 6,
    fontWeight: '600',
  },
  rekeningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 20, 140, 0.5)',
    padding: 10,
    borderRadius: 8,
    marginTop: 6,
  },
  rekeningText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 8,
  },
  donorsContainer: {
    width: '100%',
    marginTop: 12,
    marginBottom: 12,
    backgroundColor: 'rgba(126, 87, 194, 0.8)',
    padding: 10,
    borderRadius: 10,
  },
  donorsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  donorsList: {
    paddingHorizontal: 5,
  },
  donorCard: {
    width: 200,
    marginHorizontal: 5,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 3,
    height: 100,
  },
  donorGradient: {
    padding: 10,
    height: '100%',
    justifyContent: 'space-between',
  },
  donorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    width: '100%',
    marginBottom: 4,
    paddingBottom: 4,
  },
  donorName: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  donorAmount: {
    fontSize: 12,
    color: '#A5D6A7',
    fontWeight: '600',
  },
  donorDate: {
    fontSize: 10,
    color: '#E1BEE7',
    marginBottom: 4,
  },
  donorMessage: {
    fontSize: 11,
    color: '#FFFFFF',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  footer: {
    color: '#E1BEE7',
    fontSize: 12,
    marginTop: 6,
    fontStyle: 'italic',
  }
});
