'use client';

import Emojis from '@/app/(emojis)/emojis/components/Hero/Emojis';
import Square from '@/app/components/Background/Square';
import SearchInput from '@/app/components/SearchInput';
import Select from '@/app/components/Select';
import config from '@/config';
import cn from '@/lib/cn';
import useSearchStore from '@/stores/emojis/search';
import { t } from '@/stores/language';
import { motion } from 'framer-motion';
import { Bricolage_Grotesque } from 'next/font/google';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

const BricolageGrotesque = Bricolage_Grotesque({ adjustFontFallback: false, display: 'swap', subsets: ['latin'] });

export default function Hero() {
  const { category, fetchEmojis, loading, search, setCategory, setPage, setSort, sort, total } = useSearchStore(useShallow(state => ({
    category: state.category,
    fetchEmojis: state.fetchEmojis,
    loading: state.loading,
    search: state.search,
    setCategory: state.setCategory,
    setPage: state.setPage,
    setSort: state.setSort,
    sort: state.sort,
    total: state.total
  })));

  useEffect(() => {
    fetchEmojis('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sequenceTransition = {
    damping: 20,
    duration: 0.25,
    stiffness: 260,
    type: 'spring'
  };

  return (
    <div className='relative z-0 flex flex-col items-center px-4 pt-56 sm:px-0'>
      <Square blockColor='rgba(var(--bg-secondary))' column='10' row='10' transparentEffectDirection='bottomToTop' />

      <div className='absolute top-[-15%] h-[300px] w-full max-w-[800px] rounded-[5rem] bg-[#ffffff10] blur-[15rem]' />

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
          {t('emojisPage.title')}
        </motion.h1>

        <motion.span animate={{ opacity: 1, y: 0 }} className='mt-8 max-w-[700px] text-center text-tertiary sm:text-lg' initial={{ opacity: 0, y: -25 }} transition={{ ...sequenceTransition, delay: 0.2 }}>
          {t('emojisPage.subtitle', { br: <br />, count: total })}
        </motion.span>

        <div className='mt-8 flex w-full flex-col items-center justify-center gap-2 sm:flex-row'>
          <SearchInput
            animationDelay={0.3}
            fetchData={fetchEmojis}
            loading={loading}
            placeholder={t('emojisPage.searchInputPlaceholder')}
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
              onChange={setCategory}
              options={
                config.emojiCategories
                  .map(category => ({
                    label: <div className='flex items-center gap-x-2'>
                      <span className='text-tertiary'>
                        {config.emojiCategoriesIcons[category]}
                      </span>

                      {t(`categories.${category}`)}
                    </div>,
                    value: category
                  }))
              }
              placeholder={t('emojisPage.categorySelectPlaceholder')}
              value={category}
            />

            <Select
              disabled={loading}
              onChange={setSort}
              options={[
                ...[
                  {
                    label: t('emojisPage.sortSelect.items.popular'),
                    value: 'Popular'
                  },
                  {
                    label: t('emojisPage.sortSelect.items.newest'),
                    value: 'Newest'
                  },
                  {
                    label: t('emojisPage.sortSelect.items.oldest'),
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
              placeholder={t('emojisPage.sortSelect.placeholder')}
              value={sort}
            />
          </motion.div>
        </div>
      </div>

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className='my-16 flex w-full max-w-[1000px] flex-col gap-y-8 px-2 sm:px-4 lg:px-0'
        initial={{ opacity: 0, y: -25 }}
        transition={{ ...sequenceTransition, delay: 0.6 }}
      >
        <Emojis />
      </motion.div>
    </div>
  );
}