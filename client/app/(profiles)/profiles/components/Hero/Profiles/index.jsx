'use client';

import ProfileCard from '@/app/(profiles)/profiles/components/Hero/Profiles/Card';
import useSearchStore from '@/stores/profiles/search';
import ErrorState from '@/app/components/ErrorState';
import { BsEmojiAngry } from 'react-icons/bs';
import { useShallow } from 'zustand/react/shallow';
import { AnimatePresence, motion } from 'framer-motion';
import Pagination from '@/app/components/Pagination';

export default function Profiles() {
  const { search, setSearch, profiles, fetchProfiles, loading, page, setPage, limit, count } = useSearchStore(useShallow(state => ({ 
    search: state.search,
    setSearch: state.setSearch,
    profiles: state.profiles,
    fetchProfiles: state.fetchProfiles,
    loading: state.loading,
    page: state.page,
    setPage: state.setPage,
    limit: state.limit,
    count: state.count
  })));

  const showPagination = !loading && count > limit;
  
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

  const sequenceTransition = {
    duration: 0.25,
    type: 'spring',
    stiffness: 260,
    damping: 20
  };

  return (
    <motion.div 
      className='flex flex-col my-16'
      initial={{ opacity: 0, y: -25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...sequenceTransition, delay: 0.5 }}
    >
      {!loading && profiles.length <= 0 ? (
        <AnimatePresence>
          <motion.div 
            className='flex flex-col gap-y-2'
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
              message={'There are no profiles to display. Maybe that\'s a sign to create one?'}
            />

            <button className='text-tertiary hover:underline hover:text-primary' onClick={() => {
              setSearch('');
              fetchProfiles('');
              setPage(1);
            }}>
              Reset Search
            </button>
          </motion.div>
        </AnimatePresence>
      ) : (
        <>
          <motion.div 
            className='grid self-center grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {loading ? (
              new Array(limit).fill(0).map((_, index) => (
                <div key={index} className='w-[300px] h-[461px] bg-secondary rounded-3xl animate-pulse' />
              ))
            ) : (
              profiles.map(profile => (
                <ProfileCard
                  key={profile.slug}
                  {...profile}
                />
              ))
            )}
          </motion.div>

          <div className='flex items-center justify-center w-full' key='pagination'> 
            {showPagination && (
              <Pagination 
                page={page} 
                setPage={newPage => {
                  setPage(newPage);
                  fetchProfiles(search);
                }} 
                loading={loading} 
                total={count} 
                limit={limit} 
              />      
            )}
          </div>
        </>
      )}
    </motion.div>
  );
}