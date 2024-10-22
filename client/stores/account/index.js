import { toast } from 'sonner';
import { create } from 'zustand';
import fetchData from '@/lib/request/auth/getData';

export const useAccountStore = create(set => ({
  activeTab: 'my-account',
  setActiveTab: activeTab => set({ activeTab }),
  data: {},
  setData: data => set({ data }),
  loading: false,
  fetchData: async keys => {
    set({ loading: true });

    fetchData(keys)
      .then(data => set({ data, loading: false }))
      .catch(error => {
        toast.error(error);
        set({ loading: false });
      });
  },
  currentlyAddingServer: null,
  setCurrentlyAddingServer: currentlyAddingServer => set({ currentlyAddingServer }),
  currentlyAddingBot: false,
  setCurrentlyAddingBot: currentlyAddingBot => set({ currentlyAddingBot }),
  currentlyAddingSound: false,
  setCurrentlyAddingSound: currentlyAddingSound => set({ currentlyAddingSound }),
  currentlyAddingTheme: false,
  setCurrentlyAddingTheme: currentlyAddingTheme => set({ currentlyAddingTheme }),
  isCollapsed: false,
  setIsCollapsed: isCollapsed => set({ isCollapsed })
}));

export default useAccountStore;