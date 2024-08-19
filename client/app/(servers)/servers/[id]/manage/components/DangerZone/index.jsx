'use client';

import { toast } from 'sonner';
import useModalsStore from '@/stores/modals';
import { useShallow } from 'zustand/react/shallow';
import { RiErrorWarningFill } from 'react-icons/ri';
import deleteServer from '@/lib/request/servers/deleteServer';
import { useRouter } from 'next-nprogress-bar';
import { t } from '@/stores/language';

export default function DangerZone({ serverId }) {
  const { openModal, disableButton, enableButton, closeModal } = useModalsStore(useShallow(state => ({
    openModal: state.openModal,
    disableButton: state.disableButton,
    enableButton: state.enableButton,
    closeModal: state.closeModal
  })));

  const router = useRouter();

  async function continueDeleteServer() {
    disableButton('delete-server', 'confirm');

    toast.promise(deleteServer(serverId), {
      loading: t('serverManagePage.dangerZone.toast.deletingServer'),
      success: () => {
        closeModal('delete-server');
        setTimeout(() => router.push('/'), 3000);
        
        return t('serverManagePage.dangerZone.toast.serverDeleted');
      },
      error: error => {
        enableButton('delete-server', 'confirm');

        return error;
      }
    });
  }

  return (
    <div className='flex flex-col w-full gap-y-4'>
      <h3 className='flex items-center text-xl font-semibold gap-x-4'>
        <RiErrorWarningFill size={24} className='text-red-500' />
        {t('serverManagePage.dangerZone.title')}
      </h3>

      <p className='text-tertiary'>
        {t('serverManagePage.dangerZone.subtitle')}
      </p>

      <button
        className='px-4 py-1.5 text-sm font-semibold text-white bg-black rounded-xl w-max dark:bg-white dark:text-black dark:hover:bg-white/70 hover:bg-black/70'
        onClick={() => 
          openModal('delete-server', {
            title: t('serverManagePage.dangerZone.deleteServerModal.title'),
            description: t('serverManagePage.dangerZone.deleteServerModal.description'),
            content: (
              <p className='text-sm text-tertiary'>
                {t('serverManagePage.dangerZone.deleteServerModal.note', { br: <br /> })}
              </p>
            ),
            buttons: [
              {
                id: 'cancel',
                label: t('buttons.cancel'),
                variant: 'ghost',
                actionType: 'close'
              },
              {
                id: 'confirm',
                label: t('buttons.confirm'),
                variant: 'solid',
                action: continueDeleteServer
              }
            ]
          })
        }
      >
        {t('buttons.delete')}
      </button>
    </div>
  );
}