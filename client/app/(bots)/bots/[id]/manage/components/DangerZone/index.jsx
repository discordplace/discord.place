'use client';

import deleteBot from '@/lib/request/bots/deleteBot';
import { t } from '@/stores/language';
import useModalsStore from '@/stores/modals';
import { useRouter } from 'next-nprogress-bar';
import { RiErrorWarningFill } from 'react-icons/ri';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

export default function DangerZone({ botId }) {
  const { closeModal, disableButton, enableButton, openModal } = useModalsStore(useShallow(state => ({
    closeModal: state.closeModal,
    disableButton: state.disableButton,
    enableButton: state.enableButton,
    openModal: state.openModal
  })));

  const router = useRouter();

  async function continueDeleteBot() {
    disableButton('delete-bot', 'confirm');

    toast.promise(deleteBot(botId), {
      error: error => {
        enableButton('delete-bot', 'confirm');

        return error;
      },
      loading: t('botManagePage.dangerZone.toast.deletingBot'),
      success: () => {
        closeModal('delete-bot');
        setTimeout(() => router.push('/'), 3000);

        return t('botManagePage.dangerZone.toast.botDeleted');
      }
    });
  }

  return (
    <div className='flex w-full flex-col gap-y-4'>
      <h3 className='flex items-center gap-x-4 text-xl font-semibold'>
        <RiErrorWarningFill className='text-red-500' size={24} />
        {t('botManagePage.dangerZone.title')}
      </h3>

      <p className='text-tertiary'>
        {t('botManagePage.dangerZone.subtitle')}
      </p>

      <button
        className='w-max rounded-xl bg-black px-4 py-1.5 text-sm font-semibold text-white hover:bg-black/70 dark:bg-white dark:text-black dark:hover:bg-white/70'
        onClick={() =>
          openModal('delete-bot', {
            buttons: [
              {
                actionType: 'close',
                id: 'cancel',
                label: t('buttons.cancel'),
                variant: 'ghost'
              },
              {
                action: continueDeleteBot,
                id: 'confirm',
                label: t('buttons.confirm'),
                variant: 'solid'
              }
            ],
            content: (
              <p className='text-sm text-tertiary'>
                {t('botManagePage.dangerZone.deleteBotModal.note', { br: <br /> })}
              </p>
            ),
            description: t('botManagePage.dangerZone.deleteBotModal.description'),
            title: t('botManagePage.dangerZone.deleteBotModal.title')
          })
        }
      >
        {t('buttons.delete')}
      </button>
    </div>
  );
}