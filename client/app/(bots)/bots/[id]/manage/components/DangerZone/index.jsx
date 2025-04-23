'use client';

import { RiErrorWarningFill } from '@/icons';
import { toast } from 'sonner';
import useModalsStore from '@/stores/modals';
import { useShallow } from 'zustand/react/shallow';
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
      error: () => enableButton('delete-bot', 'confirm')
    });
  }

  return (
    <div className='flex w-full flex-col gap-y-4'>
      <h3 className='flex items-center gap-x-4 text-xl font-semibold'>
        <RiErrorWarningFill size={24} className='text-red-500' />
        {t('botManagePage.dangerZone.title')}
      </h3>

      <p className='text-tertiary'>
        {t('botManagePage.dangerZone.subtitle')}
      </p>

      <button
        className='w-max rounded-xl bg-black px-4 py-1.5 text-sm font-semibold text-white hover:bg-black/70 dark:bg-white dark:text-black dark:hover:bg-white/70'
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