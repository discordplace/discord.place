'use client';

import Square from '@/app/components/Background/Square';
import cn from '@/lib/cn';
import { motion } from 'framer-motion';
import { Bricolage_Grotesque } from 'next/font/google';
import ServerCard from '@/app/(servers)/servers/components/ServerCard';
import SearchInput from '@/app/(servers)/servers/components/Hero/SearchInput';
import { useEffect } from 'react';
import useSearchStore from '@/stores/servers/search';
import { useShallow } from 'zustand/react/shallow';
import { AnimatePresence } from 'framer-motion';
import ErrorState from '@/app/components/ErrorState';
import { TbLoader, TbSquareRoundedChevronUp } from 'react-icons/tb';
import { BsEmojiAngry } from 'react-icons/bs';
import { BiSolidCategory } from 'react-icons/bi';
import { FaUsers } from 'react-icons/fa';
import CategoriesDrawer from '@/app/components/Drawer/CategoriesDrawer';
import { useState } from 'react';
import SortingDrawer from '../Drawer/Sorting';
import { MdKeyboardVoice } from 'react-icons/md';
import { HiSortAscending, HiSortDescending } from 'react-icons/hi';
import { TiStar } from 'react-icons/ti';
import Pagination from '@/app/components/Pagination';
import config from '@/config';

const BricolageGrotesque = Bricolage_Grotesque({ subsets: ['latin'] });

export default function Hero() {
  const { category, setCategory, sort, setSort, search, loading, servers, fetchServers, page, totalServers, limit } = useSearchStore(useShallow(state => ({
    category: state.category,
    setCategory: state.setCategory,
    sort: state.sort,
    setSort: state.setSort,
    search: state.search,
    loading: state.loading,
    servers: state.servers,
    fetchServers: state.fetchServers,
    page: state.page,
    totalServers: state.totalServers,
    limit: state.limit
  })));

  const [categoryDrawerOpenState, setCategoryDrawerOpenState] = useState(false);
  const [sortingDrawerOpenState, setSortingDrawerOpenState] = useState(false);

  useEffect(() => {
    fetchServers('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sequenceTransition = {
    duration: 0.25,
    type: 'spring',
    stiffness: 260,
    damping: 20
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
    }
  };

  const showPagination = !loading && totalServers > limit;

  return (
    <div className="z-0 relative flex flex-col pt-[14rem] items-center px-4 lg:px-0">
      <Square column='10' row='10' transparentEffectDirection='bottomToTop' blockColor='rgba(var(--bg-secondary))' />

      <div className='absolute top-[-15%] max-w-[800px] w-full h-[300px] rounded-[5rem] bg-[#ffffff10] blur-[15rem]' />

      <div className='max-w-[700px] flex flex-col w-full'>
        <motion.h1 
          className={cn(
            'text-5xl font-medium max-w-[700px] text-center text-primary',
            BricolageGrotesque.className
          )}
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...sequenceTransition, delay: 0.1 }}
        >
          Discover the servers
        </motion.h1>
        <motion.span className="sm:text-lg max-w-[700px] text-center mt-8 text-neutral-400" initial={{ opacity: 0, y: -25 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sequenceTransition, delay: 0.2 }}>
          Explore the best servers on Discord and find the perfect community for you. Don{'\''}t forget to vote for your favorite servers!
        </motion.span>

        <SearchInput />
      </div>

      <motion.div
        className='flex mobile:flex-row flex-col gap-4 mt-6 max-w-[800px] w-full'
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...sequenceTransition, delay: 0.4 }}
      >
        <button
          className={cn(
            'text-secondary hover:text-primary flex flex-col items-center justify-center font-semibold text-lg mobile:w-[50%] h-[70px] rounded-xl bg-secondary hover:bg-tertiary',
            loading && 'opacity-60 pointer-events-none transition-opacity'
          )}
          onClick={() => setCategoryDrawerOpenState(true)}
        >
          <div className='text-sm font-medium text-tertiary'>
            Category
          </div>
          
          <div className='flex items-center gap-x-2'>
            <BiSolidCategory />
            {category !== 'All' ? category : 'All'}
          </div>
        </button>

        <CategoriesDrawer state={category} setState={setCategory} openState={categoryDrawerOpenState} setOpenState={setCategoryDrawerOpenState} categories={config.serverCategories} />

        <button
          className={cn(
            'text-secondary hover:text-primary flex flex-col items-center justify-center font-semibold text-lg mobile:w-[50%] h-[70px] rounded-xl bg-secondary hover:bg-tertiary',
            loading && 'opacity-60 pointer-events-none transition-opacity'
          )}
          onClick={() => setSortingDrawerOpenState(true)}
        >
          <div className='text-sm font-medium text-tertiary'>
            Sorting
          </div>
          
          <div className='flex items-center gap-x-2'>
            {sort === 'Votes' && (
              <>
                <TbSquareRoundedChevronUp />
                Votes
              </>
            )}

            {sort === 'Voice' && (
              <>
                <MdKeyboardVoice />
                Voice
              </>
            )}

            {sort === 'Members' && (
              <>
                <FaUsers />
                Members
              </>
            )}

            {sort === 'Newest' && (
              <>
                <HiSortAscending />
                Newest
              </>
            )}

            {sort === 'Oldest' && (
              <>
                <HiSortDescending />
                Oldest
              </>
            )}

            {sort === 'Boosts' && (
              <>
                <TiStar />
                Boosts
              </>
            )}
          </div>
        </button>

        <SortingDrawer state={sort} setState={setSort} openState={sortingDrawerOpenState} setOpenState={setSortingDrawerOpenState} />
      </motion.div>

      <div className='max-w-[800px] w-full flex flex-col my-8 gap-y-2'>
        <div className={cn(
          'w-full',
          (loading || servers.length <= 0) ? 'flex items-center justify-center' : 'grid grid-cols-1 sm:grid-cols-2 gap-4'
        )}>
          <AnimatePresence>
            {loading ? (
              <motion.div variants={stateVariants} initial='hidden' animate='visible' exit='hidden'>
                <ErrorState title={<div className='flex items-center gap-x-1.5'>
                  <TbLoader className='animate-spin' />
                </div>} message='' />
              </motion.div>
            ) : (
              <>
                {servers.length <= 0 ? (
                  <motion.div className='flex flex-col gap-y-2' variants={stateVariants} initial='hidden' animate='visible' exit='hidden'>
                    <ErrorState title={<div className='flex items-center gap-x-2'>
                      <BsEmojiAngry />
                      It{'\''}s quiet in here...
                    </div>} message={'There are no servers to display. Maybe that\'s a sign to create one?'} />

                    <button className='text-tertiary hover:underline hover:text-primary' onClick={() => {
                      fetchServers('', 1, limit, 'All', 'Votes');
                    }}>
                      Reset Search
                    </button>
                  </motion.div>
                ) : (
                  servers.map((server, index) => (
                    <motion.div
                      key={server.id}
                      initial={{ opacity: 0, y: -25 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...sequenceTransition, delay: (index * 0.1) }}
                      className='flex animate-scroll-based-appear'
                    >
                      <ServerCard server={server} index={page > 1 ? null : index} />
                    </motion.div>
                  ))
                )}
              </>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {showPagination && (
            <div className='flex justify-center w-full'>
              <Pagination 
                page={page} 
                setPage={newPage => {
                  fetchServers(search, newPage);
                }} 
                loading={loading} 
                total={totalServers} 
                limit={limit} 
              />
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}