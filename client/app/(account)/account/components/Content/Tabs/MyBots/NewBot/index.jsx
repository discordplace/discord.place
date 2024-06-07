'use client';

import config from '@/config';
import { MdChevronLeft } from 'react-icons/md';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri';
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import cn from '@/lib/cn';
import { IoMdCheckmarkCircle } from 'react-icons/io';
import createBot from '@/lib/request/bots/createBot';
import { useRouter } from 'next/navigation';
import Lottie from 'react-lottie';
import confetti from '@/lib/lotties/confetti.json';
import { TbLoader } from 'react-icons/tb';
import Markdown from '@/app/components/Markdown';
import ServerIcon from '@/app/(servers)/servers/components/ServerIcon';
import Link from 'next/link';
import Tooltip from '@/app/components/Tooltip';
import CopyButton from '@/app/components/CopyButton';
import useAccountStore from '@/stores/account';

export default function NewBot() {
  const data = useAccountStore(state => state.data);
  const setCurrentlyAddingBot = useAccountStore(state => state.setCurrentlyAddingBot);

  const descriptionRef = useRef(null);
  const [markdownPreviewing, setMarkdownPreviewing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [renderConfetti, setRenderConfetti] = useState(false);

  const [botId, setBotId] = useState('');
  const [botShortDescription, setBotShortDescription] = useState('');
  const [botDescription, setBotDescription] = useState('');
  const [botInviteUrl, setBotInviteUrl] = useState('');
  const [botCategories, setBotCategories] = useState([]);
  const [botSupportServerId, setBotSupportServerId] = useState('');
  const [botWebhookUrl, setBotWebhookUrl] = useState('');
  const [botWebhookToken, setBotWebhookToken] = useState('');
  const [webhookTokenBlurred, setWebhookTokenBlurred] = useState(true);

  useEffect(() => {
    if (markdownPreviewing === false) descriptionRef.current.innerText = botDescription;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markdownPreviewing]);

  const router = useRouter();

  function addBot() {
    if (!botWebhookUrl && botWebhookToken) return toast.error('If you set Webhook Token, you must set Webhook URL too.');

    setLoading(true);

    const botData = {
      short_description: botShortDescription,
      description: botDescription,
      invite_url: botInviteUrl,
      categories: botCategories
    };

    if (botSupportServerId) botData.support_server_id = botSupportServerId;
    if (botWebhookUrl || botWebhookToken) botData.webhook = {};
    if (botWebhookUrl) botData.webhook.url = botWebhookUrl;
    if (botWebhookToken) botData.webhook.token = botWebhookToken;

    toast.promise(createBot(botId, botData), {
      loading: `Adding ${botId}..`,
      success: () => {
        setTimeout(() => router.push(`/bots/${botId}`), 3000);
        setRenderConfetti(true);

        return `${botId} added! You will be redirected to Bot page in a few seconds..`;
      },
      error: error => {
        setLoading(false);

        return error;
      }
    });
  }

  return (
    <>
      <div className="fixed pointer-events-none z-[10] top-0 left-0 w-full h-[100dvh]">
        <Lottie options={{ loop: false, autoplay: false, animationData: confetti }} isStopped={!renderConfetti} height="100%" width="100%"/>
      </div>

      <div className="flex justify-center w-full gap-y-4 max-w-[800px] flex-col">
        <div className="flex items-center gap-x-4">
          <button className="p-1.5 rounded-xl bg-secondary hover:bg-tertiary" onClick={() => {
            setBotId('');
            setBotShortDescription('');
            setBotDescription('');
            setBotCategories([]);
            setBotSupportServerId('');
            setCurrentlyAddingBot(false);
          }}>
            <MdChevronLeft size={24}/>
          </button>

          <h1 className="flex flex-wrap items-center text-lg font-bold sm:text-3xl gap-x-1">
            Adding a new bot
          </h1>
        </div>

        <p className="text-sm sm:text-base max-w-[800px] text-tertiary">
          You{'\''}re about to add new bot to discord.place. This means your bot will be listed on discord.place and everyone will be able to see it. You can remove your bot from discord.place at any time.
        </p>

        <div className="flex items-center justify-center w-full mt-12">
          <div className="max-w-[800px] w-full flex flex-col gap-y-1">
            <h2 className="text-lg font-semibold">
              Bot ID
            </h2>

            <p className="text-sm sm:text-base text-tertiary">
              This is the ID of your bot on Discord. You can find it in the developer portal.
            </p>

            <input
              className="block w-full p-2 mt-4 text-sm border-2 border-transparent rounded-lg outline-none bg-secondary text-placeholder focus-visible:text-primary focus-visible:border-purple-500"
              onChange={event => setBotId(event.target.value)}
              value={botId}
            />

            <h2 className="mt-8 text-lg font-semibold">
              Add a short description
            </h2>

            <p className="text-sm sm:text-base text-tertiary">
              This is the short description that will be shown to everyone who visits your bot on discord.place.
            </p>

            <input
              className="block w-full p-2 mt-4 text-sm border-2 border-transparent rounded-lg outline-none bg-secondary text-placeholder focus-visible:text-primary focus-visible:border-purple-500"
              maxLength={config.botShortDescriptionMaxLength}
              value={botShortDescription}
              onChange={event => setBotShortDescription(event.target.value)}
            />

            <h2 className="mt-8 text-lg font-semibold">
              Add a description
            </h2>

            <p className="text-sm sm:text-base text-tertiary">
              This is the more detailed description of your bot. You can use this to tell everyone what your bot does and how it works. You can use markdown here.
            </p>

            <button
              className="mt-4 flex items-center gap-x-1.5 px-3 py-1.5 rounded-lg font-semibold text-white bg-black w-max h-max hover:bg-black/70 dark:bg-white dark:text-black dark:hover:bg-white/70 text-sm disabled:pointer-events-none disabled:opacity-70"
              onClick={() => setMarkdownPreviewing(!markdownPreviewing)}
            >
              {markdownPreviewing ? (
                <>
                  <RiEyeOffFill/>
                  Back to Editing
                </>
              ) : (
                <>
                  <RiEyeFill/>
                  Show Markdown Preview
                </>
              )}
            </button>

            {markdownPreviewing ? (
              <Markdown className="mt-4 h-[250px] overflow-y-auto rounded-lg border-2 border-transparent">
                {botDescription}
              </Markdown>
            ) : (
              <span
                contentEditable="plaintext-only"
                suppressContentEditableWarning
                className="block w-full h-[250px] p-2 mt-4 overflow-y-auto border-2 border-transparent rounded-lg outline-none bg-secondary text-placeholder focus-visible:text-primary focus-visible:border-purple-500"
                onKeyUp={event => {
                  if (event.target.innerText.length > config.botDescriptionMaxLength) {
                    event.target.innerText = event.target.innerText.slice(0, config.botDescriptionMaxLength);
                    event.preventDefault();
                    event.stopPropagation();
                    
                    return toast.error(`Description can be maximum ${config.botDescriptionMaxLength} characters long.`);
                  }

                  setBotDescription(event.target.innerText);
                }}
                ref={descriptionRef}
              />
            )}

            <h2 className="mt-8 text-lg font-semibold">
              Add a invite url
            </h2>

            <p className="text-sm sm:text-base text-tertiary">
              This is the invite URL of your bot. This is the link that users will use to add your bot to their server. You can use default Discord authorization link or custom one.
            </p>

            <input
              className="block w-full p-2 mt-4 text-sm border-2 border-transparent rounded-lg outline-none bg-secondary text-placeholder focus-visible:text-primary focus-visible:border-purple-500"
              value={botInviteUrl}
              onChange={event => setBotInviteUrl(event.target.value)}
            />

            <h2 className="mt-8 text-lg font-semibold">
              Category
            </h2>

            <p className="text-sm text-tertiary">
              Select all categories that your bot belongs to. This will help users find your bot.
            </p>

            <div className="flex flex-wrap mt-4 gap-x-2 gap-y-2">
              {config.botCategories.map(category => (
                <button
                  key={category}
                  className={cn(
                    'rounded-lg flex items-center gap-x-1 font-semibold w-max h-max text-sm px-3 py-1.5 bg-secondary hover:bg-quaternary',
                    botCategories.includes(category) && 'bg-quaternary'
                  )}
                  onClick={() => {
                    if (botCategories.includes(category)) setBotCategories(oldCategories => oldCategories.filter(oldCategory => oldCategory !== category));
                    else setBotCategories(oldCategories => [...oldCategories, category]);
                  }}
                >
                  {botCategories.includes(category) ? <IoMdCheckmarkCircle/> : config.botCategoriesIcons[category]}
                  {category}
                </button>
              ))}
            </div>

            <h2 className="flex items-center mt-8 text-lg font-semibold gap-x-2">
              Support Server <span className="text-xs font-normal select-none text-tertiary">(optional)</span>
            </h2>

            <p className="text-sm sm:text-base text-tertiary">
              You can select a server that users can join to get support for your bot. This is optional.<br/>
              You can only select servers that you listed on discord.place.
            </p>

            {data.servers.filter(server => server.is_created).length <= 0 ? (
              <p className="mt-4 text-sm text-tertiary">
                You don{'\''}t have any servers listed on discord.place.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4 mt-4 mobile:grid-cols-2 sm:grid-cols-4 lg:grid-cols-5">
                {data.servers.filter(server => server.is_created).map(server => (
                  <button
                    className="flex flex-col bg-secondary hover:bg-quaternary p-2 rounded-xl w-full h-[180px] items-center cursor-pointer overflow-clip relative"
                    key={server.id}
                    onClick={() => setBotSupportServerId(oldServerId => oldServerId === server.id ? '' : server.id)}
                  >
                    <div className="relative">
                      <ServerIcon width={128} height={128} icon_url={server.icon_url} name={server.name}/>
                      <div className={cn(
                        'absolute w-full h-full text-3xl text-primary transition-opacity rounded-lg flex items-center justify-center bg-secondary/60 z-[0] top-0 left-0',
                        botSupportServerId !== server.id && 'opacity-0'
                      )}>
                        <IoMdCheckmarkCircle/>
                      </div>
                    </div>

                    <h1 className="w-full max-w-full mt-2 text-base font-medium text-center truncate">{server.name}</h1>
                  </button>
                ))}
              </div>
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
              className="block w-full p-2 mt-2 text-sm border-2 border-transparent rounded-lg outline-none bg-secondary text-placeholder focus-visible:text-primary focus-visible:border-purple-500"
              value={botWebhookUrl}
              onChange={event => setBotWebhookUrl(event.target.value)}
            />

            <h3 className="mt-4 text-sm font-medium text-secondary">
              Webhook Token
            </h3>

            <div className='relative flex items-center justify-center mt-2'>
              <input
                className='block w-full p-2 pr-16 text-sm border-2 rounded-lg outline-none border-primary bg-secondary text-placeholder focus-visible:text-primary focus-visible:border-purple-500'
                value={botWebhookToken}
                onChange={event => setBotWebhookToken(event.target.value)}
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
                  copyText={botWebhookToken}
                  className='justify-end'
                />
              </div>
            </div>

            <h2 className="mt-8 text-lg font-semibold">
              Content Policy
            </h2>

            <p className="flex flex-col text-sm sm:text-base gap-y-1 text-tertiary">
              By adding your bot to discord.place, you agree to our Bot Submission Guidelines.
              <span className="mt-2 text-xs text-tertiary">
                * Can be found in our Discord server.
              </span>
            </p>

            <h2 className="mt-8 text-lg font-semibold">
              Are you ready?
            </h2>

            <div className="flex flex-col w-full gap-2 mt-2 sm:flex-row">
              <button
                className="flex items-center gap-x-1.5 px-3 py-1.5 rounded-lg font-semibold text-white bg-black w-full justify-center hover:bg-black/70 dark:bg-white dark:text-black dark:hover:bg-white/70 text-sm disabled:pointer-events-none disabled:opacity-70"
                disabled={
                  loading ||
                  !botId ||
                  !botId.match(/^\d{17,19}$/) ||
                  botShortDescription.length < 1 ||
                  botDescription.length < 1 ||
                  botCategories.length < 1
                }
                onClick={addBot}
              >
                {loading && <TbLoader className="animate-spin"/>}
                Add Bot
              </button>
              <button className="flex items-center justify-center w-full py-2 text-sm font-medium rounded-lg hover:bg-quaternary disabled:pointer-events-none disabled:opacity-70"
                onClick={() => {
                  setBotId('');
                  setBotShortDescription('');
                  setBotDescription('');
                  setBotCategories([]);
                  setBotSupportServerId('');
                  setCurrentlyAddingBot(false);
                }}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}