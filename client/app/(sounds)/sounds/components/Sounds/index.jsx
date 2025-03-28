'use client';

import { BsEmojiAngry } from '@/icons';
import useSearchStore from '@/stores/sounds/search';
import { useShallow } from 'zustand/react/shallow';
import Pagination from '@/app/components/Pagination';
import { AnimatePresence, motion } from 'framer-motion';
import ErrorState from '@/app/components/ErrorState';import SoundPreview from '@/app/(sounds)/sounds/components/SoundPreview';
import { t } from '@/stores/language';
import ReportableArea from '@/app/components/ReportableArea';
import useAuthStore from '@/stores/auth';

export default function Sounds() {
  const user = useAuthStore(state => state.user);

  const { page, setPage, search, loading, sounds, fetchSounds, sort, category, totalSounds, limit } = useSearchStore(useShallow(state => ({
    page: state.page,
    setPage: state.setPage,
    search: state.search,
    loading: state.loading,
    sounds: state.sounds,
    fetchSounds: state.fetchSounds,
    maxReached: state.maxReached,
    sort: state.sort,
    category: state.category,
    totalSounds: state.totalSounds,
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

  const showPagination = !loading && totalSounds > limit;

  return (
    !loading && sounds.length <= 0 ? (
      <AnimatePresence>
        <motion.div
          className='flex flex-col gap-y-2 px-4 sm:px-0'
          variants={stateVariants}
          initial='hidden'
          animate='visible'
          exit='hidden'
        >
          <ErrorState
            title={
              <div className='flex items-center gap-x-2'>
                <BsEmojiAngry />
                {t('soundsPage.emptyErrorState.title')}
              </div>
            }
            message={t('soundsPage.emptyErrorState.message')}
          />

          <button className='text-tertiary hover:text-primary hover:underline' onClick={() => {
            fetchSounds('', 1, limit, 'All', 'Downloads');
            setPage(1);
          }}>
            {t('buttons.resetSearch')}
          </button>
        </motion.div>
      </AnimatePresence>
    ) : (
      <>
        <motion.div
          className='grid w-full max-w-[1000px] grid-cols-1 gap-8 px-2 sm:grid-cols-2 sm:px-4 lg:grid-cols-3 lg:px-0'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {loading ? (
            new Array(9).fill(0).map((_, index) => (
              <div key={index} className='h-[196px] w-full animate-pulse rounded-2xl bg-secondary' />
            ))
          ) : (
            sounds.map(sound => (
              <ReportableArea
                key={sound.id}
                active={user?.id !== sound.publisher.id}
                type='sound'
                metadata={{
                  id: sound.id,
                  name: sound.name,
                  publisher: sound.publisher
                }}
                identifier={`sound-${sound.id}`}
              >
                <SoundPreview sound={sound} />
              </ReportableArea>
            ))
          )}
        </motion.div>

        <div className='flex w-full items-center justify-center' key='pagination'>
          {showPagination && (
            <Pagination
              page={page}
              setPage={newPage => {
                fetchSounds(search, newPage, limit, category, sort);
              }}
              loading={loading}
              total={totalSounds}
              limit={limit}
            />
          )}
        </div>
      </>
    )
  );
}