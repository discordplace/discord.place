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
import { TbLoader } from 'react-icons/tb';
import { BsEmojiAngry } from 'react-icons/bs';
import Pagination from '@/app/components/Pagination';
import config from '@/config';

const BricolageGrotesque = Bricolage_Grotesque({ subsets: ['latin'] });

export default function Hero() {
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
      <Square column='10' row='10' transparentEffectDirection='bottomToTop' blockColor='rgba(var(--bg-secondary))' />

      <div className='absolute top-[-15%] max-w-[800px] w-full h-[300px] rounded-[5rem] bg-[#ffffff10] blur-[15rem]' />

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
          Discover the servers
        </motion.h1>
        <motion.span className="sm:text-lg max-w-[700px] text-center mt-8 text-neutral-400" initial={{ opacity: 0, y: -25 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sequenceTransition, delay: 0.2 }}>
          Explore the best servers on Discord and find the perfect community for you. Don{'\''}t forget to vote for your favorite servers!
        </motion.span>

        <div className='flex flex-col items-center justify-center w-full gap-2 mt-8 sm:flex-row'>
          <SearchInput
            placeholder='Search for a server by name, description, tags, etc.'
            loading={loading}
            search={search}
            fetchData={fetchServers}
            setPage={setPage}
            animationDelay={0.3}
          />

          <motion.div
            className='flex items-center w-full sm:w-max gap-x-2'
            initial={{ opacity: 0, y: -25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...sequenceTransition, delay: 0.3 }}
          >
            <Select
              placeholder='Category'
              options={
                config.serverCategories.map(category => ({
                  label: <div className='flex items-center gap-x-2'>
                    <span className='text-tertiary'>
                      {config.serverCategoriesIcons[category]}
                    </span>

                    {category}
                  </div>,
                  value: category
                }))
              }
              value={category}
              onChange={setCategory}
              disabled={loading}
            />

            <Select
              placeholder='Sorting'
              options={[
                ...[
                  {
                    label: 'Votes',
                    value: 'Votes'
                  },
                  {
                    label: 'Latest Voted',
                    value: 'LatestVoted'
                  },
                  {
                    label: 'Voice',
                    value: 'Voice'
                  },
                  {
                    label: 'Members',
                    value: 'Members'
                  },
                  {
                    label: 'Newest',
                    value: 'Newest'
                  },
                  {
                    label: 'Oldest',
                    value: 'Oldest'
                  },
                  {
                    label: 'Boosts',
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

      <div className='max-w-[1000px] w-full flex flex-col my-8 gap-y-2'>
        <div className={cn(
          'w-full',
          (loading || servers.length <= 0) ? 'flex items-center justify-center' : 'grid grid-cols-1 sm:grid-cols-3 gap-4'
        )}>
          <AnimatePresence>
            {loading ? (
              <motion.div variants={stateVariants} initial='hidden' animate='visible' exit='hidden'>
                <ErrorState title={<div className='flex items-center gap-x-1.5'>
                  <TbLoader className='animate-spin' />
                </div>} message='' />
              </motion.div>
            ) : (
              <>
                {servers.length <= 0 ? (
                  <motion.div className='flex flex-col gap-y-2' variants={stateVariants} initial='hidden' animate='visible' exit='hidden'>
                    <ErrorState title={<div className='flex items-center gap-x-2'>
                      <BsEmojiAngry />
                      It{'\''}s quiet in here...
                    </div>} message={'There are no servers to display. Maybe that\'s a sign to create one?'} />

                    <button className='text-tertiary hover:underline hover:text-primary' onClick={() => {
                      fetchServers('', 1, limit, 'All', 'Votes');
                    }}>
                      Reset Search
                    </button>
                  </motion.div>
                ) : (
                  servers.map((server, index) => (
                    <motion.div
                      key={server.id}
                      initial={{ opacity: 0, y: -25 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...sequenceTransition, delay: (index * 0.1) }}
                      className='flex animate-scroll-based-appear'
                    >
                      <ServerCard server={server} index={page > 1 ? null : index} />
                    </motion.div>
                  ))
                )}
              </>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
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
        </AnimatePresence>
      </div>
    </div>
  );
}