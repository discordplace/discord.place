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
  limit: 12,
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
  totalServers: 0,
  setTotalServers: totalServers => set({ totalServers }),
  fetchServers: async (search, page, limit, category, sort) => {
    if (page) set({ page });
    if (limit) set({ limit });
    if (category) set({ category });
    if (sort) set({ sort });

    set({ loading: true, search });
    
    fetchServers(search, get().page, get().limit, get().category, get().sort)
      .then(data => set({ servers: data.servers, loading: false, maxReached: data.maxReached, totalServers: data.total }))
      .catch(error => {
        toast.error(error);
        set({ loading: false });
      });
  },
  currentDataType: 'votes',
  setCurrentDataType: currentDataType => set({ currentDataType })
}));

export default useSearchStore;