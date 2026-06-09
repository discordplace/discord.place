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
      component: <LikesGraph profile={profile} />,
      disabled: profile.dailyStats?.length === 0,
      id: 'likes',
      label: t('profilePage.graph.likes.label')
    },
    {
      component: <ViewsGraph profile={profile} />,
      disabled: profile.dailyStats?.length === 0,
      id: 'views',
      label: t('profilePage.graph.views.label')
    }
  ];

  const isMobile = useMedia('(max-width: 640px)', false);

  return (
    <div className='rounded-3xl p-[.75rem] px-8 lg:px-0'>
      <motion.div
        className='w-full'
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ damping: 10, delay: 0.6, duration: 0.3, stiffness: 100, type: 'spring' }}
      >
        {isMobile ? (
          <div className='my-8 grid grid-cols-2 grid-rows-1 gap-2'>
            {tabs.map(tab => (
              <div
                key={tab.id}
                className={cn(
                  'relative rounded-full bg-tertiary px-4 py-2 text-center text-sm font-semibold transition-all duration-500 select-none',
                  activeTab === tab.id && 'z-10 text-white dark:text-black',
                  tab.disabled && 'cursor-not-allowed opacity-50'
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
                    'relative z-10 px-4 py-2 text-sm font-semibold transition-colors',
                    activeTab === tab.id ? 'text-white duration-500 dark:text-black' : 'group-hover:text-tertiary',
                    tab.disabled && 'cursor-not-allowed opacity-50 group-hover:text-primary'
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