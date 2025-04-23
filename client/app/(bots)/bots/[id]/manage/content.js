'use client';

import { TbLoader, MdSave } from '@/icons';
import { useEffect, useState } from 'react';
import isEqual from 'lodash/isEqual';
import EssentialInformation from '@/app/(bots)/bots/[id]/manage/components/EssentialInformation';
import Other from '@/app/(bots)/bots/[id]/manage/components/Other';
import Webhook from '@/app/(bots)/bots/[id]/manage/components/Webhook';
import ApiKey from '@/app/(bots)/bots/[id]/manage/components/ApiKey';
import DangerZone from '@/app/(bots)/bots/[id]/manage/components/DangerZone';
import ExtraOwners from '@/app/(bots)/bots/[id]/manage/components/ExtraOwners';
import { toast } from 'sonner';
import editBot from '@/lib/request/bots/editBot';
import revalidateBot from '@/lib/revalidate/bot';
import useModalsStore from '@/stores/modals';
import { useShallow } from 'zustand/react/shallow';
import { useRouter } from 'next-nprogress-bar';
import { t } from '@/stores/language';
import UserAvatar from '@/app/components/ImageFromHash/UserAvatar';

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
        case 'short_description':
          setShortDescription(bot[key]);
          break;
        case 'description':
          setDescription(bot[key]);
          break;
        case 'invite_url':
          setInviteURL(bot[key]);
          break;
        case 'categories':
          setCategories(bot[key]);
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
      loading: t('botManagePage.toast.savingChanges'),
      success: () => {
        setSavingChanges(false);
        setChangedKeys([]);
        setChangesMade(false);
        revalidateBot(bot.id);

        return t('botManagePage.toast.changesSaved');
      },
      error: error => {
        setSavingChanges(false);

        return error;
      }
    });
  }

  const [markdownPreviewing, setMarkdownPreviewing] = useState(false);

  const { openModal, closeModal, openedModals } = useModalsStore(useShallow(state => ({
    openModal: state.openModal,
    closeModal: state.closeModal,
    openedModals: state.openedModals
  })));

  const router = useRouter();

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape') {

        if (changesMade) {
          if (openedModals.some(modal => modal.id === 'confirm-exit')) return;

          openModal('confirm-exit', {
            title: t('botManagePage.discardChangesModal.title'),
            description: t('botManagePage.discardChangesModal.description'),
            content: <p className='text-sm text-tertiary'>{t('botManagePage.discardChangesModal.note')}</p>,
            buttons: [
              {
                id: 'cancel',
                label: t('buttons.cancel'),
                variant: 'ghost',
                actionType: 'close'
              },
              {
                id: 'discard-changes',
                label: t('buttons.discardChanges'),
                variant: 'solid',
                action: () => {
                  resetChanges();
                  closeModal('confirm-exit');
                  router.push(`/bots/${bot.id}`, { shallow: true });
                }
              }
            ]
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
                  id={bot.id}
                  hash={bot.avatar}
                  size={32}
                  width={18}
                  height={18}
                  className='rounded-full bg-secondary'
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
          shortDescription={shortDescription}
          setShortDescription={setShortDescription}
          description={description}
          setDescription={setDescription}
          inviteURL={inviteURL}
          setInviteURL={setInviteURL}
          markdownPreviewing={markdownPreviewing}
          setMarkdownPreviewing={setMarkdownPreviewing}
        />

        <div className='h-px w-full bg-tertiary' />

        <Other
          botId={bot.id}
          categories={categories}
          setCategories={setCategories}
          canEditSupportServer={bot.permissions.canEditExtraOwners}
          supportServerId={supportServerId}
          setSupportServerId={setSupportServerId}
          githubRepository={bot.github_repository?.value || null}
        />

        <div className='h-px w-full bg-tertiary' />

        <Webhook
          botId={bot.id}
          webhookURL={bot.webhook?.url || null}
          webhookToken={bot.webhook?.token || null}
          webhookLanguage={bot.webhook?.language || null}
          webhookLanguages={bot.webhookLanguages || []}
          records={bot.webhook?.records || []}
        />

        <div className='h-px w-full bg-tertiary' />

        <ExtraOwners
          botId={bot.id}
          canEditExtraOwners={bot.permissions.canEditExtraOwners}
        />

        <div className='h-px w-full bg-tertiary' />

        <ApiKey
          botId={bot.id}
          apiKey={bot.api_key}
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