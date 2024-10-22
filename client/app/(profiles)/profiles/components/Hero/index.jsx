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

const BricolageGrotesque = Bricolage_Grotesque({ subsets: ['latin'], display: 'swap', adjustFontFallback: false });

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
      <div className='relative z-0 flex flex-col items-center px-4 pt-56 sm:px-0'>
        <Square column='10' row='10' transparentEffectDirection='bottomToTop' blockColor='rgba(var(--bg-secondary))' />

        <div className='absolute -top-1/2 h-[300px] w-full max-w-[800px] rounded-[5rem] bg-[#ffffff10] blur-[15rem]' />

        <div className='flex w-full max-w-[700px] flex-col'>
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

          <motion.div className='mt-8 max-w-[700px] text-center text-tertiary sm:text-lg' initial={{ opacity: 0, y: -25 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sequenceTransition, delay: 0.2 }}>
            {t('profilesPage.subtitle', { br: <br />, count: totalProfiles })}
          </motion.div>

          <div className='mt-8 flex w-full flex-col items-center justify-center gap-2 sm:flex-row'>
            <SearchInput
              placeholder={t('profilesPage.searchInputPlaceholder')}
              loading={loading}
              search={search}
              fetchData={fetchProfiles}
              setPage={setPage}
              animationDelay={0.3}
            />

            <motion.div
              className='flex w-full flex-col items-center gap-2 mobile:flex-row sm:w-max'
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