'use client';

import EmojiCard from '@/app/(emojis)/emojis/components/Hero/EmojiCard';
import EmojiPackageCard from '@/app/(emojis)/emojis/components/Hero/EmojiCard/Package';
import ErrorState from '@/app/components/ErrorState';
import Pagination from '@/app/components/Pagination';
import ReportableArea from '@/app/components/ReportableArea';
import useAuthStore from '@/stores/auth';
import useSearchStore from '@/stores/emojis/search';
import { t } from '@/stores/language';
import { AnimatePresence, motion } from 'framer-motion';
import { BsEmojiAngry } from 'react-icons/bs';
import { useShallow } from 'zustand/react/shallow';

export default function Emojis() {
  const user = useAuthStore(state => state.user);

  const { emojis, fetchEmojis, limit, loading, page, search, setCategory, setPage, setSearch, setSort, totalEmojis } = useSearchStore(useShallow(state => ({
    emojis: state.emojis,
    fetchEmojis: state.fetchEmojis,
    limit: state.limit,
    loading: state.loading,
    maxReached: state.maxReached,
    page: state.page,
    search: state.search,
    setCategory: state.setCategory,
    setPage: state.setPage,
    setSearch: state.setSearch,
    setSort: state.setSort,
    totalEmojis: state.totalEmojis
  })));

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

  const showPagination = !loading && totalEmojis > limit;

  return (
    !loading && emojis.length <= 0 ? (
      <AnimatePresence>
        <motion.div
          animate='visible'
          className='flex flex-col gap-y-2 px-4 sm:px-0'
          exit='hidden'
          initial='hidden'
          variants={stateVariants}
        >
          <ErrorState
            message={t('emojisPage.emptyErrorState.message')}
            title={
              <div className='flex items-center gap-x-2'>
                <BsEmojiAngry />
                {t('emojisPage.emptyErrorState.title')}
              </div>
            }
          />

          <button className='text-tertiary hover:text-primary hover:underline' onClick={() => {
            setSearch('');
            setSort('Newest');
            setCategory('All');
            fetchEmojis('');
            setPage(1);
          }}>
            {t('buttons.resetSearch')}
          </button>
        </motion.div>
      </AnimatePresence>
    ) : (
      <>
        <motion.div
          animate={{ opacity: 1 }}
          className='grid grid-cols-1 gap-4 sm:grid-cols-2 sm:px-4 xl:grid-cols-3 xl:px-0'
          initial={{ opacity: 0 }}
        >
          {loading ? (
            new Array(12).fill(0).map((_, index) => (
              <div className='h-[164px] w-[322px] animate-pulse rounded-2xl bg-secondary' key={index} />
            ))
          ) : (
            emojis.map(emoji => (
              <ReportableArea
                active={user?.id !== emoji.user.id}
                identifier={`emoji-${emoji.emoji_ids?.length > 0 ? 'package-' : ''}${emoji.id}`}
                key={emoji.id}
                metadata={{
                  animated: emoji.animated,
                  emoji_ids: emoji.emoji_ids,
                  id: emoji.id,
                  name: emoji.name
                }}
                type='emoji'
              >
                {(emoji.emoji_ids || []).length > 0 ? (
                  <EmojiPackageCard
                    categories={emoji.categories}
                    downloads={emoji.downloads}
                    emoji_ids={emoji.emoji_ids}
                    id={emoji.id}
                    name={emoji.name}
                  />
                ) : (
                  <EmojiCard
                    animated={emoji.animated}
                    categories={emoji.categories}
                    downloads={emoji.downloads}
                    id={emoji.id}
                    name={emoji.name}
                  />
                )}
              </ReportableArea>
            ))
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
                fetchEmojis(search);
              }}
              total={totalEmojis}
            />
          )}
        </div>
      </>
    )
  );
}