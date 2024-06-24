'use client';

import useSearchStore from '@/stores/emojis/search';
import { useShallow } from 'zustand/react/shallow';
import Pagination from '@/app/components/Pagination';
import { AnimatePresence, motion } from 'framer-motion';
import ErrorState from '@/app/components/ErrorState';
import { BsEmojiAngry } from 'react-icons/bs';
import EmojiCard from '@/app/(emojis)/emojis/components/Hero/EmojiCard';
import EmojiPackageCard from '@/app/(emojis)/emojis/components/Hero/EmojiCard/Package';

export default function Emojis() {
  const { page, setPage, search, setSearch, loading, emojis, fetchEmojis, setSort, setCategory, totalEmojis, limit } = useSearchStore(useShallow(state => ({
    page: state.page,
    setPage: state.setPage,
    search: state.search,
    setSearch: state.setSearch,
    loading: state.loading,
    emojis: state.emojis,
    fetchEmojis: state.fetchEmojis,
    maxReached: state.maxReached,
    setSort: state.setSort,
    setCategory: state.setCategory,
    totalEmojis: state.totalEmojis,
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
  
  const showPagination = !loading && totalEmojis > limit;

  return (
    !loading && emojis.length <= 0 ? (
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
            message={'There are no emojis to display. Maybe that\'s a sign to create one?'}
          />

          <button className='text-tertiary hover:underline hover:text-primary' onClick={() => {
            setSearch('');
            setSort('Newest');
            setCategory('All');
            fetchEmojis('');
            setPage(1);
          }}>
            Reset Search
          </button>
        </motion.div>
      </AnimatePresence>
    ) : (
      <>
        <motion.div 
          className='grid grid-cols-1 gap-4 sm:px-4 xl:px-0 sm:grid-cols-2 xl:grid-cols-3'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {loading ? (
            new Array(9).fill(0).map((_, index) => (
              <div key={index} className="h-[164px] rounded-2xl bg-secondary animate-pulse w-[226px]" />
            ))
          ) : (
            emojis.map(emoji => (
              <div key={emoji.id}>
                {(emoji.emoji_ids || []).length > 0 ? (
                  <EmojiPackageCard
                    id={emoji.id}
                    name={emoji.name}
                    categories={emoji.categories}
                    downloads={emoji.downloads}
                    emoji_ids={emoji.emoji_ids}
                  />
                ) : (
                  <EmojiCard 
                    id={emoji.id}
                    name={emoji.name}
                    animated={emoji.animated}
                    categories={emoji.categories}
                    downloads={emoji.downloads}
                  />
                )}
              </div>
            ))
          )}
        </motion.div>

        <div className='flex items-center justify-center w-full' key='pagination'> 
          {showPagination && (
            <Pagination 
              page={page} 
              setPage={newPage => {
                setPage(newPage);
                fetchEmojis(search);
              }} 
              loading={loading} 
              total={totalEmojis} 
              limit={limit} 
            />
          )}
        </div>
      </>
    )
  );
}