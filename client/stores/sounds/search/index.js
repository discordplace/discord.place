import { create } from 'zustand';
import { toast } from 'sonner';
import fetchSounds from '@/lib/request/sounds/fetchSounds';

const useSearchStore = create((set, get) => ({
  loading: true,
  setLoading: loading => set({ loading }),
  search: '',
  setSearch: search => set({ search }),
  sort: 'Newest',
  setSort: sort => {
    set({ sort, page: 1 });

    get().fetchSounds(get().search);
  },
  category: 'All',
  setCategory: category => {
    set({ category, page: 1 });
  
    get().fetchSounds(get().search);
  },
  page: 1,
  setPage: page => set({ page }),
  limit: 9,
  setLimit: limit => set({ limit }),
  sounds: [],
  setSounds: sounds => set({ sounds }),
  totalSounds: 0,
  maxReached: false,
  fetchSounds: async (search, page, limit, category, sort) => {
    if (page) set({ page });
    if (limit) set({ limit });
    if (category) set({ category });
    if (sort) set({ sort });

    set({ loading: true, search });
    
    fetchSounds(search, get().page, get().limit, get().category, get().sort)
      .then(data => set({ sounds: data.sounds, loading: false, maxReached: data.maxReached, totalSounds: data.total }))
      .catch(error => {
        toast.error(error);
        set({ loading: false });
      });
  }
}));

export default useSearchStore;