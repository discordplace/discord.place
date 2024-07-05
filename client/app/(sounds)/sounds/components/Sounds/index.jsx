'use client';

import useSearchStore from '@/stores/sounds/search';
import { useShallow } from 'zustand/react/shallow';
import Pagination from '@/app/components/Pagination';
import { AnimatePresence, motion } from 'framer-motion';
import ErrorState from '@/app/components/ErrorState';
import { BsEmojiAngry } from 'react-icons/bs';
import SoundPreview from '@/app/(sounds)/sounds/components/SoundPreview';

export default function Sounds() {
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
                It{'\''}s quiet in here...
              </div>
            }
            message={'There are no sounds to display. Maybe that\'s a sign to create one?'}
          />

          <button className='text-tertiary hover:underline hover:text-primary' onClick={() => {
            fetchSounds('', 1, limit, 'All', 'Downloads');
            setPage(1);
          }}>
            Reset Search
          </button>
        </motion.div>
      </AnimatePresence>
    ) : (
      <>
        <motion.div 
          className='max-w-[1000px] w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:px-0 px-2 sm:px-4'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {loading ? (
            new Array(9).fill(0).map((_, index) => (
              <div key={index} className="h-[196px] rounded-2xl bg-secondary animate-pulse w-full" />
            ))
          ) : (
            sounds.map(sound => (
              <SoundPreview
                key={sound.id}
                sound={sound}
              />
            ))
          )}
        </motion.div>

        <div className='flex items-center justify-center w-full' key='pagination'> 
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