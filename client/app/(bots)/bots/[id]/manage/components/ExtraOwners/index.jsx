'use client';

import Tooltip from '@/app/components/Tooltip';
import cn from '@/lib/cn';
import createExtraOwner from '@/lib/request/bots/createExtraOwner';
import getExtraOwners from '@/lib/request/bots/getExtraOwners';
import removeExtraOwner from '@/lib/request/bots/removeExtraOwner';
import { t } from '@/stores/language';
import useModalsStore from '@/stores/modals';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { ImHammer2 } from 'react-icons/im';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

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
      error: error => {
        setExtraOwnerRemoving('');

        return error;
      },
      loading: t('botManagePage.extraOwners.toast.removingOwner'),
      success: () => {
        setExtraOwners(extraOwners.filter(extraOwner => extraOwner.id !== userId));
        setExtraOwnerRemoving('');

        return t('botManagePage.extraOwners.toast.ownerRemoved');
      }
    });
  }

  const { closeModal, disableButton, enableButton, openModal } = useModalsStore(useShallow(state => ({
    closeModal: state.closeModal,
    disableButton: state.disableButton,
    enableButton: state.enableButton,
    openModal: state.openModal
  })));

  const newExtraOwnerIdInputRef = useRef(null);

  function continueAddingExtraOwner() {
    disableButton('add-extra-owner', 'confirm');

    const newExtraOwnerId = newExtraOwnerIdInputRef.current.value.trim();
    if (!newExtraOwnerId) return toast.error(t('botManagePage.extraOwners.toast.emptyUserId'));

    toast.promise(createExtraOwner(botId, newExtraOwnerId), {
      error: error => {
        enableButton('add-extra-owner', 'confirm');

        return error;
      },
      loading: t('botManagePage.extraOwners.toast.addingOwner'),
      success: userData => {
        setExtraOwners([...extraOwners, userData]);
        closeModal('add-extra-owner');
        enableButton('add-extra-owner', 'confirm');

        return t('botManagePage.extraOwners.toast.ownerAdded', { username: userData.username });
      }
    });
  }

  return (
    <div className='flex w-full flex-col gap-y-4'>
      <h3 className='flex flex-wrap items-center gap-4 text-xl font-semibold'>
        <ImHammer2 className='text-purple-500' size={24} />
        {t('botManagePage.extraOwners.title')}

        {canEditExtraOwners && (
          <button
            className='-ml-2 rounded-full bg-purple-500 px-2 py-0.5 text-xs text-white hover:bg-purple-600'
            onClick={() =>
              openModal('add-extra-owner', {
                buttons: [
                  {
                    actionType: 'close',
                    id: 'cancel',
                    label: t('buttons.cancel'),
                    variant: 'ghost'
                  },
                  {
                    action: continueAddingExtraOwner,
                    id: 'confirm',
                    label: t('buttons.confirm'),
                    variant: 'solid'
                  }
                ],
                content: (
                  <input
                    className='w-full rounded-xl bg-secondary px-3 py-2 text-sm text-secondary outline-none ring-purple-500 transition-all placeholder:text-placeholder hover:bg-background hover:ring-2 focus-visible:bg-background'
                    placeholder={botId}
                    ref={newExtraOwnerIdInputRef}
                    type='text'
                  />
                ),
                description: t('botManagePage.extraOwners.addExtraOwnerModal.description'),
                title: t('botManagePage.extraOwners.addExtraOwnerModal.title')
              })
            }
          >
            {t('buttons.addNew')}
          </button>
        )}

        <span className='-ml-2 rounded-full bg-black/30 px-2 py-0.5 text-xs text-white dark:bg-white/30 dark:text-white'>
          {t('botManagePage.extraOwners.optionalBadge')}
        </span>
      </h3>

      {canEditExtraOwners && (
        <p className='text-tertiary'>
          {t('botManagePage.extraOwners.subtitle', {
            br: <br />,
            emptyBlock: <br className='block sm:hidden' />
          })}

          <span className='text-secondary'>
            {t('botManagePage.extraOwners.noteText')}
          </span>
        </p>
      )}

      <div className='flex flex-wrap gap-4'>
        {extraOwnersLoading ? (
          new Array(7).fill().map((_, index) => (
            <div
              className='flex items-center gap-x-2'
              key={index}
            >
              <div className='size-8 animate-pulse rounded-full bg-tertiary' />
              <div className='h-4 w-[85px] flex-1 animate-pulse rounded bg-tertiary' />
            </div>
          ))
        ) : extraOwners.length === 0 ? (
          <p className='text-tertiary'>
            {t('botManagePage.extraOwners.emptyErrorState')}
          </p>
        ) : (
          extraOwners.map(extraOwner => (
            <Tooltip
              content='Remove'
              key={extraOwner.id}
              side='top'
            >
              <div
                className={cn(
                  'flex items-center transition-opacity cursor-pointer disabled:pointer-events-none disabled:opacity-70 gap-x-2 hover:opacity-70',
                  !canEditExtraOwners && 'pointer-events-none'
                )}
                disabled={extraOwnerRemoving === extraOwner.id}
                onClick={() => continueRemoveExtraOwner(extraOwner.id)}
              >
                <Image
                  alt={`${extraOwner.username}'s avatar`}
                  className='rounded-full'
                  height={32}
                  src={extraOwner.avatar_url}
                  width={32}
                />

                <span className='font-medium text-secondary'>
                  {extraOwner.username}
                </span>
              </div>
            </Tooltip>
          ))
        )}
      </div>
    </div>
  );
}