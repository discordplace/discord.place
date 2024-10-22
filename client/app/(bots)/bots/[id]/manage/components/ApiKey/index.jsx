'use client';

import CopyButton from '@/app/components/CopyButton';
import config from '@/config';
import createApiKey from '@/lib/request/bots/createApiKey';
import deleteApiKey from '@/lib/request/bots/deleteApiKey';
import { t } from '@/stores/language';
import useModalsStore from '@/stores/modals';
import Link from 'next/link';
import { useState } from 'react';
import { HiExternalLink } from 'react-icons/hi';
import { IoKey } from 'react-icons/io5';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

export default function ApiKey({ apiKey, botId }) {
  const [currentApiKey, setCurrentApiKey] = useState(apiKey);
  const [apiKeyCreating, setApiKeyCreating] = useState(false);
  const [apiKeyDeleting, setApiKeyDeleting] = useState(false);

  const { closeModal, disableButton, enableButton, openModal } = useModalsStore(useShallow(state => ({
    closeModal: state.closeModal,
    disableButton: state.disableButton,
    enableButton: state.enableButton,
    openModal: state.openModal
  })));

  async function createNewApiKey(isNew) {
    setApiKeyCreating(true);

    toast.promise(createApiKey(botId, isNew), {
      error: error => {
        setApiKeyCreating(false);

        return error;
      },
      loading: t('botManagePage.apiKey.toast.creatingApiKey'),
      success: apiKey => {
        setCurrentApiKey(apiKey);
        setApiKeyCreating(false);

        if ('clipboard' in navigator) {
          navigator.clipboard.writeText(apiKey);

          return t('botManagePage.apiKey.toast.createdApiKeyAndCopied');
        }

        return t('botManagePage.apiKey.toast.createdApiKey');
      }
    });
  }

  async function continueDeleteApiKey() {
    setApiKeyDeleting(true);
    disableButton('delete-api-key', 'confirm');

    toast.promise(deleteApiKey(botId), {
      error: error => {
        setApiKeyDeleting(false);
        enableButton('delete-api-key', 'confirm');

        return error;
      },
      loading: t('botManagePage.apiKey.toast.deletingApiKey'),
      success: () => {
        closeModal('delete-api-key');
        setCurrentApiKey(null);
        setApiKeyDeleting(false);

        return t('botManagePage.apiKey.toast.apiKeyDeleted');
      }
    });
  }

  return (
    <div className='flex w-full flex-col gap-y-4'>
      <h3 className='flex items-center gap-x-4 text-xl font-semibold'>
        <IoKey className='text-purple-500' size={24} />
        {t('botManagePage.apiKey.title')}

        <span className='-ml-2 rounded-full bg-black/30 px-2 py-0.5 text-xs text-white dark:bg-white/30 dark:text-white'>
          {t('botManagePage.apiKey.optionalBadge')}
        </span>
      </h3>

      <p className='text-tertiary'>
        {t('botManagePage.apiKey.subtitle')}
      </p>

      {!currentApiKey ? (
        <>
          <button
            className='flex w-max items-center gap-x-1 rounded-xl border border-purple-600 bg-gradient-to-r from-purple-600 via-purple-600 to-purple-900 px-4 py-1.5 text-sm font-semibold text-white hover:opacity-80 disabled:pointer-events-none disabled:opacity-70'
            disabled={apiKeyCreating}
            onClick={() => createNewApiKey(true)}
          >
            {t('buttons.generateApiKey')}
          </button>
        </>
      ) : (
        <>
          <div className='flex flex-col gap-y-2'>
            <div className='flex flex-col items-center gap-2 sm:flex-row'>
              <button
                className='flex w-full items-center gap-x-1 rounded-xl border border-red-600 bg-gradient-to-r from-red-600 via-red-600 to-red-900 px-4 py-1.5 text-sm font-semibold text-white hover:opacity-80 disabled:pointer-events-none disabled:opacity-70 sm:w-max'
                disabled={apiKeyDeleting}
                onClick={() => {
                  openModal('delete-api-key', {
                    buttons: [
                      {
                        actionType: 'close',
                        id: 'cancel',
                        label: t('buttons.cancel'),
                        variant: 'ghost'
                      },
                      {
                        action: continueDeleteApiKey,
                        id: 'confirm',
                        label: t('buttons.confirm'),
                        variant: 'solid'
                      }
                    ],
                    content: (
                      <p className='text-sm text-tertiary'>
                        {t('botManagePage.apiKey.deleteApiKeyModal.note')}
                      </p>
                    ),
                    description: t('botManagePage.apiKey.deleteApiKeyModal.description'),
                    title: t('botManagePage.apiKey.deleteApiKeyModal.title')
                  });
                }}
              >
                {t('buttons.deleteApiKey')}
              </button>

              <CopyButton
                className='flex w-full items-center gap-x-2 rounded-xl border border-primary bg-quaternary bg-gradient-to-r px-4 py-1.5 text-sm font-semibold outline-none hover:bg-tertiary hover:text-primary disabled:pointer-events-none disabled:opacity-70 sm:w-max'
                copyText={currentApiKey}
                successText={t('botManagePage.apiKey.toast.apiKeyCopied')}
              >
                {t('buttons.copyApiKey')}
              </CopyButton>

              <Link
                className='flex h-max w-full items-center gap-x-1.5 rounded-lg bg-black px-4 py-1.5 text-sm font-semibold text-white hover:bg-black/70 dark:bg-white dark:text-black dark:hover:bg-white/70 sm:w-max'
                href={config.docsUrl}
                rel='noopener noreferrer'
                target='_blank'
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