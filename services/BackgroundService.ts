import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { PrayerTimeHelpers } from '@/helpers/PrayerTimeHelpers';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKGROUND_FETCH_TASK = 'background-fetch';

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    const cityId = await AsyncStorage.getItem('selectedCityId');
    const preferencesStr = await AsyncStorage.getItem('notificationPreferences');
    const preferences = preferencesStr ? JSON.parse(preferencesStr) : [];

    if (cityId) {
      const times = await PrayerTimeHelpers.fetchPrayerTimes(cityId);
      await PrayerTimeHelpers.scheduleNotifications(times, preferences);
      return BackgroundFetch.BackgroundFetchResult.NewData;
    }
    return BackgroundFetch.BackgroundFetchResult.NoData;
  } catch (error) {
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export async function registerBackgroundFetch() {
  try {
    await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
      minimumInterval: 60 * 15, // 15 minutes
      stopOnTerminate: false,
      startOnBoot: true,
    });
  } catch (err) {
    console.log("Task Register failed:", err);
  }
}
