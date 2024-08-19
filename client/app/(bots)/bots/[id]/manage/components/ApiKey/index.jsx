'use client';

import { toast } from 'sonner';
import { useState } from 'react';
import { IoKey } from 'react-icons/io5';
import createApiKey from '@/lib/request/bots/createApiKey';
import deleteApiKey from '@/lib/request/bots/deleteApiKey';
import useModalsStore from '@/stores/modals';
import { useShallow } from 'zustand/react/shallow';
import CopyButton from '@/app/components/CopyButton';
import Link from 'next/link';
import config from '@/config';
import { HiExternalLink } from 'react-icons/hi';
import { t } from '@/stores/language';

export default function ApiKey({ botId, apiKey }) {
  const [currentApiKey, setCurrentApiKey] = useState(apiKey);
  const [apiKeyCreating, setApiKeyCreating] = useState(false);
  const [apiKeyDeleting, setApiKeyDeleting] = useState(false);
  
  const { openModal, disableButton, enableButton, closeModal } = useModalsStore(useShallow(state => ({
    openModal: state.openModal,
    disableButton: state.disableButton,
    enableButton: state.enableButton,
    closeModal: state.closeModal
  })));

  async function createNewApiKey(isNew) {
    setApiKeyCreating(true);

    toast.promise(createApiKey(botId, isNew), {
      loading: t('botManagePage.apiKey.toast.creatingApiKey'),
      success: apiKey => {
        setCurrentApiKey(apiKey);
        setApiKeyCreating(false);

        if ('clipboard' in navigator) {
          navigator.clipboard.writeText(apiKey);
          return t('botManagePage.apiKey.toast.createdApiKeyAndCopied');
        }

        return t('botManagePage.apiKey.toast.createdApiKey');
      },
      error: error => {
        setApiKeyCreating(false);

        return error;
      }
    });
  }

  async function continueDeleteApiKey() {
    setApiKeyDeleting(true);
    disableButton('delete-api-key', 'confirm');

    toast.promise(deleteApiKey(botId), {
      loading: t('botManagePage.apiKey.toast.deletingApiKey'),
      success: () => {
        closeModal('delete-api-key');
        setCurrentApiKey(null);
        setApiKeyDeleting(false);

        return t('botManagePage.apiKey.toast.apiKeyDeleted');
      },
      error: error => {
        setApiKeyDeleting(false);
        enableButton('delete-api-key', 'confirm');

        return error;
      }
    });
  }

  return (
    <div className='flex flex-col w-full gap-y-4'>
      <h3 className='flex items-center text-xl font-semibold gap-x-4'>
        <IoKey size={24} className='text-purple-500' />
        {t('botManagePage.apiKey.title')}

        <span className='-ml-2 text-xs text-white dark:text-white px-2 py-0.5 dark:bg-white/30 bg-black/30 rounded-full'>
          {t('botManagePage.apiKey.optionalBadge')}
        </span>
      </h3>

      <p className='text-tertiary'>
        {t('botManagePage.apiKey.subtitle')}
      </p>

      {!currentApiKey ? (
        <>
          <button
            className='text-sm w-max px-4 flex text-white disabled:opacity-70 disabled:pointer-events-none items-center gap-x-1 py-1.5 font-semibold bg-gradient-to-r hover:opacity-80 from-purple-600 via-purple-600 border border-purple-600 to-purple-900 rounded-xl'
            onClick={() => createNewApiKey(true)}
            disabled={apiKeyCreating}
          >
            {t('buttons.generateApiKey')}
          </button>
        </>
      ) : (
        <>
          <div className='flex flex-col gap-y-2'>
            <div className='flex flex-col items-center gap-2 sm:flex-row'>
              <button
                className='text-sm w-full sm:w-max px-4 flex text-white disabled:opacity-70 disabled:pointer-events-none items-center gap-x-1 py-1.5 font-semibold bg-gradient-to-r hover:opacity-80 from-red-600 via-red-600 border border-red-600 to-red-900 rounded-xl'
                onClick={() => {
                  openModal('delete-api-key', {
                    title: t('botManagePage.apiKey.deleteApiKeyModal.title'),
                    description: t('botManagePage.apiKey.deleteApiKeyModal.description'),
                    content: (
                      <p className='text-sm text-tertiary'>
                        {t('botManagePage.apiKey.deleteApiKeyModal.note')}
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
                        label: t('buttons.confirm'),
                        variant: 'solid',
                        action: continueDeleteApiKey
                      }
                    ]
                  });
                }}
                disabled={apiKeyDeleting}
              >
                {t('buttons.deleteApiKey')}
              </button>

              <CopyButton
                className='text-sm w-full sm:w-max outline-none px-4 flex disabled:opacity-70 disabled:pointer-events-none items-center gap-x-2 py-1.5 font-semibold bg-gradient-to-r bg-quaternary hover:bg-tertiary hover:text-primary border border-primary rounded-xl'
                successText={t('botManagePage.apiKey.toast.apiKeyCopied')}
                copyText={currentApiKey}
              >
                {t('buttons.copyApiKey')}
              </CopyButton>

              <Link
                href={config.docsUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='flex w-full sm:w-max items-center gap-x-1.5 px-4 py-1.5 rounded-lg font-semibold text-white bg-black h-max hover:bg-black/70 dark:bg-white dark:text-black dark:hover:bg-white/70 text-sm'
              >
                {t('buttons.apiDocumentation')}
                <HiExternalLink className='ml-auto' />
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}