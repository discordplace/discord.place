import { create } from 'zustand';
import { toast } from 'sonner';
import fetchBots from '@/lib/request/bots/fetchBots';
import config from '@/config';

const useSearchStore = create((set, get) => ({
  loading: true,
  setLoading: loading => set({ loading }),
  search: '',
  setSearch: search => set({ search }),
  sort: 'Votes',
  setSort: sort => {
    set({ sort, page: 1 });

    get().fetchBots(get().search);
  },
  category: 'All',
  setCategory: category => {
    set({ category, page: 1 });
  
    get().fetchBots(get().search);
  },
  page: 1,
  setPage: page => set({ page }),
  limit: config.showStandoutProductAds ? 12 : 11,
  setLimit: limit => set({ limit }),
  bots: [],
  setBots: bots => set({ bots }),
  total: 0,
  setTotal: total => set({ total }),
  maxReached: false,
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
  }
}));

export default useSearchStore;