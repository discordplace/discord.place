'use client';

import { useEffect } from 'react';
import { Bricolage_Grotesque } from 'next/font/google';
import cn from '@/lib/cn';
import Square from '@/app/components/Background/Square';
import useSearchStore from '@/stores/emojis/search';
import { motion } from 'framer-motion';
import Emojis from '@/app/(emojis)/emojis/components/Hero/Emojis';
import SearchInput from '@/app/components/SearchInput';
import { useShallow } from 'zustand/react/shallow';
import Select from '@/app/components/Select';
import config from '@/config';
import { t } from '@/stores/language';

const BricolageGrotesque = Bricolage_Grotesque({ subsets: ['latin'], display: 'swap', adjustFontFallback: false });

export default function Hero() {
  const { fetchEmojis, total, category, setCategory, sort, setSort, loading, search, setPage } = useSearchStore(useShallow(state => ({
    fetchEmojis: state.fetchEmojis,
    total: state.total,
    category: state.category,
    setCategory: state.setCategory,
    sort: state.sort,
    setSort: state.setSort,
    loading: state.loading,
    search: state.search,
    setPage: state.setPage
  })));

  useEffect(() => {
    fetchEmojis('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sequenceTransition = {
    duration: 0.25,
    type: 'spring',
    stiffness: 260,
    damping: 20
  };

  return (
    <div className='relative z-0 flex flex-col items-center px-4 pt-56 sm:px-0'>
      <Square column='10' row='10' transparentEffectDirection='bottomToTop' blockColor='rgba(var(--bg-secondary))' />

      <div className='absolute top-[-15%] h-[300px] w-full max-w-[800px] rounded-[5rem] bg-[#ffffff10] blur-[15rem]' />

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
          {t('emojisPage.title')}
        </motion.h1>

        <motion.span className='mt-8 max-w-[700px] text-center text-tertiary sm:text-lg' initial={{ opacity: 0, y: -25 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sequenceTransition, delay: 0.2 }}>
          {t('emojisPage.subtitle', { br: <br />, count: total })}
        </motion.span>

        <div className='mt-8 flex w-full flex-col items-center justify-center gap-2 sm:flex-row'>
          <SearchInput
            placeholder={t('emojisPage.searchInputPlaceholder')}
            loading={loading}
            search={search}
            fetchData={fetchEmojis}
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
              placeholder={t('emojisPage.categorySelectPlaceholder')}
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
              value={category}
              onChange={setCategory}
              disabled={loading}
            />

            <Select
              placeholder={t('emojisPage.sortSelect.placeholder')}
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
        <Emojis />
      </motion.div>
    </div>
  );
}