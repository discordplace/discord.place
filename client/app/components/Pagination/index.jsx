'use client';

import { motion } from 'framer-motion';
import cn from '@/lib/cn';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';

export default function Pagination({ page, setPage, loading, total, limit, disableAnimation }) {
  
  const totalPages = Math.ceil(total / limit);
  const pagesToShow = 1;
  const start = Math.max(1, page - pagesToShow);
  const end = Math.min(totalPages, page + pagesToShow);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  if (pages[0] !== 1) pages.unshift(1);
  if (pages[pages.length - 1] !== totalPages) pages.push(totalPages);

  let initial;
  let animate;
  let exit;
  
  if (disableAnimation) {
    initial = { opacity: 1, y: 0 };
    animate = { opacity: 1, y: 0 };
    exit = { opacity: 1, y: 0 };
  } else {
    initial = { opacity: 0, y: 50 };
    animate = { opacity: 1, y: 0 };
    exit = { opacity: 0, y: 50 };
  }

  return (
    <motion.div 
      className={cn(
        'flex items-center mt-6 gap-x-2 py-2 px-2 rounded-3xl bg-black/5 dark:bg-white/5',
        pages.length === 0 && 'hidden'
      )} 
      initial={initial}
      animate={animate}
      exit={exit}
    >
      <button
        className='flex items-center px-3 py-1 text-sm font-semibold text-black uppercase transition-colors cursor-pointer rounded-2xl active:bg-black/30 hover:bg-black/15 dark:active:bg-white/30 dark:text-white dark:hover:bg-white/15 gap-x-1'
        onClick={() => setPage(page - 1)}
        disabled={loading || page === 1}
      >
        <FiArrowLeft />
        PREV
      </button>

      {pages.map(pageNumber => (
        <div
          key={pageNumber}
          className={cn(
            'rounded-full px-3 py-1 items-center flex text-sm font-semibold cursor-pointer transition-colors text-black dark:text-white active:bg-black/30 hover:bg-black/15 dark:active:bg-white/30 dark:hover:bg-white/15',
            pageNumber === page && 'bg-black/30 dark:bg-white/30 pointer-events-none'
          )}
          onClick={() => setPage(pageNumber)}
        >
          {pageNumber}
        </div>
      ))}

      <button
        className='flex items-center px-3 py-1 text-sm font-semibold text-black uppercase transition-colors cursor-pointer rounded-2xl active:bg-black/30 hover:bg-black/15 dark:active:bg-white/30 dark:text-white dark:hover:bg-white/15 gap-x-1'
        onClick={() => setPage(page + 1)}
        disabled={loading || page === totalPages}
      >
        NEXT
        <FiArrowRight />
      </button>
    </motion.div>
  );
}
