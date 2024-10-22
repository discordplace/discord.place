import fetchThemes from '@/lib/request/themes/fetchThemes';
import { toast } from 'sonner';
import { create } from 'zustand';

const useSearchStore = create((set, get) => ({
  category: 'All',
  fetchThemes: async (search, page, limit, category, sort) => {
    if (page) set({ page });
    if (limit) set({ limit });
    if (category) set({ category });
    if (sort) set({ sort });

    set({ loading: true, search });

    fetchThemes(search, get().page, get().limit, get().category, get().sort)
      .then(data => set({ loading: false, maxReached: data.maxReached, themes: data.themes, totalThemes: data.total }))
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

    get().fetchThemes(get().search);
  },
  setLimit: limit => set({ limit }),
  setLoading: loading => set({ loading }),
  setPage: page => set({ page }),
  setSearch: search => set({ search }),
  setSort: sort => {
    set({ page: 1, sort });

    get().fetchThemes(get().search);
  },
  setThemes: themes => set({ themes }),
  sort: 'Newest',
  themes: [],
  totalThemes: 0
}));

export default useSearchStore;