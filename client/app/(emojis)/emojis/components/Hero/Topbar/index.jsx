import { IoMdCheckmarkCircle } from 'react-icons/io';
import { nanoid } from 'nanoid';
import { FiSearch } from 'react-icons/fi';
import { GrPowerReset } from 'react-icons/gr';
import useSearchStore from '@/stores/emojis/search';
import { useShallow } from 'zustand/react/shallow';
import { motion } from 'framer-motion';
import { useState } from 'react';
import cn from '@/lib/cn';
import { Drawer } from 'vaul';
import CategoriesDrawer from '@/app/(emojis)/emojis/components/CategoriesDrawer';

export default function Sidebar() {
  const { fetchEmojis, selectedCategory, setCategory, sort, setSort, search, loading, setPage } = useSearchStore(useShallow(state => ({
    fetchEmojis: state.fetchEmojis,
    selectedCategory: state.category,
    setCategory: state.setCategory,
    sort: state.sort,
    setSort: state.setSort,
    search: state.search,
    loading: state.loading,
    setPage: state.setPage
  })));

  const sequenceTransition = {
    duration: 0.25,
    type: 'spring',
    stiffness: 260,
    damping: 20
  };

  const sortings = [
    'Popular',
    'Newest',
    'Oldest'
  ];

  const [categoriesDrawerOpen, setCategoriesDrawerOpen] = useState(false);
  const [sortDrawerOpen, setSortDrawerOpen] = useState(false);

  return (
    <motion.div className='grid items-center justify-center grid-cols-2 gap-8 lg:grid-cols-4 h-[200px]' initial={{ opacity: 0, y: -25 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sequenceTransition, delay: 0.25 }}>
      <button
        className='flex flex-col items-center justify-center w-full h-full text-xl font-semibold hover:bg-tertiary gap-y-2 disabled:opacity-70 disabled:pointer-events-none sm:text-3xl bg-secondary rounded-3xl'
        disabled={loading}
        onClick={() => setCategoriesDrawerOpen(true)}
      >
        {selectedCategory}
        <p className='text-sm font-medium text-tertiary'>Category</p>
      </button>

      <CategoriesDrawer openState={categoriesDrawerOpen} setOpenState={setCategoriesDrawerOpen} state={selectedCategory} setState={setCategory} />
      
      <Drawer.Root shouldScaleBackground={true} closeThreshold={0.5} open={sortDrawerOpen} onOpenChange={setSortDrawerOpen}>
        <Drawer.Trigger asChild>
          <button 
            className='flex flex-col items-center justify-center w-full h-full text-xl font-semibold hover:bg-tertiary gap-y-2 disabled:opacity-70 disabled:pointer-events-none sm:text-3xl bg-secondary rounded-3xl'
            disabled={loading}
          >
            {sort}
            <p className='text-sm font-medium text-tertiary'>Sort by</p>
          </button>
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Content className='gap-y-1 p-4 z-[10001] bg-secondary flex flex-col rounded-t-3xl h-[250px] fixed bottom-0 left-0 right-0'>
            <div className='mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-quaternary mb-8' />
            
            {sortings.map(sorting => (
              <button
                key={nanoid()}
                onClick={() => {
                  setSort(sorting);
                  setSortDrawerOpen(false);
                }}
                className={cn(
                  'flex items-center justify-between px-4 py-3 text-base font-medium rounded-lg disabled:pointer-events-none',
                  sort === sorting ? 'pointer-events-none bg-quaternary text-primary' : 'hover:bg-quaternary text-tertiary hover:text-primary'
                )}
                disabled={loading}
              >
                {sorting}
                {sort === sorting && <IoMdCheckmarkCircle />}
              </button>
            ))}
          </Drawer.Content>
          <Drawer.Overlay className='fixed inset-0 bg-white/40 dark:bg-black/40 z-[10000]' />
        </Drawer.Portal>
      </Drawer.Root>

      <button 
        className='flex flex-col items-center justify-center w-full h-full text-xl font-semibold hover:bg-tertiary gap-y-2 disabled:opacity-70 disabled:pointer-events-none sm:text-3xl bg-secondary rounded-3xl'
        onClick={() => {
          setPage(1);
          fetchEmojis(search);
        }}
        disabled={loading}
      >
        <FiSearch />
        <p className='text-sm font-medium text-tertiary'>Apply Filters</p>
      </button>

      <button 
        className='flex flex-col items-center justify-center w-full h-full text-xl font-semibold hover:bg-tertiary gap-y-2 disabled:opacity-70 disabled:pointer-events-none sm:text-3xl bg-secondary rounded-3xl'
        onClick={() => {
          setCategory('All');
          setSort('Newest');
          fetchEmojis('');
          setPage(1);
        }} 
        disabled={(selectedCategory === 'All' && sort === 'Newest') || loading}
      >
        <GrPowerReset />
        <p className='text-sm font-medium text-tertiary'>Reset Filters</p>
      </button>
    </motion.div>
  );
}