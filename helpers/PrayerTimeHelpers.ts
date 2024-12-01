interface CountdownResult {
    hours: number;
    minutes: number;
  }

export const PrayerTimeHelpers = {
  fetchPrayerTimes: async (cityId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const response = await fetch(`https://api.myquran.com/v2/sholat/jadwal/${cityId}/${today}`);
    const data = await response.json();
    return data.data.jadwal;
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
  }
};