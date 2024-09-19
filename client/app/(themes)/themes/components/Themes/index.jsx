'use client';

import useSearchStore from '@/stores/themes/search';
import { useShallow } from 'zustand/react/shallow';
import Pagination from '@/app/components/Pagination';
import { AnimatePresence, motion } from 'framer-motion';
import ErrorState from '@/app/components/ErrorState';
import { BsEmojiAngry } from 'react-icons/bs';
import ThemeCard from '@/app/(themes)/themes/components/ThemeCard';
import { t } from '@/stores/language';
import ReportableArea from '@/app/components/ReportableArea';
import useAuthStore from '@/stores/auth';

export default function Themes() {
  const user = useAuthStore(state => state.user);

  const { page, setPage, search, loading, themes, fetchThemes, sort, category, totalThemes, limit } = useSearchStore(useShallow(state => ({
    page: state.page,
    setPage: state.setPage,
    search: state.search,
    loading: state.loading,
    themes: state.themes,
    fetchThemes: state.fetchThemes,
    maxReached: state.maxReached,
    sort: state.sort,
    category: state.category,
    totalThemes: state.totalThemes,
    limit: state.limit
  })));
  
  const stateVariants = {
    hidden: { 
      opacity: 0
    },
    visible: { 
      opacity: 1
    },
    exit: { 
      opacity: 0
    }
  };
  
  const showPagination = !loading && totalThemes > limit;

  return (
    !loading && themes.length <= 0 ? (
      <AnimatePresence>
        <motion.div 
          className='flex flex-col px-4 sm:px-0 gap-y-2'
          variants={stateVariants}
          initial='hidden'
          animate='visible'
          exit='hidden'
        >
          <ErrorState 
            title={
              <div className='flex items-center gap-x-2'>
                <BsEmojiAngry />
                {t('themesPage.emptyErrorState.title')}
              </div>
            }
            message={t('themesPage.emptyErrorState.message')}
          />

          <button
            className='text-tertiary hover:underline hover:text-primary'
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
          className='max-w-[1000px] w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:px-0 px-2 sm:px-4'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {loading ? (
            new Array(limit).fill(0).map((_, index) => (
              <div key={index} className="h-[200px] rounded-2xl bg-secondary animate-pulse w-full" />
            ))
          ) : (
            themes.map(theme => (
              <ReportableArea
                key={theme.id}
                active={user?.id !== theme.publisher.id}
                type='theme'
                metadata={{
                  id: theme.id,
                  colors: theme.colors,
                  publisher: theme.publisher
                }}
                identifier={`theme-${theme.id}`}
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

        <div className='flex items-center justify-center w-full' key='pagination'> 
          {showPagination && (
            <Pagination 
              page={page} 
              setPage={newPage => {
                fetchThemes(search, newPage, limit, category, sort);
              }} 
              loading={loading} 
              total={totalThemes} 
              limit={limit} 
            />
          )}
        </div>
      </>
    )
  );
}