import { create } from 'zustand';
import { toast } from 'sonner';
import fetchThemes from '@/lib/request/themes/fetchThemes';

const useSearchStore = create((set, get) => ({
  loading: true,
  setLoading: loading => set({ loading }),
  search: '',
  setSearch: search => set({ search }),
  sort: 'Newest',
  setSort: sort => {
    set({ sort, page: 1 });

    get().fetchThemes(get().search);
  },
  category: 'All',
  setCategory: category => {
    set({ category, page: 1 });
  
    get().fetchThemes(get().search);
  },
  page: 1,
  setPage: page => set({ page }),
  limit: 12,
  setLimit: limit => set({ limit }),
  themes: [],
  setThemes: themes => set({ themes }),
  totalThemes: 0,
  maxReached: false,
  fetchThemes: async (search, page, limit, category, sort) => {
    if (page) set({ page });
    if (limit) set({ limit });
    if (category) set({ category });
    if (sort) set({ sort });

    set({ loading: true, search });
    
    fetchThemes(search, get().page, get().limit, get().category, get().sort)
      .then(data => set({ themes: data.themes, loading: false, maxReached: data.maxReached, totalThemes: data.total }))
      .catch(error => {
        toast.error(error);
        set({ loading: false });
      });
  }
}));

export default useSearchStore;