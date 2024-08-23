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
import { FaCheck } from 'react-icons/fa';
import Select from '@/app/components/Select';
import { t } from '@/stores/language';

export default function NewServer() {
  const currentlyAddingServer = useAccountStore(state => state.currentlyAddingServer);
  const setCurrentlyAddingServer = useAccountStore(state => state.setCurrentlyAddingServer);

  const [renderConfetti, setRenderConfetti] = useState(false);

  const [serverDescription, setServerDescription] = useState('');
  const [serverInviteLink, setServerInviteLink] = useState('');
  const [serverCategory, setServerCategory] = useState('');
    
  const [keywordsInputValue, setKeywordsInputValue] = useState('');
  const [serverKeywords, setServerKeywords] = useState([]);

  const [serverVoiceActivityEnabled, setServerVoiceActivityEnabled] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function addServer() {
    const inviteLinkMatch = serverInviteLink.match(/(https?:\/\/|http?:\/\/)?(www.)?(discord.(gg)|discordapp.com\/invite|discord.com\/invite)\/[^\s/]+?(?=$|Z)/g);
    if (!inviteLinkMatch || !inviteLinkMatch?.[0]) return toast.error(t('accountPage.tabs.myServers.sections.newServer.toast.invalidInviteLink'));

    setLoading(true);

    toast.promise(createServer(currentlyAddingServer.id, { description: serverDescription, invite_link: serverInviteLink, category: serverCategory, keywords: serverKeywords, voice_activity_enabled: serverVoiceActivityEnabled }), {
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
          setServerVoiceActivityEnabled(false);
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

  return (
    <>
      <div className='fixed pointer-events-none z-[10] top-0 left-0 w-full h-[100dvh]'>
        <Lottie options={{ loop: false, autoplay: false, animationData: confetti }} isStopped={!renderConfetti} height='100%' width='100%' />
      </div>

      <div className="max-w-[800px] flex flex-col justify-center w-full gap-y-4">
        <div className='flex items-center gap-x-4'>
          <button className="p-1.5 rounded-xl bg-secondary hover:bg-quaternary" onClick={() => {
            setCurrentlyAddingServer(null);
            setServerDescription('');
            setServerInviteLink('');
            setServerCategory('');
            setServerKeywords([]);
          }}>
            <MdChevronLeft size={24} />
          </button>

          <h1 className="flex flex-wrap items-center text-lg font-bold sm:text-3xl gap-x-1">
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
        
        <p className='text-sm sm:text-base text-tertiary'>
          {t('accountPage.tabs.myServers.sections.newServer.subtitle', { serverName: currentlyAddingServer.name })}
        </p>
      </div>

      <div className='max-w-[800px] flex items-center w-full my-12'>
        <div className='flex flex-col w-full gap-y-1'>
          <h2 className='text-lg font-semibold'>
            {t('accountPage.tabs.myServers.sections.newServer.fields.description.label')}
          </h2>
          
          <p className='text-sm sm:text-base text-tertiary'>
            {t('accountPage.tabs.myServers.sections.newServer.fields.description.description', { br: <br /> })}
          </p>

          <span
            contentEditable
            suppressContentEditableWarning
            className='block w-full h-[150px] p-2 mt-4 overflow-y-auto border-2 border-transparent rounded-lg outline-none bg-secondary text-placeholder focus-visible:text-primary focus-visible:border-purple-500'
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

          <p className='text-sm sm:text-base text-tertiary'>
            {t('accountPage.tabs.myServers.sections.newServer.fields.inviteLink.description')}
          </p>

          <input
            className='block w-full p-2 mt-4 overflow-y-auto text-sm border-2 border-transparent rounded-lg outline-none placeholder-placeholder bg-secondary text-placeholder focus-visible:text-primary focus-visible:border-purple-500'
            placeholder={t('accountPage.tabs.myServers.sections.newServer.fields.inviteLink.placeholder')}
            autoComplete='off'
            spellCheck='false'
            value={serverInviteLink}
            onChange={event => setServerInviteLink(event.target.value)}
          />

          <div className='flex flex-col gap-4 mt-8 sm:flex-row'>
            <div className='flex flex-col gap-y-2'>
              <h2 className='text-lg font-semibold'>
                {t('accountPage.tabs.myServers.sections.newServer.fields.category.label')}
              </h2>

              <p className='text-sm text-tertiary'>
                {t('accountPage.tabs.myServers.sections.newServer.fields.category.description')}
              </p>

              <div className='w-full mt-4'>
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
                  className='block w-full h-[40px] px-2 mt-4 overflow-y-auto text-sm border-2 border-transparent rounded-lg outline-none disabled:pointer-events-none disabled:opacity-70 placeholder-placeholder bg-secondary text-placeholder focus-visible:text-primary focus-visible:border-purple-500'
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

              <div className='flex flex-wrap mt-2 gap-x-2 gap-y-1'>
                {serverKeywords
                  .filter(keyword => keyword.length > 0)
                  .map((keyword, i) => (
                    <button key={i} className='flex items-center gap-x-1.5 px-3 py-1.5 rounded-lg font-semibold text-white bg-black hover:bg-black/70 dark:bg-white dark:text-black dark:hover:bg-white/70 text-sm' onClick={() => setServerKeywords(serverKeywords.filter(k => k !== keyword))}>
                      {keyword}
                    </button>
                  ))}
              </div>
            </>
          )}

          <h2 className='mt-8 text-lg font-semibold'>
            {t('accountPage.tabs.myServers.sections.newServer.fields.voiceActivity.label')}
          </h2>

          <p className='text-sm sm:text-base text-tertiary'>
            {t('accountPage.tabs.myServers.sections.newServer.fields.voiceActivity.description')}
          </p>

          <div 
            className='flex items-center mt-4 cursor-pointer gap-x-2 group'
            onClick={() => setServerVoiceActivityEnabled(!serverVoiceActivityEnabled)}
          >
            <button className='p-1 bg-quaternary rounded-md group-hover:bg-white group-hover:text-black min-w-[18px] min-h-[18px]'>
              {serverVoiceActivityEnabled ? <FaCheck size={10} /> : null}
            </button>

            <span className='text-sm font-medium select-none text-tertiary'>
              {t('buttons.enableTracking')}
            </span>
          </div>

          <h2 className='mt-8 text-lg font-semibold'>
            {t('accountPage.tabs.myServers.sections.newServer.fields.contentPolicy.label')}
          </h2>
          
          <p className='flex flex-col text-sm sm:text-base gap-y-1 text-tertiary'>
            {t('accountPage.tabs.myServers.sections.newServer.fields.contentPolicy.description', {
              note: <span className='text-xs'>{t('accountPage.tabs.myServers.sections.newServer.fields.contentPolicy.note')}</span>
            })}
          </p>

          <h2 className='mt-8 text-lg font-semibold'>
            {t('accountPage.tabs.myServers.sections.newServer.fields.areYouReady.label')}
          </h2>
          
          <div className='flex flex-col w-full gap-2 mt-2 sm:flex-row'>
            <button 
              className='flex items-center gap-x-1.5 px-3 py-1.5 rounded-lg font-semibold text-white bg-black w-full justify-center hover:bg-black/70 dark:bg-white dark:text-black dark:hover:bg-white/70 text-sm disabled:pointer-events-none disabled:opacity-70' 
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

            <button className='flex items-center justify-center w-full py-2 text-sm font-medium rounded-lg hover:bg-quaternary disabled:pointer-events-none disabled:opacity-70'
              onClick={() => {
                setCurrentlyAddingServer(null);
                setServerDescription('');
                setServerInviteLink('');
                setServerCategory('');
                setServerKeywords([]);
                setServerVoiceActivityEnabled(false);
              }}
              disabled={loading}
            >
              {t('buttons.cancel')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}