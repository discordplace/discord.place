import { toast } from 'sonner';
import { create } from 'zustand';
import fetchData from '@/lib/request/dashboard/getData';

export const useDashboardStore = create(set => ({
  activeTab: 'home',
  currentSort: { key: '', name: '', order: '' },
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
  page: 1,
  searchQuery: null,
  selectedItems: [],
  setActiveTab: activeTab => set({ activeTab }),
  setCurrentSort: currentSort => set({ currentSort }),
  setData: data => set({ data }),
  setIsCollapsed: isCollapsed => set({ isCollapsed }),
  setLoading: loading => set({ loading }),
  setPage: page => set({ page }),
  setSearchQuery: searchQuery => set({ searchQuery }),
  setSelectedItems: selectedItems => set({ selectedItems })
}));

export default useDashboardStore;