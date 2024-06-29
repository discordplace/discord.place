'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { TbLoader } from 'react-icons/tb';
import { MdSave } from 'react-icons/md';

import isEqual from 'lodash/isEqual';
import EssentialInformation from '@/app/(bots)/bots/[id]/manage/components/EssentialInformation';
import Other from '@/app/(bots)/bots/[id]/manage/components/Other';
import ApiKey from '@/app/(bots)/bots/[id]/manage/components/ApiKey';
import DangerZone from '@/app/(bots)/bots/[id]/manage/components/DangerZone';
import ExtraOwners from '@/app/(bots)/bots/[id]/manage/components/ExtraOwners';
import { toast } from 'sonner';
import editBot from '@/lib/request/bots/editBot';
import revalidateBot from '@/lib/revalidate/bot';

export default function Content({ bot }) {
  const [savingChanges, setSavingChanges] = useState(false);
  const [changesMade, setChangesMade] = useState(false);
  const [changedKeys, setChangedKeys] = useState([]);

  const [shortDescription, setShortDescription] = useState(bot.short_description);
  const [description, setDescription] = useState(bot.description);
  const [inviteURL, setInviteURL] = useState(bot.invite_url);
  const [categories, setCategories] = useState(bot.categories);
  const [supportServerId, setSupportServerId] = useState(bot.support_server?.id || '0');
  const [webhookURL, setWebhookURL] = useState(bot.webhook?.url || 'none');
  const [webhookToken, setWebhookToken] = useState(bot.webhook?.token || 'none');

  // calculate if any changes made, if so, enable the save button

  useEffect(() => {
    const isShortDescriptionChanged = !isEqual(shortDescription, bot.short_description);
    const isDescriptionChanged = !isEqual(description, bot.description);
    const isInviteURLChanged = !isEqual(inviteURL, bot.invite_url);
    const isCategoriesChanged = !isEqual(categories, bot.categories);
    const isSupportServerIdChanged = !isEqual(supportServerId, bot.support_server?.id || '0');
    const isWebhookURLChanged = !isEqual(webhookURL, bot.webhook?.url || 'none');
    const isWebhookTokenChanged = !isEqual(webhookToken, bot.webhook?.token || 'none');

    setChangesMade(
      isShortDescriptionChanged ||
      isDescriptionChanged ||
      isInviteURLChanged ||
      isCategoriesChanged ||
      isSupportServerIdChanged ||
      isWebhookURLChanged ||
      isWebhookTokenChanged
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
    if (isWebhookURLChanged) pushToChangedKeys('webhook_url', webhookURL);
    if (isWebhookTokenChanged) pushToChangedKeys('webhook_token', webhookToken);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shortDescription, description, inviteURL, categories, supportServerId, webhookURL, webhookToken]);

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
      case 'webhook_url':
        setWebhookURL(bot.webhook.url || 'none');
        break;
      case 'webhook_token':
        setWebhookToken(bot.webhook.token || 'none');
        break;
      }
    });

    setChangedKeys([]);
  }

  async function saveChanges() {
    setSavingChanges(true);

    toast.promise(editBot(bot.id, changedKeys), {
      loading: 'Saving changes..',
      success: () => {
        setSavingChanges(false);
        setChangedKeys([]);
        revalidateBot(bot.id);

        return 'Successfully saved changes!';
      },
      error: error => {
        setSavingChanges(false);
        
        return error;
      }
    });
  }

  const [markdownPreviewing, setMarkdownPreviewing] = useState(false);
  
  return (
    <div className="flex items-center justify-center w-full h-full px-4 mb-24 sm:px-12">
      <div className="w-full h-full max-w-[1000px] flex flex-col items-start gap-y-8 mt-48">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col gap-y-1">
            <h2 className="text-3xl font-bold">Manage Bot</h2>
            <p className="text-tertiary">Manage your bot and its settings.</p>
            
            <div className='flex items-center mt-2 font-medium gap-x-2 text-secondary'>
              <Image
                src={bot.avatar_url}
                alt={`${bot.username}'s avatar`}
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

          <div className='flex justify-end flex-1 w-full gap-x-2'>
            <button
              className='disabled:opacity-70 border border-primary hover:border-[rgba(var(--bg-tertiary))] disabled:pointer-events-none px-4 flex items-center gap-x-1.5 py-1.5 font-semibold hover:bg-tertiary hover:text-primary text-tertiary rounded-xl'
              onClick={resetChanges}
              disabled={!changesMade || savingChanges}
            >
              Cancel
            </button>

            <button
              className='px-4 flex text-white disabled:opacity-70 disabled:pointer-events-none items-center gap-x-1 py-1.5 font-semibold hover:bg-purple-600 bg-purple-500 rounded-xl'
              disabled={!changesMade || savingChanges}
              onClick={saveChanges}
            >
              {savingChanges ? <TbLoader size={18} className='animate-spin' /> : <MdSave size={18} />}
              Save Changes
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
          categories={categories}
          setCategories={setCategories}
          canEditSupportServer={bot.permissions.canEditExtraOwners}
          supportServerId={supportServerId}
          setSupportServerId={setSupportServerId}
          webhookURL={webhookURL}
          setWebhookURL={setWebhookURL}
          webhookToken={webhookToken}
          setWebhookToken={setWebhookToken}
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