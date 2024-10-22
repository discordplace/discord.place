'use client';

import { motion } from 'framer-motion';
import Square from '@/app/components/Background/Square';
import cn from '@/lib/cn';
import { Bricolage_Grotesque } from 'next/font/google';
import SearchResults from '@/app/(bots)/bots/components/Hero/SearchResults';
import SearchInput from '@/app/components/SearchInput';
import useSearchStore from '@/stores/bots/search';
import { useShallow } from 'zustand/react/shallow';
import config from '@/config';
import Select from '@/app/components/Select';
import { t } from '@/stores/language';

const BricolageGrotesque = Bricolage_Grotesque({ subsets: ['latin'], display: 'swap', adjustFontFallback: false });

export default function Hero() {
  const { category, setCategory, sort, setSort, loading, search, fetchBots, setPage } = useSearchStore(useShallow(state => ({
    category: state.category,
    setCategory: state.setCategory,
    sort: state.sort,
    setSort: state.setSort,
    loading: state.loading,
    search: state.search,
    fetchBots: state.fetchBots,
    setPage: state.setPage
  })));

  const sequenceTransition = {
    duration: 0.25,
    type: 'spring',
    stiffness: 260,
    damping: 20
  };

  return (
    <div className="relative z-0 flex flex-col items-center px-4 pt-56 sm:px-0">
      <Square column='10' row='10' transparentEffectDirection='bottomToTop' blockColor='rgba(var(--bg-secondary))' />

      <div className='absolute top-[-15%] h-[300px] w-full max-w-[800px] rounded-[5rem] bg-[#ffffff10] blur-[15rem]' />

      <div className='flex w-full max-w-[800px] flex-col items-center'>
        <motion.h1
          className={cn(
            'text-5xl font-medium max-w-[800px] text-center text-primary',
            BricolageGrotesque.className
          )}
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...sequenceTransition, delay: 0.1 }}
        >
          {t('botsPage.title')}
        </motion.h1>

        <motion.span className="mt-8 max-w-[700px] text-center text-tertiary sm:text-lg" initial={{ opacity: 0, y: -25 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sequenceTransition, delay: 0.2 }}>
          {t('botsPage.subtitle')}
        </motion.span>

        <div className='mt-8 flex w-full flex-col items-center justify-center gap-2 sm:flex-row'>
          <SearchInput
            placeholder={t('botsPage.searchInputPlaceholder')}
            loading={loading}
            search={search}
            fetchData={fetchBots}
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
              placeholder={t('botsPage.categorySelectPlaceholder')}
              options={
                config.botCategories.map(category => ({
                  label: <div className='flex items-center gap-x-2'>
                    <span className='text-tertiary'>
                      {config.botCategoriesIcons[category]}
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
              placeholder='Sorting'
              options={[
                ...[
                  {
                    label: t('botsPage.sortSelect.items.votes'),
                    value: 'Votes'
                  },
                  {
                    label: t('botsPage.sortSelect.items.latestVoted'),
                    value: 'LatestVoted'
                  },
                  {
                    label: t('botsPage.sortSelect.items.servers'),
                    value: 'Servers'
                  },
                  {
                    label: t('botsPage.sortSelect.items.mostReviewed'),
                    value: 'Most Reviewed'
                  },
                  {
                    label: t('botsPage.sortSelect.items.newest'),
                    value: 'Newest'
                  },
                  {
                    label: t('botsPage.sortSelect.items.oldest'),
                    value: 'Oldest'
                  }
                ].map(option => ({
                  label: <div className='flex items-center gap-x-2'>
                    {config.sortIcons[option.value.replace(' ', '')]}
                    {option.label}
                  </div>,
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

      <motion.div
        className='my-16 w-full max-w-[1200px]'
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...sequenceTransition, delay: 0.5 }}
      >
        <SearchResults />
      </motion.div>
    </div>
  );
}