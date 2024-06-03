import useSearchStore from '@/stores/bots/search';
import { useShallow } from 'zustand/react/shallow';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import Card from '@/app/(bots)/bots/components/Hero/PopularBots/Card';
import ErrorState from '@/app/components/ErrorState';
import { BsEmojiAngry } from 'react-icons/bs';
import { toast } from 'sonner';
import Pagination from '@/app/components/Pagination';
import { AnimatePresence } from 'framer-motion';

export default function PopularBots() {
  const { loading, bots, fetchBots, total: totalBots, limit, page, setPage, search } = useSearchStore(useShallow(state => ({
    loading: state.loading,
    bots: state.bots,
    fetchBots: state.fetchBots,
    total: state.total,
    limit: state.limit,
    page: state.page,
    setPage: state.setPage,
    search: state.search
  })));

  useEffect(() => {
    fetchBots()
      .catch(toast.error);
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showPagination = !loading && totalBots > limit;

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

  return (
    !loading && bots.length <= 0 ? (
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
            message={'There are no bots to display. Maybe that\'s a sign to create one?'}
          />

          <button className='text-tertiary hover:underline hover:text-primary' onClick={() => {
            fetchBots('', 1, limit, 'All', 'Votes');
          }}>
            Reset Search
          </button>
        </motion.div>
      </AnimatePresence>
    ) : (
      <>
        <motion.div 
          className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {loading ? (
            new Array(12).fill(0).map((_, index) => (
              <div key={index} className='w-full h-[240px] bg-secondary rounded-3xl animate-pulse' />
            ))
          ) : (
            bots.map(bot => (
              <Card key={bot.id} data={bot} />
            ))
          )}
        </motion.div>

        <div className='flex items-center justify-center w-full' key='pagination'> 
          {showPagination && (
            <Pagination 
              page={page} 
              setPage={newPage => {
                setPage(newPage);
                fetchBots(search);
              }} 
              loading={loading} 
              total={totalBots}
              limit={limit} 
            />
          )}
        </div>
      </>
    )
  );
}