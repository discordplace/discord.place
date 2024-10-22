import { create } from 'zustand';

export const useAuthStore = create(set => ({
  loggedIn: false,
  setLoggedIn: loggedIn => set({ loggedIn }),
  setUser: user => set({ user }),
  user: 'loading'
}));

export default useAuthStore;