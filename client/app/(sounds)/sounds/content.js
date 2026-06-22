'use client';

import Square from '@/app/components/Background/Square';
import cn from '@/lib/cn';
import { motion } from 'framer-motion';
import { Bricolage_Grotesque } from 'next/font/google';
import SearchInput from '@/app/components/SearchInput';
import Select from '@/app/components/Select';
import config from '@/config';
import Sounds from '@/app/(sounds)/sounds/components/Sounds';
import useSearchStore from '@/stores/sounds/search';
import { useShallow } from 'zustand/react/shallow';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const BricolageGrotesque = Bricolage_Grotesque({ adjustFontFallback: false, display: 'swap', subsets: ['latin'] });

export default function Content() {
  const { t } = useTranslation();

  const { search, setPage, category, setCategory, sort, setSort, loading, fetchSounds } = useSearchStore(useShallow(state => ({
    category: state.category,
    fetchSounds: state.fetchSounds,
    loading: state.loading,
    search: state.search,
    setCategory: state.setCategory,
    setPage: state.setPage,
    setSort: state.setSort,
    sort: state.sort
  })));

  const sequenceTransition = {
    damping: 20,
    duration: 0.25,
    stiffness: 260,
    type: 'spring'
  };

  useEffect(() => {
    fetchSounds('');
  }, []);

  return (
    <div className='relative z-0 flex flex-col items-center px-4 pt-56 sm:px-0'>
      <Square
        column='10'
        row='10'
        transparentEffectDirection='bottomToTop'
        blockColor='rgba(var(--bg-secondary))'
      />

      <div className='absolute top-[-15%] h-[300px] w-full max-w-[800px] rounded-[5rem] bg-[#ffffff10] blur-[15rem]' />

      <div className='flex w-full max-w-[700px] flex-col'>
        <motion.h1
          className={cn(
            'max-w-[700px] text-center text-5xl font-medium text-primary',
            BricolageGrotesque.className
          )}
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...sequenceTransition, delay: 0.1 }}
        >
          {t('soundsPage.title')}
        </motion.h1>

        <motion.span className='mt-8 max-w-[700px] text-center text-tertiary sm:text-lg' initial={{ opacity: 0, y: -25 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sequenceTransition, delay: 0.2 }}>
          {t('soundsPage.subtitle')}
        </motion.span>

        <div className='mt-8 flex w-full flex-col items-center justify-center gap-2 sm:flex-row'>
          <SearchInput
            placeholder={t('soundsPage.searchInputPlaceholder')}
            loading={false}
            search={search}
            fetchData={fetchSounds}
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
              placeholder={t('soundsPage.categorySelectPlaceholder')}
              options={
                ['All', ...config.soundCategories]
                  .map(category => ({
                    label: <div className='flex items-center gap-x-2'>
                      <span className='text-tertiary'>
                        {config.soundCategoriesIcons[category]}
                      </span>

                      {t(`categories.${category}`)}
                    </div>,
                    value: category
                  }))
              }
              value={category}
              onChange={setCategory}
              disabled={loading}
            />

            <Select
              placeholder={t('soundsPage.sortSelect.placeholder')}
              options={[
                {
                  label: t('soundsPage.sortSelect.items.downloads'),
                  value: 'Downloads'
                },
                {
                  label: t('soundsPage.sortSelect.items.likes'),
                  value: 'Likes'
                },
                {
                  label: t('soundsPage.sortSelect.items.newest'),
                  value: 'Newest'
                },
                {
                  label: t('soundsPage.sortSelect.items.oldest'),
                  value: 'Oldest'
                }
              ].map(option => ({
                label: <div className='flex items-center gap-x-2'>
                  {config.sortIcons[option.value.replace(' ', '')]}
                  {option.label}
                </div>,
                value: option.value
              }))}
              value={sort}
              onChange={setSort}
              disabled={loading}
            />
          </motion.div>
        </div>
      </div>

      <motion.div
        className='my-16 flex w-full max-w-[1000px] flex-col gap-y-8 px-2 sm:px-4 lg:px-0'
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...sequenceTransition, delay: 0.6 }}
      >
        <Sounds />
      </motion.div>
    </div>
  );
}