import fetchServers from '@/lib/request/servers/fetchServers';
import { toast } from 'sonner';
import { create } from 'zustand';

const useSearchStore = create((set, get) => ({
  category: 'All',
  currentDataType: 'votes',
  fetchServers: async (search, page, limit, category, sort) => {
    if (page) set({ page });
    if (limit) set({ limit });
    if (category) set({ category });
    if (sort) set({ sort });

    set({ loading: true, search });

    fetchServers(search, get().page, get().limit, get().category, get().sort)
      .then(data => set({ loading: false, maxReached: data.maxReached, servers: data.servers, totalServers: data.total }))
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
  servers: [],
  setCategory: category => {
    set({ category, page: 1 });

    get().fetchServers(get().search);
  },
  setCurrentDataType: currentDataType => set({ currentDataType }),
  setLimit: limit => set({ limit }),
  setLoading: loading => set({ loading }),
  setPage: page => set({ page }),
  setSearch: search => set({ search }),
  setServers: servers => set({ servers }),
  setSort: sort => {
    set({ page: 1, sort });

    get().fetchServers(get().search);
  },
  setTotalServers: totalServers => set({ totalServers }),
  sort: 'Votes',
  totalServers: 0
}));

export default useSearchStore;