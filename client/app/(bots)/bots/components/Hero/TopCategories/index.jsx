'use client';

import config from '@/config';
import { useEffect, useState } from 'react';
import getCategoriesSize from '@/lib/request/bots/getCategoriesSize';
import { motion } from 'framer-motion';
import cn from '@/lib/cn';
import useSearchStore from '@/stores/bots/search';
import { IoMdCheckmarkCircle } from 'react-icons/io'; 
import { useShallow } from 'zustand/react/shallow';
import { TbLoader } from 'react-icons/tb';

export default function TopCategories() {
  const { category, setCategory, loading } = useSearchStore(useShallow(state => ({
    category: state.category,
    setCategory: state.setCategory,
    loading: state.loading
  })));

  const [sizeData, setSizeData] = useState([]);

  useEffect(() => {
    getCategoriesSize()
      .then(data => setSizeData(data));
  }, []);

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal'
  });

  const sequenceTransition = {
    duration: 0.25,
    type: 'spring',
    stiffness: 260,
    damping: 20
  };

  const container = {
    hidden: { opacity: 0, y: -25 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        ...sequenceTransition,
        delay: 0.35
      }
    }
  };

  return (
    <motion.div 
      className='flex flex-wrap justify-center gap-4 mt-8' 
      variants={container}
      initial='hidden'
      animate='show'
    >
      {config.botCategories
        .sort((a, b) => sizeData[b] - sizeData[a])
        .map(botCategory => (
          <div
            disabled={loading}
            onClick={() => category === botCategory ? setCategory(null) : setCategory(botCategory)}
            key={botCategory} 
            className={cn(
              'flex items-center select-none text-sm px-3 py-1 font-medium rounded-md disabled:bg-quaternary disabled:pointer-events-none cursor-pointer gap-x-1.5 hover:bg-quaternary bg-secondary',
              category === botCategory && 'bg-quaternary'
            )}
          >
            {config.botCategoriesIcons[botCategory] && (
              <>
                <span className='text-tertiary'>
                  {category === botCategory ? (
                    loading ? <TbLoader className='animate-spin' /> : <IoMdCheckmarkCircle />
                  ) : config.botCategoriesIcons[botCategory]}
                </span>
              </>
            )}
            {botCategory}
            <span className='text-xs font-normal text-tertiary'>
              ({formatter.format(sizeData[botCategory] || 0)})
            </span>
          </div>
        ))
      }
    </motion.div>
  );
}