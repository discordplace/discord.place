'use client';

import { RiErrorWarningFill } from '@/icons';
import { toast } from 'sonner';
import deleteProfile from '@/lib/request/profiles/deleteProfile';
import useModalsStore from '@/stores/modals';
import { useShallow } from 'zustand/react/shallow';
import { t } from '@/stores/language';

export default function DangerZone({ profile }) {
  const { openModal, disableButton, enableButton, closeModal } = useModalsStore(useShallow(state => ({
    openModal: state.openModal,
    disableButton: state.disableButton,
    enableButton: state.enableButton,
    closeModal: state.closeModal
  })));

  function continueDeleteProfile() {
    disableButton('delete-profile', 'confirm');

    toast.promise(deleteProfile(profile.slug), {
      loading: t('editProfilePage.toast.deletingProfile'),
      success: () => {
        closeModal('delete-profile');

        // Immediately redirect to /profiles after deleting the profile
        window.location.href = '/profiles';

        return t('editProfilePage.toast.profileDeleted');
      },
      error: error => {
        enableButton('delete-profile', 'confirm');

        return error;
      }
    });
  }

  return (
    <div className='flex flex-col gap-y-2 rounded-xl border border-red-500 bg-red-500/10 p-4'>
      <h1 className='flex items-center gap-x-1.5 text-lg font-semibold text-primary'>
        <RiErrorWarningFill />
        {t('editProfilePage.dangerZone.title')}
      </h1>

      <p className='text-sm font-medium text-tertiary'>
        {t('editProfilePage.dangerZone.subtitle')}
      </p>

      <div className='mt-1 flex gap-x-2'>
        <button
          className='w-max rounded-lg bg-black px-3 py-1 text-sm font-medium text-white hover:bg-black/70 dark:bg-white dark:text-black dark:hover:bg-white/70'
          onClick={() =>
            openModal('delete-profile', {
              title: t('editProfilePage.dangerZone.deleteProfileModal.title'),
              description: t('editProfilePage.dangerZone.deleteProfileModal.description'),
              content: (
                <p className='text-sm text-tertiary'>
                  {t('editProfilePage.dangerZone.deleteProfileModal.note', { br: <br /> })}
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
                  label: t('buttons.delete'),
                  variant: 'solid',
                  action: continueDeleteProfile
                }
              ]
            })
          }
        >
          {t('buttons.delete')}
        </button>
      </div>
    </div>
  );
}