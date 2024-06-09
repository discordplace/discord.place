'use client';

import config from '@/config';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { IoMdCheckmarkCircle } from 'react-icons/io';
import { IoReload } from 'react-icons/io5';
import { MdChevronLeft } from 'react-icons/md';
import { toast } from 'sonner';
import { TbLoader } from 'react-icons/tb';
import editBot from '@/lib/request/bots/editBot';
import { RiErrorWarningFill, RiEyeFill, RiEyeOffFill, RiKey2Line } from 'react-icons/ri';
import { FaEyeSlash, FaRegTrashAlt, FaEye } from 'react-icons/fa';
import deleteBot from '@/lib/request/bots/deleteBot';
import createApiKey from '@/lib/request/bots/createApiKey';
import deleteApiKey from '@/lib/request/bots/deleteApiKey';
import getData from '@/lib/request/auth/getData';
import { useRouter } from 'next-nprogress-bar';
import revalidateBot from '@/lib/revalidate/bot';
import Image from 'next/image';
import Markdown from '@/app/components/Markdown';
import cn from '@/lib/cn';
import CopyButton from '@/app/components/CopyButton';
import Tooltip from '@/app/components/Tooltip';
import ServerIcon from '@/app/(servers)/servers/components/ServerIcon';
import { HiExternalLink } from 'react-icons/hi';
import useModalsStore from '@/stores/modals';
import { useShallow } from 'zustand/react/shallow';

export default function Content({ bot }) {
  const [currentBot, setCurrentBot] = useState(bot);
  const [newShortDescription, setNewShortDescription] = useState(currentBot.short_description);
  const [newDescription, setNewDescription] = useState(currentBot.description);
  const [newInviteUrl, setNewInviteUrl] = useState(currentBot.invite_url);
  const [newCategories, setNewCategories] = useState(currentBot.categories);
  const [newSupportServerId, setNewSupportServerId] = useState(currentBot.support_server?.id || '');
  const [newWebhookUrl, setNewWebhookUrl] = useState(currentBot.webhook?.url || '');
  const [newWebhookToken, setNewWebhookToken] = useState(currentBot.webhook?.token || '');

  const descriptionRef = useRef(null);
  const [markdownPreviewing, setMarkdownPreviewing] = useState(false);
  const [domLoaded, setDomLoaded] = useState(false);
  const [ownedServersLoading, setOwnedServersLoading] = useState(true);
  const [ownedServers, setOwnedServers] = useState([]);

  useEffect(() => {
    setDomLoaded(true);
    setOwnedServersLoading(true);

    getData(['servers'])
      .then(data => setOwnedServers(data.servers))
      .catch(toast.error)
      .finally(() => setOwnedServersLoading(false));

    return () => setDomLoaded(false);
  }, []);

  useEffect(() => {
    if (markdownPreviewing === false) descriptionRef.current.innerText = newDescription;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markdownPreviewing]);
  
  const [loading, setLoading] = useState(false);
  const [apiKeyLoading, setApiKeyLoading] = useState(false);
  const [apiKeyBlurred, setApiKeyBlurred] = useState(true);
  const [webhookTokenBlurred, setWebhookTokenBlurred] = useState(true);
  const [anyChangesMade, setAnyChangesMade] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    setAnyChangesMade(
      newShortDescription !== currentBot.short_description ||
      newDescription !== currentBot.description ||
      newInviteUrl !== currentBot.invite_url ||
      newCategories.length !== currentBot.categories.length ||
      newSupportServerId !== (currentBot.support_server?.id || '') ||
      newWebhookUrl !== (currentBot.webhook?.url || '') ||
      newWebhookToken !== (currentBot.webhook?.token || '')
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newDescription, newShortDescription, newInviteUrl, newCategories, newSupportServerId, newWebhookUrl, newWebhookToken]);

  async function save() {
    if (!newWebhookUrl && newWebhookToken) return toast.error('You need to provide a Webhook URL if you want to use a Webhook Token.');

    if (!anyChangesMade) return toast.error('No changes were made.');
    
    setLoading(true);

    const newBotData = {
      newDescription,
      newShortDescription,
      newInviteUrl,
      newCategories,
      newWebhook: {
        url: currentBot?.url || null,
        token: currentBot.webhook?.token || null
      }
    };

    if (newSupportServerId) newBotData.newSupportServerId = newSupportServerId;
    if (!newWebhookUrl) newBotData.newWebhook = { url: null, token: null };
    else {
      newBotData.newWebhook = {
        url: newWebhookUrl,
        token: newWebhookToken || null
      };
    }

    toast.promise(editBot(currentBot.id, newBotData), {
      loading: 'Saving changes..',
      success: newBot => {
        setLoading(false);
        setAnyChangesMade(false);
        setCurrentBot(oldBot => ({ ...oldBot, ...newBot }));
        revalidateBot(newBot.id);

        return 'Successfully saved changes!';
      },
      error: error => {
        setLoading(false);
        return error;
      }
    });
  }

  const { openModal, disableButton, enableButton, closeModal } = useModalsStore(useShallow(state => ({
    openModal: state.openModal,
    disableButton: state.disableButton,
    enableButton: state.enableButton,
    closeModal: state.closeModal
  })));

  async function continueDeleteBot() {
    disableButton('delete-bot', 'confirm');
    setLoading(true);

    toast.promise(deleteBot(currentBot.id), {
      loading: `Deleting ${currentBot.username}..`,
      success: () => {
        closeModal('delete-bot');
        setTimeout(() => router.push('/'), 3000);
        
        return `Successfully deleted ${currentBot.username}. You will be redirected to the home page in a few seconds.`;
      },
      error: error => {
        enableButton('delete-bot', 'confirm');
        setLoading(false);

        return error;
      }
    });
  }

  async function createNewApiKey(isNew) {
    setApiKeyLoading(true);

    toast.promise(createApiKey(currentBot.id, isNew), {
      loading: 'Creating new API key..',
      success: apiKey => {
        setApiKeyLoading(false);
        setCurrentBot(oldBot => ({ ...oldBot, api_key: apiKey }));

        if ('clipboard' in navigator) {
          navigator.clipboard.writeText(apiKey);
          return 'Successfully created new API key and copied it to clipboard!';
        }

        return 'Successfully created new API key!';
      },
      error: error => {
        setApiKeyLoading(false);
        return error;
      }
    });
  }

  async function continueDeleteApiKey() {
    setApiKeyLoading(true);

    toast.promise(deleteApiKey(currentBot.id), {
      loading: 'Deleting API key..',
      success: () => {
        setApiKeyLoading(false);
        setCurrentBot(oldBot => ({ ...oldBot, api_key: null }));

        return 'Successfully deleted API key!';
      },
      error: error => {
        setApiKeyLoading(false);
        return error;
      }
    });
  }

  return (
    <div className='flex flex-col items-center justify-center h-full px-8 mt-48 mb-16 gap-y-4 lg:px-0'>
      <div className="flex justify-center w-full max-w-[800px] flex-col">
        <div className='flex items-center gap-x-4'>
          <Link className="p-1.5 rounded-xl bg-secondary hover:bg-tertiary" href={`/bots/${currentBot.id}`}>
            <MdChevronLeft size={24} />
          </Link>
              
          <h1 className="flex items-center text-xl font-bold sm:text-3xl gap-x-1">
            Manage <Image width={32} height={32} src={currentBot.avatar_url} alt={`${currentBot.username}'s avatar`} className='rounded-lg' /> <span className='truncate'>{currentBot.username}#{currentBot.discriminator}</span>
          </h1>
        </div>
              
        <p className='mt-4 text-sm sm:text-base max-w-[800px] text-tertiary'>
          You{'\''}re currently managing {currentBot.username}. You can edit the about section, invite link, and more.
        </p>

        <div className='flex flex-col gap-y-1'>
          <h2 className='mt-12 text-lg font-semibold'>
            Short Description
          </h2>
                  
          <p className='text-sm sm:text-base text-tertiary'>
            This is the short description that will be shown to everyone who visits your bot on discord.place.
          </p>

          <input
            className='block w-full p-2 mt-4 text-sm border-2 border-transparent rounded-lg outline-none bg-secondary text-placeholder focus-visible:text-primary focus-visible:border-purple-500'
            maxLength={config.botShortDescriptionMaxLength}
            value={newShortDescription}
            onChange={event => setNewShortDescription(event.target.value)}
          />

          <h2 className='mt-8 text-lg font-semibold'>
            Description
          </h2>
                  
          <p className='text-sm sm:text-base text-tertiary'>
            This is the more detailed description of your bot. You can use this to tell everyone what your bot does and how it works. You can use markdown here.
          </p>

          <button 
            className='mt-4 flex items-center gap-x-1.5 px-3 py-1.5 rounded-lg font-semibold text-white bg-black w-max h-max hover:bg-black/70 dark:bg-white dark:text-black dark:hover:bg-white/70 text-sm disabled:pointer-events-none disabled:opacity-70' 
            onClick={() => setMarkdownPreviewing(!markdownPreviewing)}
          >
            {markdownPreviewing ? (
              <>
                <RiEyeOffFill />
                Back to Editing
              </>
            ) : (
              <>
                <RiEyeFill />
                Show Markdown Preview
              </>
            )}
          </button>

          {markdownPreviewing ? (
            <Markdown className='mt-4 h-[250px] overflow-y-auto rounded-lg border-2 border-transparent'>
              {newDescription}
            </Markdown>
          ) : (
            <div className='relative'>
              <span 
                contentEditable='plaintext-only' 
                suppressContentEditableWarning 
                className={cn(
                  'block w-full h-[250px] p-2 mt-4 overflow-y-auto border-2 border-transparent rounded-lg outline-none bg-secondary text-placeholder focus-visible:text-primary focus-visible:border-purple-500',
                  !domLoaded && 'pointer-events-none'
                )} 
                onKeyUp={event => {
                  if (event.target.textContent.length > config.botDescriptionMaxCharacters) return toast.error(`Description can only contain ${config.serverDescriptionMaxCharacters} characters.`);
                  setNewDescription(event.target.innerText);
                }}
                ref={descriptionRef}
              />

              {!domLoaded && (
                <div className='absolute top-0 left-0 flex items-center justify-center w-full h-full text-tertiary'>
                  <TbLoader className='animate-spin' size={20} />
                </div>
              )}
            </div>
          )}

          <h2 className='mt-8 text-lg font-semibold'>
            Invite url
          </h2>
                  
          <p className='text-sm sm:text-base text-tertiary'>
            This is the invite URL of your bot. This is the link that users will use to add your bot to their server. You can use default Discord authorization link or custom one.
          </p>

          <input
            className='block w-full p-2 mt-4 text-sm border-2 border-transparent rounded-lg outline-none bg-secondary text-placeholder focus-visible:text-primary focus-visible:border-purple-500'
            value={newInviteUrl}
            onChange={event => setNewInviteUrl(event.target.value)}
          />

          <h2 className='mt-8 text-lg font-semibold'>
            Category
          </h2>

          <p className='text-sm text-tertiary'>
            Select all categories that your bot belongs to. This will help users find your bot.
          </p>

          <div className='flex flex-wrap mt-4 gap-x-2 gap-y-2'>
            {config.botCategories.map(category => (
              <button 
                key={category} 
                className={cn(
                  'rounded-lg flex items-center gap-x-1 font-semibold w-max h-max text-sm px-3 py-1.5 bg-secondary hover:bg-quaternary',
                  newCategories.includes(category) && 'bg-quaternary'
                )}
                onClick={() => {
                  if (newCategories.includes(category)) setNewCategories(oldCategories => oldCategories.filter(oldCategory => oldCategory !== category));
                  else setNewCategories(oldCategories => [...oldCategories, category]);
                }}
              >
                {newCategories.includes(category) ? <IoMdCheckmarkCircle /> : config.botCategoriesIcons[category]}
                {category}
              </button>
            ))}
          </div>

          <h2 className='flex items-center mt-8 text-lg font-semibold gap-x-2'>
            Support Server <span className='text-xs font-normal select-none text-tertiary'>(optional)</span>
          </h2>

          <p className='text-sm sm:text-base text-tertiary'>
            You can select a server that users can join to get support for your bot. This is optional.<br/>
            You can only select servers that you listed on discord.place.
          </p>
          
          {ownedServersLoading ? (
            <div className='mt-4 rounded-lg flex items-center justify-center w-full h-[100px] bg-secondary'>
              <TbLoader className='text-2xl text-tertiary animate-spin' />
            </div>
          ) : (
            ownedServers.filter(server => server.is_created).length <= 0 ? (
              <p className='mt-4 text-sm text-tertiary'>
                You don{'\''}t have any servers listed on discord.place.
              </p>
            ) : (
              <div className='grid grid-cols-1 gap-4 mt-4 mobile:grid-cols-2 sm:grid-cols-4 lg:grid-cols-5'>
                {ownedServers.filter(server => server.is_created).map(server => (
                  <button 
                    className="flex flex-col bg-tertiary hover:bg-quaternary p-2 rounded-xl w-full h-[180px] items-center cursor-pointer overflow-clip relative"
                    key={server.id}
                    onClick={() => setNewSupportServerId(oldServerId => oldServerId === server.id ? '' : server.id)}
                  >                     
                    <div className='relative'>
                      <ServerIcon width={128} height={128} icon_url={server.icon_url} name={server.name} />
                      <div className={cn(
                        'absolute w-full h-full text-3xl text-primary transition-opacity rounded-lg flex items-center justify-center bg-secondary/60 z-[0] top-0 left-0',
                        newSupportServerId !== server.id && 'opacity-0'
                      )}>
                        <IoMdCheckmarkCircle />
                      </div>
                    </div>
                
                    <h1 className="w-full max-w-full mt-2 text-base font-medium text-center truncate">{server.name}</h1>
                  </button>
                ))}
              </div>
            )
          )}

          <h2 className="mt-8 text-lg font-semibold">
            Webhook <span className="text-xs font-normal select-none text-tertiary">(optional)</span>
          </h2>

          <p className="text-sm text-tertiary">
            You can use webhooks to get notified when someone votes for your bot. Documentation can be found <Link href={config.docsUrl} target="_blank" rel="noopener noreferrer" className="text-primary">here</Link>.
          </p>


          <h3 className="mt-4 text-sm font-medium text-secondary">
            Webhook URL
          </h3>
          
          <input
            className='block w-full p-2 mt-2 text-sm border-2 border-transparent rounded-lg outline-none bg-secondary text-placeholder focus-visible:text-primary focus-visible:border-purple-500'
            value={newWebhookUrl}
            onChange={event => setNewWebhookUrl(event.target.value)}
          />

          <h3 className="mt-4 text-sm font-medium text-secondary">
            Webhook Token
          </h3>

          <div className='relative flex items-center justify-center mt-2'>
            <input
              className='block w-full p-2 pr-16 text-sm border-2 rounded-lg outline-none border-primary bg-secondary text-placeholder focus-visible:text-primary focus-visible:border-purple-500'
              value={newWebhookToken}
              onChange={event => setNewWebhookToken(event.target.value)}
              type={webhookTokenBlurred ? 'password' : 'text'}
            />

            <div className='absolute right-0 flex items-center gap-x-1'>
              <Tooltip content={webhookTokenBlurred ? 'Click to show Webhook Token' : 'Click to hide Webhook Token'}>
                <div className='flex items-center text-sm text-secondary hover:text-tertiary'>
                  <FaEye 
                    className={cn(
                      'cursor-pointer transition-all',
                      !webhookTokenBlurred && 'opacity-0 scale-0'
                    )} 
                    onClick={() => setWebhookTokenBlurred(old => !old)} 
                  />
                  
                  <FaEyeSlash
                    className={cn(
                      'cursor-pointer transition-all absolute',
                      webhookTokenBlurred && 'opacity-0 scale-0'
                    )}
                    onClick={() => setWebhookTokenBlurred(old => !old)}
                  />
                </div>
              </Tooltip>
            
              <CopyButton
                successText='Copied Webhook Token!'
                copyText={newWebhookToken}
                className='justify-end'
              />
            </div>
          </div>

          {bot.permissions.canEditAPIKey && (
            <>
              <h2 className='mt-8 text-lg font-semibold'>
                API Key
              </h2>

              {currentBot.api_key ? (
                <>
                  <div className='flex flex-col-reverse gap-4 mt-4 lg:items-center lg:flex-row'>
                    <div className='relative flex items-center py-1 text-sm font-medium border-2 rounded-lg sm:pl-3 border-primary gap-x-2 bg-secondary text-tertiary'>
                      <Tooltip 
                        content={apiKeyBlurred ? 'Click to show API Key' : 'Click to hide API Key'} 
                        side='left'
                      >
                        <span 
                          className={cn(
                            'px-2 lg:px-0 lg:-mr-3 cursor-pointer select-none transition-all break-words w-full',
                            apiKeyBlurred && 'blur-[4px]'
                          )}
                          onClick={() => setApiKeyBlurred(old => !old)}
                        >
                          {currentBot.api_key}
                        </span>
                      </Tooltip>

                      <CopyButton
                        successText='Copied API Key!'
                        copyText={currentBot.api_key}
                        className='justify-end'
                      />
                    </div>

                    <div className='flex gap-x-1'>
                      <button 
                        className='flex items-center gap-x-1.5 px-3 py-2 rounded-lg font-semibold text-white bg-black w-max h-max hover:bg-black/70 dark:bg-white dark:text-black dark:hover:bg-white/70 text-sm disabled:pointer-events-none disabled:opacity-70' 
                        onClick={() => createNewApiKey(false)}
                        disabled={apiKeyLoading}
                      >
                        {apiKeyLoading ? <TbLoader className='animate-spin' /> : <IoReload />}
                        Change API Key
                      </button>

                      <button
                        className='flex items-center gap-x-1.5 px-3 py-[0.69rem] rounded-lg font-semibold text-white bg-red-500 w-max h-max hover:bg-red-500/70 text-sm disabled:pointer-events-none disabled:opacity-70'
                        onClick={continueDeleteApiKey}
                        disabled={apiKeyLoading}
                      >
                        {apiKeyLoading ? <TbLoader className='animate-spin' /> : <FaRegTrashAlt />}
                      </button>
                    </div>
                  </div>

                  <p className='mt-2 text-sm text-tertiary'>
                    This key should be kept secret and should not be shared with anyone.
                  </p>
                </>
              ) : (
                <>
                  <p className='text-sm text-tertiary'>
                    You can create a new API key for your bot. This key can be used to authenticate your bot with discord.place API.
                  </p>

                  <button 
                    className='mt-4 flex items-center gap-x-1.5 px-3 py-1.5 rounded-lg font-semibold text-white bg-black w-max h-max hover:bg-black/70 dark:bg-white dark:text-black dark:hover:bg-white/70 text-sm disabled:pointer-events-none disabled:opacity-70' 
                    onClick={() => createNewApiKey(true)}
                    disabled={apiKeyLoading}
                  >
                    {apiKeyLoading ? <TbLoader className='animate-spin' /> : <RiKey2Line />}
                    Create New API Key
                  </button>
                </>
              )}

              <Link
                href={config.docsUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='mt-4 flex items-center gap-x-1.5 px-3 py-1.5 rounded-lg font-semibold text-white bg-black w-max h-max hover:bg-black/70 dark:bg-white dark:text-black dark:hover:bg-white/70 text-sm'
              >
                API Documentation
                <HiExternalLink />
              </Link>
            </>
          )}

          <h2 className='mt-8 text-lg font-semibold'>
            Are you ready?
          </h2>

          <p className='text-sm sm:text-base text-tertiary'>
            Make sure to double-check everything before saving. Once you save, the changes will be live on discord.place.
          </p>
                  
          <div className='flex flex-col w-full gap-2 mt-2 sm:flex-row'>
            <button 
              className='flex items-center gap-x-1.5 px-3 py-1.5 rounded-lg font-semibold text-white bg-black w-full justify-center hover:bg-black/70 dark:bg-white dark:text-black dark:hover:bg-white/70 text-sm disabled:pointer-events-none disabled:opacity-70' 
              disabled={
                !anyChangesMade ||
                loading ||
                newDescription.length < 1 ||
                newShortDescription.length < 1 ||
                newInviteUrl.length < 1 ||
                newCategories.length < 1
              } 
              onClick={save}
            >
              {loading && <TbLoader className='animate-spin' />}
              Save
            </button>
            <button className='flex items-center justify-center w-full py-2 text-sm font-medium rounded-lg hover:bg-secondary disabled:pointer-events-none disabled:opacity-70'
              onClick={() => {
                setNewShortDescription(currentBot.short_description);
                setNewDescription(currentBot.description);
                setNewInviteUrl(currentBot.invite_url);
                setNewCategories(currentBot.categories);
                setNewSupportServerId(currentBot.support_server?.id || '');
              }}
              disabled={!anyChangesMade || loading}
            >
              Cancel
            </button>
          </div>

          {currentBot.permissions.canDelete && (
            <div className='flex flex-col p-4 mt-8 border border-red-500 gap-y-2 bg-red-500/10 rounded-xl'>
              <h1 className='text-lg text-primary flex items-center font-semibold gap-x-1.5'>
                <RiErrorWarningFill />
                Danger Zone
              </h1>
              <p className='text-sm font-medium text-tertiary'>
                You can delete the bot using the button below, but be careful not to delete it by mistake :)
              </p>
              
              <div className='flex mt-1 gap-x-2'>
                <button
                  className='px-3 py-1 text-sm font-medium text-white bg-black rounded-lg w-max dark:bg-white dark:text-black dark:hover:bg-white/70 hover:bg-black/70'
                  onClick={() => 
                    openModal('delete-bot', {
                      title: 'Delete Bot',
                      description: `Are you sure you want to delete ${currentBot.username}?`,
                      content: (
                        <p className='text-sm text-tertiary'>
                          Please note that deleting your bot will remove all votes and reviews that your bot has received.<br/><br/>
                          This action cannot be undone.
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
                          action: continueDeleteBot
                        }
                      ]
                    })
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}