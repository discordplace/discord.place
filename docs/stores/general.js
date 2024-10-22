import { create } from 'zustand';

export const useGeneralStore = create(set => ({
  activeEndpoint: 'update-bot-stats',
  headings: [],
  setActiveEndpoint: newEndpoint => set({ activeEndpoint: newEndpoint }),
  setHeadings: newHeadings => set({ headings: newHeadings })
}));