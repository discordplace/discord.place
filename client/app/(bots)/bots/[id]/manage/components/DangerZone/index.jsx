'use client';

import { toast } from 'sonner';
import useModalsStore from '@/stores/modals';
import { useShallow } from 'zustand/react/shallow';
import { RiErrorWarningFill } from 'react-icons/ri';
import deleteBot from '@/lib/request/bots/deleteBot';
import { useRouter } from 'next-nprogress-bar';

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
      loading: 'Bot deleting..',
      success: () => {
        closeModal('delete-bot');
        setTimeout(() => router.push('/'), 3000);
        
        return 'Successfully deleted the bot. You will be redirected to the home page in a few seconds.';
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
        Danger Zone

      </h3>

      <p className='text-tertiary'>
        You can delete your bot here. Please be careful with this action. This action cannot be undone.
      </p>

      <button
        className='px-4 py-1.5 text-sm font-semibold text-white bg-black rounded-xl w-max dark:bg-white dark:text-black dark:hover:bg-white/70 hover:bg-black/70'
        onClick={() => 
          openModal('delete-bot', {
            title: 'Delete Bot',
            description: 'Are you sure you want to delete?',
            content: (
              <p className='text-sm text-tertiary'>
                Please note that deleting your bot will remove all votes and reviews that your bot has received.<br/><br/>
                This action cannot be undone.
              </p>
            ),
            buttons: [
              {
                id: 'cancel',
                label: 'Cancel',
                variant: 'ghost',
                actionType: 'close'
              },
              {
                id: 'confirm',
                label: 'Confirm',
                variant: 'solid',
                action: continueDeleteBot
              }
            ]
          })
        }
      >
        Delete
      </button>
    </div>
  );
}