'use client';

import { toast } from 'sonner';
import useModalsStore from '@/stores/modals';
import { useShallow } from 'zustand/react/shallow';
import { RiErrorWarningFill } from 'react-icons/ri';
import deleteBot from '@/lib/request/bots/deleteBot';
import { useRouter } from 'next-nprogress-bar';
import { t } from '@/stores/language';

export default function DangerZone({ botId }) {
  const { openModal, disableButton, enableButton, closeModal } = useModalsStore(useShallow(state => ({
    openModal: state.openModal,
    disableButton: state.disableButton,
    enableButton: state.enableButton,
    closeModal: state.closeModal
  })));

  const router = useRouter();

  async function continueDeleteBot() {
    disableButton('delete-bot', 'confirm');

    toast.promise(deleteBot(botId), {
      loading: t('botManagePage.dangerZone.toast.deletingBot'),
      success: () => {
        closeModal('delete-bot');
        setTimeout(() => router.push('/'), 3000);
        
        return t('botManagePage.dangerZone.toast.botDeleted');
      },
      error: error => {
        enableButton('delete-bot', 'confirm');

        return error;
      }
    });
  }

  return (
    <div className='flex flex-col w-full gap-y-4'>
      <h3 className='flex items-center text-xl font-semibold gap-x-4'>
        <RiErrorWarningFill size={24} className='text-red-500' />
        {t('botManagePage.dangerZone.title')}
      </h3>

      <p className='text-tertiary'>
        {t('botManagePage.dangerZone.subtitle')}
      </p>

      <button
        className='px-4 py-1.5 text-sm font-semibold text-white bg-black rounded-xl w-max dark:bg-white dark:text-black dark:hover:bg-white/70 hover:bg-black/70'
        onClick={() => 
          openModal('delete-bot', {
            title: t('botManagePage.dangerZone.deleteBotModal.title'),
            description: t('botManagePage.dangerZone.deleteBotModal.description'),
            content: (
              <p className='text-sm text-tertiary'>
                {t('botManagePage.dangerZone.deleteBotModal.note', { br: <br /> })}
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
                action: continueDeleteBot
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