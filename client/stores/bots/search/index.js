import fetchBots from '@/lib/request/bots/fetchBots';
import { toast } from 'sonner';
import { create } from 'zustand';

const useSearchStore = create((set, get) => ({
  bots: [],
  category: 'All',
  fetchBots: async (search, page, limit, category, sort) => {
    if (page) set({ page });
    if (limit) set({ limit });
    if (category) set({ category });
    if (sort) set({ sort });

    set({ loading: true, search });

    fetchBots(search, get().page, get().limit, get().category, get().sort)
      .then(data => set({ bots: data.bots, loading: false, maxReached: data.maxReached, total: data.total }))
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
  setBots: bots => set({ bots }),
  setCategory: category => {
    set({ category, page: 1 });

    get().fetchBots(get().search);
  },
  setLimit: limit => set({ limit }),
  setLoading: loading => set({ loading }),
  setPage: page => set({ page }),
  setSearch: search => set({ search }),
  setSort: sort => {
    set({ page: 1, sort });

    get().fetchBots(get().search);
  },
  setTotal: total => set({ total }),
  sort: 'Votes',
  total: 0
}));

export default useSearchStore;