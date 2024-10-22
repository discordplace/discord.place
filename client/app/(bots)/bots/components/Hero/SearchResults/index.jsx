'use client';

import Card from '@/app/(bots)/bots/components/Hero/SearchResults/Card';
import ErrorState from '@/app/components/ErrorState';
import Pagination from '@/app/components/Pagination';
import ReportableArea from '@/app/components/ReportableArea';
import useAuthStore from '@/stores/auth';
import useSearchStore from '@/stores/bots/search';
import { t } from '@/stores/language';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { BsEmojiAngry } from 'react-icons/bs';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

export default function SearchResults() {
  const user = useAuthStore(state => state.user);

  const { bots, fetchBots, limit, loading, page, search, setPage, total: totalBots } = useSearchStore(useShallow(state => ({
    bots: state.bots,
    fetchBots: state.fetchBots,
    limit: state.limit,
    loading: state.loading,
    page: state.page,
    search: state.search,
    setPage: state.setPage,
    total: state.total
  })));

  useEffect(() => {
    fetchBots()
      .catch(toast.error);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showPagination = !loading && totalBots > limit;

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

  return (
    !loading && bots.length <= 0 ? (
      <AnimatePresence>
        <motion.div
          animate='visible'
          className='flex flex-col gap-y-2'
          exit='hidden'
          initial='hidden'
          variants={stateVariants}
        >
          <ErrorState
            message={t('botsPage.emptyErrorState.message')}
            title={
              <div className='flex items-center gap-x-2'>
                <BsEmojiAngry />
                {t('botsPage.emptyErrorState.title')}
              </div>
            }
          />

          <button
            className='text-tertiary hover:text-primary hover:underline'
            onClick={() => {
              fetchBots('', 1, limit, 'All', 'Votes');
            }}
          >
            {t('buttons.resetSearch')}
          </button>
        </motion.div>
      </AnimatePresence>
    ) : (
      <>
        <motion.div
          animate={{ opacity: 1 }}
          className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'
          initial={{ opacity: 0 }}
        >
          {loading ? (
            new Array(limit).fill(0).map((_, index) => (
              <div className='h-[240px] w-full animate-pulse rounded-3xl bg-secondary' key={index} />
            ))
          ) : (
            <>
              {bots.map(bot => (
                <ReportableArea
                  active={user?.id !== bot.owner.id}
                  identifier={`bot-${bot.id}`}
                  key={bot.id}
                  metadata={{
                    avatar: bot.avatar,
                    discriminator: bot.discriminator,
                    id: bot.id,
                    short_description: bot.short_description,
                    username: bot.username
                  }}
                  type='bot'
                >
                  <Card data={bot} />
                </ReportableArea>
              ))}
            </>
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
                fetchBots(search);
              }}
              total={totalBots}
            />
          )}
        </div>
      </>
    )
  );
}