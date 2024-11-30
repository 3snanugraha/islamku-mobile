import { StyleSheet, StatusBar, TouchableOpacity, Clipboard } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useState } from 'react';

export default function DonasiScreen() {
  const [copied, setCopied] = useState(false);
  const rekeningNumber = '1770021679532';

  const copyToClipboard = () => {
    Clipboard.setString(rekeningNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

      <ThemedText style={styles.message}>
        Setiap donasi yang Anda berikan akan digunakan untuk pengembangan aplikasi 
        dan penyediaan konten-konten islami yang berkualitas.
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
  icon: {
    marginBottom: 20,
    opacity: 0.9,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#E1BEE7',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 24,
  },
  bankContainer: {
    backgroundColor: 'rgba(126, 87, 194, 0.8)',
    padding: 20,
    borderRadius: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  bankInfo: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 10,
    fontWeight: '600',
  },
  rekeningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 20, 140, 0.5)',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  rekeningText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 10,
  },
  copiedText: {
    color: '#A5D6A7',
    marginTop: 10,
    fontSize: 14,
  },
  footer: {
    color: '#E1BEE7',
    fontSize: 16,
    marginTop: 30,
    fontStyle: 'italic',
  }
});
