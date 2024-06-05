'use client';

import { toast } from 'sonner';
import deleteProfile from '@/lib/request/profiles/deleteProfile';
import { RiErrorWarningFill } from 'react-icons/ri';
import useModalsStore from '@/stores/modals';
import { useShallow } from 'zustand/react/shallow';
import { useRouter } from 'next-nprogress-bar';

export default function DangerZone({ profile }) {
  const router = useRouter();

  const { openModal, disableButton, enableButton, closeModal } = useModalsStore(useShallow(state => ({
    openModal: state.openModal,
    disableButton: state.disableButton,
    enableButton: state.enableButton,
    closeModal: state.closeModal
  })));

  function continueDeleteProfile() {
    disableButton('delete-profile', 'confirm');
    
    toast.promise(deleteProfile(profile.slug), {
      loading: 'Deleting profile..',
      success: () => {
        closeModal();
        setTimeout(() => router.push('/'), 3000);

        return 'Profile has been deleted! You will be redirected to home page after 3 seconds.'; 
      },
      error: message => {
        enableButton('delete-profile', 'confirm');
        return message;
      }
    });
  }

  return (
    <div className='flex flex-col p-4 border border-red-500 gap-y-2 bg-red-500/10 rounded-xl'>
      <h1 className='text-lg text-primary flex items-center font-semibold gap-x-1.5'>
        <RiErrorWarningFill />
        Danger Zone
      </h1>
      <p className='text-sm font-medium text-tertiary'> 
        You can delete the your profile using the button below, but be careful not to delete it by mistake :)
      </p>
    
      <div className='flex mt-1 gap-x-2'>
        <button
          className='px-3 py-1 text-sm font-medium text-white bg-black rounded-lg w-max dark:bg-white dark:text-black dark:hover:bg-white/70 hover:bg-black/70'
          onClick={() =>
            openModal('delete-profile', {
              title: 'Delete Profile',
              description: 'Are you sure you want to delete your profile?',
              content: (
                <p className='text-sm text-tertiary'>
                  Please note that deleting your profile will remove all your social links and likes that your profile has received.<br/><br/>
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
                  action: continueDeleteProfile
                }
              ]
            })
          }
        >
          Delete
        </button>
      </div>
    </div>
  );
}