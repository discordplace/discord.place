'use client';

import { useEffect, useState } from 'react';
import { HiBell } from 'react-icons/hi';
import Input from '@/app/(bots)/bots/[id]/manage/components/Input';
import { TbLoader } from 'react-icons/tb';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { toast } from 'sonner';
import deleteWebhookSettings from '@/lib/request/bots/deleteWebhookSettings';
import setWebhookSettings from '@/lib/request/bots/setWebhookSettings';
import useLanguageStore, { t } from '@/stores/language';
import cn from '@/lib/cn';
import CodeBlock from '@/app/components/CodeBlock';
import { BiCodeCurly } from 'react-icons/bi';
import { FaFileCode } from 'react-icons/fa';
import revalidateBot from '@/lib/revalidate/bot';

export default function Webhook({ botId, webhookURL: currentWebhookURL, webhookToken: currentWebhookToken, records }) {
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
    if ((webhookURL || '') === '' && webhookToken !== '') return toast.error(t('botManagePage.webhook.toast.secretRequired'));
    
    try {
      if (webhookURL !== '') {
        const url = new URL(webhookURL);
        if (url.protocol !== 'https:') return toast.error(t('botManagePage.webhook.toast.urlNotHTTPS'));
      }
      
      setSavingChanges(true);

      const functionToCall = (
        webhookURL === '' && webhookToken === ''
          ? deleteWebhookSettings
          : setWebhookSettings
      );

      toast.promise(functionToCall(botId, webhookURL || null, webhookToken || null), {
        loading: t('botManagePage.webhook.toast.saving'),
        success: () => {
          revalidateBot(botId);

          setSavingChanges(false);
          setChangesMade(false);

          setDefaultWebhookURL(webhookURL || null);
          setDefaultWebhookToken(webhookToken || null);
          
          return t('botManagePage.webhook.toast.saved');
        },
        error: error => {
          setSavingChanges(false);

          return error;
        }
      });
    } catch {
      return toast.error(t('botManagePage.webhook.toast.urlNotValid'));
    }
  }

  const [selectedRecord, setSelectedRecord] = useState(records[0] || null);
  const language = useLanguageStore(state => state.language);
  
  let responseIsJSON = false;
  
  try {
    JSON.parse(selectedRecord?.response_body);
    responseIsJSON = true;
    // eslint-disable-next-line no-empty
  } catch {}

  return (
    <div className='flex flex-col w-full gap-y-4'>
      <div className='flex flex-col items-center justify-between w-full sm:flex-row'>
        <div className='flex flex-col gap-y-4'>
          <h3 className='flex items-center text-xl font-semibold gap-x-4'>
            <HiBell size={24} className='text-purple-500' />
            {t('botManagePage.webhook.title')}

            <span className='-ml-2 text-xs text-white dark:text-white px-2 py-0.5 dark:bg-white/30 bg-black/30 rounded-full'>
              {t('botManagePage.webhook.optionalBadge')}
            </span>
          </h3>

          <p className='text-tertiary'>
            {t('botManagePage.webhook.subtitle')}
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
          label={t('botManagePage.webhook.inputs.url.label')}
          description={t('botManagePage.webhook.inputs.url.description')}
          placeholder={t('botManagePage.webhook.inputs.url.placeholder')}
          value={webhookURL}
          onChange={event => setWebhookURL(event.target.value)}
        />

        <Input
          label={t('botManagePage.webhook.inputs.secret.label')}
          description={t('botManagePage.webhook.inputs.secret.description')}
          placeholder={t('botManagePage.webhook.inputs.secret.placeholder')}
          value={webhookToken}
          onChange={event => setWebhookToken(event.target.value)}
        />
      </div>

      {defaultWebhookURL && (
        <div className='flex flex-col gap-4 mt-4'>
          <h3 className='text-lg font-semibold'>
            Recent Delivery Records
          </h3>

          <p className='text-tertiary'>
            We deliver webhook payloads to the URL you specify. Here are the most recent deliveries.
          </p>

          {records.length === 0 ? (
            <p className='text-tertiary'>
              No delivery records found.
            </p>
          ) : (
            <div className='flex flex-col-reverse w-full gap-8 mt-2 lg:flex-row'>
              <div className='flex flex-col w-full gap-y-1'>
                {records.map(record => (
                  <button
                    key={`record-${record.created_at}`}
                    className={cn(
                      'flex gap-x-2 select-none items-center bg-secondary py-2 px-4 rounded-lg',
                      selectedRecord === record ? 'bg-quaternary cursor-default' : 'hover:bg-tertiary'
                    )}
                    onClick={() => setSelectedRecord(record)}
                  >
                    <span
                      className={cn(
                        'flex font-semibold text-xs',
                        record.response_status_code === 200 ? 'text-green-600' : 'text-red-500'
                      )}
                      onClick={() => setSelectedRecord(record)}
                    >
                      {record.response_status_code === 200 ? 'Success' : 'Failed'}
                    </span>

                    <span className='max-w-[200px] truncate text-xs text-tertiary'>
                      {new URL(record.url).pathname}
                    </span>

                    <span className='flex text-xs text-tertiary'>
                      {record.response_status_code}
                    </span>

                    <span className='flex ml-auto text-xs text-tertiary'>
                      {new Date(record.created_at).toLocaleDateString(language, { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
                    </span>
                  </button>
                ))}
              </div>
              
              <div className='flex w-full lg:max-w-[50%]'>
                <div className='flex flex-col w-full text-xs gap-y-2'>
                  {responseIsJSON ? (
                    <CodeBlock
                      language='json'
                      fileName='response-body.json'
                      FileIcon={<BiCodeCurly />}
                    >
                      {JSON.stringify(JSON.parse(selectedRecord?.response_body), null, 2)}
                    </CodeBlock>
                  ) : (
                    <CodeBlock
                      language='txt'
                      fileName='response-body.txt'
                      FileIcon={<FaFileCode />}
                    >
                      {selectedRecord?.response_body || 'N/A'}
                    </CodeBlock>
                  )}
                  
                  <CodeBlock
                    language='json'
                    fileName='request-body.json'
                    FileIcon={<BiCodeCurly size={16} />}
                  >
                    {selectedRecord?.request_body ? JSON.stringify(selectedRecord?.request_body, null, 2) : 'N/A'}
                  </CodeBlock>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}