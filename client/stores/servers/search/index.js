import { create } from 'zustand';
import { toast } from 'sonner';
import fetchServers from '@/lib/request/servers/fetchServers';

const useSearchStore = create((set, get) => ({
  loading: true,
  setLoading: loading => set({ loading }),
  search: '',
  setSearch: search => set({ search }),
  page: 1,
  setPage: page => set({ page }),
  limit: 9,
  setLimit: limit => set({ limit }),
  category: 'All',
  setCategory: category => {
    set({ category, page: 1 });
  
    get().fetchServers(get().search);
  },
  sort: 'Votes',
  setSort: sort => {
    set({ sort, page: 1 });

    get().fetchServers(get().search);
  },
  servers: [],
  setServers: servers => set({ servers }),
  maxReached: false,
  fetchServers: async (search) => {
    const page = get().page;
    const limit = get().limit;
    const category = get().category;
    const sort = get().sort;

    set({ loading: true, search });
    
    fetchServers(search, page, limit, category, sort)
      .then(data => set({ servers: data.servers, loading: false, maxReached: data.maxReached }))
      .catch(error => {
        toast.error(error);
        set({ loading: false });
      });
  },
  currentDataType: 'votes',
  setCurrentDataType: currentDataType => set({ currentDataType })
}));

export default useSearchStore;