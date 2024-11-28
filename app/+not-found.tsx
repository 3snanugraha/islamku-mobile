import { Link, Stack } from 'expo-router';
import { StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function NotFoundScreen() {
  return (
    <ThemedView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#7E57C2', '#4A148C']}
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 1.0, y: 1.0 }}
        style={styles.gradientBackground}
      />
      <Stack.Screen options={{ title: 'Fitur Belum Tersedia' }} />
      
      <Ionicons name="construct-outline" size={100} color="#FFFFFF" style={styles.icon} />
      
      <ThemedText style={styles.title}>
        Mohon Maaf
      </ThemedText>
      
      <ThemedText style={styles.message}>
        Fitur ini belum ada, mohon ditunggu ya update selanjutnya.
      </ThemedText>

      <Link href="/(tabs)" style={styles.link}>
        <ThemedText style={styles.linkText}>
          Kembali ke Beranda
        </ThemedText>
      </Link>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#E1BEE7',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  link: {
    backgroundColor: 'rgba(126, 87, 194, 0.8)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginTop: 20,
  },
  linkText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});