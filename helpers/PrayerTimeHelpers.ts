import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

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
  sound: any;
}

// Add sound control
interface NotificationAction {
  identifier: string;
  buttonTitle: string;
  options: {
    isDestructive?: boolean;
    isAuthenticationRequired?: boolean;
  };
}

const STOP_SOUND_ACTION = 'STOP_SOUND';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

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
        const soundFile = prayer.prayerName === 'Subuh' ? 
          require('@/assets/audio/adzan_shubuh.mp3') :
          require('@/assets/audio/adzan.mp3');
          
        await PrayerTimeHelpers.scheduleNotification({
          title: `Waktu ${prayer.prayerName}`,
          body: `${prayer.minutesBefore} menit menuju waktu ${prayer.prayerName}`,
          time: PrayerTimeHelpers.calculateNotificationTime(prayerTime, prayer.minutesBefore),
          sound: soundFile
        });
      }
    }
  },

  scheduleNotification: async (notification: NotificationPayload) => {
    const timeInSeconds = Math.floor((notification.time.getTime() - Date.now()) / 1000);
    
    if (timeInSeconds > 0) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          sound: notification.sound,
          data: { type: 'prayer' },
          categoryIdentifier: 'prayer'
        },
        trigger: {
          seconds: timeInSeconds,
          channelId: 'prayer-times'
        },
      });
    }
  },

  setupNotifications: async () => {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('prayer-times', {
        name: 'Prayer Times',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#7E57C2',
        sound: 'adzan.mp3'
      });

      // Set up notification categories with actions
      await Notifications.setNotificationCategoryAsync('prayer', [
        {
          identifier: STOP_SOUND_ACTION,
          buttonTitle: 'Stop Adzan',
          options: {
            isDestructive: true,
          },
        },
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
