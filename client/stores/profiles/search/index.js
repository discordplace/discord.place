import { create } from 'zustand';
import { toast } from 'sonner';
import fetchProfiles from '@/lib/request/profiles/fetchProfiles';
import fetchPresences from '@/lib/request/profiles/fetchPresences';

const useSearchStore = create((set, get) => ({
  loading: true,
  setLoading: loading => set({ loading }),
  search: '',
  setSearch: search => set({ search }),
  page: 1,
  setPage: page => set({ page }),
  limit: 9,
  setLimit: limit => set({ limit }),
  profiles: [],
  setProfiles: profiles => set({ profiles }),
  totalProfiles: 0,
  count: 0,
  maxReached: false,
  presences: [],
  fetchProfiles: async search => {
    const page = get().page;
    const limit = get().limit;

    set({ loading: true, search });
    
    fetchProfiles(search, page, limit)
      .then(data => {
        set({ profiles: data.profiles, loading: false, totalProfiles: data.total, maxReached: data.maxReached, count: data.count });

        if (data.profiles.length > 0) {
          const userIds = data.profiles.map(profile => profile.id);
          
          fetchPresences(userIds)
            .then(presences => set({ presences }))
            .catch(error => toast.error(error));
        }
      })
      .catch(error => {
        toast.error(error);
        set({ loading: false });
      });
  }
}));

export default useSearchStore;