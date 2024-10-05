'use client';

import Square from '@/app/components/Background/Square';
import cn from '@/lib/cn';
import { motion } from 'framer-motion';
import { Bricolage_Grotesque } from 'next/font/google';
import ServerCard from '@/app/(servers)/servers/components/ServerCard';
import SearchInput from '@/app/components/SearchInput';
import Select from '@/app/components/Select';
import { useEffect } from 'react';
import useSearchStore from '@/stores/servers/search';
import { useShallow } from 'zustand/react/shallow';
import { AnimatePresence } from 'framer-motion';
import ErrorState from '@/app/components/ErrorState';
import { BsEmojiAngry } from 'react-icons/bs';
import Pagination from '@/app/components/Pagination';
import config from '@/config';
import { t } from '@/stores/language';
import ReportableArea from '@/app/components/ReportableArea';
import useAuthStore from '@/stores/auth';

const BricolageGrotesque = Bricolage_Grotesque({ subsets: ['latin'], display: 'swap', adjustFontFallback: false });

export default function Hero() {
  const user = useAuthStore(state => state.user);

  const { category, setCategory, sort, setSort, search, loading, servers, fetchServers, page, totalServers, limit, setPage } = useSearchStore(useShallow(state => ({
    category: state.category,
    setCategory: state.setCategory,
    sort: state.sort,
    setSort: state.setSort,
    search: state.search,
    loading: state.loading,
    servers: state.servers,
    fetchServers: state.fetchServers,
    page: state.page,
    totalServers: state.totalServers,
    limit: state.limit,
    setPage: state.setPage
  })));

  useEffect(() => {
    fetchServers('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sequenceTransition = {
    duration: 0.25,
    type: 'spring',
    stiffness: 260,
    damping: 20
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
    }
  };

  const showPagination = !loading && totalServers > limit;

  return (
    <div className="z-0 relative flex flex-col pt-[14rem] items-center px-4 lg:px-0">
      <Square
        column='5'
        row='5'
        transparentEffectDirection='bottomToTop'
        blockColor='rgba(var(--bg-secondary))'
      />

      <div className='absolute top-0 left-0 -z-[1] w-full h-full [background:linear-gradient(180deg,_rgba(85,_98,_247,_0.075)_0%,_transparent_100%)]' />

      <div className='max-w-[800px] flex flex-col w-full items-center'>
        <motion.h1 
          className={cn(
            'text-5xl font-medium max-w-[800px] text-center text-primary',
            BricolageGrotesque.className
          )}
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...sequenceTransition, delay: 0.1 }}
        >
          {t('serversPage.title')}
        </motion.h1>
        <motion.span className="sm:text-lg max-w-[700px] text-center mt-8 text-tertiary" initial={{ opacity: 0, y: -25 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sequenceTransition, delay: 0.2 }}>
          {t('serversPage.subtitle')}
        </motion.span>

        <div className='flex flex-col items-center justify-center w-full gap-2 mt-8 sm:flex-row'>
          <SearchInput
            placeholder={t('serversPage.searchInputPlaceholder')}
            loading={loading}
            search={search}
            fetchData={fetchServers}
            setPage={setPage}
            animationDelay={0.3}
          />

          <motion.div
            className='flex flex-col items-center w-full gap-2 mobile:flex-row sm:w-max'
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
              value={sort}
              onChange={setSort}
              disabled={loading}
            />
          </motion.div>
        </div>
      </div>

      <motion.div
        className='max-w-[1000px] w-full flex flex-col my-8 gap-y-2'
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

              <button className='text-tertiary hover:underline hover:text-primary' onClick={() => {
                fetchServers('', 1, limit, 'All', 'Votes');
              }}>
                {t('buttons.resetSearch')}
              </button>
            </motion.div>
          </AnimatePresence>
        ) : (
          <>
            <motion.div
              className='grid grid-cols-1 gap-4 sm:grid-cols-3'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {loading ? (
                new Array(limit).fill(0).map((_, index) => (
                  <div key={index} className='animate-pulse h-[250px] w-[322px] bg-secondary rounded-3xl' />
                ))
              ) : (
                <>                  
                  {servers.map(server => (
                    <ReportableArea
                      key={server.id}
                      active={user?.id !== server.owner.id}
                      type='server'
                      metadata={{
                        id: server.id,
                        name: server.name,
                        icon: server.icon,
                        description: server.description
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

            <div className='flex items-center justify-center w-full' key='pagination'> 
              {showPagination && (
                <div className='flex justify-center w-full'>
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