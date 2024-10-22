'use client';

import useThemeStore from '@/stores/theme';
import { useEffect } from 'react';
import { useLocalStorage } from 'react-use';

export default function ThemeProvider({ children }) {
  const [localTheme, setLocalTheme] = useLocalStorage('theme', 'dark');
  const storedTheme = useThemeStore(state => state.theme);
  const setStoredTheme = useThemeStore(state => state.setTheme);

  useEffect(() => {
    if (storedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setLocalTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      setLocalTheme('light');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storedTheme]);

  useEffect(() => {
    if (localTheme === 'dark') setStoredTheme('dark');
    else setStoredTheme('light');

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return children;
}