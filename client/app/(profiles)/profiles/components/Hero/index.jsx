'use client';

import Square from '@/app/components/Background/Square';
import SearchInput from '@/app/components/SearchInput';
import Select from '@/app/components/Select';
import config from '@/config';
import cn from '@/lib/cn';
import { t } from '@/stores/language';
import useSearchStore from '@/stores/profiles/search';
import { motion } from 'framer-motion';
import { Bricolage_Grotesque } from 'next/font/google';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

const BricolageGrotesque = Bricolage_Grotesque({ adjustFontFallback: false, display: 'swap', subsets: ['latin'] });

export default function Hero() {
  const { fetchProfiles, loading, search, setPage, setSort, sort, totalProfiles } = useSearchStore(useShallow(state => ({
    fetchProfiles: state.fetchProfiles,
    loading: state.loading,
    search: state.search,
    setPage: state.setPage,
    setSort: state.setSort,
    sort: state.sort,
    totalProfiles: state.totalProfiles
  })));

  useEffect(() => {
    fetchProfiles('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sequenceTransition = {
    damping: 20,
    duration: 0.25,
    stiffness: 260,
    type: 'spring'
  };

  return (
    <>
      <div className='relative z-0 flex flex-col items-center px-4 pt-56 sm:px-0'>
        <Square blockColor='rgba(var(--bg-secondary))' column='10' row='10' transparentEffectDirection='bottomToTop' />

        <div className='absolute -top-1/2 h-[300px] w-full max-w-[800px] rounded-[5rem] bg-[#ffffff10] blur-[15rem]' />

        <div className='flex w-full max-w-[700px] flex-col'>
          <motion.h1
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'text-5xl font-medium max-w-[700px] text-center text-primary',
              BricolageGrotesque.className
            )}
            initial={{ opacity: 0, y: -25 }}
            transition={{ ...sequenceTransition, delay: 0.1 }}
          >
            {t('profilesPage.title')}
          </motion.h1>

          <motion.div animate={{ opacity: 1, y: 0 }} className='mt-8 max-w-[700px] text-center text-tertiary sm:text-lg' initial={{ opacity: 0, y: -25 }} transition={{ ...sequenceTransition, delay: 0.2 }}>
            {t('profilesPage.subtitle', { br: <br />, count: totalProfiles })}
          </motion.div>

          <div className='mt-8 flex w-full flex-col items-center justify-center gap-2 sm:flex-row'>
            <SearchInput
              animationDelay={0.3}
              fetchData={fetchProfiles}
              loading={loading}
              placeholder={t('profilesPage.searchInputPlaceholder')}
              search={search}
              setPage={setPage}
            />

            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className='flex w-full flex-col items-center gap-2 mobile:flex-row sm:w-max'
              initial={{ opacity: 0, y: -25 }}
              transition={{ ...sequenceTransition, delay: 0.3 }}
            >
              <Select
                disabled={loading}
                onChange={setSort}
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
                placeholder={t('profilesPage.sortSelect.placeholder')}
                value={sort}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}