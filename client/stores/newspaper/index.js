import { create } from 'zustand';

export const useNewspaperStore = create(set => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen })
}));