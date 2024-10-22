import fetchData from '@/lib/request/dashboard/getData';
import { toast } from 'sonner';
import { create } from 'zustand';

export const useDashboardStore = create(set => ({
  activeTab: 'home',
  data: {},
  fetchData: async keys => {
    set({ loading: true, searchQuery: null });

    fetchData(keys)
      .then(data => set({ data, loading: false }))
      .catch(error => {
        toast.error(error);
        set({ loading: false });
      });
  },
  isCollapsed: false,
  loading: true,
  searchQuery: null,
  selectedItems: [],
  setActiveTab: activeTab => set({ activeTab }),
  setData: data => set({ data }),
  setIsCollapsed: isCollapsed => set({ isCollapsed }),
  setLoading: loading => set({ loading }),
  setSearchQuery: searchQuery => set({ searchQuery }),
  setSelectedItems: selectedItems => set({ selectedItems })
}));

export default useDashboardStore;