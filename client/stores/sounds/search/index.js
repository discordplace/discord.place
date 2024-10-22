import fetchSounds from '@/lib/request/sounds/fetchSounds';
import { toast } from 'sonner';
import { create } from 'zustand';

const useSearchStore = create((set, get) => ({
  category: 'All',
  fetchSounds: async (search, page, limit, category, sort) => {
    if (page) set({ page });
    if (limit) set({ limit });
    if (category) set({ category });
    if (sort) set({ sort });

    set({ loading: true, search });

    fetchSounds(search, get().page, get().limit, get().category, get().sort)
      .then(data => set({ loading: false, maxReached: data.maxReached, sounds: data.sounds, totalSounds: data.total }))
      .catch(error => {
        toast.error(error);
        set({ loading: false });
      });
  },
  limit: 9,
  loading: true,
  maxReached: false,
  page: 1,
  search: '',
  setCategory: category => {
    set({ category, page: 1 });

    get().fetchSounds(get().search);
  },
  setLimit: limit => set({ limit }),
  setLoading: loading => set({ loading }),
  setPage: page => set({ page }),
  setSearch: search => set({ search }),
  setSort: sort => {
    set({ page: 1, sort });

    get().fetchSounds(get().search);
  },
  setSounds: sounds => set({ sounds }),
  sort: 'Newest',
  sounds: [],
  totalSounds: 0
}));

export default useSearchStore;