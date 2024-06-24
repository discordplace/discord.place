'use client';

import { motion } from 'framer-motion';
import cn from '@/lib/cn';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

function generateClickableNumbers(currentPage, totalPages, limit) {
  currentPage = Math.max(1, Math.min(currentPage, totalPages));
  
  const halfLimit = Math.floor(limit / 2);
  let startPage = Math.max(1, currentPage - halfLimit);
  let endPage = Math.min(totalPages, currentPage + halfLimit);

  if (endPage - startPage + 1 < limit) {
    if (currentPage - halfLimit < 1) {
      endPage = Math.min(totalPages, endPage + (limit - (endPage - startPage + 1)));
    } else if (currentPage + halfLimit > totalPages) {
      startPage = Math.max(1, startPage - (limit - (endPage - startPage + 1)));
    }
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return pages;
}

export default function Pagination({ page, setPage, loading, total, limit, disableAnimation }) {
  const totalPages = Math.ceil(total / limit);
  const pages = generateClickableNumbers(page, totalPages, 4);

  const [inputOpened, setInputOpened] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef?.current) {
      if (inputOpened) toast.info(`Type a page number between 1 and ${totalPages} and press Enter to navigate to that page.`);
      inputRef.current.focus();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputOpened]);

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
      className='flex my-6 gap-x-2.5'
      initial={initial}
      animate={animate}
      exit={exit}
    >
      <button
        className='outline-none px-1.5 py-1 bg-secondary select-none hover:bg-quaternary rounded-lg text-sm font-bold border-2 border-[rgba(var(--bg-quaternary))] disabled:pointer-events-none disabled:opacity-60'
        onClick={() => setPage(page - 1)}
        disabled={loading || page === 1}
      >
        <LuChevronLeft strokeWidth={3} />
      </button>
      
      {pages.map(pageNumber => (
        <>
          <button
            key={pageNumber}
            className={cn(
              'outline-none px-2.5 py-1 relative overflow-hidden bg-secondary select-none hover:bg-quaternary duration-300 [&:not(:disabled)]:hover:border-purple-500 rounded-lg text-sm font-bold border-2 border-[rgba(var(--bg-quaternary))] disabled:pointer-events-none disabled:opacity-60',
              pageNumber === page ? '!opacity-100 border-purple-500' : 'transition-[background-color,border-color]'
            )}
            onClick={() => setPage(pageNumber)}
            disabled={loading || pageNumber === page}
          >
            {pageNumber}
          </button>

          {(pages[pages.length - 1] === 4 && pageNumber === 2) && (
            inputOpened ? (
              <input
                ref={inputRef}
                className='focus-visible:bg-quaternary caret-[rgba(var(--text-secondary))] text-secondary placeholder-[rgba(var(--text-tertiary))] max-w-[50px] text-center outline-none px-2.5 py-1 relative overflow-hidden bg-secondary select-none hover:bg-quaternary duration-300 rounded-lg text-sm font-bold border-2 border-[rgba(var(--bg-quaternary))]'
                value={inputValue}
                onChange={event => {
                  // dont allow to type 0 as the first digit
                  if (event.target.value.length === 1 && event.target.value === '0') {
                    setInputValue('');
                    return;
                  }

                  // dont allow to type max number of pages + 1
                  if (parseInt(event.target.value) > totalPages) {
                    setInputValue(totalPages.toString());
                    return;
                  }

                  setInputValue(event.target.value);
                }}
                onKeyUp={event => {
                  if (event.key === 'Enter') {
                    setPage(Math.max(1, Math.min(totalPages, parseInt(inputValue))));
                    setInputOpened(false);
                  }
                }}
                maxLength={totalPages.toString().length}
              />
            ) : (
              <button
                className='outline-none gap-x-0.5 flex items-center justify-center px-2.5 py-1 relative overflow-hidden bg-secondary select-none hover:bg-quaternary duration-300 [&:not(:disabled)]:hover:border-purple-500 rounded-lg text-sm font-bold border-2 border-[rgba(var(--bg-quaternary))]'
                onClick={() => setInputOpened(true)}
              >
                <span className='bg-[rgba(var(--text-primary))] w-[2.5px] h-[2.5px] block rounded-full' />
                <span className='bg-[rgba(var(--text-primary))] w-[2.5px] h-[2.5px] block rounded-full' />
                <span className='bg-[rgba(var(--text-primary))] w-[2.5px] h-[2.5px] block rounded-full' />
              </button>
            )
          )}
        </>
      ))}

      <button
        className='outline-none px-1.5 py-1 bg-secondary select-none hover:bg-quaternary rounded-lg text-sm font-bold border-2 border-[rgba(var(--bg-quaternary))] disabled:pointer-events-none disabled:opacity-60'
        onClick={() => setPage(page + 1)}
        disabled={loading || page === totalPages}
      >
        <LuChevronRight strokeWidth={3} />
      </button>
    </motion.div>
  );
}