import fetchEmojis from '@/lib/request/emojis/fetchEmojis';
import { toast } from 'sonner';
import { create } from 'zustand';

const useSearchStore = create((set, get) => ({
  category: 'All',
  emojis: [],
  fetchEmojis: async search => {
    const page = get().page;
    const limit = get().limit;
    const category = get().category;
    const sort = get().sort;

    set({ loading: true, search });

    fetchEmojis(search, category, sort, page, limit)
      .then(data => set({ emojis: data.emojis, loading: false, maxReached: data.maxReached, total: data.total, totalEmojis: data.totalEmojis }))
      .catch(error => {
        toast.error(error);
        set({ loading: false });
      });
  },
  limit: 12,
  loading: true,
  maxReached: false,
  page: 1,
  search: '',
  setCategory: category => {
    set({ category, page: 1 });

    get().fetchEmojis(get().search);
  },
  setEmojis: emojis => set({ emojis }),
  setLimit: limit => set({ limit }),
  setLoading: loading => set({ loading }),
  setPage: page => set({ page }),
  setSearch: search => set({ search }),
  setSort: sort => {
    set({ page: 1, sort });

    get().fetchEmojis(get().search);
  },
  sort: 'Newest',
  total: 0,
  totalEmojis: 0
}));

export default useSearchStore;