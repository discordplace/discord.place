'use client';

import { BsEmojiAngry } from 'react-icons/bs';
import Square from '@/app/components/Background/Square';
import cn from '@/lib/cn';
import { Bricolage_Grotesque } from 'next/font/google';
import ServerCard from '@/app/(servers)/servers/components/ServerCard';
import SearchInput from '@/app/components/SearchInput';
import Select from '@/app/components/Select';
import { useEffect } from 'react';
import useSearchStore from '@/stores/servers/search';
import { useShallow } from 'zustand/react/shallow';
import { AnimatePresence, motion } from 'framer-motion';
import ErrorState from '@/app/components/ErrorState';
import Pagination from '@/app/components/Pagination';
import config from '@/config';
import { useTranslation } from 'react-i18next';
import ReportableArea from '@/app/components/ReportableArea';
import useAuthStore from '@/stores/auth';

const BricolageGrotesque = Bricolage_Grotesque({ adjustFontFallback: false, display: 'swap', subsets: ['latin'] });

export default function Hero() {
  const { t } = useTranslation();
  const user = useAuthStore(state => state.user);

  const { category, setCategory, sort, setSort, search, loading, servers, fetchServers, page, totalServers, limit, setPage } = useSearchStore(useShallow(state => ({
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
      <Square column='10' row='10' transparentEffectDirection='bottomToTop' blockColor='rgba(var(--bg-secondary))' />

      <div className='absolute top-[-15%] h-[300px] w-full max-w-[800px] rounded-[5rem] bg-[#ffffff10] blur-[15rem]' />

      <div className='flex w-full max-w-[800px] flex-col items-center'>
        <motion.h1
          className={cn(
            'max-w-[800px] text-center text-5xl font-medium text-primary',
            BricolageGrotesque.className
          )}
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...sequenceTransition, delay: 0.1 }}
        >
          {t('serversPage.title')}
        </motion.h1>
        <motion.span className='mt-8 max-w-[700px] text-center text-tertiary sm:text-lg' initial={{ opacity: 0, y: -25 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sequenceTransition, delay: 0.2 }}>
          {t('serversPage.subtitle')}
        </motion.span>

        <div className='mt-8 flex w-full flex-col items-center justify-center gap-2 sm:flex-row'>
          <SearchInput
            placeholder={t('serversPage.searchInputPlaceholder')}
            loading={loading}
            search={search}
            fetchData={fetchServers}
            setPage={setPage}
            animationDelay={0.3}
          />

          <motion.div
            className='flex w-full flex-col items-center gap-2 mobile:flex-row sm:w-max'
            initial={{ opacity: 0, y: -25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...sequenceTransition, delay: 0.3 }}
          >
            <Select
              placeholder={t('serversPage.categorySelectPlaceholder')}
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
              value={category}
              onChange={setCategory}
              disabled={loading}
            />

            <Select
              placeholder={t('serversPage.sortSelect.placeholder')}
              options={[
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
              }))}
              value={sort}
              onChange={setSort}
              disabled={loading}
            />
          </motion.div>
        </div>
      </div>

      <motion.div
        className='my-8 flex w-full max-w-[1000px] flex-col gap-y-2'
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...sequenceTransition, delay: 0.5 }}
      >
        {!loading && servers.length <= 0 ? (
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
                    {t('serversPage.emptyErrorState.title')}
                  </div>
                }
                message={t('serversPage.emptyErrorState.message')}
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
              className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {loading ? (
                Array.from({ length: limit }).fill(0).map((_, index) => (
                  <div key={index} className='h-[250px] w-[322px] animate-pulse rounded-3xl bg-secondary' />
                ))
              ) : (
                <>
                  {servers.map(server => (
                    <ReportableArea
                      key={server.id}
                      active={user?.id !== server.owner.id}
                      type='server'
                      metadata={{
                        description: server.description,
                        icon: server.icon,
                        id: server.id,
                        name: server.name
                      }}
                      identifier={`server-${server.id}`}
                    >
                      <div className='flex animate-scroll-based-appear'>
                        <ServerCard
                          server={server}
                          index={page > 1 ? null : servers.filter(({ standed_out }) => !standed_out?.created_at).indexOf(server)}
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
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}