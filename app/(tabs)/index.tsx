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
        <Text style={styles.welcomeText}>اَلسَّلَامُ عَلَيْكُمْ</Text>
      </View>

      <View style={styles.menuContainer}>
        <View style={styles.menuRow}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handlePress('doa')}
          >
            <LinearGradient
              colors={['#9575CD', '#7E57C2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.menuGradient}
            >
              <MaterialCommunityIcons name="book-open-variant" size={40} color="#FFF" />
              <Text style={styles.menuText}>Kumpulan Do'a</Text>
              <Text style={styles.menuDescription}>Do'a sehari-hari untuk berbagai situasi</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handlePress('dzikr')}
          >
            <LinearGradient
              colors={['#9575CD', '#7E57C2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.menuGradient}
            >
              <MaterialCommunityIcons name="hand-heart" size={40} color="#FFF" />
              <Text style={styles.menuText}>Dzikir & Tasbih</Text>
              <Text style={styles.menuDescription}>Selalu mengingat Allah SWT</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.menuRow}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handlePress('alquran')}
          >
            <LinearGradient
              colors={['#9575CD', '#7E57C2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.menuGradient}
            >
              <MaterialCommunityIcons name="book-music" size={40} color="#FFF" />
              <Text style={styles.menuText}>Audio Al-Qur'an & Tafsir</Text>
              <Text style={styles.menuDescription}>Dengarkan bacaan yang indah dengan tafsir</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handlePress('donasi')}
          >
            <LinearGradient
              colors={['#9575CD', '#7E57C2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.menuGradient}
            >
              <MaterialCommunityIcons name="book-open-page-variant" size={40} color="#FFF" />
              <Text style={styles.menuText}>Baca Al-Qur'an & Terjemahannya</Text>
              <Text style={styles.menuDescription}>Baca Al-Qur'an dengan Terjemahannya</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.menuRow}>
          <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handlePress('donasi')}
            >
              <LinearGradient
                colors={['#9575CD', '#7E57C2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.menuGradient}
              >
                <MaterialCommunityIcons name="format-list-numbered" size={40} color="#FFF" />
                <Text style={styles.menuText}>Asmaul Husna</Text>
                <Text style={styles.menuDescription}>99 Nama Allah Yang Maha Indah</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handlePress('donasi')}
          >
            <LinearGradient
              colors={['#9575CD', '#7E57C2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.menuGradient}
            >
              <MaterialCommunityIcons name="hand-coin" size={40} color="#FFF" />
              <Text style={styles.menuText}>Donasi Pengembangan</Text>
              <Text style={styles.menuDescription}>Dukung pengembangan aplikasi ini</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
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
    paddingTop: 45,
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
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  menuItem: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 8,
  },
  menuGradient: {
    padding: 15,
    alignItems: 'center',
    aspectRatio: 1,
  },
  menuText: {
    color: '#FFF',
    fontSize: 16,
    marginTop: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  menuDescription: {
    color: '#E1BEE7',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
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
