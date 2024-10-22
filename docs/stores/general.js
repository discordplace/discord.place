import { create } from 'zustand';

export const useGeneralStore = create(set => ({
  activeEndpoint: 'update-bot-stats',
  setActiveEndpoint: newEndpoint => set({ activeEndpoint: newEndpoint }),
  headings: [],
  setHeadings: newHeadings => set({ headings: newHeadings })
}));