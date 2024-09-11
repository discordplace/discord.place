'use client';

import MyAccount from '@/app/(account)/account/components/Content/Tabs/MyAccount';
import cn from '@/lib/cn';
import { useEffect, useState } from 'react';
import { MdAccountCircle, MdDarkMode, MdEmojiEmotions, MdSunny } from 'react-icons/md';
import { MdAccessTimeFilled } from 'react-icons/md';
import ActiveTimeouts from '@/app/(account)/account/components/Content/Tabs/ActiveTimeouts';
import ActiveReminders from '@/app/(account)/account/components/Content/Tabs/ActiveReminders';
import MyLinks from '@/app/(account)/account/components/Content/Tabs/MyLinks';
import MyServers from '@/app/(account)/account/components/Content/Tabs/MyServers';
import MyBots from '@/app/(account)/account/components/Content/Tabs/MyBots';
import MyEmojis from '@/app/(account)/account/components/Content/Tabs/MyEmojis';
import MyTemplates from '@/app/(account)/account/components/Content/Tabs/MyTemplates';
import MySounds from '@/app/(account)/account/components/Content/Tabs/MySounds';
import useAccountStore from '@/stores/account';
import useThemeStore from '@/stores/theme';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { IoMdArrowBack } from 'react-icons/io';
import { useRouter } from 'next-nprogress-bar';
import { TbLoader } from 'react-icons/tb';
import { FaCompass, FaBell, FaShieldAlt, FaDiscord } from 'react-icons/fa';
import { RiRobot2Fill } from 'react-icons/ri';
import useAuthStore from '@/stores/auth';
import { MdArrowOutward } from 'react-icons/md';
import { HiTemplate } from 'react-icons/hi';
import Link from 'next/link';
import { useLocalStorage, useMedia } from 'react-use';
import { IoChevronBackOutline } from 'react-icons/io5';
import { nanoid } from 'nanoid';
import { PiWaveformBold } from 'react-icons/pi';
import { FiLink } from 'react-icons/fi';
import { useShallow } from 'zustand/react/shallow';
import { t } from '@/stores/language';

export default function Content() {
  const user = useAuthStore(state => state.user);
  const data = useAccountStore(state => state.data);
  const theme = useThemeStore(state => state.theme);
  const toggleTheme = useThemeStore(state => state.toggleTheme);
  const isCollapsed = useAccountStore(state => state.isCollapsed);
  const setIsCollapsed = useAccountStore(state => state.setIsCollapsed);

  const router = useRouter();

  const [linksPageVisited, setLinksPageVisited] = useLocalStorage('links-page-visited', false);

  const sidebar = [
    {
      name: t('accountPage.sidebar.labels.account'),
      items: [
        {
          Icon: MdAccountCircle,
          name: t('accountPage.sidebar.labels.myAccount'),
          id: 'my-account',
          component: <MyAccount />
        },
        {
          Icon: FaDiscord,
          IconEnd: MdArrowOutward,
          name: t('accountPage.sidebar.labels.myUserProfile'),
          id: 'view-discord-profile',
          action: () => router.push(`/profile/u/${user.id}`)
        },
        {
          Icon: MdAccessTimeFilled,
          name: t('accountPage.sidebar.labels.activeTimeouts'),
          id: 'active-timeouts',
          component: <ActiveTimeouts />,
          badge_count: data.counts?.timeouts || 0
        },
        {
          Icon: FaBell,
          name: t('accountPage.sidebar.labels.activeReminders'),
          id: 'active-reminders',
          component: <ActiveReminders />,
          badge_count: data.counts?.reminders || 0
        }
      ]
    },
    {
      name: t('accountPage.sidebar.labels.yourPublicContent'),
      items: [
        {
          Icon: FiLink,
          name: t('accountPage.sidebar.labels.myLinks'),
          id: 'my-links',
          component: <MyLinks />,
          new_badge: !linksPageVisited,
          badge_count: data.counts?.links || 0
        },
        {
          Icon: FaCompass,
          name: t('accountPage.sidebar.labels.myServers'),
          id: 'my-servers',
          component: <MyServers />,
          badge_count: data.counts?.servers || 0
        },
        {
          Icon: RiRobot2Fill,
          name: t('accountPage.sidebar.labels.myBots'),
          id: 'my-bots',
          component: <MyBots />,
          badge_count: data.counts?.bots || 0
        },
        {
          Icon: MdEmojiEmotions,
          name: t('accountPage.sidebar.labels.myEmojis'),
          id: 'my-emojis',
          component: <MyEmojis />,
          badge_count: data.counts?.emojis || 0
        },
        {
          Icon: HiTemplate,
          name: t('accountPage.sidebar.labels.myTemplates'),
          id: 'my-templates',
          component: <MyTemplates />,
          badge_count: data.counts?.templates || 0
        },
        {
          Icon: PiWaveformBold,
          name: t('accountPage.sidebar.labels.mySounds'),
          id: 'my-sounds',
          component: <MySounds />,
          badge_count: data.counts?.sounds || 0
        },
        {
          type: 'divider'
        },
        {
          Icon: FaShieldAlt,
          IconEnd: MdArrowOutward,
          name: t('accountPage.sidebar.labels.adminDashboard'),
          id: 'admin-dashboard',
          action: () => router.push('/dashboard'),
          condition: () => user.can_view_dashboard === true
        },
        {
          Icon: theme === 'dark' ? MdSunny : MdDarkMode,
          name: t('accountPage.sidebar.labels.switchTheme'),
          id: 'toggle-theme',
          action: () => toggleTheme()
        },
        {
          Icon: IoMdArrowBack,
          name: t('accountPage.sidebar.labels.backToHome'),
          id: 'back',
          action: () => router.push('/')
        }
      ]
    }
  ];

  const [activeTab, setActiveTab] = useState('my-account');

  const { fetchData, setCurrentlyAddingBot, setCurrentlyAddingServer, setCurrentlyAddingSound } = useAccountStore(useShallow(state => ({
    fetchData: state.fetchData,
    setCurrentlyAddingBot: state.setCurrentlyAddingBot,
    setCurrentlyAddingServer: state.setCurrentlyAddingServer,
    setCurrentlyAddingSound: state.setCurrentlyAddingSound
  })));

  useEffect(() => {
    switch (activeTab) {
      case 'my-account':
        fetchData([]);
        break;
      case 'active-timeouts':
        fetchData(['timeouts']);
        break;
      case 'my-links':
        fetchData(['links']);
        setLinksPageVisited(true);
        break;
      case 'my-servers':
        fetchData(['servers']);
        break;
      case 'my-bots':
        fetchData(['bots']);
        break;
      case 'my-emojis':
        fetchData(['emojis']);
        break;
      case 'my-templates':
        fetchData(['templates']);
        break;
      case 'my-sounds':
        fetchData(['sounds']);
        break;
      case 'active-reminders':
        fetchData(['reminders']);
        break;
    }

    setCurrentlyAddingServer(null);
    setCurrentlyAddingBot(false);
    setCurrentlyAddingSound(false);
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const loading = useAccountStore(state => state.loading);
  const transition = { duration: 0.25, type: 'spring', damping: 10, stiffness: 100 };

  useEffect(() => {
    if (loading) {
      document.body.style.overflow = 'hidden';
      window.scrollTo(0, 0);
    } else document.body.style.overflow = 'auto';
    
    return () => document.body.style.overflow = 'auto';
  }, [loading]);

  useEffect(() => {
    if (isCollapsed) {
      document.body.style.overflow = 'auto';
    } else {
      document.body.style.overflow = 'hidden';
      window.scrollTo(0, 0);
    }
  }, [isCollapsed]);

  const isLaptop = useMedia('(max-width: 1024px)', false);

  useEffect(() => {
    if (!isLaptop && isCollapsed) setIsCollapsed(false);
    else if (isLaptop && !isCollapsed) setIsCollapsed(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLaptop]);

  return (
    <div className='flex min-h-[100dvh]'>
      <div className={cn(
        'w-full max-w-[8%] sm:max-w-[5%] lg:max-w-[30%] border-r-2 relative border-r-primary bg-secondary min-h-[100dvh] items-end flex flex-col',
        isLaptop && !isCollapsed && 'max-w-[95%] sm:max-w-[45%] absolute left-0 z-[11]'
      )}>
        <div className='flex flex-col w-full pt-16 pl-8 pr-8 sm:pl-0 sm:w-max gap-y-8'>
          {isLaptop && (
            <div
              className='z-[9999] absolute ml-auto -right-[1rem] cursor-pointer bg-secondary p-1.5 hover:bg-quaternary text-secondary hover:text-primary rounded-full border-2 border-primary'
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <IoChevronBackOutline 
                className={cn(
                  'transition-transform transform duration-200 ease-in-out',
                  isCollapsed && 'rotate-180'
                )}
              />
            </div>
          )}
          
          <Link 
            href='/'
            className={cn(
              'relative items-center transition-opacity gap-x-6 hover:opacity-70',
              isCollapsed ? 'hidden lg:flex' : 'flex'
            )}
          >
            <Image 
              src={theme === 'dark' ? '/symbol_white.png' : '/symbol_black.png'} 
              width={200} 
              height={200} 
              className='w-[32px] h-[32px]' 
              alt='discord.placeLogo' 
            />

            <h1 className={cn(
              'text-lg font-semibold'
            )}>
              Discord Place
            </h1>
          </Link>
          
          {sidebar.map((item, index) => (
            <div
              className={cn(
                'flex-col gap-y-4',
                isCollapsed ? 'hidden lg:flex' : 'flex'
              )}
              key={index}
            >
              <h2 className='flex justify-between text-sm font-medium text-tertiary'>{item.name}</h2>
              <div className='flex flex-col gap-y-1.5 items-start'>
                {item.items
                  .filter(({ condition }) => !condition || condition())
                  .map(({ Icon, IconEnd, name, id, type, action, badge_count, new_badge }) => (
                    type === 'divider' ? (
                      <div 
                        key={nanoid()}
                        className='w-[95%] mx-auto h-[2px] bg-quaternary my-2' 
                      />
                    ) : (
                      <button
                        className={cn(
                          'outline-none group relative items-center transition-opacity gap-x-2 px-2 py-2 font-medium w-full rounded-lg select-none flex',
                          activeTab === id ? 'pointer-events-none bg-quaternary text-primary' : 'text-secondary hover:text-primary hover:bg-tertiary',
                          loading && 'pointer-events-none'
                        )}
                        key={id}
                        onClick={() => {
                          if (action) return action();

                          setActiveTab(id);
                          setIsCollapsed(true);
                        }}
                      >
                        {activeTab === id && (
                          <motion.div
                            layoutId='activeTabIndicator'
                            className='absolute -left-3 bg-black dark:bg-white w-[3px] h-[50%] rounded-lg'
                          />
                        )}

                        <Icon />
                      
                        <span className='pr-2 truncate'>
                          {name}
                        </span>

                        {new_badge && (
                          <div className='px-2.5 py-0.5 ml-auto text-xs font-bold text-white bg-purple-500 rounded-full'>
                            {t('accountPage.sidebar.newBadge')}
                          </div>
                        )}

                        {badge_count > 0 && (
                          <span className={cn(
                            'px-2 py-0.5 ml-auto text-xs transition-opacity font-semibold rounded-full bg-quaternary text-primary',
                            ((badge_count || 0) === 0 || (activeTab === id && loading)) ? 'opacity-0' : 'opacity-100'
                          )}>
                            {badge_count}
                          </span>
                        )}

                        {IconEnd && <IconEnd className='ml-auto text-tertiary' />}

                        <TbLoader 
                          className={cn(
                            'absolute right-2 animate-spin transition-opacity text-tertiary',
                            (loading && activeTab === id && !new_badge) ? 'opacity-100' : 'opacity-0'
                          )} 
                        />
                      </button>
                    )
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={cn(
        'relative w-full pb-4 bg-tertiary min-h-[100dvh] flex flex-col overflow-y-auto',
        isCollapsed && 'max-w-[100%]',
        !isLaptop && 'max-w-[70%]'
      )}>
        {!loading && (
          <AnimatePresence>
            {sidebar.map(({ items }) => (
              items.map(({ id, component }) => (
                activeTab === id && (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={transition}
                    className='w-full h-full'
                  >
                    {component}
                  </motion.div>
                )
              ))
            ))}
          </AnimatePresence>
        )}

        <AnimatePresence>
          {isLaptop && !isCollapsed && (
            <motion.div
              className='absolute top-0 left-0 w-full h-full backdrop-blur-md dark:bg-black/50 bg-white/50 z-[10]'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}

          {loading && (
            <motion.div
              className="absolute top-0 left-0 flex flex-col items-center justify-center w-full h-[100dvh] bg-tertiary z-[10]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Image
                className='w-[64px] h-[64px]'
                src={theme === 'dark' ? '/symbol_white.png' : '/symbol_black.png'} 
                alt="discord.place Logo" 
                width={256} 
                height={256}
              />
            
              <div className='overflow-hidden mt-8 bg-quaternary w-[150px] h-[6px] rounded-full relative'>
                <div 
                  className='absolute h-[6px] dark:bg-white bg-black rounded-full animate-loading' style={{
                    width: '50%',
                    transform: 'translateX(-100%)'
                  }} 
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}