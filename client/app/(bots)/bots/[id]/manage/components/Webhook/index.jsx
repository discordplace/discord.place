'use client';

import config from '@/config';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { HiBell } from 'react-icons/hi';
import Input from '@/app/(bots)/bots/[id]/manage/components/Input';
import { TbLoader } from 'react-icons/tb';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { toast } from 'sonner';
import deleteWebhookSettings from '@/lib/request/bots/deleteWebhookSettings';
import setWebhookSettings from '@/lib/request/bots/setWebhookSettings';

export default function Other({ botId, webhookURL: currentWebhookURL, webhookToken: currentWebhookToken }) {
  const [defaultWebhookURL, setDefaultWebhookURL] = useState(currentWebhookURL);
  const [defaultWebhookToken, setDefaultWebhookToken] = useState(currentWebhookToken);
  const [webhookURL, setWebhookURL] = useState(currentWebhookURL);
  const [webhookToken, setWebhookToken] = useState(currentWebhookToken);
  const [savingChanges, setSavingChanges] = useState(false);
  const [changesMade, setChangesMade] = useState(false);

  useEffect(() => {
    const isWebhookURLChanged = (webhookURL || null) !== defaultWebhookURL;
    const isWebhookTokenChanged = (webhookToken || null) !== defaultWebhookToken;

    setChangesMade(isWebhookURLChanged || isWebhookTokenChanged);
 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webhookURL, webhookToken]);

  function saveChanges() {
    if ((webhookURL || '') === '' && webhookToken !== '') return toast.error('You should fill Webhook URL if you want to use a secret.');
    
    try {
      if (webhookURL !== '') {
        const url = new URL(webhookURL);
        if (url.protocol !== 'https:') return toast.error('Webhook URL should be a HTTPS URL.');
      }
      
      setSavingChanges(true);

      const functionToCall = (
        webhookURL === '' && webhookToken === ''
          ? deleteWebhookSettings
          : setWebhookSettings
      );

      toast.promise(functionToCall(botId, webhookURL || null, webhookToken || null), {
        loading: 'Saving webhook settings...',
        success: () => {
          setSavingChanges(false);
          setChangesMade(false);

          setDefaultWebhookURL(webhookURL || null);
          setDefaultWebhookToken(webhookToken || null);
          
          return 'Webhook settings saved successfully.';
        },
        error: error => {
          setSavingChanges(false);

          return error;
        }
      });
    } catch {
      return toast.error('Webhook URL is not a valid URL.');
    }
  }
  
  return (
    <div className='flex flex-col w-full gap-y-4'>
      <div className='flex items-center justify-between w-full'>
        <div className='flex flex-col gap-y-4'>
          <h3 className='flex items-center text-xl font-semibold gap-x-4'>
            <HiBell size={24} className='text-purple-500' />
              Webhook

            <span className='-ml-2 text-xs text-white dark:text-white px-2 py-0.5 dark:bg-white/30 bg-black/30 rounded-full'>
              Optional
            </span>
          </h3>

          <p className='text-tertiary'>
              Get notified when someone votes for your bot. Documentation can be found{' '}
            <Link
              href={config.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:underline hover:text-primary"
            >
              here
            </Link>.
          </p>
        </div>

        <div className='flex justify-end flex-1 w-full gap-x-2'>
          <button
            className='px-4 flex text-white disabled:opacity-70 disabled:pointer-events-none items-center gap-x-1 py-1.5 font-semibold bg-black/30 hover:bg-black/40 dark:hover:bg-white/40 dark:bg-white/30 rounded-xl'
            disabled={!changesMade || savingChanges}
            onClick={saveChanges}
          >
            {savingChanges ? <TbLoader size={18} className='animate-spin' /> : <IoCheckmarkCircle size={18} />}
            Save Webhook Settings
          </button>
        </div>
      </div>

      <div className='flex gap-8 mt-4'>
        <Input
          label='URL'
          description='Enter the URL of your webhook.'
          placeholder='https://example.com/webhook'
          value={webhookURL}
          onChange={event => setWebhookURL(event.target.value)}
        />

        <Input
          label='Secret'
          description='Enter the secret of your webhook.'
          placeholder='ed5d38a4-a3b3-4cf0-adc6-da128973b865'
          value={webhookToken}
          onChange={event => setWebhookToken(event.target.value)}
        />
      </div>
    </div>
  );
}