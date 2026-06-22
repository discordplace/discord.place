'use client';

import { FaBell, FaCompass, FaDiscord, FaShieldAlt } from 'react-icons/fa';
import { FiLink } from 'react-icons/fi';
import { HiTemplate } from 'react-icons/hi';
import { IoMdArrowBack, IoMdLogOut } from 'react-icons/io';
import { MdAccessTimeFilled, MdAccountCircle, MdDarkMode, MdEmojiEmotions, MdSunny } from 'react-icons/md';
import { PiWaveformBold } from 'react-icons/pi';
import { RiBrush2Fill, RiRobot2Fill } from 'react-icons/ri';
import MyAccount from '@/app/(account)/account/components/Content/Tabs/MyAccount';
import { useEffect } from 'react';
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
import { useRouter } from 'next-nprogress-bar';
import useAuthStore from '@/stores/auth';
import { useCookie, useMedia } from 'react-use';
import { useShallow } from 'zustand/react/shallow';
import { useTranslation } from 'react-i18next';
import Sidebar from '@/app/(account)/account/components/Content/Sidebar';
import logout from '@/lib/request/auth/logout';
import { toast } from 'sonner';
import FullPageLoading from '@/app/components/FullPageLoading';

export default function Content() {
  const { t } = useTranslation();
  const user = useAuthStore(state => state.user);

  const theme = useThemeStore(state => state.theme);
  const toggleTheme = useThemeStore(state => state.toggleTheme);

  const { data, activeTab, setActiveTab, fetchData, setCurrentlyAddingBot, setCurrentlyAddingServer, setCurrentlyAddingSound, setIsCollapsed } = useAccountStore(useShallow(state => ({
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

  const deleteToken = useCookie('token')[2];

  function logOut() {
    toast.promise(logout(), {
      error: error => error,
      loading: t('accountPage.toast.loggingOut'),
      success: () => {
        globalThis.window.location.href = '/';
        deleteToken(null);

        return t('accountPage.toast.loggedOut');
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
      id: 'divider-0',
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
          onClick: () => setActiveTab('my-themes')
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
          onClick: () => {
            if (!document.startViewTransition) return toggleTheme();

            document.startViewTransition(() => toggleTheme());
          }
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
      case 'my-account': {
        fetchData([]);
        break;
      }
      case 'active-timeouts': {
        fetchData(['timeouts']);
        break;
      }
      case 'my-links': {
        fetchData(['links']);
        break;
      }
      case 'my-servers': {
        fetchData(['servers']);
        break;
      }
      case 'my-bots': {
        fetchData(['bots']);
        break;
      }
      case 'my-emojis': {
        fetchData(['emojis']);
        break;
      }
      case 'my-templates': {
        fetchData(['templates']);
        break;
      }
      case 'my-sounds': {
        fetchData(['sounds']);
        break;
      }
      case 'my-themes': {
        fetchData(['themes']);
        break;
      }
      case 'active-reminders': {
        fetchData(['reminders']);
        break;
      }
    }

    setCurrentlyAddingServer(null);
    setCurrentlyAddingBot(false);
    setCurrentlyAddingSound(false);
  }, [activeTab]);

  const loading = useAccountStore(state => state.loading);
  const transition = { damping: 10, duration: 0.25, stiffness: 100, type: 'spring' };

  const isMobile = useMedia('(max-width: 768px)');

  useEffect(() => {
    setIsCollapsed(isMobile);
  }, [isMobile]);

  return (
    <div className='flex min-h-svh gap-x-4 bg-secondary'>
      <Sidebar blocks={sidebar} />

      <div className='flex w-full sm:py-4 sm:pr-4'>
        <div className='relative flex w-full flex-col overflow-y-auto border border-primary bg-background sm:rounded-3xl'>
          <AnimatePresence mode='wait'>
            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                key='account-page-tab-content-loading'
              >
                <FullPageLoading position='absolute' />
              </motion.div>
            ) : (
              <>
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
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}