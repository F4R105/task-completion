import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

import { todayKey } from '@/lib/dates';

/** Today's date, refreshed whenever the app returns to the foreground. */
export function useToday() {
  const [today, setToday] = useState(todayKey);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        setToday(todayKey());
      }
    });
    return () => subscription.remove();
  }, []);

  return today;
}
