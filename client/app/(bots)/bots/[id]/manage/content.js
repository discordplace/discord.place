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
import { FaRegTrashAlt } from 'react-icons/fa';
import deleteBot from '@/lib/request/bots/deleteBot';
import createApiKey from '@/lib/request/bots/createApiKey';
import deleteApiKey from '@/lib/request/bots/deleteApiKey';
import { useRouter } from 'next-nprogress-bar';
import revalidateBot from '@/lib/revalidate/bot';
import Image from 'next/image';
import Markdown from '@/app/components/Markdown';
import cn from '@/lib/cn';
import CopyButton from '@/app/components/CopyButton';
import Tooltip from '@/app/components/Tooltip';

export default function Content({ bot }) {
  const [currentBot, setCurrentBot] = useState(bot);
  const [newShortDescription, setNewShortDescription] = useState(currentBot.short_description);
  const [newDescription, setNewDescription] = useState(currentBot.description);
  const [newInviteUrl, setNewInviteUrl] = useState(currentBot.invite_url);
  const [newCategories, setNewCategories] = useState(currentBot.categories);

  const descriptionRef = useRef(null);
  const [markdownPreviewing, setMarkdownPreviewing] = useState(false);
  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    setDomLoaded(true);

    return () => setDomLoaded(false);
  }, []);

  useEffect(() => {
    if (markdownPreviewing === false) descriptionRef.current.innerText = currentBot.description;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markdownPreviewing]);
  
  const [loading, setLoading] = useState(false);
  const [apiKeyLoading, setApiKeyLoading] = useState(false);
  const [apiKeyBlurred, setApiKeyBlurred] = useState(true);
  const [anyChangesMade, setAnyChangesMade] = useState(false);
  const [showDeleteConsent, setShowDeleteConsent] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    setAnyChangesMade(
      newShortDescription !== currentBot.short_description ||
      newDescription !== currentBot.description ||
      newInviteUrl !== currentBot.invite_url ||
      newCategories.length !== currentBot.categories.length
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newDescription, newShortDescription, newInviteUrl, newCategories]);

  async function save() {
    if (!anyChangesMade) return toast.error('No changes were made.');
    
    setLoading(true);

    toast.promise(editBot(currentBot.id, { newDescription, newShortDescription, newInviteUrl, newCategories }), {
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

  async function continueDeleteBot() {
    setLoading(true);

    toast.promise(deleteBot(currentBot.id), {
      loading: `Deleting ${currentBot.username}..`,
      success: () => {
        setTimeout(() => router.push('/'), 3000);
        
        return `Successfully deleted ${currentBot.username}. You will be redirected to the home page in a few seconds.`;
      },
      error: error => {
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
            Manage <Image width={32} height={32} src={currentBot.avatar_url} alt={`${currentBot.username}'s avatar`} className='rounded-lg' /> <span className='truncate'>{currentBot.username}</span>
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
                contentEditable 
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

          {bot.permissions.canEditAPIKey && (
            <>
              <h2 className='mt-8 text-lg font-semibold'>
                API Key
              </h2>

              {currentBot.api_key ? (
                <>
                  <div className='flex items-center mt-4 gap-x-4'>
                    <div className='relative flex items-center py-1 pl-3 text-sm font-medium border-2 rounded-lg border-primary gap-x-2 bg-secondary text-tertiary'>
                      <Tooltip 
                        content={apiKeyBlurred ? 'Click to show API Key' : 'Click to hide API Key'} 
                        side='left'
                      >
                        <span 
                          className={cn(
                            '-mr-3 cursor-pointer select-none transition-all',
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

                  <h2 className='mt-8 text-lg font-semibold'>
                    API Key Usage
                  </h2>

                  <p className='text-sm text-tertiary'>
                    You can use this key to access the API endpoints that require authentication.
                  </p>

                  <div className='flex flex-col mt-4 gap-y-6'>
                    <div className='flex flex-col gap-y-1'>
                      <h3 className='text-sm font-semibold'>
                        Base API URL
                      </h3>

                      <p className='text-sm text-tertiary'>
                        The base URL for discord.place API is as follows.
                      </p>

                      <code className='p-2 mt-2 text-sm font-medium rounded-lg text-tertiary bg-secondary'>
                        {config.api.url}
                      </code>
                    </div>

                    <div className='flex flex-col gap-y-1'>
                      <h3 className='text-sm font-semibold'>
                        Authorization
                      </h3>

                      <p className='text-sm text-tertiary'>
                        To authorize your bot with discord.place API, you need to send the API key in the Authorization header.
                      </p>

                      <code className='p-2 mt-2 text-sm font-medium rounded-lg text-tertiary bg-secondary'>
                        authorization: <span className='font-semibold text-primary'>API_KEY_HERE</span>
                      </code>
                    </div>

                    <div className='flex flex-col gap-y-1'>
                      <h3 className='text-sm font-semibold'>
                        User Vote Check
                      </h3>

                      <p className='text-sm text-tertiary'>
                        You can check if a user has voted for your bot using the following endpoint.
                      </p>

                      <div className='flex items-center p-2 mt-2 text-sm font-medium rounded-lg text-tertiary bg-secondary'>
                        <span className='px-2 py-0.5 mr-1 text-xs text-white bg-green-700 rounded-lg'>GET</span> /bots/{bot.id}/voters/<span className='font-semibold text-primary'>:user_id</span>
                      </div>

                      <p className='text-sm text-tertiary'>
                        This endpoint will return a 200 status code if the user has voted for your bot. Otherwise, it will return a 404 status code.
                      </p>
                    </div>

                    <div className='flex flex-col gap-y-1'>
                      <h3 className='text-sm font-semibold'>
                        Update Bot Stats
                      </h3>

                      <p className='text-sm text-tertiary'>
                        You should update your bot stats approximately every day. This will help us keep the your bot{'\''}s stats in sync with the actual stats. Do not abuse this endpoint. Abuse of this endpoint will result in your bot being quarantined.
                      </p>

                      <div className='flex items-center p-2 mt-2 text-sm font-medium rounded-lg text-tertiary bg-secondary'>
                        <span className='px-2 py-0.5 mr-1 text-xs text-white bg-purple-600 rounded-lg'>PATCH</span> /bots/{bot.id}/stats
                      </div>

                      <p className='text-sm text-tertiary'>
                        This endpoint will return a 200 status code if the stats were successfully updated.<br/>
                      </p>

                      <h3 className='mt-2 text-sm font-semibold'>
                        Request Body
                      </h3>
 
                      <code className='p-2 mt-2 text-sm font-medium whitespace-pre-wrap rounded-lg text-tertiary bg-secondary'>
                        {'{\n  "server_count": 0,\n  "command_count": 0\n}'}
                      </code>
                    </div>
                  </div>
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
                {showDeleteConsent ? (
                  <>
                    Are you sure you really want to delete this bot?
                  </>
                ) : (
                  <>
                    You can delete the bot using the button below, but be careful not to delete it by mistake :)
                  </>
                )}
              </p>
              
              <div className='flex mt-1 gap-x-2'>
                {showDeleteConsent ? (
                  <>
                    <button className='flex items-center gap-x-1.5 px-3 py-1 text-sm font-medium text-white bg-black rounded-lg w-max dark:bg-white dark:text-black dark:hover:bg-white/70 hover:bg-black/70 disabled:pointer-events-none disabled:opacity-70' onClick={continueDeleteBot} disabled={loading}>
                      {loading && (
                        <TbLoader className='animate-spin' />
                      )}
                      Confirm
                    </button>

                    <button className='px-3 py-1 text-sm font-medium text-white bg-black rounded-lg w-max dark:bg-white dark:text-black dark:hover:bg-white/70 hover:bg-black/70 disabled:pointer-events-none disabled:opacity-70' onClick={() => setShowDeleteConsent(false)} disabled={loading}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <button className='px-3 py-1 text-sm font-medium text-white bg-black rounded-lg w-max dark:bg-white dark:text-black dark:hover:bg-white/70 hover:bg-black/70' onClick={() => setShowDeleteConsent(true)}>
                    Delete
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}