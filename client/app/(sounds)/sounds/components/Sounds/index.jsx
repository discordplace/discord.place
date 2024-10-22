'use client';

import SoundPreview from '@/app/(sounds)/sounds/components/SoundPreview';
import ErrorState from '@/app/components/ErrorState';
import Pagination from '@/app/components/Pagination';
import ReportableArea from '@/app/components/ReportableArea';
import useAuthStore from '@/stores/auth';
import { t } from '@/stores/language';
import useSearchStore from '@/stores/sounds/search';
import { AnimatePresence, motion } from 'framer-motion';
import { BsEmojiAngry } from 'react-icons/bs';
import { useShallow } from 'zustand/react/shallow';

export default function Sounds() {
  const user = useAuthStore(state => state.user);

  const { category, fetchSounds, limit, loading, page, search, setPage, sort, sounds, totalSounds } = useSearchStore(useShallow(state => ({
    category: state.category,
    fetchSounds: state.fetchSounds,
    limit: state.limit,
    loading: state.loading,
    maxReached: state.maxReached,
    page: state.page,
    search: state.search,
    setPage: state.setPage,
    sort: state.sort,
    sounds: state.sounds,
    totalSounds: state.totalSounds
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

  const showPagination = !loading && totalSounds > limit;

  return (
    !loading && sounds.length <= 0 ? (
      <AnimatePresence>
        <motion.div
          animate='visible'
          className='flex flex-col gap-y-2 px-4 sm:px-0'
          exit='hidden'
          initial='hidden'
          variants={stateVariants}
        >
          <ErrorState
            message={t('soundsPage.emptyErrorState.message')}
            title={
              <div className='flex items-center gap-x-2'>
                <BsEmojiAngry />
                {t('soundsPage.emptyErrorState.title')}
              </div>
            }
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
          animate={{ opacity: 1 }}
          className='grid w-full max-w-[1000px] grid-cols-1 gap-8 px-2 sm:grid-cols-2 sm:px-4 lg:grid-cols-3 lg:px-0'
          initial={{ opacity: 0 }}
        >
          {loading ? (
            new Array(9).fill(0).map((_, index) => (
              <div className='h-[196px] w-full animate-pulse rounded-2xl bg-secondary' key={index} />
            ))
          ) : (
            sounds.map(sound => (
              <ReportableArea
                active={user?.id !== sound.publisher.id}
                identifier={`sound-${sound.id}`}
                key={sound.id}
                metadata={{
                  id: sound.id,
                  name: sound.name,
                  publisher: sound.publisher
                }}
                type='sound'
              >
                <SoundPreview sound={sound} />
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
                fetchSounds(search, newPage, limit, category, sort);
              }}
              total={totalSounds}
            />
          )}
        </div>
      </>
    )
  );
}