import fetchTemplates from '@/lib/request/templates/fetchTemplates';
import { toast } from 'sonner';
import { create } from 'zustand';

const useSearchStore = create((set, get) => ({
  category: 'All',
  fetchTemplates: async (search, page, limit, category, sort) => {
    if (page) set({ page });
    if (limit) set({ limit });
    if (category) set({ category });
    if (sort) set({ sort });

    set({ loading: true, search });

    fetchTemplates(search, get().page, get().limit, get().category, get().sort)
      .then(data => set({ loading: false, maxReached: data.maxReached, templates: data.templates, total: data.total }))
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

    get().fetchTemplates(get().search);
  },
  setLimit: limit => set({ limit }),
  setLoading: loading => set({ loading }),
  setPage: page => set({ page }),
  setSearch: search => set({ search }),
  setSort: sort => {
    set({ page: 1, sort });

    get().fetchTemplates(get().search);
  },
  setTemplates: templates => set({ templates }),
  setTotal: total => set({ total }),
  sort: 'Popular',
  templates: [],
  total: 0
}));

export default useSearchStore;