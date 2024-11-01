'use client';

import MyAccount from '@/app/(account)/account/components/Content/Tabs/MyAccount';
import { useEffect } from 'react';
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
import MyThemes from '@/app/(account)/account/components/Content/Tabs/MyThemes';
import useAccountStore from '@/stores/account';
import useThemeStore from '@/stores/theme';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { IoMdArrowBack, IoMdLogOut } from 'react-icons/io';
import { useRouter } from 'next-nprogress-bar';
import { FaCompass, FaBell, FaShieldAlt, FaDiscord } from 'react-icons/fa';
import { RiBrush2Fill, RiRobot2Fill } from 'react-icons/ri';
import useAuthStore from '@/stores/auth';
import { HiTemplate } from 'react-icons/hi';
import { useCookie, useLocalStorage, useMedia } from 'react-use';
import { PiWaveformBold } from 'react-icons/pi';
import { FiLink } from 'react-icons/fi';
import { useShallow } from 'zustand/react/shallow';
import { t } from '@/stores/language';
import Sidebar from '@/app/(account)/account/components/Content/Sidebar';
import logout from '@/lib/request/auth/logout';
import { toast } from 'sonner';

export default function Content() {
  const user = useAuthStore(state => state.user);
  const setLoggedIn = useAuthStore(state => state.setLoggedIn);
  const setUser = useAuthStore(state => state.setUser);

  const theme = useThemeStore(state => state.theme);
  const toggleTheme = useThemeStore(state => state.toggleTheme);

  const { data, activeTab, setActiveTab, fetchData, setCurrentlyAddingBot, setCurrentlyAddingServer, setCurrentlyAddingSound, setIsCollapsed } = useAccountStore(useShallow(state => ({
    data: state.data,
    activeTab: state.activeTab,
    setActiveTab: state.setActiveTab,
    fetchData: state.fetchData,
    setCurrentlyAddingBot: state.setCurrentlyAddingBot,
    setCurrentlyAddingServer: state.setCurrentlyAddingServer,
    setCurrentlyAddingSound: state.setCurrentlyAddingSound,
    setIsCollapsed: state.setIsCollapsed
  })));

  const router = useRouter();

  const [themesPageVisited, setThemesPageVisited] = useLocalStorage('themes-page-visited', false);
  const [,, deleteToken] = useCookie('token');

  function logOut() {
    toast.promise(logout(), {
      loading: 'Please wait while we log you out..',
      success: () => {
        setLoggedIn(false);
        setUser(null);
        deleteToken(null);

        return 'Logged out successfully.';
      },
      error: message => message
    });
  }

  const sidebar = [
    {
      id: 'my-account',
      icon: MdAccountCircle,
      name: t('accountPage.sidebar.labels.myAccount'),
      component: <MyAccount />
    },
    {
      id: 'my-user-profile',
      icon: FaDiscord,
      name: t('accountPage.sidebar.labels.myUserProfile'),
      onClick: () => router.push(`/profile/u/${user?.id}`)
    },
    {
      id: 'active-timeouts',
      icon: MdAccessTimeFilled,
      name: t('accountPage.sidebar.labels.activeTimeouts'),
      component: <ActiveTimeouts />,
      badge: data.counts?.timeouts || 0
    },
    {
      id: 'active-reminders',
      icon: FaBell,
      name: t('accountPage.sidebar.labels.activeReminders'),
      component: <ActiveReminders />,
      badge: data.counts?.reminders || 0
    },
    {
      name: t('accountPage.sidebar.labels.yourPublicContent'),
      tabs: [
        {
          id: 'my-links',
          icon: FiLink,
          name: t('accountPage.sidebar.labels.myLinks'),
          component: <MyLinks />,
          badge: data.counts?.links || 0
        },
        {
          id: 'my-servers',
          icon: FaCompass,
          name: t('accountPage.sidebar.labels.myServers'),
          component: <MyServers />,
          badge: data.counts?.servers || 0
        },
        {
          id: 'my-bots',
          icon: RiRobot2Fill,
          name: t('accountPage.sidebar.labels.myBots'),
          component: <MyBots />,
          badge: data.counts?.bots || 0
        },
        {
          id: 'my-emojis',
          icon: MdEmojiEmotions,
          name: t('accountPage.sidebar.labels.myEmojis'),
          component: <MyEmojis />,
          badge: data.counts?.emojis || 0
        },
        {
          id: 'my-templates',
          icon: HiTemplate,
          name: t('accountPage.sidebar.labels.myTemplates'),
          component: <MyTemplates />,
          badge: data.counts?.templates || 0
        },
        {
          id: 'my-sounds',
          icon: PiWaveformBold,
          name: t('accountPage.sidebar.labels.mySounds'),
          component: <MySounds />,
          badge: data.counts?.sounds || 0
        },
        {
          id: 'my-themes',
          icon: RiBrush2Fill,
          name: t('accountPage.sidebar.labels.myThemes'),
          component: <MyThemes />,
          badge: data.counts?.themes || 0,
          visited: themesPageVisited,
          onClick: () => {
            setThemesPageVisited(true);
            setActiveTab('my-themes');
          }
        },
        {
          id: 'divider-1'
        },
        {
          id: 'admin-dashboard',
          icon: FaShieldAlt,
          name: t('accountPage.sidebar.labels.adminDashboard'),
          onClick: () => router.push('/dashboard'),
          condition: () => user.can_view_dashboard === true
        },
        {
          id: 'toggle-theme',
          icon: theme === 'dark' ? MdSunny : MdDarkMode,
          name: t('accountPage.sidebar.labels.switchTheme'),
          onClick: toggleTheme
        },
        {
          id: 'logout',
          icon: IoMdLogOut,
          name: t('accountPage.sidebar.labels.logout'),
          onClick: logOut
        },
        {
          id: 'back',
          icon: IoMdArrowBack,
          name: t('accountPage.sidebar.labels.backToHome'),
          onClick: () => router.push('/')
        }
      ]
    }
  ];

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
      case 'my-themes':
        fetchData(['themes']);
        setThemesPageVisited(true);
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

  const isMobile = useMedia('(max-width: 768px)');

  useEffect(() => {
    setIsCollapsed(isMobile);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  return (
    <div className='flex min-h-svh gap-x-4 bg-secondary'>
      <Sidebar blocks={sidebar} />

      <div className='flex w-full sm:py-4 sm:pr-4'>
        <div className='relative flex w-full flex-col overflow-y-auto border border-primary bg-background sm:rounded-3xl'>
          {!loading && (
            <AnimatePresence>
              {sidebar.filter(({ tabs }) => tabs).map(({ tabs }) => (
                tabs.map(({ id, component }) => (
                  activeTab === id && (
                    <motion.div
                      key={id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={transition}
                      className='flex size-full flex-col gap-y-4 p-4 sm:p-8'
                    >
                      {component}
                    </motion.div>
                  )
                ))
              ))}

              {sidebar.filter(({ tabs }) => !tabs).map(({ id, component }) => (
                activeTab === id && (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={transition}
                    className='flex size-full flex-col gap-y-4 p-4 sm:p-8'
                  >
                    {component}
                  </motion.div>
                )
              ))}
            </AnimatePresence>
          )}

          <AnimatePresence>
            {loading && (
              <motion.div
                className='absolute left-0 top-0 z-10 flex size-full flex-col items-center justify-center bg-background'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Image
                  className='size-[64px]'
                  src={theme === 'dark' ? '/symbol_white.png' : '/symbol_black.png'}
                  alt='discord.place Logo'
                  width={256}
                  height={256}
                  priority={true}
                />

                <div className='relative mt-8 h-[6px] w-[150px] overflow-hidden rounded-full bg-quaternary'>
                  <div
                    className='absolute h-[6px] animate-loading rounded-full bg-black dark:bg-white' style={{
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
    </div>
  );
}