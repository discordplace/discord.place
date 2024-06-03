'use client';

import useAuthStore from '@/stores/auth';
import { useEffect } from 'react';
import { useRouter } from 'next-nprogress-bar';
import Sidebar from '@/app/(dashboard)/components/Sidebar';
import Home from '@/app/(dashboard)/components/Home';
import EmojisQueue from '@/app/(dashboard)/components/EmojisQueue';
import BotsQueue from '@/app/(dashboard)/components/BotsQueue';
import ReviewsQueue from '@/app/(dashboard)/components/ReviewsQueue';
import BlockedIps from '@/app/(dashboard)/components/BlockedIps';
import BotDenies from '@/app/(dashboard)/components/BotDenies';
import Timeouts from '@/app/(dashboard)/components/Timeouts';
import useDashboardStore from '@/stores/dashboard';
import { CgFormatSlash } from 'react-icons/cg';
import useThemeStore from '@/stores/theme';
import { motion, AnimatePresence } from 'framer-motion';
import MotionImage from '@/app/components/Motion/Image';
import cn from '@/lib/cn';
import { useMedia } from 'react-use';

export default function Page() {
  const user = useAuthStore(state => state.user);
  const loggedIn = useAuthStore(state => state.loggedIn);
  const router = useRouter();

  useEffect(() => {
    if (loggedIn && !user.can_view_dashboard) return router.push('/error?code=401');

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn, user]);

  const activeTab = useDashboardStore(state => state.activeTab);
  const loading = useDashboardStore(state => state.loading);

  const tabs = [
    {
      id: 'home',
      name: 'Home',
      component: <Home />
    },
    {
      id: 'emojisQueue',
      name: 'Emojis Queue',
      component: <EmojisQueue />
    },
    {
      id: 'botsQueue',
      name: 'Bots Queue',
      component: <BotsQueue />
    },
    {
      id: 'reviewsQueue',
      name: 'Reviews Queue',
      component: <ReviewsQueue />
    },
    {
      id: 'blockedIPs',
      name: 'Blocked IPs',
      component: <BlockedIps />
    },
    {
      id: 'botDenies',
      name: 'Bot Denies',
      component: <BotDenies />
    },
    {
      id: 'timeouts',
      name: 'Timeouts',
      component: <Timeouts />
    }
  ];

  const fetchData = useDashboardStore(state => state.fetchData);

  useEffect(() => {
    switch (activeTab) {
    case 'home':
      fetchData(['stats']);
      break;
    case 'emojisQueue':
      fetchData(['emojis']);
      break;
    case 'botsQueue':
      fetchData(['bots']);
      break;
    case 'reviewsQueue':
      fetchData(['reviews']);
      break;
    case 'blockedIPs':
      fetchData(['blockedips']);
      break;
    case 'botDenies':
      fetchData(['botdenies']);
      break;
    case 'timeouts':
      fetchData(['timeouts']);
      break;
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const theme = useThemeStore(state => state.theme);
  const transition = { duration: 0.25, type: 'spring', damping: 10, stiffness: 100 };

  useEffect(() => {
    if (loading) {
      document.body.style.overflow = 'hidden';
      window.scrollTo(0, 0);
    } else document.body.style.overflow = 'auto';
    
    return () => document.body.style.overflow = 'auto';
  }, [loading]);

  const isCollapsed = useDashboardStore(state => state.isCollapsed);
  const isMobile = useMedia('(max-width: 768px)', false);

  return (
    <div className='relative flex'>
      <Sidebar />
      
      <div className={cn(
        'relative z-[5] flex flex-1 w-full min-h-[100dvh] max-w-[calc(100%_-_300px)]',
        isCollapsed && 'max-w-[90%]',
        isMobile && !isCollapsed && 'max-w-full'
      )}>
        <div className='flex-1 w-full'>
          <div className='flex items-center mt-6 ml-6 text-sm font-medium'>
            <span className='text-tertiary'>
              Dashboard
            </span>

            <CgFormatSlash className='text-lg text-tertiary' />

            <span className='text-primary'>
              {tabs.find(tab => tab.id === activeTab)?.name}
            </span>
          </div>

          <AnimatePresence>
            {isMobile && !isCollapsed && (
              <motion.div
                className='absolute top-0 left-0 w-full h-full dark:bg-black/70 bg-white/70 z-[1]'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            )}
          </AnimatePresence>

          <div className='mt-6 ml-6'>
            {tabs.find(tab => tab.id === activeTab)?.component}
          </div>

          {loading && (
            <AnimatePresence>
              <div className="absolute top-0 left-0 flex flex-col items-center justify-center w-full h-[100dvh] bg-background z-[10]">
                <MotionImage
                  className='w-[64px] h-[64px]'
                  src={theme === 'dark' ? '/symbol_white.png' : '/symbol_black.png'} 
                  alt="discord.place Logo" 
                  width={256} 
                  height={256}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={transition}
                />
            
                <motion.div 
                  className='overflow-hidden mt-8 bg-tertiary w-[150px] h-[6px] rounded-full relative'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={transition}
                >
                  <div className='absolute h-[6px] dark:bg-white bg-black rounded-full animate-loading' style={{
                    width: '50%',
                    transform: 'translateX(-100%)'
                  }} />
                </motion.div>
              </div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}