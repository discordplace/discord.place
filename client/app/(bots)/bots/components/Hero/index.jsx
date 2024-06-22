'use client';

import { motion } from 'framer-motion';
import Square from '@/app/components/Background/Square';
import cn from '@/lib/cn';
import { Bricolage_Grotesque } from 'next/font/google';
import SearchResults from '@/app/(bots)/bots/components/Hero/SearchResults';
import SearchInput from '@/app/components/SearchInput';
import useSearchStore from '@/stores/bots/search';
import { useShallow } from 'zustand/react/shallow';
import { BiSolidCategory } from 'react-icons/bi';
import { useState } from 'react';
import config from '@/config';
import CategoriesDrawer from '@/app/components/Drawer/CategoriesDrawer';
import SortingDrawer from '@/app/(bots)/bots/components/Hero/Drawer/Sorting';
import { FaCompass } from 'react-icons/fa';
import { TbSquareRoundedChevronUp } from 'react-icons/tb';
import { HiSortAscending, HiSortDescending } from 'react-icons/hi';
import { TiStar } from 'react-icons/ti';
import { MdUpdate } from 'react-icons/md';

const BricolageGrotesque = Bricolage_Grotesque({ subsets: ['latin'] });

export default function Hero() {
  const [categoryDrawerOpenState, setCategoryDrawerOpenState] = useState(false);
  const [sortingDrawerOpenState, setSortingDrawerOpenState] = useState(false);

  const { category, setCategory, sort, setSort, loading, search, fetchBots, setPage } = useSearchStore(useShallow(state => ({
    category: state.category,
    setCategory: state.setCategory,
    sort: state.sort,
    setSort: state.setSort,
    loading: state.loading,
    search: state.search,
    fetchBots: state.fetchBots,
    setPage: state.setPage
  })));

  const sequenceTransition = {
    duration: 0.25,
    type: 'spring',
    stiffness: 260,
    damping: 20
  };

  return (
    <div className="z-0 relative flex flex-col pt-[14rem] items-center px-4 sm:px-0">
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
          Discover the bots
        </motion.h1>
        
        <motion.span className="sm:text-lg max-w-[700px] text-center mt-8 text-neutral-400" initial={{ opacity: 0, y: -25 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sequenceTransition, delay: 0.2 }}>
          Explore most popular bots and find the perfect one for your Discord server!<br/>Make your server more fun and interactive with the best bots available.
        </motion.span>

        <SearchInput
          placeholder='Search for a bot by id, description, or category...'
          loading={loading}
          search={search}
          fetchData={fetchBots}
          setPage={setPage}
          animationDelay={0.3}
        />
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

        <CategoriesDrawer 
          state={category}
          setState={setCategory}
          openState={categoryDrawerOpenState}
          setOpenState={setCategoryDrawerOpenState}
          categories={config.botCategories}
        />

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

            {sort === 'LatestVoted' && (
              <>
                <MdUpdate />
                Latest Voted
              </>
            )}

            {sort === 'Servers' && (
              <>
                <FaCompass />
                Servers
              </>
            )}

            {sort === 'Most Reviewed' && (
              <>
                <TiStar />
                Most Reviewed
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
          </div>
        </button>

        <SortingDrawer
          state={sort}
          setState={setSort}
          openState={sortingDrawerOpenState}
          setOpenState={setSortingDrawerOpenState}
        />
      </motion.div>

      <motion.div 
        className='my-16 max-w-[1200px] w-full'
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...sequenceTransition, delay: 0.5 }}
      >
        <SearchResults />
      </motion.div>
    </div>
  );
}