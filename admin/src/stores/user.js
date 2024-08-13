import { create } from 'zustand';

export const useUserStore = create(set => ({
  user: 'initial',
  setUser: user => set({ user })
}));