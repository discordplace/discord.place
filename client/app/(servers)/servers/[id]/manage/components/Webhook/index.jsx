'use client';

import { useEffect, useState } from 'react';
import { HiBell } from 'react-icons/hi';
import Input from '@/app/(servers)/servers/[id]/manage/components/Input';
import { TbLoader } from 'react-icons/tb';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { toast } from 'sonner';
import deleteWebhookSettings from '@/lib/request/servers/deleteWebhookSettings';
import setWebhookSettings from '@/lib/request/servers/setWebhookSettings';
import testServerWebhook from '@/lib/request/servers/testWebhook';
import useLanguageStore, { t } from '@/stores/language';
import cn from '@/lib/cn';
import CodeBlock from '@/app/components/CodeBlock';
import { BiCodeCurly } from 'react-icons/bi';
import revalidateServer from '@/lib/revalidate/server';
import { RiSendPlaneFill } from 'react-icons/ri';
import Tooltip from '@/app/components/Tooltip';
import config from '@/config';
import Twemoji from 'react-twemoji';

export default function Webhook({ serverId, webhookURL: currentWebhookURL, webhookToken: currentWebhookToken, webhookLanguage: currentWebhookLanguage, webhookLanguages, records }) {
  const [defaultWebhookURL, setDefaultWebhookURL] = useState(currentWebhookURL);
  const [defaultWebhookToken, setDefaultWebhookToken] = useState(currentWebhookToken);
  const [defaultWebhookLanguage, setDefaultWebhookLanguage] = useState(currentWebhookLanguage);
  const [webhookURL, setWebhookURL] = useState(currentWebhookURL);
  const [webhookToken, setWebhookToken] = useState(currentWebhookToken);
  const [webhookLanguage, setWebhookLanguage] = useState(currentWebhookLanguage);
  const [savingChanges, setSavingChanges] = useState(false);
  const [changesMade, setChangesMade] = useState(false);

  const isDiscordWebhook = config.discordWebhookRegex.test(webhookURL || '');

  useEffect(() => {
    const isWebhookURLChanged = (webhookURL || null) !== defaultWebhookURL;
    const isWebhookTokenChanged = (webhookToken || null) !== defaultWebhookToken;
    const isWebhookLanguageChanged = (webhookLanguage || null) !== defaultWebhookLanguage;

    setChangesMade(isWebhookURLChanged || isWebhookTokenChanged || isWebhookLanguageChanged);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webhookURL, webhookToken, webhookLanguage]);

  function saveChanges() {
    if ((webhookURL || '') === '' && (webhookToken || '') !== '') return toast.error(t('serverManagePage.webhook.toast.secretRequired'));

    try {
      if (webhookURL !== '') {
        const url = new URL(webhookURL);
        if (url.protocol !== 'https:') return toast.error(t('serverManagePage.webhook.toast.urlNotHTTPS'));
      }

      setSavingChanges(true);

      const functionToCall = (
        webhookURL === '' && (webhookToken || '') === ''
          ? deleteWebhookSettings
          : setWebhookSettings
      );

      toast.promise(functionToCall(serverId, webhookURL || null, webhookToken || null, webhookLanguage || null), {
        loading: t('serverManagePage.webhook.toast.saving'),
        success: () => {
          revalidateServer(serverId);

          setSavingChanges(false);
          setChangesMade(false);

          setDefaultWebhookURL(webhookURL || null);
          setDefaultWebhookToken(webhookToken || null);
          setDefaultWebhookLanguage(webhookLanguage || null);

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

  const [selectedRecord, setSelectedRecord] = useState(records?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())?.[0] || null);
  const language = useLanguageStore(state => state.language);

  const [webhookTestLoading, setWebhookTestLoading] = useState(false);

  async function testWebhook() {
    setWebhookTestLoading(true);

    toast.promise(testServerWebhook(serverId), {
      loading: t('serverManagePage.webhook.toast.testingWebhook'),
      success: () => {
        setSelectedRecord(null);
        revalidateServer(serverId);

        return t('botManagePage.webhook.toast.webhookTested');
      },
      finally: () => setWebhookTestLoading(false)
    });
  }

  useEffect(() => {
    if (isDiscordWebhook) setWebhookToken('');
  }, [isDiscordWebhook]);

  return (
    <div className='flex w-full flex-col gap-y-4'>
      <div className='flex w-full flex-col items-center justify-between sm:flex-row'>
        <div className='flex flex-col gap-y-4'>
          <h3 className='flex items-center gap-x-4 text-xl font-semibold'>
            <HiBell size={24} className='text-purple-500' />
            {t('serverManagePage.webhook.title')}

            <span className='-ml-2 rounded-full bg-black/30 px-2 py-0.5 text-xs text-white dark:bg-white/30 dark:text-white'>
              {t('serverManagePage.webhook.optionalBadge')}
            </span>
          </h3>

          <p className='text-tertiary'>
            {t('serverManagePage.webhook.subtitle')}
          </p>
        </div>

        <div className='mt-4 flex w-full flex-1 justify-end gap-x-2 sm:mt-0'>
          <button
            className='flex w-full items-center justify-center gap-x-1 rounded-xl bg-black/30 px-4 py-1.5 font-semibold text-white hover:bg-black/40 disabled:pointer-events-none disabled:opacity-70 dark:bg-white/30 dark:hover:bg-white/40 sm:w-max'
            disabled={!changesMade || savingChanges}
            onClick={saveChanges}
          >
            {savingChanges ? <TbLoader size={18} className='animate-spin' /> : <IoCheckmarkCircle size={18} />}
            {t('buttons.saveWebhookSettings')}
          </button>
        </div>
      </div>

      <div className='mt-4 flex flex-col gap-8 sm:flex-row'>
        <Input
          label={
            <div className='flex items-center gap-x-2'>
              {t('serverManagePage.webhook.inputs.url.label')}

              {isDiscordWebhook && (
                <Tooltip content={t('serverManagePage.webhook.inputs.url.discordBadge.tooltip')}>
                  <span className='flex items-center gap-x-1 rounded-lg bg-blue-600 px-2 py-0.5 text-xs text-white'>
                    <IoCheckmarkCircle size={16} />

                    {t('serverManagePage.webhook.inputs.url.discordBadge.label')}
                  </span>
                </Tooltip>
              )}
            </div>
          }
          description={t('serverManagePage.webhook.inputs.url.description')}
          placeholder={t('serverManagePage.webhook.inputs.url.placeholder')}
          value={webhookURL}
          onChange={event => setWebhookURL(event.target.value)}
        />

        {isDiscordWebhook ? (
          <Input
            label={t('serverManagePage.webhook.inputs.language.label')}
            description={t('serverManagePage.webhook.inputs.language.description')}
            CustomInput={
              <div className='mt-2 grid grid-cols-2 items-center gap-3'>
                {webhookLanguages.map(locale => (
                  <button
                    key={locale.code}
                    className={cn(
                      'flex flex-1 min-w-max w-full justify-center items-center gap-x-2 rounded-xl bg-secondary border-2 px-4 border-[rgba(var(--bg-background))] py-1.5 text-secondary font-medium',
                      webhookLanguage === locale.code ? 'bg-quaternary cursor-default text-primary border-purple-500' : 'hover:bg-tertiary hover:text-primary'
                    )}
                    onClick={() => setWebhookLanguage(locale.code)}
                  >
                    {webhookLanguage === locale.code ? (
                      <IoCheckmarkCircle size={18} />
                    ) : (
                      <Twemoji options={{ className: 'w-[18px] h-[18px]' }}>
                        {locale.flag}
                      </Twemoji>
                    )}

                    {t(`footer.language.${locale.code}`)}
                  </button>
                ))}
              </div>
            }
          />
        ) : (
          <Input
            label={t('serverManagePage.webhook.inputs.secret.label')}
            description={t('serverManagePage.webhook.inputs.secret.description')}
            placeholder={t('serverManagePage.webhook.inputs.secret.placeholder')}
            value={webhookToken}
            onChange={event => setWebhookToken(event.target.value)}
          />
        )}
      </div>

      {defaultWebhookURL && (
        <div className='mt-4 flex flex-col gap-4'>
          <div className='flex flex-wrap items-center justify-between gap-4'>
            <div className='flex flex-col gap-4'>
              <h3 className='text-lg font-semibold'>
                {t('serverManagePage.webhook.recentDeliveries.title')}
              </h3>

              <p className='text-tertiary'>
                {t('serverManagePage.webhook.recentDeliveries.subtitle')}
              </p>
            </div>

            <button
              className='flex w-full items-center justify-center gap-x-1 rounded-xl bg-green-600 px-4 py-1.5 font-semibold text-white hover:bg-green-700 disabled:pointer-events-none disabled:opacity-70 sm:w-max'
              disabled={savingChanges || webhookTestLoading || changesMade}
              onClick={testWebhook}
            >
              {webhookTestLoading ? <TbLoader size={18} className='animate-spin' /> : <RiSendPlaneFill size={18} />}
              {t('buttons.testWebhook')}
            </button>
          </div>

          {records.length === 0 ? (
            <p className='text-tertiary'>
              {t('serverManagePage.webhook.recentDeliveries.noRecords')}
            </p>
          ) : (
            <div className='mt-2 flex w-full flex-col-reverse gap-8 lg:flex-row'>
              <div className='flex w-full flex-col gap-y-1'>
                {records
                  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                  .map(record => {
                    const isRecordSuccess = record.response_status_code >= 200 && record.response_status_code < 300;

                    return (
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
                            isRecordSuccess ? 'text-green-600' : 'text-red-500'
                          )}
                          onClick={() => setSelectedRecord(record)}
                        >
                          {isRecordSuccess ? t('serverManagePage.webhook.recentDeliveries.successLabel') : t('serverManagePage.webhook.recentDeliveries.errorLabel')}
                        </span>

                        <span className='max-w-[200px] truncate text-xs text-tertiary'>
                          {new URL(record.url).pathname}
                        </span>

                        <span className='flex text-xs text-tertiary'>
                          {record.response_status_code}
                        </span>

                        <span className='ml-auto flex text-xs text-tertiary'>
                          {new Date(record.created_at).toLocaleDateString(language, { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
                        </span>
                      </button>
                    );
                  })}
              </div>

              <div className='flex w-full lg:max-w-[50%]'>
                <div className='flex w-full flex-col gap-y-2 text-xs'>
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