'use client';

import config from '@/config';
import { MdChevronLeft } from 'react-icons/md';
import { useEffect, useLayoutEffect, useState } from 'react';
import { toast } from 'sonner';
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri';
import cn from '@/lib/cn';
import { IoMdCheckmarkCircle } from 'react-icons/io';
import createBot from '@/lib/request/bots/createBot';
import { useRouter } from 'next/navigation';
import Lottie from 'react-lottie';
import confetti from '@/lib/lotties/confetti.json';
import { TbLoader } from 'react-icons/tb';
import Markdown from '@/app/components/Markdown';
import useAccountStore from '@/stores/account';
import { useLocalStorage } from 'react-use';
import { t } from '@/stores/language';

export default function NewBot() {
  const setCurrentlyAddingBot = useAccountStore(state => state.setCurrentlyAddingBot);

  const [markdownPreviewing, setMarkdownPreviewing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [renderConfetti, setRenderConfetti] = useState(false);

  const [botId, setBotId] = useState('');
  const [botShortDescription, setBotShortDescription] = useState('');
  const [botDescription, setBotDescription] = useState('');
  const [botInviteUrl, setBotInviteUrl] = useState('');
  const [botCategories, setBotCategories] = useState([]);

  const [localData, setLocalData] = useLocalStorage('bot-stored-data', {
    botId: '',
    botShortDescription: '',
    botDescription: '',
    botInviteUrl: '',
    botCategories: []
  });

  useLayoutEffect(() => {
    if (localData) {
      if (localData.botId === '' && localData.botShortDescription === '' && localData.botDescription === '' && localData.botInviteUrl === '' && localData.botCategories.length === 0) return;

      setBotId(localData.botId);
      setBotShortDescription(localData.botShortDescription);
      setBotDescription(localData.botDescription);
      setBotInviteUrl(localData.botInviteUrl);
      setBotCategories(localData.botCategories);

      toast.info(t('accountPage.tabs.myBots.sections.addBot.toast.storedDataLoaded'));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (botId === '' && botShortDescription === '' && botDescription === '' && botInviteUrl === '' && botCategories.length === 0) return;

    setLocalData({
      botId,
      botShortDescription,
      botDescription,
      botInviteUrl,
      botCategories
    });
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [botId, botShortDescription, botDescription, botInviteUrl, botCategories]);

  const router = useRouter();

  function addBot() {
    setLoading(true);

    const botData = {
      short_description: botShortDescription,
      description: botDescription,
      invite_url: botInviteUrl,
      categories: botCategories
    };

    toast.promise(createBot(botId, botData), {
      loading: t('accountPage.tabs.myBots.sections.addBot.toast.addingBot', { botId }),
      success: () => {
        setTimeout(() => {
          router.push(`/bots/${botId}`);

          // Reset states
          setCurrentlyAddingBot(false);
          setBotId('');
          setBotShortDescription('');
          setBotDescription('');
          setBotCategories([]);
        }, 3000);

        setRenderConfetti(true);

        return t('accountPage.tabs.myBots.sections.addBot.toast.botAdded', { botId });
      },
      error: error => {
        setLoading(false);

        return error;
      }
    });
  }

  return (
    <>
      <div className="fixed pointer-events-none z-[10] top-0 left-0 w-full h-[100svh]">
        <Lottie options={{ loop: false, autoplay: false, animationData: confetti }} isStopped={!renderConfetti} height="100%" width="100%"/>
      </div>

      <div className="flex justify-center w-full gap-y-4 max-w-[800px] flex-col">
        <div className="flex items-center gap-x-4">
          <button className="p-1.5 rounded-xl bg-secondary hover:bg-tertiary" onClick={() => {
            setBotId('');
            setBotShortDescription('');
            setBotDescription('');
            setBotCategories([]);
            setCurrentlyAddingBot(false);
          }}>
            <MdChevronLeft size={24}/>
          </button>

          <h1 className="flex flex-wrap items-center text-lg font-bold sm:text-3xl gap-x-1">
            {t('accountPage.tabs.myBots.sections.addBot.title')}
          </h1>
        </div>

        <p className="text-sm sm:text-base max-w-[800px] text-tertiary">
          {t('accountPage.tabs.myBots.sections.addBot.subtitle')}
        </p>

        <div className="flex items-center justify-center w-full mt-12">
          <div className="max-w-[800px] w-full flex flex-col gap-y-1">
            <h2 className="text-lg font-semibold">
              {t('accountPage.tabs.myBots.sections.addBot.fields.botId.label')}
            </h2>

            <p className="text-sm sm:text-base text-tertiary">
              {t('accountPage.tabs.myBots.sections.addBot.fields.botId.description')}
            </p>

            <input
              className="block w-full p-2 mt-4 text-sm border-2 border-transparent rounded-lg outline-none bg-secondary text-placeholder focus-visible:text-primary focus-visible:border-purple-500"
              onChange={event => setBotId(event.target.value)}
              value={botId}
            />

            <h2 className="mt-8 text-lg font-semibold">
              {t('accountPage.tabs.myBots.sections.addBot.fields.shortDescription.label')}
            </h2>

            <p className="text-sm sm:text-base text-tertiary">
              {t('accountPage.tabs.myBots.sections.addBot.fields.shortDescription.description')}
            </p>

            <input
              className="block w-full p-2 mt-4 text-sm border-2 border-transparent rounded-lg outline-none bg-secondary text-placeholder focus-visible:text-primary focus-visible:border-purple-500"
              maxLength={config.botShortDescriptionMaxLength}
              value={botShortDescription}
              onChange={event => setBotShortDescription(event.target.value)}
            />

            <h2 className="mt-8 text-lg font-semibold">
              {t('accountPage.tabs.myBots.sections.addBot.fields.longDescription.label')}
            </h2>

            <p className="text-sm sm:text-base text-tertiary">
              {t('accountPage.tabs.myBots.sections.addBot.fields.longDescription.description')}
            </p>

            <button
              className="mt-4 flex items-center gap-x-1.5 px-3 py-1.5 rounded-lg font-semibold text-white bg-black w-max h-max hover:bg-black/70 dark:bg-white dark:text-black dark:hover:bg-white/70 text-sm disabled:pointer-events-none disabled:opacity-70"
              onClick={() => setMarkdownPreviewing(!markdownPreviewing)}
            >
              {markdownPreviewing ? (
                <>
                  <RiEyeOffFill/>
                  {t('buttons.backToEditing')}
                </>
              ) : (
                <>
                  <RiEyeFill/>
                  {t('buttons.showMarkdownPreview')}
                </>
              )}
            </button>

            {markdownPreviewing ? (
              <Markdown className="mt-4 h-[250px] overflow-y-auto rounded-lg border-2 border-transparent">
                {botDescription}
              </Markdown>
            ) : (
              <textarea
                className="block w-full resize-none h-[250px] p-2 mt-4 overflow-y-auto border-2 border-transparent rounded-lg outline-none bg-secondary text-placeholder focus-visible:text-primary focus-visible:border-purple-500"
                value={botDescription}
                onChange={event => setBotDescription(event.target.value)}
                maxLength={config.botDescriptionMaxLength}
              />
            )}

            <h2 className="mt-8 text-lg font-semibold">
              {t('accountPage.tabs.myBots.sections.addBot.fields.inviteUrl.label')}
            </h2>

            <p className="text-sm sm:text-base text-tertiary">
              {t('accountPage.tabs.myBots.sections.addBot.fields.inviteUrl.description')}
            </p>

            <input
              className="block w-full p-2 mt-4 text-sm border-2 border-transparent rounded-lg outline-none bg-secondary text-placeholder focus-visible:text-primary focus-visible:border-purple-500"
              value={botInviteUrl}
              onChange={event => setBotInviteUrl(event.target.value)}
            />

            <h2 className="mt-8 text-lg font-semibold">
              {t('accountPage.tabs.myBots.sections.addBot.fields.categories.label')}
            </h2>

            <p className="text-sm text-tertiary">
              {t('accountPage.tabs.myBots.sections.addBot.fields.categories.description')}
            </p>

            <div className="flex flex-wrap mt-4 gap-x-2 gap-y-2">
              {config.botCategories
                .filter(category => category !== 'All')
                .map(category => (
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
                    {t(`categories.${category}`)}
                  </button>
                ))}
            </div>

            <h2 className="mt-8 text-lg font-semibold">
              {t('accountPage.tabs.myBots.sections.addBot.fields.contentPolicy.label')}
            </h2>

            <p className='flex flex-col text-sm sm:text-base gap-y-1 text-tertiary'>
              {t('accountPage.tabs.myBots.sections.addBot.fields.contentPolicy.description', {
                note: <span className='text-xs'>{t('accountPage.tabs.myBots.sections.addBot.fields.contentPolicy.note')}</span>
              })}
            </p>

            <h2 className="mt-8 text-lg font-semibold">
              {t('accountPage.tabs.myBots.sections.addBot.fields.areYouReady.label')}
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
                {t('buttons.addBot')}
              </button>

              <button className="flex items-center justify-center w-full py-2 text-sm font-medium rounded-lg hover:bg-quaternary disabled:pointer-events-none disabled:opacity-70"
                onClick={() => {
                  setBotId('');
                  setBotShortDescription('');
                  setBotDescription('');
                  setBotCategories([]);
                  setCurrentlyAddingBot(false);
                }}
                disabled={loading}
              >
                {t('buttons.cancel')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}