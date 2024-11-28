# Islamku Mobile App 🌙

## Deskripsi Proyek

**Islamku** adalah aplikasi mobile yang dirancang untuk menjadi panduan Islami sehari-hari. Dengan antarmuka yang modern dan fitur yang mudah digunakan, **Islamku** membantu pengguna mendekatkan diri kepada Allah melalui berbagai alat dan informasi Islami.

## Fitur Utama

- 📖 **Kumpulan Do'a**: Koleksi do'a harian untuk berbagai situasi dan kebutuhan.
- 🕋 **Arah Kiblat**: Penunjuk arah kiblat dengan akurasi tinggi.
- 🕌 **Waktu Sholat**: Jadwal sholat harian berdasarkan lokasi Anda.
- 📿 **Dzikir & Tasbih**: Panduan dzikir dengan penghitung tasbih digital.
- 🎵 **Audio Al-Qur'an**: Dengarkan lantunan ayat suci Al-Qur'an yang indah.
- ⚙️ **Pengaturan Pribadi**: Atur preferensi sesuai kebutuhan Anda, termasuk tema mode gelap/terang.

## Prasyarat

Sebelum memulai pengembangan atau menjalankan aplikasi, pastikan Anda telah menginstal perangkat lunak berikut:

- **Node.js** (disarankan versi 16 atau lebih baru)
- **npm** atau **yarn**
- **Expo CLI**
- **Android Studio** / **Xcode** (untuk emulator)

## Pengaturan Variabel Lingkungan

Untuk menghubungkan aplikasi dengan database atau API yang relevan, atur variabel lingkungan berikut:
```bash
eas secret:create --name EXPO_PUBLIC_DB_HOST --value "alamat_database"
eas secret:create --name EXPO_PUBLIC_DB_USER --value "username"
eas secret:create --name EXPO_PUBLIC_DB_PASS --value "password"
