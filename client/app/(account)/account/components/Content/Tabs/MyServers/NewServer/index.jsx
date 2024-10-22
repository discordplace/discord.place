'use client';

import ServerIcon from '@/app/components/ImageFromHash/ServerIcon';
import Image from 'next/image';
import createServer from '@/lib/request/servers/createServer';
import useAccountStore from '@/stores/account';
import { useRouter } from 'next-nprogress-bar';
import { useState } from 'react';
import { toast } from 'sonner';
import Lottie from 'react-lottie';
import confetti from '@/lib/lotties/confetti.json';
import { TbLoader } from 'react-icons/tb';
import { MdChevronLeft } from 'react-icons/md';
import config from '@/config';
import Select from '@/app/components/Select';
import { t } from '@/stores/language';
import { BsFire } from 'react-icons/bs';
import { IoMdCheckmarkCircle, IoMdCloseCircle } from 'react-icons/io';
import cn from '@/lib/cn';

export default function NewServer() {
  const currentlyAddingServer = useAccountStore(state => state.currentlyAddingServer);
  const setCurrentlyAddingServer = useAccountStore(state => state.setCurrentlyAddingServer);

  const [renderConfetti, setRenderConfetti] = useState(false);

  const [serverDescription, setServerDescription] = useState('');
  const [serverInviteLink, setServerInviteLink] = useState('');
  const [serverCategory, setServerCategory] = useState('');

  const [keywordsInputValue, setKeywordsInputValue] = useState('');
  const [serverKeywords, setServerKeywords] = useState([]);

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function addServer() {
    const inviteLinkMatch = serverInviteLink.match(/(https?:\/\/|http?:\/\/)?(www.)?(discord.(gg)|discordapp.com\/invite|discord.com\/invite)\/[^\s/]+?(?=$|Z)/g);
    if (!inviteLinkMatch || !inviteLinkMatch?.[0]) return toast.error(t('accountPage.tabs.myServers.sections.newServer.toast.invalidInviteLink'));

    setLoading(true);

    toast.promise(createServer(currentlyAddingServer.id, { description: serverDescription, invite_link: serverInviteLink, category: serverCategory, keywords: serverKeywords }), {
      loading: t('accountPage.tabs.myServers.sections.newServer.toast.addingServer', { serverName: currentlyAddingServer.name }),
      success: () => {
        setTimeout(() => {
          router.push(`/servers/${currentlyAddingServer.id}`);

          // Reset states
          setCurrentlyAddingServer(null);
          setServerDescription('');
          setServerInviteLink('');
          setServerCategory('');
          setServerKeywords([]);
        }, 3000);
        setRenderConfetti(true);

        return t('accountPage.tabs.myServers.sections.newServer.toast.serverAdded', { serverName: currentlyAddingServer.name });
      },
      error: error => {
        setLoading(false);

        return error;
      }
    });
  }

  const allRequirementsIsMet = currentlyAddingServer.requirements.every(requirement => requirement.met);
  const completedPercent = currentlyAddingServer.requirements.filter(requirement => requirement.met).length / currentlyAddingServer.requirements.length * 100;

  return (
    <>
      <div className='pointer-events-none fixed left-0 top-0 z-10 h-svh w-full'>
        <Lottie options={{ loop: false, autoplay: false, animationData: confetti }} isStopped={!renderConfetti} height='100%' width='100%' />
      </div>

      <div className="flex w-full max-w-[800px] flex-col justify-center gap-y-4">
        <div className='flex items-center gap-x-4'>
          <button className="rounded-xl bg-secondary p-1.5 hover:bg-quaternary" onClick={() => {
            setCurrentlyAddingServer(null);
            setServerDescription('');
            setServerInviteLink('');
            setServerCategory('');
            setServerKeywords([]);
          }}>
            <MdChevronLeft size={24} />
          </button>

          <h1 className="flex flex-wrap items-center gap-x-1 text-lg font-bold sm:text-3xl">
            {t('accountPage.tabs.myServers.sections.newServer.title', {
              serverName: <span className='truncate'>{currentlyAddingServer.name}</span>,
              serverIcon: (
                currentlyAddingServer.icon ? (
                  <ServerIcon
                    id={currentlyAddingServer.id}
                    hash={currentlyAddingServer.icon}
                    size={32}
                    width={24}
                    height={24}
                    className='rounded-lg'
                  />
                ) : (
                  <Image
                    src='https://cdn.discordapp.com/embed/avatars/0.png'
                    alt='Server Icon'
                    width={24}
                    height={24}
                    className='rounded-lg'
                  />
                )
              )
            })}
          </h1>
        </div>

        <p className='text-sm text-tertiary sm:text-base'>
          {t('accountPage.tabs.myServers.sections.newServer.subtitle', { serverName: currentlyAddingServer.name })}
        </p>
      </div>

      <div className='flex w-full max-w-[800px] items-center'>
        <div className='mt-8 flex w-full flex-col gap-y-1'>
          <div
            className={cn(
              'flex-col w-full p-6 mb-8 border-2 h-max rounded-xl',
              allRequirementsIsMet ? 'border-green-500' : 'dark:border-neutral-500 border-neutral-400'
            )}
          >
            <div className='flex w-full items-start justify-between'>
              <span className='flex items-center gap-x-2 text-lg font-semibold'>
                <BsFire
                  className={cn(
                    allRequirementsIsMet ? 'text-green-500' : 'text-tertiary'
                  )}
                />

                {t('accountPage.tabs.myServers.sections.newServer.requirements.title')}
              </span>

              <div className='flex flex-col items-center gap-y-2'>
                <div className='hidden items-center gap-x-1 sm:flex'>
                  <span className='text-base font-semibold'>
                    {completedPercent}%
                  </span>

                  <span className='text-sm font-medium text-tertiary'>
                    {t('accountPage.tabs.myServers.sections.newServer.requirements.completedBadge')}
                  </span>
                </div>

                <div
                  className={cn(
                    'w-full h-1 rounded-lg',
                    allRequirementsIsMet ? 'bg-green-600' : 'bg-neutral-600/30'
                  )}
                >
                  <div
                    className={cn(
                      'h-full rounded-lg',
                      allRequirementsIsMet ? 'bg-green-500' : 'bg-neutral-500'
                    )}
                    style={{ width: `${currentlyAddingServer.requirements.filter(requirement => requirement.met).length / currentlyAddingServer.requirements.length * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <p className='mt-2 text-sm text-tertiary sm:mt-0'>
              {t('accountPage.tabs.myServers.sections.newServer.requirements.subtitle')}
            </p>

            <div className='mt-6 flex flex-col gap-y-4 sm:hidden'>
              <div className='flex items-center justify-center gap-x-1'>
                <span className='text-base font-semibold'>
                  {completedPercent}%
                </span>

                <span className='text-sm font-medium text-tertiary'>
                  {t('accountPage.tabs.myServers.sections.newServer.requirements.completedBadge')}
                </span>
              </div>
            </div>

            <div className='mt-8 flex flex-col gap-y-4 overflow-hidden'>
              {currentlyAddingServer.requirements.map(requirement => (
                <div
                  className='flex items-center gap-x-4'
                  key={requirement.id}
                >
                  {requirement.met ? (
                    <IoMdCheckmarkCircle className='min-w-[24px] text-green-500' size={24} />
                  ) : (
                    <IoMdCloseCircle className='min-w-[24px] text-tertiary' size={24} />
                  )}

                  <div className='flex flex-col gap-y-1'>
                    <span className='max-w-[200px] truncate text-lg font-semibold sm:max-w-[700px]'>
                      {t(`accountPage.tabs.myServers.sections.newServer.requirements.items.${requirement.id}.name`)}
                    </span>

                    <span className='max-w-[200px] text-sm font-medium text-tertiary sm:max-w-[700px]'>
                      {t(`accountPage.tabs.myServers.sections.newServer.requirements.items.${requirement.id}.description`)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className={cn(
              'flex flex-col gap-y-1',
              !allRequirementsIsMet && 'opacity-50 pointer-events-none select-none filter grayscale'
            )}
          >
            <h2 className='text-lg font-semibold'>
              {t('accountPage.tabs.myServers.sections.newServer.fields.description.label')}
            </h2>

            <p className='text-sm text-tertiary sm:text-base'>
              {t('accountPage.tabs.myServers.sections.newServer.fields.description.description', { br: <br /> })}
            </p>

            <span
              contentEditable
              suppressContentEditableWarning
              className='mt-4 block h-[150px] w-full overflow-y-auto rounded-lg border-2 border-transparent bg-secondary p-2 text-placeholder outline-none focus-visible:border-purple-500 focus-visible:text-primary'
              onKeyUp={event => {
                if (event.target.innerText.length > config.serverDescriptionMaxCharacters) {
                  event.target.innerText = event.target.innerText.slice(0, config.serverDescriptionMaxCharacters);
                  event.preventDefault();
                  event.stopPropagation();

                  return toast.error(`Description can be maximum ${config.serverDescriptionMaxCharacters} characters long.`);
                }

                setServerDescription(event.target.textContent);
              }}
            />

            <h2 className='mt-8 text-lg font-semibold'>
              {t('accountPage.tabs.myServers.sections.newServer.fields.inviteLink.label')}
            </h2>

            <p className='text-sm text-tertiary sm:text-base'>
              {t('accountPage.tabs.myServers.sections.newServer.fields.inviteLink.description')}
            </p>

            <input
              className='mt-4 block w-full overflow-y-auto rounded-lg border-2 border-transparent bg-secondary p-2 text-sm text-placeholder outline-none placeholder:text-placeholder focus-visible:border-purple-500 focus-visible:text-primary'
              placeholder={t('accountPage.tabs.myServers.sections.newServer.fields.inviteLink.placeholder')}
              autoComplete='off'
              spellCheck='false'
              value={serverInviteLink}
              onChange={event => setServerInviteLink(event.target.value)}
            />

            <div className='mt-8 flex flex-col gap-4 sm:flex-row'>
              <div className='flex flex-col gap-y-2'>
                <h2 className='text-lg font-semibold'>
                  {t('accountPage.tabs.myServers.sections.newServer.fields.category.label')}
                </h2>

                <p className='text-sm text-tertiary'>
                  {t('accountPage.tabs.myServers.sections.newServer.fields.category.description')}
                </p>

                <div className='mt-4 w-full'>
                  <Select
                    mobileOverride={true}
                    triggerClassName='w-full py-2.5'
                    placeholder={t('accountPage.tabs.myServers.sections.newServer.fields.category.placeholder')}
                    options={
                      config.serverCategories
                        .filter(category => category !== 'All')
                        .map(category => ({
                          label: <div className='flex items-center gap-x-2'>
                            <span className='text-tertiary'>
                              {config.serverCategoriesIcons[category]}
                            </span>

                            {t(`categories.${category}`)}
                          </div>,
                          value: category
                        }))
                    }
                    value={serverCategory}
                    onChange={setServerCategory}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className='flex flex-col gap-y-2'>
                <h2 className='text-lg font-semibold'>
                  {t('accountPage.tabs.myServers.sections.newServer.fields.keywords.label')}
                </h2>

                <p className='text-sm text-tertiary'>
                  {t('accountPage.tabs.myServers.sections.newServer.fields.keywords.description')}
                </p>

                <div className='relative'>
                  <input
                    className='mt-4 block h-[40px] w-full overflow-y-auto rounded-lg border-2 border-transparent bg-secondary px-2 text-sm text-placeholder outline-none placeholder:text-placeholder focus-visible:border-purple-500 focus-visible:text-primary disabled:pointer-events-none disabled:opacity-70'
                    autoComplete='off'
                    spellCheck='false'
                    value={keywordsInputValue}
                    placeholder={t('accountPage.tabs.myServers.sections.newServer.fields.keywords.placeholder')}
                    onChange={event => {
                      const regexp = new RegExp(/[^a-zA-Z0-9-]/g);
                      if (regexp.test(event.target.value)) return;
                      if (event.target.value.length > config.serverKeywordsMaxCharacters) return toast.error(`Keyword can only contain ${config.serverKeywordsMaxCharacters} characters.`);

                      setKeywordsInputValue(event.target.value);
                    }}
                    onKeyUp={event => {
                      if (event.key === ' ' || event.key === 'Enter') {
                        if (keywordsInputValue.trim().length <= 0) return;
                        if (serverKeywords.some(keyword => keyword.toLowerCase() === keywordsInputValue.trim().toLowerCase())) return toast.error(t('accountPage.tabs.myServers.sections.newServer.toast.duplicateKeyword'));

                        setServerKeywords([...serverKeywords, keywordsInputValue.trim()]);
                        setKeywordsInputValue('');
                      }
                    }}
                    disabled={serverKeywords.length >= config.serverKeywordsMaxLength}
                  />
                </div>
              </div>
            </div>

            {serverKeywords.filter(keyword => keyword.length > 0).length > 0 && (
              <>
                <h3 className='mt-4 text-sm font-medium text-secondary'>
                  {t('accountPage.tabs.myServers.sections.newServer.fields.keywords.count', { count: serverKeywords.filter(keyword => keyword.length > 0).length })}
                </h3>

                <div className='mt-2 flex flex-wrap gap-x-2 gap-y-1'>
                  {serverKeywords
                    .filter(keyword => keyword.length > 0)
                    .map((keyword, i) => (
                      <button key={i} className='flex items-center gap-x-1.5 rounded-lg bg-black px-3 py-1.5 text-sm font-semibold text-white hover:bg-black/70 dark:bg-white dark:text-black dark:hover:bg-white/70' onClick={() => setServerKeywords(serverKeywords.filter(k => k !== keyword))}>
                        {keyword}
                      </button>
                    ))}
                </div>
              </>
            )}

            <h2 className='mt-8 text-lg font-semibold'>
              {t('accountPage.tabs.myServers.sections.newServer.fields.contentPolicy.label')}
            </h2>

            <p className='flex flex-col gap-y-1 text-sm text-tertiary sm:text-base'>
              {t('accountPage.tabs.myServers.sections.newServer.fields.contentPolicy.description', {
                note: <span className='text-xs'>{t('accountPage.tabs.myServers.sections.newServer.fields.contentPolicy.note')}</span>
              })}
            </p>

            <h2 className='mt-8 text-lg font-semibold'>
              {t('accountPage.tabs.myServers.sections.newServer.fields.areYouReady.label')}
            </h2>

            <div className='mt-2 flex w-full flex-col gap-2 sm:flex-row'>
              <button
                className='flex w-full items-center justify-center gap-x-1.5 rounded-lg bg-black px-3 py-1.5 text-sm font-semibold text-white hover:bg-black/70 disabled:pointer-events-none disabled:opacity-70 dark:bg-white dark:text-black dark:hover:bg-white/70'
                disabled={
                  loading ||
                  serverDescription.length < 1 ||
                  serverInviteLink.length < 1 ||
                  !serverCategory ||
                  serverKeywords.length < 1
                }
                onClick={addServer}
              >
                {loading && <TbLoader className='animate-spin' />}

                {t('accountPage.tabs.myServers.sections.newServer.fields.areYouReady.addButton', {
                  serverName: currentlyAddingServer.name,
                  serverIcon: (
                    currentlyAddingServer.icon ? (
                      <ServerIcon
                        id={currentlyAddingServer.id}
                        hash={currentlyAddingServer.icon}
                        size={32}
                        width={16}
                        height={16}
                        className='rounded'
                      />
                    ) : (
                      <Image
                        src='https://cdn.discordapp.com/embed/avatars/0.png'
                        alt='Server Icon'
                        width={16}
                        height={16}
                        className='rounded'
                      />
                    )
                  )
                })}
              </button>

              <button className='flex w-full items-center justify-center rounded-lg py-2 text-sm font-medium hover:bg-quaternary disabled:pointer-events-none disabled:opacity-70'
                onClick={() => {
                  setCurrentlyAddingServer(null);
                  setServerDescription('');
                  setServerInviteLink('');
                  setServerCategory('');
                  setServerKeywords([]);
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