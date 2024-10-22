'use client';

import DangerZone from '@/app/(servers)/servers/[id]/manage/components/DangerZone';
import EssentialInformation from '@/app/(servers)/servers/[id]/manage/components/EssentialInformation';
import Other from '@/app/(servers)/servers/[id]/manage/components/Other';
import Webhook from '@/app/(servers)/servers/[id]/manage/components/Webhook';
import ServerIcon from '@/app/components/ImageFromHash/ServerIcon';
import editServer from '@/lib/request/servers/editServer';
import revalidateServer from '@/lib/revalidate/server';
import { t } from '@/stores/language';
import useModalsStore from '@/stores/modals';
import isEqual from 'lodash/isEqual';
import { useRouter } from 'next-nprogress-bar';
import { useEffect, useState } from 'react';
import { MdSave } from 'react-icons/md';
import { TbLoader } from 'react-icons/tb';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

export default function Content({ server }) {
  const [savingChanges, setSavingChanges] = useState(false);
  const [changesMade, setChangesMade] = useState(false);
  const [changedKeys, setChangedKeys] = useState([]);

  const [description, setDescription] = useState(server.description);

  const parsedInviteUrl = server.invite_code.type === 'Vanity' ? (server.vanity_url || '') : (
    server.invite_code.type === 'Deleted' ? '' :
      `https://discord.com/invite/${server.invite_code.code}`
  );

  const [inviteURL, setInviteURL] = useState(parsedInviteUrl);
  const [category, setCategory] = useState(server.category);
  const [keywords, setKeywords] = useState(server.keywords);

  useEffect(() => {
    const isDescriptionChanged = !isEqual(description, server.description);
    const isInviteURLChanged = !isEqual(inviteURL, parsedInviteUrl);
    const isCategoryChanged = !isEqual(category, server.category);
    const isKeywordsChanged = !isEqual(keywords, server.keywords);

    setChangesMade(
      isDescriptionChanged ||
      isInviteURLChanged ||
      isCategoryChanged ||
      isKeywordsChanged
    );

    function pushToChangedKeys(key, value) {
      // if the current value is the same as the original value, remove the key from the array
      if (isEqual(value, server[key])) return setChangedKeys(oldKeys => oldKeys.filter(({ key: oldKey }) => oldKey !== key));

      // if the key already exists, update the value
      // otherwise, add the key and value to the array

      setChangedKeys(oldKeys =>
        oldKeys
          .filter(({ key: oldKey }) => oldKey !== key)
          .concat({
            key,
            value: isEqual(value, '') ? null : value
          })
      );
    }

    if (isDescriptionChanged) pushToChangedKeys('description', description);
    if (isInviteURLChanged) pushToChangedKeys('invite_url', inviteURL);
    if (isCategoryChanged) pushToChangedKeys('category', category);
    if (isKeywordsChanged) pushToChangedKeys('keywords', keywords);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [description, inviteURL, category, keywords]);

  function resetChanges() {
    changedKeys.forEach(({ key }) => {
      switch (key) {
        case 'category':
          setCategory(server[key]);
          break;
        case 'description':
          setDescription(server[key]);
          break;
        case 'invite_url':
          var parsedInviteUrl = server.invite_code.type === 'Vanity' ? (server.vanity_url || '') : (
            server.invite_code.type === 'Deleted' ? '' :
              `https://discord.com/invite/${server.invite_code.code}`
          );

          setInviteURL(parsedInviteUrl);
          break;
        case 'keywords':
          setKeywords(server[key]);
          break;
      }
    });

    setChangedKeys([]);
  }

  async function saveChanges() {
    setSavingChanges(true);

    toast.promise(editServer(server.id, changedKeys), {
      error: error => {
        setSavingChanges(false);

        return error;
      },
      loading: t('serverManagePage.toast.savingChanges'),
      success: () => {
        setSavingChanges(false);
        setChangedKeys([]);
        setChangesMade(false);
        revalidateServer(server.id);

        return t('serverManagePage.toast.changesSaved');
      }
    });
  }

  const { closeModal, openedModals, openModal } = useModalsStore(useShallow(state => ({
    closeModal: state.closeModal,
    openedModals: state.openedModals,
    openModal: state.openModal
  })));

  const router = useRouter();

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape') {
        if (changesMade) {
          if (openedModals.some(modal => modal.id === 'confirm-exit')) return;

          openModal('confirm-exit', {
            buttons: [
              {
                actionType: 'close',
                id: 'cancel',
                label: t('buttons.cancel'),
                variant: 'ghost'
              },
              {
                action: () => {
                  resetChanges();
                  closeModal('confirm-exit');
                  router.push(`/servers/${server.id}`, { shallow: true });
                },
                id: 'discard-changes',
                label: t('buttons.discardChanges'),
                variant: 'solid'
              }
            ],
            content: <p className='text-sm text-tertiary'>{t('serverManagePage.discardChangesModal.note')}</p>,
            description: t('serverManagePage.discardChangesModal.description'),
            title: t('serverManagePage.discardChangesModal.title')
          });
        } else {
          window.location.href = `/servers/${server.id}`;
        }
      }
    }

    document.addEventListener('keydown', handleEscape);

    return () => document.removeEventListener('keydown', handleEscape);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changesMade, openedModals]);

  return (
    <div className='mb-24 flex size-full items-center justify-center px-4 sm:px-12'>
      <div className='mt-48 flex size-full max-w-[1000px] flex-col items-start gap-y-8'>
        <div className='flex w-full flex-col sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex flex-col gap-y-1'>
            <h2 className='flex items-center gap-x-2 text-3xl font-bold'>
              {t('serverManagePage.title')}

              <div className='select-none rounded-lg bg-quaternary p-2 text-xs font-bold uppercase'>
                {t('serverManagePage.escToCloseBadge')}
              </div>
            </h2>

            <p className='text-tertiary'>
              {t('serverManagePage.subtitle')}
            </p>

            <div className='mt-2 flex items-center gap-x-2 font-medium text-secondary'>
              <ServerIcon
                className='rounded-full bg-quaternary'
                hash={server.icon}
                height={18}
                id={server.id}
                size={32}
                width={18}
              />

              {server.name}
            </div>
          </div>

          <div className='mt-8 flex w-full flex-1 justify-end gap-x-2 sm:mt-0'>
            <button
              className='flex w-full items-center justify-center gap-x-1.5 rounded-xl border border-primary px-2 py-1.5 text-xs font-semibold text-tertiary hover:border-[rgba(var(--bg-tertiary))] hover:bg-tertiary hover:text-primary disabled:pointer-events-none disabled:opacity-70 sm:w-max sm:px-4 sm:text-sm'
              disabled={!changesMade || savingChanges}
              onClick={resetChanges}
            >
              {t('buttons.cancel')}
            </button>

            <button
              className='flex w-full items-center justify-center gap-x-1 rounded-xl bg-purple-500 px-2 py-1.5 text-xs font-semibold text-white hover:bg-purple-600 disabled:pointer-events-none disabled:opacity-70 sm:w-max sm:px-4 sm:text-sm'
              disabled={!changesMade || savingChanges}
              onClick={saveChanges}
            >
              {savingChanges ? <TbLoader className='animate-spin' size={18} /> : <MdSave size={18} />}
              {t('buttons.saveChanges')}
            </button>
          </div>
        </div>

        <div className='h-px w-full bg-tertiary' />

        <EssentialInformation
          description={description}
          inviteURL={inviteURL}
          setDescription={setDescription}
          setInviteURL={setInviteURL}
        />

        <div className='h-px w-full bg-tertiary' />

        <Other
          category={category}
          keywords={keywords}
          setCategory={setCategory}
          setKeywords={setKeywords}
        />

        <div className='h-px w-full bg-tertiary' />

        <Webhook
          records={server.webhook?.records || []}
          serverId={server.id}
          webhookToken={server.webhook?.token || null}
          webhookURL={server.webhook?.url || null}
        />

        {server.permissions.canDelete && (
          <>
            <div className='h-px w-full bg-tertiary' />

            <DangerZone serverId={server.id} />
          </>
        )}
      </div>
    </div>
  );
}