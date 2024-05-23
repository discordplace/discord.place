'use client';

import AuthProtected from '@/app/components/Providers/Auth/Protected';
import getOwnedServers from '@/lib/request/auth/getOwnedServers';
import createServer from '@/lib/request/servers/createServer';
import { useState } from 'react';
import { TbLoader } from 'react-icons/tb';
import { toast } from 'sonner';
import ServerCard from '@/app/(servers)/servers/manage/components/ServerCard';
import { BsQuestionCircleFill } from 'react-icons/bs';
import cn from '@/lib/cn';
import Link from 'next/link';
import config from '@/config';
import { RiAddCircleFill } from 'react-icons/ri';
import ServerIcon from '@/app/(servers)/servers/components/ServerIcon';
import CategoriesDrawer from '@/app/components/Drawer/CategoriesDrawer';
import { IoMdCheckmarkCircle } from 'react-icons/io';
import { useRouter } from 'next-nprogress-bar';
import { MdChevronLeft } from 'react-icons/md';
import Lottie from 'react-lottie';
import confetti from '@/lib/lotties/confetti.json';
import { useMedia } from 'react-use';
import { FaCheck } from 'react-icons/fa';

export default function Page() {
  const [servers, setServers] = useState([]);
  const [currentlyAddingServer, setCurrentlyAddingServer] = useState(null);
  const [renderConfetti, setRenderConfetti] = useState(false);

  const [serverDescription, setServerDescription] = useState('');
  const [serverInviteLink, setServerInviteLink] = useState('');
  const [serverCategory, setServerCategory] = useState('');
  
  const [categoriesDrawerIsOpen, setCategoriesDrawerIsOpen] = useState(false);
  
  const [keywordsInputValue, setKeywordsInputValue] = useState('');
  const [serverKeywords, setServerKeywords] = useState([]);

  const [serverVoiceActivityEnabled, setServerVoiceActivityEnabled] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function getServers() {
    setLoading(true);
    
    toast.promise(getOwnedServers(), {
      loading: 'Loading servers..',
      success: data => {
        setServers(data);
        setLoading(false);
        
        return `Found ${data.length} servers!`;
      },
      error: error => {
        setLoading(false);
        return error;
      }
    });
  }

  function addServer() {
    const inviteLinkMatch = serverInviteLink.match(/(https?:\/\/|http?:\/\/)?(www.)?(discord.(gg)|discordapp.com\/invite|discord.com\/invite)\/[^\s/]+?(?=$|Z)/g);
    if (!inviteLinkMatch || !inviteLinkMatch?.[0]) return toast.error('Invalid invite link.');

    setLoading(true);

    toast.promise(createServer(currentlyAddingServer.id, { description: serverDescription, invite_link: serverInviteLink, category: serverCategory, keywords: serverKeywords, voice_activity_enabled: serverVoiceActivityEnabled }), {
      loading: `Adding ${currentlyAddingServer.name}..`,
      success: () => {
        setTimeout(() => router.push(`/servers/${currentlyAddingServer.id}`), 3000);
        setRenderConfetti(true);
        
        return `${currentlyAddingServer.name} added! You will be redirected to ${currentlyAddingServer.name} page in a few seconds..`;
      },
      error: error => {
        setLoading(false);
        
        return error;
      }
    });
  }
  
  const is2xLarge = useMedia('(max-width: 1280px)', false);
  const isLarge = useMedia('(min-width: 1024px)', false);
  const isMobile = useMedia('(max-width: 640px)', false);
  const placeholderServerCardLength = is2xLarge ? (isMobile ? 6 : (isLarge ? 20 : 12)) : 24;

  return (
    <AuthProtected>
      <div className='flex flex-col items-center justify-center h-full px-8 mt-48 mb-16 gap-y-4 lg:px-0'>
        {currentlyAddingServer !== null ? (
          <>
            <div className='fixed pointer-events-none z-[10] top-0 left-0 w-full h-[100dvh]'>
              <Lottie options={{ loop: false, autoplay: false, animationData: confetti }} isStopped={!renderConfetti} height='100%' width='100%' />
            </div>

            <div className="flex justify-center w-full gap-y-4 max-w-[800px] flex-col">
              <div className='flex items-center gap-x-4'>
                <button className="p-1.5 rounded-xl bg-secondary hover:bg-tertiary" onClick={() => {
                  setCurrentlyAddingServer(null);
                  setServerDescription('');
                  setServerInviteLink('');
                  setServerCategory('');
                  setServerKeywords([]);
                }}>
                  <MdChevronLeft size={24} />
                </button>
              
                <h1 className="flex flex-wrap items-center text-lg font-bold sm:text-3xl gap-x-1">
                  Adding <ServerIcon width={32} height={32} icon_url={currentlyAddingServer.icon_url} name={currentlyAddingServer.name} /> <span className='truncate'>{currentlyAddingServer.name}</span>
                </h1>
              </div>
              
              <p className='text-sm sm:text-base max-w-[800px] text-tertiary'>
                You{'\''}re about to add {currentlyAddingServer.name} to discord.place. This means your server will be listed on discord.place and everyone will be able to see it. You can remove your server from discord.place at any time.
              </p>
            </div>

            <div className='flex items-center justify-center w-full mt-12'>
              <div className='max-w-[800px] w-full flex flex-col gap-y-1'>
                <h2 className='text-lg font-semibold'>
                  Add a description
                </h2>
                
                <p className='text-sm sm:text-base text-tertiary'>
                  This is the description that will be shown to everyone who visits your server on discord.place.<br/>Make sure to include important information about your server.
                </p>

                <span contentEditable suppressContentEditableWarning className='block w-full h-[150px] p-2 mt-4 overflow-y-auto border-2 border-transparent rounded-lg outline-none bg-secondary text-placeholder focus-visible:text-primary focus-visible:border-purple-500' onKeyUp={event => {
                  if (event.target.innerText.length > config.serverDescriptionMaxCharacters) {
                    event.target.innerText = event.target.innerText.slice(0, config.serverDescriptionMaxCharacters);
                    event.preventDefault();
                    event.stopPropagation();
                    
                    return toast.error(`Description can be maximum ${config.serverDescriptionMaxCharacters} characters long.`);
                  }

                  setServerDescription(event.target.textContent);
                }} />

                <h2 className='mt-8 text-lg font-semibold'>
                  Invite link
                </h2>

                <p className='text-sm sm:text-base text-tertiary'>
                  Add an invite link to your server. This will be helpful for people who want to join your server.<br/>Make sure to set the invite link to never expire.
                </p>

                <input
                  className='block w-full p-2 mt-4 overflow-y-auto text-sm border-2 border-transparent rounded-lg outline-none placeholder-placeholder bg-secondary text-placeholder focus-visible:text-primary focus-visible:border-purple-500'
                  placeholder='https://discord.gg/invite'
                  autoComplete='off'
                  spellCheck='false'
                  value={serverInviteLink}
                  onChange={event => setServerInviteLink(event.target.value)}
                />

                <div className='flex flex-col gap-4 mt-8 sm:flex-row'>
                  <div className='flex flex-col gap-y-2'>
                    <h2 className='text-lg font-semibold'>
                      Category
                    </h2>

                    <p className='text-sm text-tertiary'>
                      Select a base category for your server. This will help people find your server on discord.place.
                    </p>

                    <button className={cn(
                      'flex items-center justify-center w-full h-[40px] mt-4 text-sm font-medium rounded-lg gap-x-2 bg-secondary hover:bg-tertiary',
                      serverCategory ? 'text-primary' : 'text-placeholder'
                    )} onClick={() => setCategoriesDrawerIsOpen(true)}>
                      {serverCategory ? (
                        <>
                          {serverCategory}
                          <IoMdCheckmarkCircle />
                        </>
                      ) :
                        'Select a category'
                      }
                    </button>

                    <CategoriesDrawer openState={categoriesDrawerIsOpen} setOpenState={setCategoriesDrawerIsOpen} state={serverCategory} setState={setServerCategory} categories={config.serverCategories.filter(category => category !== 'All')} />
                  </div>

                  <div className='flex flex-col gap-y-2'>
                    <h2 className='text-lg font-semibold'>
                      Keywords
                    </h2>

                    <p className='text-sm text-tertiary'>
                      Add keywords to your server. This will help people find your server on discord.place.
                    </p>

                    <div className='relative'>
                      <input
                        className='block w-full h-[40px] px-2 mt-4 overflow-y-auto text-sm border-2 border-transparent rounded-lg outline-none disabled:pointer-events-none disabled:opacity-70 placeholder-placeholder bg-secondary text-placeholder focus-visible:text-primary focus-visible:border-purple-500'
                        autoComplete='off'
                        spellCheck='false'
                        value={keywordsInputValue}
                        placeholder='Type a keyword and press enter or space..'
                        onChange={event => {
                          const regexp = new RegExp(/[^a-zA-Z0-9-]/g);
                          if (regexp.test(event.target.value)) return;
                          if (event.target.value.length > config.serverKeywordsMaxCharacters) return toast.error(`Keyword can only contain ${config.serverKeywordsMaxCharacters} characters.`);

                          setKeywordsInputValue(event.target.value);
                        }}
                        onKeyUp={event => {
                          if (event.key === ' ' || event.key === 'Enter') {
                            if (keywordsInputValue.trim().length <= 0) return;

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
                      {serverKeywords.filter(keyword => keyword.length > 0).length} Keywords
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
                  Voice Activity
                </h2>

                <p className='text-sm sm:text-base text-tertiary'>
                  Check this box if you want to enable voice activity tracking for your server. This will help people see how voice active your server is.
                </p>

                <div 
                  className='flex items-center mt-4 cursor-pointer gap-x-2 group'
                  onClick={() => setServerVoiceActivityEnabled(!serverVoiceActivityEnabled)}
                >
                  <button className='p-1 bg-quaternary rounded-md group-hover:bg-white group-hover:text-black min-w-[18px] min-h-[18px]'>
                    {serverVoiceActivityEnabled ? <FaCheck size={10} /> : null}
                  </button>
                  <span className='text-sm font-medium select-none text-tertiary'>
                    Enable Tracking
                  </span>
                </div>

                <h2 className='mt-8 text-lg font-semibold'>
                  Content Policy
                </h2>
                
                <p className='flex flex-col text-sm sm:text-base gap-y-1 text-tertiary'>
                  By adding your server to discord.place, you agree to our Server Submission Guidelines.
                  <span className='mt-2 text-xs text-tertiary'>
                    * Can be found in our Discord server.
                  </span>
                </p>

                <h2 className='mt-8 text-lg font-semibold'>
                  Are you ready?
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
                    Add <ServerIcon width={20} height={20} icon_url={currentlyAddingServer.icon_url} name={currentlyAddingServer.name} /> <span className='truncate'>{currentlyAddingServer.name}</span>
                  </button>
                  <button className='flex items-center justify-center w-full py-2 text-sm font-medium rounded-lg hover:bg-secondary disabled:pointer-events-none disabled:opacity-70'
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
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <h1 className='text-3xl font-bold text-center'>
              My Servers
            </h1>

            <p className='max-w-[400px] text-tertiary text-center'>
              {servers.length > 0 ? 'Select a server to go or add a new server.' : 'Before we get started, we need to know what guilds you\'re in.'}
            </p>

            {servers.length <= 0 && (
              <button className='mt-4 sm:hidden flex items-center gap-x-1.5 px-3 py-1.5 rounded-lg font-semibold text-white bg-black w-max h-max hover:bg-black/70 dark:bg-white dark:text-black dark:hover:bg-white/70 text-sm disabled:pointer-events-none disabled:opacity-70' disabled={loading} onClick={getServers}>
                {loading && <TbLoader className='animate-spin' />}
                Find my servers
              </button>
            )}

            <div className='relative flex flex-col gap-y-2 w-full max-w-[1000px] bg-orange-500/10 border border-orange-500 p-4 rounded-xl mt-8 transition-[margin,opacity] duration-1000 ease-in-out'>
              <h2 className='flex items-center text-lg font-semibold gap-x-2'>
                <BsQuestionCircleFill /> Can{'\''}t see your server?
              </h2>

              <p className='text-sm font-medium text-tertiary'>
                You can only add servers that you own. If you can{'\''}t see your server, make sure you{'\''}re the owner of the server.<br/>If you still can{'\''}t see your server, make sure <Link className='text-secondary hover:text-primary' href={config.botInviteURL} target='_blank'>discord.place bot</Link> is in your server.
              </p>
            </div>

            <div className='max-w-[1000px] grid grid-cols-1 mobile:grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 w-full min-h-[600px] relative mt-4'>
              {servers.map(server => (
                <ServerCard key={server.id} data={server} setCurrentlyAddingServer={setCurrentlyAddingServer} />
              ))}

              {servers.length > 0 && (
                <Link className='flex flex-col text-tertiary hover:text-primary gap-y-4 hover:bg-tertiary w-full h-[180px] bg-secondary rounded-xl items-center justify-center' href={config.botInviteURL} target='_blank'>
                  <RiAddCircleFill className='text-4xl' />
                  <span className='text-sm font-medium'>
                    Add a server
                  </span>
                </Link>
              )}

              {new Array(servers.length > 0 ? (placeholderServerCardLength - 1) - servers.length : placeholderServerCardLength).fill(0).map((_, i) => (
                <div className='w-full h-[180px] bg-secondary rounded-xl' key={i} />
              ))}

              {servers.length <= 0 && (
                <div className='absolute items-center justify-center hidden w-full h-full sm:flex'>
                  <button className='flex items-center gap-x-1.5 px-3 py-1.5 rounded-lg font-semibold text-white bg-black w-max h-max hover:bg-black/70 dark:bg-white dark:text-black dark:hover:bg-white/70 text-sm disabled:pointer-events-none disabled:opacity-70' disabled={loading} onClick={getServers}>
                    {loading && <TbLoader className='animate-spin' />}
                    Find my servers
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AuthProtected>
  );
}
