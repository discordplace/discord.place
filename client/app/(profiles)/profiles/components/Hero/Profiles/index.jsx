'use client';

import { BsEmojiAngry } from '@/icons';
import ProfileCard from '@/app/(profiles)/profiles/components/Hero/Profiles/Card';
import useSearchStore from '@/stores/profiles/search';
import ErrorState from '@/app/components/ErrorState';import { useShallow } from 'zustand/react/shallow';
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
      className='my-16 flex flex-col'
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
            className='grid grid-cols-1 gap-8 self-center sm:grid-cols-2 lg:grid-cols-3'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {loading ? (
              new Array(limit).fill(0).map((_, index) => (
                <div key={index} className='h-[461px] w-[300px] animate-pulse rounded-3xl bg-secondary' />
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