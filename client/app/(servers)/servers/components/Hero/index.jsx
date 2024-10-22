'use client';

import ServerCard from '@/app/(servers)/servers/components/ServerCard';
import Square from '@/app/components/Background/Square';
import ErrorState from '@/app/components/ErrorState';
import Pagination from '@/app/components/Pagination';
import ReportableArea from '@/app/components/ReportableArea';
import SearchInput from '@/app/components/SearchInput';
import Select from '@/app/components/Select';
import config from '@/config';
import cn from '@/lib/cn';
import useAuthStore from '@/stores/auth';
import { t } from '@/stores/language';
import useSearchStore from '@/stores/servers/search';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import { Bricolage_Grotesque } from 'next/font/google';
import { useEffect } from 'react';
import { BsEmojiAngry } from 'react-icons/bs';
import { useShallow } from 'zustand/react/shallow';

const BricolageGrotesque = Bricolage_Grotesque({ adjustFontFallback: false, display: 'swap', subsets: ['latin'] });

export default function Hero() {
  const user = useAuthStore(state => state.user);

  const { category, fetchServers, limit, loading, page, search, servers, setCategory, setPage, setSort, sort, totalServers } = useSearchStore(useShallow(state => ({
    category: state.category,
    fetchServers: state.fetchServers,
    limit: state.limit,
    loading: state.loading,
    page: state.page,
    search: state.search,
    servers: state.servers,
    setCategory: state.setCategory,
    setPage: state.setPage,
    setSort: state.setSort,
    sort: state.sort,
    totalServers: state.totalServers
  })));

  useEffect(() => {
    fetchServers('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sequenceTransition = {
    damping: 20,
    duration: 0.25,
    stiffness: 260,
    type: 'spring'
  };

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

  const showPagination = !loading && totalServers > limit;

  return (
    <div className='relative z-0 flex flex-col items-center px-4 pt-56 lg:px-0'>
      <Square blockColor='rgba(var(--bg-secondary))' column='10' row='10' transparentEffectDirection='bottomToTop' />

      <div className='absolute top-[-15%] h-[300px] w-full max-w-[800px] rounded-[5rem] bg-[#ffffff10] blur-[15rem]' />

      <div className='flex w-full max-w-[800px] flex-col items-center'>
        <motion.h1
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'text-5xl font-medium max-w-[800px] text-center text-primary',
            BricolageGrotesque.className
          )}
          initial={{ opacity: 0, y: -25 }}
          transition={{ ...sequenceTransition, delay: 0.1 }}
        >
          {t('serversPage.title')}
        </motion.h1>
        <motion.span animate={{ opacity: 1, y: 0 }} className='mt-8 max-w-[700px] text-center text-tertiary sm:text-lg' initial={{ opacity: 0, y: -25 }} transition={{ ...sequenceTransition, delay: 0.2 }}>
          {t('serversPage.subtitle')}
        </motion.span>

        <div className='mt-8 flex w-full flex-col items-center justify-center gap-2 sm:flex-row'>
          <SearchInput
            animationDelay={0.3}
            fetchData={fetchServers}
            loading={loading}
            placeholder={t('serversPage.searchInputPlaceholder')}
            search={search}
            setPage={setPage}
          />

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className='flex w-full flex-col items-center gap-2 mobile:flex-row sm:w-max'
            initial={{ opacity: 0, y: -25 }}
            transition={{ ...sequenceTransition, delay: 0.3 }}
          >
            <Select
              disabled={loading}
              onChange={setCategory}
              options={
                config.serverCategories.map(category => ({
                  label: <div className='flex items-center gap-x-2'>
                    <span className='text-tertiary'>
                      {config.serverCategoriesIcons[category]}
                    </span>

                    {t(`categories.${category}`)}
                  </div>,
                  value: category
                }))
              }
              placeholder={t('serversPage.categorySelectPlaceholder')}
              value={category}
            />

            <Select
              disabled={loading}
              onChange={setSort}
              options={[
                ...[
                  {
                    label: t('serversPage.sortSelect.items.votes'),
                    value: 'Votes'
                  },
                  {
                    label: t('serversPage.sortSelect.items.latestVoted'),
                    value: 'LatestVoted'
                  },
                  {
                    label: t('serversPage.sortSelect.items.members'),
                    value: 'Members'
                  },
                  {
                    label: t('serversPage.sortSelect.items.newest'),
                    value: 'Newest'
                  },
                  {
                    label: t('serversPage.sortSelect.items.oldest'),
                    value: 'Oldest'
                  },
                  {
                    label: t('serversPage.sortSelect.items.boosts'),
                    value: 'Boosts'
                  }
                ].map(option => ({
                  label: <div className='flex items-center gap-x-2'>
                    {config.sortIcons[option.value.replace(' ', '')]}
                    {option.label}
                  </div>,
                  value: option.value
                }))
              ]}
              placeholder={t('serversPage.sortSelect.placeholder')}
              value={sort}
            />
          </motion.div>
        </div>
      </div>

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className='my-8 flex w-full max-w-[1000px] flex-col gap-y-2'
        initial={{ opacity: 0, y: -25 }}
        transition={{ ...sequenceTransition, delay: 0.5 }}
      >
        {!loading && servers.length <= 0 ? (
          <AnimatePresence>
            <motion.div
              animate='visible'
              className='flex flex-col gap-y-2'
              exit='hidden'
              initial='hidden'
              variants={stateVariants}
            >
              <ErrorState
                message={t('serversPage.emptyErrorState.message')}
                title={
                  <div className='flex items-center gap-x-2'>
                    <BsEmojiAngry />
                    {t('serversPage.emptyErrorState.title')}
                  </div>
                }
              />

              <button className='text-tertiary hover:text-primary hover:underline' onClick={() => {
                fetchServers('', 1, limit, 'All', 'Votes');
              }}>
                {t('buttons.resetSearch')}
              </button>
            </motion.div>
          </AnimatePresence>
        ) : (
          <>
            <motion.div
              animate={{ opacity: 1 }}
              className='grid grid-cols-1 gap-4 sm:grid-cols-3'
              initial={{ opacity: 0 }}
            >
              {loading ? (
                new Array(limit).fill(0).map((_, index) => (
                  <div className='h-[250px] w-[322px] animate-pulse rounded-3xl bg-secondary' key={index} />
                ))
              ) : (
                <>
                  {servers.map(server => (
                    <ReportableArea
                      active={user?.id !== server.owner.id}
                      identifier={`server-${server.id}`}
                      key={server.id}
                      metadata={{
                        description: server.description,
                        icon: server.icon,
                        id: server.id,
                        name: server.name
                      }}
                      type='server'
                    >
                      <div className='flex animate-scroll-based-appear'>
                        <ServerCard
                          index={page > 1 ? null : servers.filter(({ standed_out }) => !standed_out?.created_at).indexOf(server)}
                          server={server}
                        />
                      </div>
                    </ReportableArea>
                  ))}
                </>
              )}
            </motion.div>

            <div className='flex w-full items-center justify-center' key='pagination'>
              {showPagination && (
                <div className='flex w-full justify-center'>
                  <Pagination
                    limit={limit}
                    loading={loading}
                    page={page}
                    setPage={newPage => {
                      fetchServers(search, newPage);
                    }}
                    total={totalServers}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}