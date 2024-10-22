'use client';

import ApiKey from '@/app/(bots)/bots/[id]/manage/components/ApiKey';
import DangerZone from '@/app/(bots)/bots/[id]/manage/components/DangerZone';
import EssentialInformation from '@/app/(bots)/bots/[id]/manage/components/EssentialInformation';
import ExtraOwners from '@/app/(bots)/bots/[id]/manage/components/ExtraOwners';
import Other from '@/app/(bots)/bots/[id]/manage/components/Other';
import Webhook from '@/app/(bots)/bots/[id]/manage/components/Webhook';
import UserAvatar from '@/app/components/ImageFromHash/UserAvatar';
import editBot from '@/lib/request/bots/editBot';
import revalidateBot from '@/lib/revalidate/bot';
import { t } from '@/stores/language';
import useModalsStore from '@/stores/modals';
import isEqual from 'lodash/isEqual';
import { useRouter } from 'next-nprogress-bar';
import { useEffect, useState } from 'react';
import { MdSave } from 'react-icons/md';
import { TbLoader } from 'react-icons/tb';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

export default function Content({ bot }) {
  const [savingChanges, setSavingChanges] = useState(false);
  const [changesMade, setChangesMade] = useState(false);
  const [changedKeys, setChangedKeys] = useState([]);

  const [shortDescription, setShortDescription] = useState(bot.short_description);
  const [description, setDescription] = useState(bot.description);
  const [inviteURL, setInviteURL] = useState(bot.invite_url);
  const [categories, setCategories] = useState(bot.categories);
  const [supportServerId, setSupportServerId] = useState(bot.support_server?.id || '0');

  // calculate if any changes made, if so, enable the save button

  useEffect(() => {
    const isShortDescriptionChanged = !isEqual(shortDescription, bot.short_description);
    const isDescriptionChanged = !isEqual(description, bot.description);
    const isInviteURLChanged = !isEqual(inviteURL, bot.invite_url);
    const isCategoriesChanged = !isEqual(categories, bot.categories);
    const isSupportServerIdChanged = !isEqual(supportServerId, bot.support_server?.id || '0');

    setChangesMade(
      isShortDescriptionChanged ||
      isDescriptionChanged ||
      isInviteURLChanged ||
      isCategoriesChanged ||
      isSupportServerIdChanged
    );

    function pushToChangedKeys(key, value) {
      // if the current value is the same as the original value, remove the key from the array
      if (isEqual(value, bot[key])) return setChangedKeys(oldKeys => oldKeys.filter(({ key: oldKey }) => oldKey !== key));

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

    if (isShortDescriptionChanged) pushToChangedKeys('short_description', shortDescription);
    if (isDescriptionChanged) pushToChangedKeys('description', description);
    if (isInviteURLChanged) pushToChangedKeys('invite_url', inviteURL);
    if (isCategoriesChanged) pushToChangedKeys('categories', categories);
    if (isSupportServerIdChanged) pushToChangedKeys('support_server_id', supportServerId);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shortDescription, description, inviteURL, categories, supportServerId]);

  function resetChanges() {
    changedKeys.forEach(({ key }) => {
      switch (key) {
        case 'categories':
          setCategories(bot[key]);
          break;
        case 'description':
          setDescription(bot[key]);
          break;
        case 'invite_url':
          setInviteURL(bot[key]);
          break;
        case 'short_description':
          setShortDescription(bot[key]);
          break;
        case 'support_server_id':
          setSupportServerId(bot.support_server?.id || '0');
          break;
      }
    });

    setChangedKeys([]);
  }

  async function saveChanges() {
    setSavingChanges(true);

    toast.promise(editBot(bot.id, changedKeys), {
      error: error => {
        setSavingChanges(false);

        return error;
      },
      loading: t('botManagePage.toast.savingChanges'),
      success: () => {
        setSavingChanges(false);
        setChangedKeys([]);
        setChangesMade(false);
        revalidateBot(bot.id);

        return t('botManagePage.toast.changesSaved');
      }
    });
  }

  const [markdownPreviewing, setMarkdownPreviewing] = useState(false);

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
                  router.push(`/bots/${bot.id}`, { shallow: true });
                },
                id: 'discard-changes',
                label: t('buttons.discardChanges'),
                variant: 'solid'
              }
            ],
            content: <p className='text-sm text-tertiary'>{t('botManagePage.discardChangesModal.note')}</p>,
            description: t('botManagePage.discardChangesModal.description'),
            title: t('botManagePage.discardChangesModal.title')
          });
        } else {
          window.location.href = `/bots/${bot.id}`;
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
              {t('botManagePage.title')}

              <div className='select-none rounded-lg bg-quaternary p-2 text-xs font-bold uppercase'>
                {t('botManagePage.escToCloseBadge')}
              </div>
            </h2>

            <p className='text-tertiary'>
              {t('botManagePage.subtitle')}
            </p>

            <div className='mt-2 flex items-center gap-x-2 font-medium text-secondary'>
              <UserAvatar
                className='rounded-full bg-secondary'
                hash={bot.avatar}
                height={18}
                id={bot.id}
                size={32}
                width={18}
              />

              {bot.username}

              <span className='-ml-2 text-tertiary'>
                #{bot.discriminator}
              </span>
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
          markdownPreviewing={markdownPreviewing}
          setDescription={setDescription}
          setInviteURL={setInviteURL}
          setMarkdownPreviewing={setMarkdownPreviewing}
          setShortDescription={setShortDescription}
          shortDescription={shortDescription}
        />

        <div className='h-px w-full bg-tertiary' />

        <Other
          botId={bot.id}
          canEditSupportServer={bot.permissions.canEditExtraOwners}
          categories={categories}
          githubRepository={bot.github_repository?.value || null}
          setCategories={setCategories}
          setSupportServerId={setSupportServerId}
          supportServerId={supportServerId}
        />

        <div className='h-px w-full bg-tertiary' />

        <Webhook
          botId={bot.id}
          records={bot.webhook?.records || []}
          webhookToken={bot.webhook?.token || null}
          webhookURL={bot.webhook?.url || null}
        />

        <div className='h-px w-full bg-tertiary' />

        <ExtraOwners
          botId={bot.id}
          canEditExtraOwners={bot.permissions.canEditExtraOwners}
        />

        <div className='h-px w-full bg-tertiary' />

        <ApiKey
          apiKey={bot.api_key}
          botId={bot.id}
        />

        {bot.permissions.canDelete && (
          <>
            <div className='h-px w-full bg-tertiary' />

            <DangerZone botId={bot.id} />
          </>
        )}
      </div>
    </div>
  );
}