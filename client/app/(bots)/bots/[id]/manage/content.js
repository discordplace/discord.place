'use client';

import { useEffect, useState } from 'react';
import { TbLoader } from 'react-icons/tb';
import { MdSave } from 'react-icons/md';
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
    <div className="flex items-center justify-center w-full h-full px-4 mb-24 sm:px-12">
      <div className="w-full h-full max-w-[1000px] flex flex-col items-start gap-y-8 mt-48">
        <div className="flex flex-col w-full sm:items-center sm:flex-row sm:justify-between">
          <div className="flex flex-col gap-y-1">
            <h2 className="flex items-center text-3xl font-bold gap-x-2">
              {t('botManagePage.title')}
            
              <div className='p-2 text-xs font-bold uppercase rounded-lg select-none bg-quaternary'>
                {t('botManagePage.escToCloseBadge')}
              </div>
            </h2>

            <p className="text-tertiary">
              {t('botManagePage.subtitle')}
            </p>
            
            <div className='flex items-center mt-2 font-medium gap-x-2 text-secondary'>
              <UserAvatar
                id={bot.id}
                hash={bot.avatar}
                size={32}
                width={18}
                height={18}
                className="rounded-full bg-secondary"
              />

              {bot.username}
              
              <span className='-ml-2 text-tertiary'>
                #{bot.discriminator}
              </span>
            </div>
          </div>

          <div className='flex justify-end flex-1 w-full mt-8 sm:mt-0 gap-x-2'>
            <button
              className='w-full text-xs sm:text-sm px-2 sm:w-max justify-center disabled:opacity-70 border border-primary hover:border-[rgba(var(--bg-tertiary))] disabled:pointer-events-none sm:px-4 flex items-center gap-x-1.5 py-1.5 font-semibold hover:bg-tertiary hover:text-primary text-tertiary rounded-xl'
              onClick={resetChanges}
              disabled={!changesMade || savingChanges}
            >
              {t('buttons.cancel')}
            </button>

            <button
              className='w-full text-xs sm:text-sm sm:w-max justify-center px-2 sm:px-4 flex text-white disabled:opacity-70 disabled:pointer-events-none items-center gap-x-1 py-1.5 font-semibold hover:bg-purple-600 bg-purple-500 rounded-xl'
              disabled={!changesMade || savingChanges}
              onClick={saveChanges}
            >
              {savingChanges ? <TbLoader size={18} className='animate-spin' /> : <MdSave size={18} />}
              {t('buttons.saveChanges')}
            </button>
          </div>
        </div>

        <div className='w-full h-[1px] bg-tertiary' />

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

        <div className='w-full h-[1px] bg-tertiary' />

        <Other
          botId={bot.id}
          categories={categories}
          setCategories={setCategories}
          canEditSupportServer={bot.permissions.canEditExtraOwners}
          supportServerId={supportServerId}
          setSupportServerId={setSupportServerId}
          githubRepository={bot.github_repository?.value || null}
        />
        
        <div className='w-full h-[1px] bg-tertiary' />

        <Webhook
          botId={bot.id}
          webhookURL={bot.webhook?.url || null}
          webhookToken={bot.webhook?.token || null}
          records={bot.webhook?.records || []}
        />

        <div className='w-full h-[1px] bg-tertiary' />

        <ExtraOwners
          botId={bot.id}
          canEditExtraOwners={bot.permissions.canEditExtraOwners}
        />

        <div className='w-full h-[1px] bg-tertiary' />

        <ApiKey
          botId={bot.id}
          apiKey={bot.api_key}
        />

        {bot.permissions.canDelete && (
          <>
            <div className='w-full h-[1px] bg-tertiary' />

            <DangerZone botId={bot.id} />
          </>
        )}
      </div>
    </div>
  );
}