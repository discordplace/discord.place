'use client';

import { motion } from 'framer-motion';
import cn from '@/lib/cn';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

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
        'flex items-center p-2 mt-6 overflow-hidden rounded-lg bg-secondary gap-x-2',
        pages.length === 0 && 'hidden'
      )} 
      initial={initial}
      animate={animate}
      exit={exit}
    >
      <button 
        className='select-none items-center w-[28px] h-[28px] flex justify-center text-lg font-semibold rounded bg-quaternary disabled:pointer-events-none dark:hover:text-black dark:hover:bg-white hover:bg-black hover:text-white'
        onClick={() => setPage(page - 1)}
        disabled={loading || page === 1}
      >
        <MdKeyboardArrowLeft />
      </button>

      {pages.map(pageNumber => (
        <button
          key={pageNumber}
          className={cn(
            'select-none items-center flex justify-center w-[28px] h-[28px] text-sm font-semibold rounded text-tertiary hover:text-primary',
            pageNumber === page && 'bg-quaternary text-primary'
          )}
          onClick={() => setPage(pageNumber)}
          disabled={loading || pageNumber === page}
        >
          {pageNumber}
        </button>
      ))}

      <button
        className='select-none items-center w-[28px] h-[28px] flex justify-center text-lg font-semibold rounded bg-quaternary disabled:pointer-events-none dark:hover:text-black dark:hover:bg-white hover:bg-black hover:text-white'
        onClick={() => setPage(page + 1)}
        disabled={loading || page === totalPages}
      >
        <MdKeyboardArrowRight />
      </button>
    </motion.div>
  );
}
