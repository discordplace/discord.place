import fetchPresences from '@/lib/request/profiles/fetchPresences';
import fetchProfiles from '@/lib/request/profiles/fetchProfiles';
import { toast } from 'sonner';
import { create } from 'zustand';

const useSearchStore = create((set, get) => ({
  count: 0,
  fetchProfiles: async search => {
    const page = get().page;
    const limit = get().limit;
    const sort = get().sort;

    set({ loading: true, search });

    fetchProfiles(search, page, limit, sort)
      .then(data => {
        set({ count: data.count, loading: false, maxReached: data.maxReached, profiles: data.profiles, totalProfiles: data.total });

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
  },
  limit: 9,
  loading: true,
  maxReached: false,
  page: 1,
  presences: [],
  profiles: [],
  search: '',
  setLimit: limit => set({ limit }),
  setLoading: loading => set({ loading }),
  setPage: page => set({ page }),
  setProfiles: profiles => set({ profiles }),
  setSearch: search => set({ search }),
  setSort: sort => {
    set({ page: 1, sort });

    get().fetchProfiles(get().search);
  },
  sort: 'Likes',
  totalProfiles: 0
}));

export default useSearchStore;