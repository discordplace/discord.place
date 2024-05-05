import useSearchStore from '@/stores/bots/search';
import { useShallow } from 'zustand/react/shallow';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import Card from '@/app/(bots)/bots/components/Hero/PopularBots/Card';
import ErrorState from '@/app/components/ErrorState';
import { BsEmojiAngry } from 'react-icons/bs';
import { toast } from 'sonner';
import Pagination from '@/app/components/Pagination';

export default function PopularBots() {
  const { loading, bots, fetchBots, total: totalBots, limit, page, setPage, category } = useSearchStore(useShallow(state => ({
    loading: state.loading,
    bots: state.bots,
    fetchBots: state.fetchBots,
    total: state.total,
    limit: state.limit,
    page: state.page,
    setPage: state.setPage,
    category: state.category
  })));

  useEffect(() => {
    fetchBots()
      .catch(toast.error);
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showPagination = !loading && totalBots > limit;
  
  return (
    !loading && bots.length <= 0 ? (
      <ErrorState 
        title={
          <div className='flex items-center gap-x-2'>
            <BsEmojiAngry />
          It{'\''}s quiet in here...
          </div>
        } message='We couldn’t find any bots.' 
      />
    ) : (
      <>
        <motion.div 
          className='grid grid-cols-4 gap-4'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {loading ? (
            new Array(12).fill(0).map((_, index) => (
              <div key={index} className='w-full h-[400px] bg-secondary rounded-3xl animate-pulse' />
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
                fetchBots(category);
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