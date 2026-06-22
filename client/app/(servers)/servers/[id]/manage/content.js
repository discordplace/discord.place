'use client';

import { MdSave } from 'react-icons/md';
import { TbLoader } from 'react-icons/tb';
import ServerIcon from '@/app/components/ImageFromHash/ServerIcon';
import { useEffect, useState } from 'react';
import EssentialInformation from '@/app/(servers)/servers/[id]/manage/components/EssentialInformation';
import Other from '@/app/(servers)/servers/[id]/manage/components/Other';
import Webhook from '@/app/(servers)/servers/[id]/manage/components/Webhook';
import DangerZone from '@/app/(servers)/servers/[id]/manage/components/DangerZone';
import isEqual from 'lodash/isEqual';
import { toast } from 'sonner';
import editServer from '@/lib/request/servers/editServer';
import revalidateServer from '@/lib/revalidate/server';
import { useRouter } from 'next-nprogress-bar';
import useModalsStore from '@/stores/modals';
import { useShallow } from 'zustand/react/shallow';
import { useTranslation } from 'react-i18next';

export default function Content({ server }) {
  const { t } = useTranslation();
  const [savingChanges, setSavingChanges] = useState(false);
  const [changesMade, setChangesMade] = useState(false);
  const [changedKeys, setChangedKeys] = useState([]);

  const [description, setDescription] = useState(server.description);

  const handledInviteUrl = server.invite_code.type === 'Vanity' ? (server.vanity_url || '') : (
    server.invite_code.type === 'Deleted' ? '' :
      `https://discord.com/invite/${server.invite_code.code}`
  );

  const [inviteURL, setInviteURL] = useState(handledInviteUrl);
  const [category, setCategory] = useState(server.category);
  const [keywords, setKeywords] = useState(server.keywords);

  useEffect(() => {
    const isDescriptionChanged = !isEqual(description, server.description);
    const isInviteURLChanged = !isEqual(inviteURL, handledInviteUrl);
    const isCategoryChanged = !isEqual(category, server.category);
    const isKeywordsChanged = !isEqual(keywords, server.keywords);

    setChangesMade(
      isDescriptionChanged ||
      isInviteURLChanged ||
      isCategoryChanged ||
      isKeywordsChanged
    );

    function pushToChangedKeys(key, value) {
      if (isEqual(value, server[key])) return setChangedKeys(oldKeys => oldKeys.filter(({ key: oldKey }) => oldKey !== key));

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
  }, [description, inviteURL, category, keywords]);

  function resetChanges() {
    changedKeys.forEach(({ key }) => {
      switch (key) {
        case 'description': {
          setDescription(server[key]);
          break;
        }
        case 'invite_url': {
          const handledInviteUrl = server.invite_code.type === 'Vanity' ? (server.vanity_url || '') : (
            server.invite_code.type === 'Deleted' ? '' :
              `https://discord.com/invite/${server.invite_code.code}`
          );

          setInviteURL(handledInviteUrl);
          break;
        }
        case 'category': {
          setCategory(server[key]);
          break;
        }
        case 'keywords': {
          setKeywords(server[key]);
          break;
        }
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

  const { openModal, closeModal, openedModals } = useModalsStore(useShallow(state => ({
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
          globalThis.location.href = `/servers/${server.id}`;
        }
      }
    }

    document.addEventListener('keydown', handleEscape);

    return () => document.removeEventListener('keydown', handleEscape);
  }, [changesMade, openedModals]);

  return (
    <div className='mb-24 flex size-full items-center justify-center px-4 sm:px-12'>
      <div className='mt-36 flex size-full max-w-[1000px] flex-col items-start gap-y-8'>
        <div className='sticky top-0 z-10 flex w-full'>
          <div
            className='pointer-events-none absolute inset-0 z-[-1] flex bg-transparent backdrop-blur-[3px]'
            style={{
              backgroundImage: 'radial-gradient(transparent 0.1px, rgba(var(--bg-background)) 1px)',
              backgroundSize: '4px 4px',
              mask: 'linear-gradient(rgb(0, 0, 0) 60%, rgba(0, 0, 0, 0) 100%)'
            } }
          />

          <div className='relative flex w-full flex-col py-12 sm:flex-row sm:items-center sm:justify-between'>
            <div className='flex flex-col gap-y-1'>
              <h2 className='flex items-center gap-x-2 text-3xl font-bold'>
                {t('serverManagePage.title')}

                <div className='rounded-lg bg-quaternary p-2 text-xs font-bold uppercase select-none'>
                  {t('serverManagePage.escToCloseBadge')}
                </div>
              </h2>

              <p className='text-tertiary'>
                {t('serverManagePage.subtitle')}
              </p>

              <div className='mt-2 flex items-center gap-x-2 font-medium text-secondary'>
                <ServerIcon
                  id={server.id}
                  hash={server.icon}
                  size={32}
                  width={18}
                  height={18}
                  className='rounded-full bg-quaternary'
                />

                {server.name}
              </div>
            </div>

            <div className='mt-8 flex w-full flex-1 justify-end gap-x-2 sm:mt-0'>
              <button
                className='flex w-full items-center justify-center gap-x-1.5 rounded-xl border border-primary px-2 py-1.5 text-xs font-semibold text-tertiary hover:border-[rgba(var(--bg-tertiary))] hover:bg-tertiary hover:text-primary disabled:pointer-events-none disabled:opacity-70 sm:w-max sm:px-4 sm:text-sm'
                onClick={resetChanges}
                disabled={!changesMade || savingChanges}
              >
                {t('buttons.cancel')}
              </button>

              <button
                className='flex w-full items-center justify-center gap-x-1 rounded-xl bg-purple-500 px-2 py-1.5 text-xs font-semibold text-white hover:bg-purple-600 disabled:pointer-events-none disabled:opacity-70 sm:w-max sm:px-4 sm:text-sm'
                disabled={!changesMade || savingChanges}
                onClick={saveChanges}
              >
                {savingChanges ? <TbLoader size={18} className='animate-spin' /> : <MdSave size={18} />}
                {t('buttons.saveChanges')}
              </button>
            </div>
          </div>
        </div>

        <div className='-mt-6 h-px w-full bg-tertiary' />

        <EssentialInformation
          description={description}
          setDescription={setDescription}
          inviteURL={inviteURL}
          setInviteURL={setInviteURL}
        />

        <div className='h-px w-full bg-tertiary' />

        <Other
          category={category}
          setCategory={setCategory}
          keywords={keywords}
          setKeywords={setKeywords}
        />

        <div className='h-px w-full bg-tertiary' />

        <Webhook
          serverId={server.id}
          webhookURL={server.webhook?.url || null}
          webhookToken={server.webhook?.token || null}
          webhookLanguage={server.webhook?.language || null}
          webhookLanguages={server.webhookLanguages || []}
          records={server.webhook?.records || []}
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