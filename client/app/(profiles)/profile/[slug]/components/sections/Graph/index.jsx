'use client';

import { motion } from 'framer-motion';
import cn from '@/lib/cn';
import { useState } from 'react';
import { useMedia } from 'react-use';
import LikesGraph from '@/app/(profiles)/profile/[slug]/components/sections/Graph/Likes';
import ViewsGraph from '@/app/(profiles)/profile/[slug]/components/sections/Graph/Views';
import { t } from '@/stores/language';

export default function Graph({ profile }) {
  const [activeTab, setActiveTab] = useState('likes');
  const tabs = [
    {
      label: t('profilePage.graph.likes.label'),
      id: 'likes',
      component: <LikesGraph profile={profile} />,
      disabled: profile.dailyStats?.length === 0
    },
    {
      label: t('profilePage.graph.views.label'),
      id: 'views',
      component: <ViewsGraph profile={profile} />,
      disabled: profile.dailyStats?.length === 0
    }
  ];

  const isMobile = useMedia('(max-width: 640px)', false);

  return (
    <div className='rounded-3xl p-[.75rem] px-8 lg:px-0'>
      <motion.div
        className='w-full'
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10, delay: 0.6 }}
      >
        {isMobile ? (
          <div className='my-8 grid grid-cols-2 grid-rows-1 gap-2'>
            {tabs.map(tab => (
              <div
                key={tab.id}
                className={cn(
                  'relative px-4 text-center py-2 text-sm font-semibold rounded-full select-none transition-all duration-500 bg-tertiary',
                  activeTab === tab.id && 'z-[10] text-white dark:text-black',
                  tab.disabled && 'opacity-50 cursor-not-allowed'
                )}
                onClick={() => !tab.disabled && setActiveTab(tab.id)}
              >
                <span className='truncate'>
                  {tab.label}
                </span>

                {activeTab === tab.id && (
                  <motion.div
                    layoutId='tabIndicator'
                    className='pointer-events-none absolute bottom-0 left-0 z-[-1] size-full rounded-full bg-black dark:bg-white'
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className='my-8 flex w-max rounded-full bg-tertiary lg:mx-0'>
            {tabs.map(tab => (
              <div className='group relative cursor-pointer select-none' key={tab.id} onClick={() => !tab.disabled && setActiveTab(tab.id)}>
                <div
                  className={cn(
                    'px-4 py-2 font-semibold text-sm z-10 relative transition-colors',
                    activeTab === tab.id ? 'text-white dark:text-black duration-500' : 'group-hover:text-tertiary',
                    tab.disabled && 'opacity-50 cursor-not-allowed group-hover:text-primary'
                  )}
                >
                  {tab.label}
                </div>

                {activeTab === tab.id && (
                  <motion.div
                    layoutId='tabIndicator'
                    className='pointer-events-none absolute bottom-0 left-0 size-full rounded-full bg-black dark:bg-white'
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {tabs.find(tab => tab.id === activeTab)?.component}
      </motion.div>
    </div>
  );
}