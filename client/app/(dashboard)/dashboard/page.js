'use client';

import useAuthStore from '@/stores/auth';
import { useEffect } from 'react';
import { useRouter } from 'next-nprogress-bar';
import Sidebar from '@/app/(dashboard)/components/Sidebar';
import Home from '@/app/(dashboard)/components/Home';
import EmojisQueue from '@/app/(dashboard)/components/EmojisQueue';
import BotsQueue from '@/app/(dashboard)/components/BotsQueue';
import ReviewsQueue from '@/app/(dashboard)/components/ReviewsQueue';
import useDashboardStore from '@/stores/dashboard';
import { CgFormatSlash } from 'react-icons/cg';

export default function Page() {
  const user = useAuthStore(state => state.user);
  const loggedIn = useAuthStore(state => state.loggedIn);
  const router = useRouter();

  useEffect(() => {
    if (loggedIn && !user.can_view_dashboard) return router.push('/error?code=401');

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn, user]);

  const activeTab = useDashboardStore(state => state.activeTab);

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
    }
  ];

  const fetchData = useDashboardStore(state => state.fetchData);

  useEffect(() => {
    fetchData();
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='relative flex'>
      <Sidebar />
      
      <div className='ml-6 mt-6 relative z-[5] flex flex-1 w-full min-h-[100dvh] max-w-[calc(100%_-_300px)]'>
        <div className='flex-1 w-full'>
          <div className='flex items-center text-sm font-medium'>
            <span className='text-tertiary'>
              Dashboard
            </span>

            <CgFormatSlash className='text-lg text-tertiary' />

            <span className='text-primary'>
              {tabs.find(tab => tab.id === activeTab)?.name}
            </span>
          </div>

          {tabs.find(tab => tab.id === activeTab)?.component}
        </div>
      </div>
    </div>
  );
}