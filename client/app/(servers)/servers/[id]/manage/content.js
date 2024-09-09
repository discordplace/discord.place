'use client';

import ServerIcon from '@/app/components/ImageFromHash/ServerIcon';
import { TbLoader } from 'react-icons/tb';
import { MdSave } from 'react-icons/md';
import { useEffect, useState } from 'react';
import EssentialInformation from '@/app/(servers)/servers/[id]/manage/components/EssentialInformation';
import Other from '@/app/(servers)/servers/[id]/manage/components/Other';
import Webhook from '@/app/(servers)/servers/[id]/manage/components/Webhook';
import DangerZone from '@/app/(servers)/servers/[id]/manage/components/DangerZone';
import { isEqual } from 'lodash';
import { toast } from 'sonner';
import editServer from '@/lib/request/servers/editServer';
import revalidateServer from '@/lib/revalidate/server';
import { useRouter } from 'next-nprogress-bar';
import useModalsStore from '@/stores/modals';
import { useShallow } from 'zustand/react/shallow';
import { t } from '@/stores/language';

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
        case 'category':
          setCategory(server[key]);
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
      loading: t('serverManagePage.toast.savingChanges'),
      success: () => {
        setSavingChanges(false);
        setChangedKeys([]);
        revalidateServer(server.id);

        return t('serverManagePage.toast.changesSaved');
      },
      error: error => {
        setSavingChanges(false);
        
        return error;
      }
    });
  }

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
            title: t('serverManagePage.discardChangesModal.title'),
            description: t('serverManagePage.discardChangesModal.description'),
            content: <p className='text-sm text-tertiary'>{t('serverManagePage.discardChangesModal.note')}</p>,
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
                  router.push(`/servers/${server.id}`, { shallow: true });
                }
              }
            ]
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
    <div className="flex items-center justify-center w-full h-full px-4 mb-24 sm:px-12">
      <div className="w-full h-full max-w-[1000px] flex flex-col items-start gap-y-8 mt-48">
        <div className="flex flex-col w-full sm:items-center sm:flex-row sm:justify-between">
          <div className="flex flex-col gap-y-1">
            <h2 className="flex items-center text-3xl font-bold gap-x-2">
              {t('serverManagePage.title')}
            
              <div className='p-2 text-xs font-bold uppercase rounded-lg select-none bg-quaternary'>
                {t('serverManagePage.escToCloseBadge')}
              </div>
            </h2>

            <p className="text-tertiary">
              {t('serverManagePage.subtitle')}
            </p>
            
            
            <div className='flex items-center mt-2 font-medium gap-x-2 text-secondary'>
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
          description={description}
          setDescription={setDescription}
          inviteURL={inviteURL}
          setInviteURL={setInviteURL}
        />

        <div className='w-full h-[1px] bg-tertiary' />

        <Other
          category={category}
          setCategory={setCategory}
          keywords={keywords}
          setKeywords={setKeywords}
        />

        <div className='w-full h-[1px] bg-tertiary' />
        
        <Webhook
          serverId={server.id}
          webhookURL={server.webhook?.url || null}
          webhookToken={server.webhook?.token || null}
        />

        {server.permissions.canDelete && (
          <>
            <div className='w-full h-[1px] bg-tertiary' />

            <DangerZone serverId={server.id} />
          </>
        )}
      </div>
    </div>
  );
}