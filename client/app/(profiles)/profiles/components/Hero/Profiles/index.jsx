'use client';

import ProfileCard from '@/app/(profiles)/profiles/components/Hero/Profiles/Card';
import useSearchStore from '@/stores/profiles/search';
import { nanoid } from 'nanoid';
import ErrorState from '@/app/components/ErrorState';
import { TbLoader } from 'react-icons/tb';
import { BsEmojiAngry } from 'react-icons/bs';
import { useShallow } from 'zustand/react/shallow';
import { AnimatePresence, motion } from 'framer-motion';
import Pagination from '@/app/components/Pagination';

export default function Profiles() {

  const { search, setSearch, profiles, fetchProfiles, loading, page, setPage, totalProfiles, limit } = useSearchStore(useShallow(state => ({ 
    search: state.search,
    setSearch: state.setSearch,
    profiles: state.profiles,
    fetchProfiles: state.fetchProfiles,
    loading: state.loading,
    page: state.page,
    setPage: state.setPage,
    totalProfiles: state.totalProfiles,
    limit: state.limit
  })));

  const showPagination = !loading && profiles.length > limit;
  
  const profileCardTransition = {
    type: 'spring',
    stiffness: 260,
    damping: 20
  };
  const profileCardVariants = {
    hidden: { 
      opacity: 0,
      y: -50,
      transition: profileCardTransition
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: profileCardTransition
    },
    exit: { 
      opacity: 0,
      y: -50,
      transition: profileCardTransition
    }
  };
  
  const stateVariants = {
    hidden: { 
      opacity: 0
    },
    visible: { 
      opacity: 1
    },
    exit: { 
      opacity: 0
    },
  };
  
  return (
    <>
      <section className='flex flex-col items-center w-full my-12'>
        <AnimatePresence>
          {loading ? (
            <motion.div variants={stateVariants} initial='hidden' animate='visible' exit='hidden'>
              <ErrorState title={<div className='flex items-center gap-x-1.5'>
                <TbLoader className='animate-spin' />
              </div>} message='' />
            </motion.div>
          ) : (
            <>
              {profiles.length <= 0 ? (
                <motion.div className='flex flex-col gap-y-2'  variants={stateVariants} initial='hidden' animate='visible' exit='hidden'>
                  <ErrorState title={<div className='flex items-center gap-x-2'>
                    <BsEmojiAngry />
                    It{'\''}s quiet in here...
                  </div>} message={'There are no profiles to display. Maybe that\'s a sign to create one?'} />

                  {search.length > 0 && (
                    <button className='text-tertiary hover:underline hover:text-primary' onClick={() => {
                      setSearch('');
                      fetchProfiles('');
                      setPage(1);
                    }}>
                      Reset Search
                    </button>
                  )}
                </motion.div>
              ) : (
                <div className='grid self-center grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3'>
                  {profiles.map(profile => (
                    <motion.div 
                      key={nanoid()} 
                      variants={profileCardVariants}
                      initial='hidden'
                      animate='visible'
                      exit='hidden'
                    >
                      <ProfileCard 
                        avatar_url={profile.avatar_url}
                        username={profile.username}
                        occupation={profile.occupation || null}
                        gender={profile.gender || null}
                        location={profile.location || null}
                        birthday={profile.birthday || null}
                        bio={profile.bio}
                        views={profile.views}
                        likes={profile.likes}
                        verified={profile.verified}
                        preferredHost={profile.preferredHost}
                        slug={profile.slug}
                        badges={profile.badges}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}

          {showPagination && (
            <Pagination 
              page={page} 
              setPage={newPage => {
                setPage(newPage);
                fetchProfiles(search);
              }} 
              loading={loading} 
              total={totalProfiles} 
              limit={limit} 
            />          
          )}
        </AnimatePresence>
      </section>
    </>
  );
}