'use client';

import { useEffect, useState } from 'react';
import { HiBell } from 'react-icons/hi';
import Input from '@/app/(servers)/servers/[id]/manage/components/Input';
import { TbLoader } from 'react-icons/tb';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { toast } from 'sonner';
import deleteWebhookSettings from '@/lib/request/servers/deleteWebhookSettings';
import setWebhookSettings from '@/lib/request/servers/setWebhookSettings';
import { t } from '@/stores/language';

export default function Webhook({ serverId, webhookURL: currentWebhookURL, webhookToken: currentWebhookToken }) {
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
    if ((webhookURL || '') === '' && webhookToken !== '') return toast.error(t('serverManagePage.webhook.toast.secretRequired'));
    
    try {
      if (webhookURL !== '') {
        const url = new URL(webhookURL);
        if (url.protocol !== 'https:') return toast.error(t('serverManagePage.webhook.toast.urlNotHTTPS'));
      }
      
      setSavingChanges(true);

      const functionToCall = (
        webhookURL === '' && webhookToken === ''
          ? deleteWebhookSettings
          : setWebhookSettings
      );

      toast.promise(functionToCall(serverId, webhookURL || null, webhookToken || null), {
        loading: t('serverManagePage.webhook.toast.saving'),
        success: () => {
          setSavingChanges(false);
          setChangesMade(false);

          setDefaultWebhookURL(webhookURL || null);
          setDefaultWebhookToken(webhookToken || null);
          
          return t('serverManagePage.webhook.toast.saved');
        },
        error: error => {
          setSavingChanges(false);

          return error;
        }
      });
    } catch {
      return toast.error(t('serverManagePage.webhook.toast.urlNotValid'));
    }
  }
  
  return (
    <div className='flex flex-col w-full gap-y-4'>
      <div className='flex flex-col items-center justify-between w-full sm:flex-row'>
        <div className='flex flex-col gap-y-4'>
          <h3 className='flex items-center text-xl font-semibold gap-x-4'>
            <HiBell size={24} className='text-purple-500' />
            {t('serverManagePage.webhook.title')}

            <span className='-ml-2 text-xs text-white dark:text-white px-2 py-0.5 dark:bg-white/30 bg-black/30 rounded-full'>
              {t('serverManagePage.webhook.optionalBadge')}
            </span>
          </h3>

          <p className='text-tertiary'>
            {t('serverManagePage.webhook.subtitle')}
          </p>
        </div>

        <div className='flex justify-end flex-1 w-full mt-4 sm:mt-0 gap-x-2'>
          <button
            className='px-4 w-full justify-center sm:w-max flex text-white disabled:opacity-70 disabled:pointer-events-none items-center gap-x-1 py-1.5 font-semibold bg-black/30 hover:bg-black/40 dark:hover:bg-white/40 dark:bg-white/30 rounded-xl'
            disabled={!changesMade || savingChanges}
            onClick={saveChanges}
          >
            {savingChanges ? <TbLoader size={18} className='animate-spin' /> : <IoCheckmarkCircle size={18} />}
            {t('buttons.saveWebhookSettings')}
          </button>
        </div>
      </div>

      <div className='flex flex-col gap-8 mt-4 sm:flex-row'>
        <Input
          label={t('serverManagePage.webhook.inputs.url.label')}
          description={t('serverManagePage.webhook.inputs.url.description')}
          placeholder={t('serverManagePage.webhook.inputs.url.placeholder')}
          value={webhookURL}
          onChange={event => setWebhookURL(event.target.value)}
        />

        <Input
          label={t('serverManagePage.webhook.inputs.secret.label')}
          description={t('serverManagePage.webhook.inputs.secret.description')}
          placeholder={t('serverManagePage.webhook.inputs.secret.placeholder')}
          value={webhookToken}
          onChange={event => setWebhookToken(event.target.value)}
        />
      </div>
    </div>
  );
}