'use client';

import { LuChevronLeft, LuChevronRight } from '@/icons';
import { motion } from 'framer-motion';
import cn from '@/lib/cn';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { t } from '@/stores/language';
import { useMedia } from 'react-use';

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
  const isMobile = useMedia('(max-width: 640px)', false);
  const totalPages = Math.ceil(total / limit);
  const pages = generateClickableNumbers(page, totalPages, 4);

  const [inputOpened, setInputOpened] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef?.current) {
      if (inputOpened) toast.info(t('pagination.inputOpened', { totalPages }));
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
      className='my-6 flex gap-x-2.5'
      initial={initial}
      animate={animate}
      exit={exit}
    >
      <button
        className='select-none rounded-lg border-2 border-[rgba(var(--bg-quaternary))] bg-secondary px-1.5 py-1 text-sm font-bold outline-none hover:bg-quaternary disabled:pointer-events-none disabled:opacity-60'
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
                type='text'
                inputMode='numeric'
                pattern='[0-9]*'
                ref={inputRef}
                className='relative max-w-[50px] select-none overflow-hidden rounded-lg border-2 border-[rgba(var(--bg-quaternary))] bg-secondary px-2.5 py-1 text-center text-sm font-bold text-secondary caret-[rgba(var(--text-secondary))] outline-none duration-300 placeholder:text-[rgba(var(--text-tertiary))] hover:bg-quaternary focus-visible:bg-quaternary'
                value={inputValue}
                onChange={event => {
                  // dont allow to type non-numeric characters
                  if (event.target.validity.patternMismatch) return;

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
                    setInputOpened(false);

                    if (isNaN(inputValue) || inputValue === '') return;

                    setPage(Math.max(1, Math.min(totalPages, parseInt(inputValue))));
                  }
                }}
                onBlur={() => {
                  setInputOpened(false);

                  if (isNaN(inputValue) || inputValue === '') return;

                  setPage(Math.max(1, Math.min(totalPages, parseInt(inputValue))));

                  // Move user to the top of the page if they are on mobile
                  if (isMobile) window.scrollTo(0, 0);
                }}
                maxLength={totalPages.toString().length}
              />
            ) : (
              <button
                className='relative flex select-none items-center justify-center gap-x-0.5 overflow-hidden rounded-lg border-2 border-[rgba(var(--bg-quaternary))] bg-secondary px-2.5 py-1 text-sm font-bold outline-none duration-300 hover:bg-quaternary [&:not(:disabled)]:hover:border-purple-500'
                onClick={() => setInputOpened(true)}
              >
                <span className='block size-[2.5px] rounded-full bg-[rgba(var(--text-primary))]' />
                <span className='block size-[2.5px] rounded-full bg-[rgba(var(--text-primary))]' />
                <span className='block size-[2.5px] rounded-full bg-[rgba(var(--text-primary))]' />
              </button>
            )
          )}
        </>
      ))}

      <button
        className='select-none rounded-lg border-2 border-[rgba(var(--bg-quaternary))] bg-secondary px-1.5 py-1 text-sm font-bold outline-none hover:bg-quaternary disabled:pointer-events-none disabled:opacity-60'
        onClick={() => setPage(page + 1)}
        disabled={loading || page === totalPages}
      >
        <LuChevronRight strokeWidth={3} />
      </button>
    </motion.div>
  );
}