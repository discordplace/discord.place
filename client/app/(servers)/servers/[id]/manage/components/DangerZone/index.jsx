'use client';

import deleteServer from '@/lib/request/servers/deleteServer';
import { t } from '@/stores/language';
import useModalsStore from '@/stores/modals';
import { useRouter } from 'next-nprogress-bar';
import { RiErrorWarningFill } from 'react-icons/ri';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

export default function DangerZone({ serverId }) {
  const { closeModal, disableButton, enableButton, openModal } = useModalsStore(useShallow(state => ({
    closeModal: state.closeModal,
    disableButton: state.disableButton,
    enableButton: state.enableButton,
    openModal: state.openModal
  })));

  const router = useRouter();

  async function continueDeleteServer() {
    disableButton('delete-server', 'confirm');

    toast.promise(deleteServer(serverId), {
      error: error => {
        enableButton('delete-server', 'confirm');

        return error;
      },
      loading: t('serverManagePage.dangerZone.toast.deletingServer'),
      success: () => {
        closeModal('delete-server');
        setTimeout(() => router.push('/'), 3000);

        return t('serverManagePage.dangerZone.toast.serverDeleted');
      }
    });
  }

  return (
    <div className='flex w-full flex-col gap-y-4'>
      <h3 className='flex items-center gap-x-4 text-xl font-semibold'>
        <RiErrorWarningFill className='text-red-500' size={24} />
        {t('serverManagePage.dangerZone.title')}
      </h3>

      <p className='text-tertiary'>
        {t('serverManagePage.dangerZone.subtitle')}
      </p>

      <button
        className='w-max rounded-xl bg-black px-4 py-1.5 text-sm font-semibold text-white hover:bg-black/70 dark:bg-white dark:text-black dark:hover:bg-white/70'
        onClick={() =>
          openModal('delete-server', {
            buttons: [
              {
                actionType: 'close',
                id: 'cancel',
                label: t('buttons.cancel'),
                variant: 'ghost'
              },
              {
                action: continueDeleteServer,
                id: 'confirm',
                label: t('buttons.confirm'),
                variant: 'solid'
              }
            ],
            content: (
              <p className='text-sm text-tertiary'>
                {t('serverManagePage.dangerZone.deleteServerModal.note', { br: <br /> })}
              </p>
            ),
            description: t('serverManagePage.dangerZone.deleteServerModal.description'),
            title: t('serverManagePage.dangerZone.deleteServerModal.title')
          })
        }
      >
        {t('buttons.delete')}
      </button>
    </div>
  );
}