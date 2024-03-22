import { create } from 'zustand';
import { toast } from 'sonner';
import fetchEmojis from '@/lib/request/emojis/fetchEmojis';

const useSearchStore = create((set, get) => ({
  loading: true,
  setLoading: loading => set({ loading }),
  search: '',
  setSearch: search => set({ search }),
  page: 1,
  setPage: page => set({ page }),
  limit: 12,
  setLimit: limit => set({ limit }),
  emojis: [],
  setEmojis: emojis => set({ emojis }),
  totalEmojis: 0,
  total: 0,
  maxReached: false,
  fetchEmojis: async (search) => {
    const page = get().page;
    const limit = get().limit;
    const category = get().category;
    const sort = get().sort;

    set({ loading: true, search });
    
    fetchEmojis(search, category, sort, page, limit)
      .then(data => set({ emojis: data.emojis, loading: false, totalEmojis: data.totalEmojis, total: data.total, maxReached: data.maxReached }))
      .catch(error => {
        toast.error(error);
        set({ loading: false });
      });
  },
  category: 'All',
  setCategory: category => set({ category }),
  sort: 'Newest',
  setSort: sort => set({ sort }),
}));

export default useSearchStore;