'use client';

import { useEffect } from 'react';
import { Bricolage_Grotesque } from 'next/font/google';
import cn from '@/lib/cn';
import Square from '@/app/components/Background/Square';
import SearchInput from '@/app/components/SearchInput';
import useSearchStore from '@/stores/profiles/search';
import { motion } from 'framer-motion';
import { useShallow } from 'zustand/react/shallow';
import { t } from '@/stores/language';
import Select from '@/app/components/Select';
import config from '@/config';

const BricolageGrotesque = Bricolage_Grotesque({ subsets: ['latin'] });

export default function Hero() {
  const { fetchProfiles, totalProfiles, loading, search, setPage, sort, setSort } = useSearchStore(useShallow(state => ({
    fetchProfiles: state.fetchProfiles,
    totalProfiles: state.totalProfiles,
    loading: state.loading,
    search: state.search,
    setPage: state.setPage,
    sort: state.sort,
    setSort: state.setSort
  })));
  
  useEffect(() => {
    fetchProfiles('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sequenceTransition = {
    duration: 0.25,
    type: 'spring',
    stiffness: 260,
    damping: 20
  };

  return (
    <>
      <div className="z-0 relative flex flex-col pt-[14rem] items-center px-4 sm:px-0">
        <Square column='10' row='10' transparentEffectDirection='bottomToTop' blockColor='rgba(var(--bg-secondary))' />

        <div className='absolute top-[-50%] max-w-[800px] w-full h-[300px] rounded-[5rem] bg-[#ffffff10] blur-[15rem]' />

        <div className='max-w-[700px] flex flex-col w-full'>
          <motion.h1 
            className={cn(
              'text-5xl font-medium max-w-[700px] text-center text-primary',
              BricolageGrotesque.className
            )}
            initial={{ opacity: 0, y: -25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...sequenceTransition, delay: 0.1 }}
          >
            {t('profilesPage.title')}
          </motion.h1>
          
          <motion.div className="sm:text-lg max-w-[700px] text-center mt-8 text-tertiary" initial={{ opacity: 0, y: -25 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sequenceTransition, delay: 0.2 }}>
            {t('profilesPage.subtitle', { br: <br />, count: totalProfiles })}
          </motion.div>

          <div className='flex flex-col items-center justify-center w-full gap-2 mt-8 sm:flex-row'>
            <SearchInput
              placeholder={t('profilesPage.searchInputPlaceholder')}
              loading={loading}
              search={search}
              fetchData={fetchProfiles}
              setPage={setPage}
              animationDelay={0.3}
            />

            <motion.div
              className='flex flex-col items-center w-full gap-2 mobile:flex-row sm:w-max'
              initial={{ opacity: 0, y: -25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...sequenceTransition, delay: 0.3 }}
            >
              <Select
                placeholder={t('profilesPage.sortSelect.placeholder')}
                options={[
                  ...[
                    {
                      label: t('profilesPage.sortSelect.items.likes'),
                      value: 'Likes'
                    },
                    {
                      label: t('profilesPage.sortSelect.items.mostViewed'),
                      value: 'MostViewed'
                    },
                    {
                      label: t('profilesPage.sortSelect.items.newest'),
                      value: 'Newest'
                    },
                    {
                      label: t('profilesPage.sortSelect.items.oldest'),
                      value: 'Oldest'
                    }
                  ].map(option => ({
                    label: (
                      <div className='flex items-center gap-x-2'>
                        {config.sortIcons[option.value.replace(' ', '')]}
                        {option.label}
                      </div>
                    ),
                    value: option.value
                  }))
                ]}
                value={sort}
                onChange={setSort}
                disabled={loading}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}