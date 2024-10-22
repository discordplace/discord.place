'use client';

import ThemeCard from '@/app/(themes)/themes/components/ThemeCard';
import ErrorState from '@/app/components/ErrorState';
import Pagination from '@/app/components/Pagination';
import ReportableArea from '@/app/components/ReportableArea';
import useAuthStore from '@/stores/auth';
import { t } from '@/stores/language';
import useSearchStore from '@/stores/themes/search';
import { AnimatePresence, motion } from 'framer-motion';
import { BsEmojiAngry } from 'react-icons/bs';
import { useShallow } from 'zustand/react/shallow';

export default function Themes() {
  const user = useAuthStore(state => state.user);

  const { category, fetchThemes, limit, loading, page, search, setPage, sort, themes, totalThemes } = useSearchStore(useShallow(state => ({
    category: state.category,
    fetchThemes: state.fetchThemes,
    limit: state.limit,
    loading: state.loading,
    maxReached: state.maxReached,
    page: state.page,
    search: state.search,
    setPage: state.setPage,
    sort: state.sort,
    themes: state.themes,
    totalThemes: state.totalThemes
  })));

  const stateVariants = {
    exit: {
      opacity: 0
    },
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1
    }
  };

  const showPagination = !loading && totalThemes > limit;

  return (
    !loading && themes.length <= 0 ? (
      <AnimatePresence>
        <motion.div
          animate='visible'
          className='flex flex-col gap-y-2 px-4 sm:px-0'
          exit='hidden'
          initial='hidden'
          variants={stateVariants}
        >
          <ErrorState
            message={t('themesPage.emptyErrorState.message')}
            title={
              <div className='flex items-center gap-x-2'>
                <BsEmojiAngry />
                {t('themesPage.emptyErrorState.title')}
              </div>
            }
          />

          <button
            className='text-tertiary hover:text-primary hover:underline'
            onClick={() => {
              fetchThemes('', 1, limit, 'All', 'Newest');
              setPage(1);
            }}
          >
            {t('buttons.resetSearch')}
          </button>
        </motion.div>
      </AnimatePresence>
    ) : (
      <>
        <motion.div
          animate={{ opacity: 1 }}
          className='grid w-full max-w-[1000px] grid-cols-1 gap-8 px-2 sm:grid-cols-2 sm:px-4 lg:grid-cols-4 lg:px-0'
          initial={{ opacity: 0 }}
        >
          {loading ? (
            new Array(limit).fill(0).map((_, index) => (
              <div className='h-[200px] w-full animate-pulse rounded-2xl bg-secondary' key={index} />
            ))
          ) : (
            themes.map(theme => (
              <ReportableArea
                active={user?.id !== theme.publisher.id}
                identifier={`theme-${theme.id}`}
                key={theme.id}
                metadata={{
                  colors: theme.colors,
                  id: theme.id,
                  publisher: theme.publisher
                }}
                type='theme'
              >
                <div className='flex'>
                  <ThemeCard
                    id={theme.id}
                    primaryColor={theme.colors.primary}
                    secondaryColor={theme.colors.secondary}
                  />
                </div>
              </ReportableArea>
            ))
          )}
        </motion.div>

        <div className='flex w-full items-center justify-center' key='pagination'>
          {showPagination && (
            <Pagination
              limit={limit}
              loading={loading}
              page={page}
              setPage={newPage => {
                fetchThemes(search, newPage, limit, category, sort);
              }}
              total={totalThemes}
            />
          )}
        </div>
      </>
    )
  );
}