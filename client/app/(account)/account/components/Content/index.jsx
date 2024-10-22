'use client';

import Sidebar from '@/app/(account)/account/components/Content/Sidebar';
import ActiveReminders from '@/app/(account)/account/components/Content/Tabs/ActiveReminders';
import ActiveTimeouts from '@/app/(account)/account/components/Content/Tabs/ActiveTimeouts';
import MyAccount from '@/app/(account)/account/components/Content/Tabs/MyAccount';
import MyBots from '@/app/(account)/account/components/Content/Tabs/MyBots';
import MyEmojis from '@/app/(account)/account/components/Content/Tabs/MyEmojis';
import MyLinks from '@/app/(account)/account/components/Content/Tabs/MyLinks';
import MyServers from '@/app/(account)/account/components/Content/Tabs/MyServers';
import MySounds from '@/app/(account)/account/components/Content/Tabs/MySounds';
import MyTemplates from '@/app/(account)/account/components/Content/Tabs/MyTemplates';
import MyThemes from '@/app/(account)/account/components/Content/Tabs/MyThemes';
import logout from '@/lib/request/auth/logout';
import useAccountStore from '@/stores/account';
import useAuthStore from '@/stores/auth';
import { t } from '@/stores/language';
import useThemeStore from '@/stores/theme';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next-nprogress-bar';
import { useEffect } from 'react';
import { FaBell, FaCompass, FaDiscord, FaShieldAlt } from 'react-icons/fa';
import { FiLink } from 'react-icons/fi';
import { HiTemplate } from 'react-icons/hi';
import { IoMdArrowBack, IoMdLogOut } from 'react-icons/io';
import { MdAccountCircle, MdDarkMode, MdEmojiEmotions, MdSunny } from 'react-icons/md';
import { MdAccessTimeFilled } from 'react-icons/md';
import { PiWaveformBold } from 'react-icons/pi';
import { RiBrush2Fill, RiRobot2Fill } from 'react-icons/ri';
import { useLocalStorage, useMedia } from 'react-use';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

export default function Content() {
  const user = useAuthStore(state => state.user);
  const setLoggedIn = useAuthStore(state => state.setLoggedIn);
  const setUser = useAuthStore(state => state.setUser);

  const theme = useThemeStore(state => state.theme);
  const toggleTheme = useThemeStore(state => state.toggleTheme);

  const { activeTab, data, fetchData, setActiveTab, setCurrentlyAddingBot, setCurrentlyAddingServer, setCurrentlyAddingSound, setIsCollapsed } = useAccountStore(useShallow(state => ({
    activeTab: state.activeTab,
    data: state.data,
    fetchData: state.fetchData,
    setActiveTab: state.setActiveTab,
    setCurrentlyAddingBot: state.setCurrentlyAddingBot,
    setCurrentlyAddingServer: state.setCurrentlyAddingServer,
    setCurrentlyAddingSound: state.setCurrentlyAddingSound,
    setIsCollapsed: state.setIsCollapsed
  })));

  const router = useRouter();

  const [themesPageVisited, setThemesPageVisited] = useLocalStorage('themes-page-visited', false);

  function logOut() {
    toast.promise(logout(), {
      error: message => message,
      loading: 'Please wait while we log you out..',
      success: () => {
        setLoggedIn(false);
        setUser(null);

        return 'Logged out successfully.';
      }
    });
  }

  const sidebar = [
    {
      component: <MyAccount />,
      icon: MdAccountCircle,
      id: 'my-account',
      name: t('accountPage.sidebar.labels.myAccount')
    },
    {
      icon: FaDiscord,
      id: 'my-user-profile',
      name: t('accountPage.sidebar.labels.myUserProfile'),
      onClick: () => router.push(`/profile/u/${user?.id}`)
    },
    {
      badge: data.counts?.timeouts || 0,
      component: <ActiveTimeouts />,
      icon: MdAccessTimeFilled,
      id: 'active-timeouts',
      name: t('accountPage.sidebar.labels.activeTimeouts')
    },
    {
      badge: data.counts?.reminders || 0,
      component: <ActiveReminders />,
      icon: FaBell,
      id: 'active-reminders',
      name: t('accountPage.sidebar.labels.activeReminders')
    },
    {
      name: t('accountPage.sidebar.labels.yourPublicContent'),
      tabs: [
        {
          badge: data.counts?.links || 0,
          component: <MyLinks />,
          icon: FiLink,
          id: 'my-links',
          name: t('accountPage.sidebar.labels.myLinks')
        },
        {
          badge: data.counts?.servers || 0,
          component: <MyServers />,
          icon: FaCompass,
          id: 'my-servers',
          name: t('accountPage.sidebar.labels.myServers')
        },
        {
          badge: data.counts?.bots || 0,
          component: <MyBots />,
          icon: RiRobot2Fill,
          id: 'my-bots',
          name: t('accountPage.sidebar.labels.myBots')
        },
        {
          badge: data.counts?.emojis || 0,
          component: <MyEmojis />,
          icon: MdEmojiEmotions,
          id: 'my-emojis',
          name: t('accountPage.sidebar.labels.myEmojis')
        },
        {
          badge: data.counts?.templates || 0,
          component: <MyTemplates />,
          icon: HiTemplate,
          id: 'my-templates',
          name: t('accountPage.sidebar.labels.myTemplates')
        },
        {
          badge: data.counts?.sounds || 0,
          component: <MySounds />,
          icon: PiWaveformBold,
          id: 'my-sounds',
          name: t('accountPage.sidebar.labels.mySounds')
        },
        {
          badge: data.counts?.themes || 0,
          component: <MyThemes />,
          icon: RiBrush2Fill,
          id: 'my-themes',
          name: t('accountPage.sidebar.labels.myThemes'),
          onClick: () => {
            setThemesPageVisited(true);
            setActiveTab('my-themes');
          },
          visited: themesPageVisited
        },
        {
          id: 'divider-1'
        },
        {
          condition: () => user.can_view_dashboard === true,
          icon: FaShieldAlt,
          id: 'admin-dashboard',
          name: t('accountPage.sidebar.labels.adminDashboard'),
          onClick: () => router.push('/dashboard')
        },
        {
          icon: theme === 'dark' ? MdSunny : MdDarkMode,
          id: 'toggle-theme',
          name: t('accountPage.sidebar.labels.switchTheme'),
          onClick: toggleTheme
        },
        {
          icon: IoMdLogOut,
          id: 'logout',
          name: t('accountPage.sidebar.labels.logout'),
          onClick: logOut
        },
        {
          icon: IoMdArrowBack,
          id: 'back',
          name: t('accountPage.sidebar.labels.backToHome'),
          onClick: () => router.push('/')
        }
      ]
    }
  ];

  useEffect(() => {
    switch (activeTab) {
      case 'active-reminders':
        fetchData(['reminders']);
        break;
      case 'active-timeouts':
        fetchData(['timeouts']);
        break;
      case 'my-account':
        fetchData([]);
        break;
      case 'my-bots':
        fetchData(['bots']);
        break;
      case 'my-emojis':
        fetchData(['emojis']);
        break;
      case 'my-links':
        fetchData(['links']);
        break;
      case 'my-servers':
        fetchData(['servers']);
        break;
      case 'my-sounds':
        fetchData(['sounds']);
        break;
      case 'my-templates':
        fetchData(['templates']);
        break;
      case 'my-themes':
        fetchData(['themes']);
        setThemesPageVisited(true);
        break;
    }

    setCurrentlyAddingServer(null);
    setCurrentlyAddingBot(false);
    setCurrentlyAddingSound(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const loading = useAccountStore(state => state.loading);
  const transition = { damping: 10, duration: 0.25, stiffness: 100, type: 'spring' };

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
                tabs.map(({ component, id }) => (
                  activeTab === id && (
                    <motion.div
                      animate={{ opacity: 1 }}
                      className='flex size-full flex-col gap-y-4 p-4 sm:p-8'
                      initial={{ opacity: 0 }}
                      key={id}
                      transition={transition}
                    >
                      {component}
                    </motion.div>
                  )
                ))
              ))}

              {sidebar.filter(({ tabs }) => !tabs).map(({ component, id }) => (
                activeTab === id && (
                  <motion.div
                    animate={{ opacity: 1 }}
                    className='flex size-full flex-col gap-y-4 p-4 sm:p-8'
                    initial={{ opacity: 0 }}
                    key={id}
                    transition={transition}
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
                animate={{ opacity: 1 }}
                className='absolute left-0 top-0 z-10 flex size-full flex-col items-center justify-center bg-background'
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
              >
                <Image
                  alt='discord.place Logo'
                  className='size-[64px]'
                  height={256}
                  src={theme === 'dark' ? '/symbol_white.png' : '/symbol_black.png'}
                  width={256}
                />

                <div className='relative mt-8 h-[6px] w-[150px] overflow-hidden rounded-full bg-quaternary'>
                  <div
                    className='absolute h-[6px] animate-loading rounded-full bg-black dark:bg-white' style={{
                      transform: 'translateX(-100%)',
                      width: '50%'
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