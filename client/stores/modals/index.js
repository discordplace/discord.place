import { create } from 'zustand';

const useModalsStore = create((set, get) => ({
  activeModalId: null,
  closeModal: modalId => {
    const { openedModals } = get();
    const { activeModalId } = get();
    const modal = openedModals.find(modal => modal.id === modalId);

    if (modalId === activeModalId && openedModals.length > 1) {
      const lastModal = openedModals[openedModals.length - 2];
      set({ activeModalId: lastModal.id });
    }

    modal.data?.events?.onClose?.();

    set({ openedModals: openedModals.filter(({ id }) => id !== modalId) });
  },
  disableButton: (modalId, buttonId) => {
    const { openedModals } = get();

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
    const { openedModals } = get();

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
  },
  openedModals: [],
  openModal: (modalId, modalData) => {
    const { openedModals } = get();

    set({
      activeModalId: modalId,
      openedModals: [...openedModals, { data: modalData, id: modalId }]
    });
  },
  updateModal: (modalId, newModalData) => {
    const { openedModals } = get();

    set({
      openedModals: openedModals.map(modal => {
        if (modal.id === modalId) {
          return {
            ...modal,
            data: {
              ...modal.data,
              ...newModalData
            }
          };
        }

        return modal;
      })
    });
  }
}));

export default useModalsStore;