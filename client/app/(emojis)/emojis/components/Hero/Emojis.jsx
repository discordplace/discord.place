'use client';

import useSearchStore from '@/stores/emojis/search';
import { useShallow } from 'zustand/react/shallow';
import Pagination from '@/app/components/Pagination';
import { AnimatePresence, motion } from 'framer-motion';
import { TbLoader } from 'react-icons/tb';
import ErrorState from '@/app/components/ErrorState';
import { BsEmojiAngry } from 'react-icons/bs';
import { nanoid } from 'nanoid';
import EmojiCard from '@/app/(emojis)/emojis/components/Hero/EmojiCard';
import EmojiPackageCard from '@/app/(emojis)/emojis/components/Hero/EmojiPackageCard';

export default function Emojis() {
  const { page, setPage, search, setSearch, loading, emojis, fetchEmojis, maxReached, setSort, setCategory, totalEmojis, limit } = useSearchStore(useShallow(state => ({
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

  const emojiCardTransition = {
    type: 'spring',
    stiffness: 260,
    damping: 20,
    delay: 0.35
  };
  const emojiCardVariants = {
    hidden: { 
      opacity: 0,
      y: -50,
      transition: emojiCardTransition
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: emojiCardTransition
    },
    exit: { 
      opacity: 0,
      y: -50,
      transition: emojiCardTransition
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
  
  const showPagination = !loading && emojis.length > 0;

  return (
    <div className="flex flex-col flex-1 w-full gap-y-8">
      <AnimatePresence>
        {loading ? (
          <motion.div variants={stateVariants} initial='hidden' animate='visible' exit='hidden'>
            <ErrorState title={<div className='flex items-center gap-x-1.5'>
              <TbLoader className='animate-spin' />
            </div>} message='' />
          </motion.div>
        ) : (
          <>
            {emojis.length <= 0 ? (
              <motion.div className='flex flex-col gap-y-2'  variants={stateVariants} initial='hidden' animate='visible' exit='hidden'>
                <ErrorState title={<div className='flex items-center gap-x-2'>
                  <BsEmojiAngry />
                    It{'\''}s quiet in here...
                </div>} message={'There are no emojis to display. Maybe that\'s a sign to publish one?'} />

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
            ) : (
              <div className='grid grid-cols-1 gap-8 mobile:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 emojis-cols-3:grid-cols-3'>
                {emojis.map(emoji => (
                  <motion.div 
                    key={nanoid()} 
                    variants={emojiCardVariants}
                    initial='hidden'
                    animate='visible'
                    exit='hidden'
                  >
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
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}

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
      </AnimatePresence>
    </div>
  );
}