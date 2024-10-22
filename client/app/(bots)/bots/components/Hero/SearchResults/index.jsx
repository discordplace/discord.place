'use client';

import useSearchStore from '@/stores/bots/search';
import { useShallow } from 'zustand/react/shallow';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import Card from '@/app/(bots)/bots/components/Hero/SearchResults/Card';
import ErrorState from '@/app/components/ErrorState';
import { BsEmojiAngry } from 'react-icons/bs';
import { toast } from 'sonner';
import Pagination from '@/app/components/Pagination';
import { AnimatePresence } from 'framer-motion';
import { t } from '@/stores/language';
import ReportableArea from '@/app/components/ReportableArea';
import useAuthStore from '@/stores/auth';

export default function SearchResults() {
  const user = useAuthStore(state => state.user);

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
                {t('botsPage.emptyErrorState.title')}
              </div>
            }
            message={t('botsPage.emptyErrorState.message')}
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
          className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {loading ? (
            new Array(limit).fill(0).map((_, index) => (
              <div key={index} className='h-[240px] w-full animate-pulse rounded-3xl bg-secondary' />
            ))
          ) : (
            <>
              {bots.map(bot => (
                <ReportableArea
                  key={bot.id}
                  active={user?.id !== bot.owner.id}
                  type='bot'
                  metadata={{
                    id: bot.id,
                    username: bot.username,
                    discriminator: bot.discriminator,
                    avatar: bot.avatar,
                    short_description: bot.short_description
                  }}
                  identifier={`bot-${bot.id}`}
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