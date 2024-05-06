import { create } from 'zustand';

const useManageStore = create(set => ({
  selectedBot: null,
  setSelectedBot: selectedBot => set({ selectedBot })
  
}));

export default useManageStore;