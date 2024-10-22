import { create } from 'zustand';
import { toast } from 'sonner';
import fetchTemplates from '@/lib/request/templates/fetchTemplates';

const useSearchStore = create((set, get) => ({
  loading: true,
  setLoading: loading => set({ loading }),
  search: '',
  setSearch: search => set({ search }),
  sort: 'Popular',
  setSort: sort => {
    set({ sort, page: 1 });

    get().fetchTemplates(get().search);
  },
  category: 'All',
  setCategory: category => {
    set({ category, page: 1 });

    get().fetchTemplates(get().search);
  },
  page: 1,
  setPage: page => set({ page }),
  limit: 9,
  setLimit: limit => set({ limit }),
  templates: [],
  setTemplates: templates => set({ templates }),
  total: 0,
  setTotal: total => set({ total }),
  maxReached: false,
  fetchTemplates: async (search, page, limit, category, sort) => {
    if (page) set({ page });
    if (limit) set({ limit });
    if (category) set({ category });
    if (sort) set({ sort });

    set({ loading: true, search });

    fetchTemplates(search, get().page, get().limit, get().category, get().sort)
      .then(data => set({ templates: data.templates, loading: false, maxReached: data.maxReached, total: data.total }))
      .catch(error => {
        toast.error(error);
        set({ loading: false });
      });
  }
}));

export default useSearchStore;