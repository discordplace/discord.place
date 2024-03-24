'use client';

import { motion } from 'framer-motion';
import { CgChevronLeft, CgChevronRight } from 'react-icons/cg';
import { useEffect, useRef, useState } from 'react';
import cn from '@/lib/cn';

export default function Pagination({ page, setPage, loading, total, limit }) {
  
  const totalPages = Math.ceil(total / limit);
  const pagesToShow = 2;
  const start = Math.max(1, page - pagesToShow);
  const end = Math.min(totalPages, page + pagesToShow);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <motion.div 
      className={cn(
        'flex items-center p-2 mt-6 overflow-hidden rounded-lg bg-secondary gap-x-2',
        pages.length === 0 && 'hidden'
      )} 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }} 
    >
      <button 
        className='select-none items-center w-[28px] h-[28px] flex justify-center text-lg font-semibold rounded bg-quaternary disabled:pointer-events-none dark:hover:text-black dark:hover:bg-white hover:bg-black hover:text-white'
        onClick={() => setPage(page - 1)}
        disabled={loading || page === 1}
      >
        <CgChevronLeft />
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
        <CgChevronRight />
      </button>
    </motion.div>
  )
}
