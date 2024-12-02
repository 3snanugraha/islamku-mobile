import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

interface CountdownResult {
    hours: number;
    minutes: number;
}

interface NotificationPreference {
  prayerName: string;
  isEnabled: boolean;
  soundType: 'regular' | 'fajr';
  minutesBefore: number;
}

interface NotificationPayload {
  title: string;
  body: string;
  time: Date;
  data: {
      prayerName: string;
      minutesBefore: number;
  };
}

const STOP_SOUND_ACTION = 'STOP_SOUND';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    priority: Notifications.AndroidNotificationPriority.MAX
  }),
});

const getCreativeMessage = (prayerName: string, minutesBefore: number): string => {
  const messages: Record<number, Record<string, string>> = {
    30: {
      Subuh: "🌙 Persiapkan diri untuk bermunajat di waktu yang penuh keberkahan",
      Dzuhur: "🌤️ Sebentar lagi waktu istirahat dan shalat Dzuhur",
      Ashar: "🌅 Jangan biarkan Ashar berlalu, sudah waktunya rehat sejenak",
      Maghrib: "🌆 Siapkan hati menyambut pergantian hari",
      Isya: "✨ Penghujung hari akan segera tiba"
    },
    15: {
      Subuh: "🌄 15 menit menuju waktu Subuh, yuk bersiap!",
      Dzuhur: "☀️ Sebentar lagi waktu Dzuhur tiba",
      Ashar: "🌞 Waktu Ashar hampir tiba, jangan ditunda",
      Maghrib: "🌅 Maghrib akan segera masuk",
      Isya: "🌙 Isya sebentar lagi, sempurnakan ibadah hari ini"
    },
    5: {
      Subuh: "⏰ Segera bangun, waktu Subuh hampir tiba!",
      Dzuhur: "⚡ 5 menit lagi Dzuhur, sudah wudhu?",
      Ashar: "⚡ Ashar sebentar lagi masuk!",
      Maghrib: "🕌 Bersiap untuk Maghrib!",
      Isya: "🌟 Isya akan berkumandang!"
    },
    0: {
      Subuh: "🕌 Allahu Akbar! Waktu Subuh telah tiba",
      Dzuhur: "🕌 Allahu Akbar! Waktu Dzuhur telah tiba",
      Ashar: "🕌 Allahu Akbar! Waktu Ashar telah tiba",
      Maghrib: "🕌 Allahu Akbar! Waktu Maghrib telah tiba",
      Isya: "🕌 Allahu Akbar! Waktu Isya telah tiba"
    }
  };
  
  return messages[minutesBefore][prayerName] || "Waktu shalat akan segera tiba";
};

export const PrayerTimeHelpers = {
  fetchPrayerTimes: async (cityId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const response = await fetch(`https://api.myquran.com/v2/sholat/jadwal/${cityId}/${today}`);
    const data = await response.json();
    return data.data.jadwal;
  },

  scheduleNotifications: async (prayerTimes: any, preferences: NotificationPreference[]) => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    
    for (const prayer of preferences) {
      if (prayer.isEnabled) {
        const prayerTime = prayerTimes[prayer.prayerName.toLowerCase()];
        
        for (const interval of [30, 15, 5, 0]) {
          const notificationTime = PrayerTimeHelpers.calculateNotificationTime(prayerTime, interval);
          
          await PrayerTimeHelpers.scheduleNotification({
            title: `Waktu ${prayer.prayerName}`,
            body: getCreativeMessage(prayer.prayerName, interval),
            time: notificationTime,
            data: {
              prayerName: prayer.prayerName,
              minutesBefore: interval
            }
          });
        }
      }
    }
  },

  scheduleNotification: async (notification: NotificationPayload) => {
    const { prayerName, minutesBefore } = notification.data;
    
    try {
      const timeInSeconds = Math.floor((notification.time.getTime() - Date.now()) / 1000);
      
      if (timeInSeconds <= 0) return;
      
      const soundName = minutesBefore === 0 ? 
        (prayerName === 'Subuh' ? 'adzan_shubuh' : 'adzan') : 
        'default';

      await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          sound: Platform.OS === 'android' ? soundName : undefined,
          data: notification.data,
          categoryIdentifier: 'prayer',
          priority: Notifications.AndroidNotificationPriority.MAX
        },
        trigger: {
          seconds: timeInSeconds,
          channelId: 'prayer-times'
        },
      });
    } catch (error) {
      console.error('Failed to schedule notification:', error);
    }
  },

  setupNotifications: async () => {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('prayer-times', {
        name: 'Prayer Times',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#7E57C2',
        sound: 'adzan',
        enableVibrate: true,
        enableLights: true,
      });

      await Notifications.setNotificationCategoryAsync('prayer', [
        {
          identifier: STOP_SOUND_ACTION,
          buttonTitle: 'Hentikan Adzan',
          options: {
            isDestructive: true,
          },
        }
      ]);
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      return finalStatus === 'granted';
    }
    
    return false;
  },

  calculateNextPrayer: (schedule: any) => {
    const now = new Date();
    const prayers = [
      { name: 'Subuh', time: schedule.subuh },
      { name: 'Dzuhur', time: schedule.dzuhur },
      { name: 'Ashar', time: schedule.ashar },
      { name: 'Maghrib', time: schedule.maghrib },
      { name: 'Isya', time: schedule.isya }
    ];

    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    for (const prayer of prayers) {
      const [hours, minutes] = prayer.time.split(':').map(Number);
      const prayerTime = hours * 60 + minutes;
      
      if (prayerTime > currentTime) {
        return prayer;
      }
    }
    
    return prayers[0];
  },

  calculateCountdown: (targetTime: string): CountdownResult | null => {
    const now = new Date();
    const [targetHours, targetMinutes] = targetTime.split(':').map(Number);
    
    const targetDate = new Date();
    targetDate.setHours(targetHours, targetMinutes, 0);

    if (targetDate < now) {
      targetDate.setDate(targetDate.getDate() + 1);
    }

    const diffMs = targetDate.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    return {
      hours: Math.floor(diffMins / 60),
      minutes: diffMins % 60
    };
  },

  formatCountdown: (countdown: CountdownResult): string => {
    if (countdown.hours > 0) {
      return `${countdown.hours} jam ${countdown.minutes} menit lagi`;
    }
    return `${countdown.minutes} menit lagi`;
  },

  calculateNotificationTime: (prayerTime: string, minutesBefore: number): Date => {
    const [hours, minutes] = prayerTime.split(':').map(Number);
    const notificationTime = new Date();
    notificationTime.setHours(hours, minutes - minutesBefore, 0);
    return notificationTime;
  }
};
