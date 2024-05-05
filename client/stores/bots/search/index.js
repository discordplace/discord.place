import { create } from 'zustand';
import { toast } from 'sonner';
import fetchBots from '@/lib/request/bots/fetchBots';

const useSearchStore = create((set, get) => ({
  loading: true,
  setLoading: loading => set({ loading }),
  category: null,
  setCategory: category => {
    set({ category, page: 1 });

    get().fetchBots(category);
  },
  page: 1,
  setPage: page => set({ page }),
  limit: 12,
  setLimit: limit => set({ limit }),
  bots: [],
  setBots: bots => set({ bots }),
  total: 0,
  setTotal: total => set({ total }),
  maxReached: false,
  fetchBots: async category => {
    const page = get().page;
    const limit = get().limit;

    set({ loading: true });
    
    fetchBots(category, page, limit)
      .then(data => set({ bots: data.bots, loading: false, maxReached: data.maxReached, total: data.total }))
      .catch(error => {
        toast.error(error);
        set({ loading: false });
      });
  }
}));

export default useSearchStore;