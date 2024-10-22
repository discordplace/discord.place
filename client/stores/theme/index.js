import { create } from 'zustand';

export const useThemeStore = create((set, get) => ({
  setTheme: theme => set({ theme }),
  theme: 'dark',
  toggleTheme: theme => set(() => {
    const newTheme = theme !== undefined ? theme : get().theme === 'dark' ? 'light' : 'dark';

    return { theme: newTheme };
  })
}));

export default useThemeStore;