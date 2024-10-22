'use client';

import ProfileCard from '@/app/(profiles)/profiles/components/Hero/Profiles/Card';
import ErrorState from '@/app/components/ErrorState';
import Pagination from '@/app/components/Pagination';
import useSearchStore from '@/stores/profiles/search';
import { AnimatePresence, motion } from 'framer-motion';
import { BsEmojiAngry } from 'react-icons/bs';
import { useShallow } from 'zustand/react/shallow';

export default function Profiles() {
  const { count, fetchProfiles, limit, loading, page, profiles, search, setPage, setSearch } = useSearchStore(useShallow(state => ({
    count: state.count,
    fetchProfiles: state.fetchProfiles,
    limit: state.limit,
    loading: state.loading,
    page: state.page,
    profiles: state.profiles,
    search: state.search,
    setPage: state.setPage,
    setSearch: state.setSearch
  })));

  const showPagination = !loading && count > limit;

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

  const sequenceTransition = {
    damping: 20,
    duration: 0.25,
    stiffness: 260,
    type: 'spring'
  };

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className='my-16 flex flex-col'
      initial={{ opacity: 0, y: -25 }}
      transition={{ ...sequenceTransition, delay: 0.5 }}
    >
      {!loading && profiles.length <= 0 ? (
        <AnimatePresence>
          <motion.div
            animate='visible'
            className='flex flex-col gap-y-2'
            exit='hidden'
            initial='hidden'
            variants={stateVariants}
          >
            <ErrorState
              message={'There are no profiles to display. Maybe that\'s a sign to create one?'}
              title={
                <div className='flex items-center gap-x-2'>
                  <BsEmojiAngry />
                  It{'\''}s quiet in here...
                </div>
              }
            />

            <button className='text-tertiary hover:text-primary hover:underline' onClick={() => {
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
            animate={{ opacity: 1 }}
            className='grid grid-cols-1 gap-8 self-center sm:grid-cols-2 lg:grid-cols-3'
            initial={{ opacity: 0 }}
          >
            {loading ? (
              new Array(limit).fill(0).map((_, index) => (
                <div className='h-[461px] w-[300px] animate-pulse rounded-3xl bg-secondary' key={index} />
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

          <div className='flex w-full items-center justify-center' key='pagination'>
            {showPagination && (
              <Pagination
                limit={limit}
                loading={loading}
                page={page}
                setPage={newPage => {
                  setPage(newPage);
                  fetchProfiles(search);
                }}
                total={count}
              />
            )}
          </div>
        </>
      )}
    </motion.div>
  );
}