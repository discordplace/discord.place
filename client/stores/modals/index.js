import { create } from 'zustand';

const useModalsStore = create((set, get) => ({
  activeModalId: null,
  openedModals: [],
  openModal: (modalId, modalData) => {
    const openedModals = get().openedModals;
    
    set({
      activeModalId: modalId,
      openedModals: [...openedModals, { id: modalId, data: modalData }]
    });
  },
  closeModal: modalId => {
    const openedModals = get().openedModals;
    const activeModalId = get().activeModalId;

    if (modalId === activeModalId && openedModals.length > 1) {
      const lastModal = openedModals[openedModals.length - 2];
      set({ activeModalId: lastModal.id });
    }

    set({ openedModals: openedModals.filter(modal => modal.id !== modalId) });
  },
  disableButton: (modalId, buttonId) => {
    const openedModals = get().openedModals;

    set({ 
      openedModals: openedModals.map(modal => {
        if (modal.id === modalId) {
          return {
            ...modal,
            data: {
              ...modal.data,
              buttons: modal.data.buttons.map(button => {
                if (button.id === buttonId) return { ...button, disabled: true };
                return button;
              })
            }
          };
        }

        return modal;
      }) 
    });
  },
  enableButton: (modalId, buttonId) => {
    const openedModals = get().openedModals;

    set({ 
      openedModals: openedModals.map(modal => {
        if (modal.id === modalId) {
          return {
            ...modal,
            data: {
              ...modal.data,
              buttons: modal.data.buttons.map(button => {
                if (button.id === buttonId) return { ...button, disabled: false };
                return button;
              })
            }
          };
        }

        return modal;
      }) 
    });
  }
}));

export default useModalsStore;