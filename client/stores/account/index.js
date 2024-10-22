import fetchData from '@/lib/request/auth/getData';
import { toast } from 'sonner';
import { create } from 'zustand';

export const useAccountStore = create(set => ({
  activeTab: 'my-account',
  currentlyAddingBot: false,
  currentlyAddingServer: null,
  currentlyAddingSound: false,
  currentlyAddingTheme: false,
  data: {},
  fetchData: async keys => {
    set({ loading: true });

    fetchData(keys)
      .then(data => set({ data, loading: false }))
      .catch(error => {
        toast.error(error);
        set({ loading: false });
      });
  },
  isCollapsed: false,
  loading: false,
  setActiveTab: activeTab => set({ activeTab }),
  setCurrentlyAddingBot: currentlyAddingBot => set({ currentlyAddingBot }),
  setCurrentlyAddingServer: currentlyAddingServer => set({ currentlyAddingServer }),
  setCurrentlyAddingSound: currentlyAddingSound => set({ currentlyAddingSound }),
  setCurrentlyAddingTheme: currentlyAddingTheme => set({ currentlyAddingTheme }),
  setData: data => set({ data }),
  setIsCollapsed: isCollapsed => set({ isCollapsed })
}));

export default useAccountStore;