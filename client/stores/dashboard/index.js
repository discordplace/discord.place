import { toast } from 'sonner';
import { create } from 'zustand';
import fetchData from '@/lib/request/dashboard/getData';

export const useDashboardStore = create(set => ({
  activeTab: 'home',
  setActiveTab: activeTab => set({ activeTab }),
  data: {},
  setData: data => set({ data }),
  loading: true,
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
  setIsCollapsed: isCollapsed => set({ isCollapsed })
}));

export default useDashboardStore;