import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function LayarMenuUtama() {
  const handlePress = (menu: string) => {
    router.push(`/(tabs)/${menu}` as any);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#7E57C2', '#4A148C']}
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 1.0, y: 1.0 }}
        style={styles.gradientBackground}
      />
      
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <MaterialCommunityIcons name="mosque" size={48} color="#FFF" />
          <View>
            <Text style={styles.title}>Panduan Muslim</Text>
            <Text style={styles.subtitle}>Teman Islami Sehari-hari</Text>
          </View>
        </View>
        <Text style={styles.welcomeText}>Assalamu'alaikum</Text>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: '#7E57C2' }]}
          onPress={() => handlePress('doa')}
        >
          <MaterialCommunityIcons name="book-open-variant" size={40} color="#FFF" />
          <Text style={styles.menuText}>Kumpulan Do'a</Text>
          <Text style={styles.menuDescription}>Do'a dan permohonan sehari-hari</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: '#9575CD' }]}
          onPress={() => handlePress('dzikr')}
        >
          <MaterialCommunityIcons name="hand-heart" size={40} color="#FFF" />
          <Text style={styles.menuText}>Dzikir & Tasbih</Text>
          <Text style={styles.menuDescription}>Selalu mengingat Allah</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: '#B39DDB' }]}
          onPress={() => handlePress('alquran')}
        >
          <MaterialCommunityIcons name="book-music" size={40} color="#FFF" />
          <Text style={styles.menuText}>Audio Al-Qur'an</Text>
          <Text style={styles.menuDescription}>Dengarkan bacaan yang indah</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerContent} onPress={() => handlePress('kiblat')}>
          <MaterialCommunityIcons name="compass" size={24} color="#FFF" />
          <Text style={styles.footerText}>Arah Kiblat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerContent} onPress={() => handlePress('sholat')}>
          <MaterialCommunityIcons name="clock-outline" size={24} color="#FFF" />
          <Text style={styles.footerText}>Waktu Sholat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerContent} onPress={() => handlePress('settings')}>
          <MaterialCommunityIcons name="cog" size={24} color="#FFF" />
          <Text style={styles.footerText}>Pengaturan</Text>
        </TouchableOpacity>
      </View>
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
    paddingTop: 35,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    backgroundColor: 'rgba(126, 87, 194, 0.8)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    marginLeft: 15,
  },
  subtitle: {
    fontSize: 16,
    color: '#E1BEE7',
    marginLeft: 15,
  },
  welcomeText: {
    fontSize: 24,
    color: '#FFF',
    textAlign: 'center',
    marginTop: 15,
    fontStyle: 'italic',
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  menuItem: {
    padding: 20,
    marginBottom: 20,
    borderRadius: 15,
    width: '100%',
    alignItems: 'center',
    elevation: 8,
  },
  menuText: {
    color: '#FFF',
    fontSize: 20,
    marginTop: 10,
    fontWeight: 'bold',
  },
  menuDescription: {
    color: '#E1BEE7',
    fontSize: 14,
    marginTop: 5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: 'rgba(126, 87, 194, 0.8)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  footerContent: {
    alignItems: 'center',
  },
  footerText: {
    color: '#FFF',
    fontSize: 12,
    marginTop: 5,
  },
});
