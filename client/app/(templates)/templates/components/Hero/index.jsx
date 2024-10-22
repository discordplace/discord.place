'use client';

import { motion } from 'framer-motion';
import Square from '@/app/components/Background/Square';
import cn from '@/lib/cn';
import { Bricolage_Grotesque } from 'next/font/google';
import SearchResults from '@/app/(templates)/templates/components/Hero/SearchResults';
import SearchInput from '@/app/components/SearchInput';
import useSearchStore from '@/stores/templates/search';
import { useShallow } from 'zustand/react/shallow';
import config from '@/config';
import Select from '@/app/components/Select';
import { t } from '@/stores/language';

const BricolageGrotesque = Bricolage_Grotesque({ subsets: ['latin'], display: 'swap', adjustFontFallback: false });

export default function Hero() {
  const { category, setCategory, sort, setSort, loading, search, setPage, fetchTemplates } = useSearchStore(useShallow(state => ({
    category: state.category,
    setCategory: state.setCategory,
    sort: state.sort,
    setSort: state.setSort,
    loading: state.loading,
    search: state.search,
    setPage: state.setPage,
    fetchTemplates: state.fetchTemplates
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
          {t('templatesPage.title')}
        </motion.h1>

        <motion.span className="mt-8 max-w-[700px] text-center text-tertiary sm:text-lg" initial={{ opacity: 0, y: -25 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sequenceTransition, delay: 0.2 }}>
          {t('templatesPage.subtitle', { br: <br /> })}
        </motion.span>

        <div className='mt-8 flex w-full flex-col items-center justify-center gap-2 sm:flex-row'>
          <SearchInput
            placeholder={t('templatesPage.searchInputPlaceholder')}
            loading={loading}
            search={search}
            fetchData={fetchTemplates}
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
              placeholder={t('templatesPage.categorySelectPlaceholder')}
              options={
                config.templateCategories.map(category => ({
                  label: <div className='flex items-center gap-x-2'>
                    <span className='text-tertiary'>
                      {config.templateCategoriesIcons[category]}
                    </span>

                    {t(`categories.${category}`)}
                  </div>,
                  value: category
                }))
              }
              value={category}
              onChange={setCategory}
            />

            <Select
              placeholder={t('templatesPage.sortSelect.placeholder')}
              options={[
                ...[
                  {
                    label: t('templatesPage.sortSelect.items.popular'),
                    value: 'Popular'
                  },
                  {
                    label: t('templatesPage.sortSelect.items.newest'),
                    value: 'Newest'
                  },
                  {
                    label: t('templatesPage.sortSelect.items.oldest'),
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