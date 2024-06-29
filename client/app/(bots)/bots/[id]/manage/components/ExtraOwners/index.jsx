'use client';

import { useEffect, useRef, useState } from 'react';
import { ImHammer2 } from 'react-icons/im';
import getExtraOwners from '@/lib/request/bots/getExtraOwners';
import { toast } from 'sonner';
import Image from 'next/image';
import Tooltip from '@/app/components/Tooltip';
import removeExtraOwner from '@/lib/request/bots/removeExtraOwner';
import createExtraOwner from '@/lib/request/bots/createExtraOwner';
import useModalsStore from '@/stores/modals';
import { useShallow } from 'zustand/react/shallow';
import cn from '@/lib/cn';

export default function ExtraOwners({ botId, canEditExtraOwners }) {
  const [extraOwners, setExtraOwners] = useState([]);
  const [extraOwnersLoading, setExtraOwnersLoading] = useState(true);
  const [extraOwnerRemoving, setExtraOwnerRemoving] = useState('');

  useEffect(() => {
    setExtraOwnersLoading(true);

    getExtraOwners(botId)
      .then(data => setExtraOwners(data))
      .catch(toast.error)
      .finally(() => setExtraOwnersLoading(false));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function continueRemoveExtraOwner(userId) {
    setExtraOwnerRemoving(userId);
    
    toast.promise(removeExtraOwner(botId, userId), {
      loading: 'Removing extra owner..',
      success: () => {
        setExtraOwners(extraOwners.filter(extraOwner => extraOwner.id !== userId));
        setExtraOwnerRemoving('');

        return 'Successfully removed extra owner!';
      },
      error: error => {
        setExtraOwnerRemoving('');
        
        return error;
      }
    });
  }

  const { openModal, disableButton, enableButton, closeModal } = useModalsStore(useShallow(state => ({
    openModal: state.openModal,
    disableButton: state.disableButton,
    enableButton: state.enableButton,
    closeModal: state.closeModal
  })));

  const newExtraOwnerIdInputRef = useRef(null);

  function continueAddingExtraOwner() {
    disableButton('add-extra-owner', 'confirm');

    const newExtraOwnerId = newExtraOwnerIdInputRef.current.value.trim();
    if (!newExtraOwnerId) return toast.error('User ID cannot be empty.');

    toast.promise(createExtraOwner(botId, newExtraOwnerId), {
      loading: 'Adding extra owner..',
      success: userData => {
        setExtraOwners([...extraOwners, userData]);
        closeModal('add-extra-owner');
        enableButton('add-extra-owner', 'confirm');

        return `User @${userData.username} successfully added as an extra owner!`;
      },
      error: error => {
        enableButton('add-extra-owner', 'confirm');

        return error;
      }
    });
  }

  return (
    <div className='flex flex-col w-full gap-y-4'>
      <h3 className='flex flex-wrap items-center gap-4 text-xl font-semibold'>
        <ImHammer2 size={24} className='text-purple-500' />
        Extra Owners

        {canEditExtraOwners && (
          <button
            className='text-white -ml-2 text-xs bg-purple-500 hover:bg-purple-600 px-2 py-0.5 rounded-full'
            onClick={() => 
              openModal('add-extra-owner', {
                title: 'Add Extra Owner',
                description: 'Add a user as an extra owner of your bot.',
                content: (
                  <input
                    type="text"
                    placeholder={botId}
                    className="w-full px-3 py-2 text-sm transition-all outline-none placeholder-placeholder text-secondary bg-secondary hover:bg-background focus-visible:bg-background hover:ring-2 ring-purple-500 rounded-xl"
                    ref={newExtraOwnerIdInputRef}
                  />
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
                    action: continueAddingExtraOwner
                  }
                ]
              })
            }
          >
          Add New
          </button>
        )}       

        <span className='-ml-2 text-xs text-white dark:text-white px-2 py-0.5 dark:bg-white/30 bg-black/30 rounded-full'>
          Optional
        </span>
      </h3>

      {canEditExtraOwners && (
        <p className='text-tertiary'>
          You can add users as extra owners of your bot. Extra owners can manage your bot just like you do.
          <br />
          <br className='block sm:hidden' />
          <span className='text-secondary'>Note:</span> Extra owners can see and manage all the settings of your bot including API key, so be careful who you add.
        </p>
      )}

      <div className='flex flex-wrap gap-4'>
        {extraOwnersLoading ? (
          new Array(7).fill().map((_, index) => (
            <div
              key={index}
              className='flex items-center gap-x-2'
            >
              <div className='w-8 h-8 rounded-full animate-pulse bg-tertiary' />
              <div className='flex-1 w-[85px] h-4 bg-tertiary animate-pulse rounded' />
            </div>
          ))
        ) : extraOwners.length === 0 ? (
          <p className='text-tertiary'>No extra owners added yet.</p>
        ) : (
          extraOwners.map(extraOwner => (
            <Tooltip
              side='top'
              key={extraOwner.id}
              content='Remove'
            >
              <div
                className={cn(
                  'flex items-center transition-opacity cursor-pointer disabled:pointer-events-none disabled:opacity-70 gap-x-2 hover:opacity-70',
                  !canEditExtraOwners && 'pointer-events-none'
                )}
                onClick={() => continueRemoveExtraOwner(extraOwner.id)}
                disabled={extraOwnerRemoving === extraOwner.id}
              >
                <Image
                  src={extraOwner.avatar_url}
                  alt={`${extraOwner.username}'s avatar`}
                  width={32}
                  height={32}
                  className='rounded-full'
                />
                <span className='font-medium text-secondary'>{extraOwner.username}</span>
              </div>
            </Tooltip>
          ))
        )}
      </div>
    </div>
  );
}