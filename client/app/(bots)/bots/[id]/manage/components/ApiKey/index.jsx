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
      loading: 'Creating new API key..',
      success: apiKey => {
        setCurrentApiKey(apiKey);
        setApiKeyCreating(false);

        if ('clipboard' in navigator) {
          navigator.clipboard.writeText(apiKey);
          return 'Successfully created new API key and copied it to clipboard!';
        }

        return 'Successfully created new API key!';
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
      loading: 'Deleting API key..',
      success: () => {
        closeModal('delete-api-key');
        setCurrentApiKey(null);
        setApiKeyDeleting(false);

        return 'Successfully deleted API key!';
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
        API Key

        <span className='-ml-2 text-xs text-white dark:text-white px-2 py-0.5 dark:bg-white/30 bg-black/30 rounded-full'>
          Optional
        </span>
      </h3>

      <p className='text-tertiary'>
        You can manage your API key for your bot. This key can be used to authenticate your bot with discord.place API.
      </p>

      {!currentApiKey ? (
        <>
          <button
            className='text-sm w-max px-4 flex text-white disabled:opacity-70 disabled:pointer-events-none items-center gap-x-1 py-1.5 font-semibold bg-gradient-to-r hover:opacity-80 from-purple-600 via-purple-600 border border-purple-600 to-purple-900 rounded-xl'
            onClick={() => createNewApiKey(true)}
            disabled={apiKeyCreating}
          >
            Generate API Key
          </button>
        </>
      ) : (
        <>
          <div className='flex flex-col gap-y-2'>
            <div className='flex items-center gap-x-2'>
              <button
                className='text-sm w-max px-4 flex text-white disabled:opacity-70 disabled:pointer-events-none items-center gap-x-1 py-1.5 font-semibold bg-gradient-to-r hover:opacity-80 from-red-600 via-red-600 border border-red-600 to-red-900 rounded-xl'
                onClick={() => {
                  openModal('delete-api-key', {
                    title: 'Delete API Key',
                    description: 'Are you sure you want to delete the API key for your bot?',
                    content: (
                      <p className='text-sm text-tertiary'>
                        This action is irreversible and you will not be able to recover your API key after deleting it.
                      </p>
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
                        action: continueDeleteApiKey
                      }
                    ]
                  });
                }}
                disabled={apiKeyDeleting}
              >
                Delete API Key
              </button>

              <CopyButton
                className='text-sm w-max outline-none px-4 flex disabled:opacity-70 disabled:pointer-events-none items-center gap-x-2 py-1.5 font-semibold bg-gradient-to-r bg-quaternary hover:bg-tertiary hover:text-primary border border-primary rounded-xl'
                successText='API Key copied to clipboard!'
                copyText={currentApiKey}
              >
                Copy API Key
              </CopyButton>

              <Link
                href={config.docsUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-x-1.5 px-4 py-1.5 rounded-lg font-semibold text-white bg-black w-max h-max hover:bg-black/70 dark:bg-white dark:text-black dark:hover:bg-white/70 text-sm'
              >
                API Documentation
                <HiExternalLink />
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}