import { create } from 'zustand';

export const useAuthStore = create(set => ({
  user: 'loading',
  setUser: user => set({ user }),
  loggedIn: false,
  setLoggedIn: loggedIn => set({ loggedIn })
}));

export default useAuthStore;