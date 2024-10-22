'use client';

import useThemeStore from '@/stores/theme';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import MotionImage from '@/app/components/Motion/Image';
import { AnimatePresence } from 'framer-motion';

export default function FullPageLoading() {
  const theme = useThemeStore(state => state.theme);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const transition = { duration: 0.25, type: 'spring', damping: 10, stiffness: 100 };

  return (
    <AnimatePresence>
      <div className='fixed top-0 z-10 flex size-full flex-col items-center justify-center bg-background'>
        <MotionImage
          className='size-[64px]'
          src={theme === 'dark' ? '/symbol_white.png' : '/symbol_black.png'}
          alt='discord.place Logo'
          width={256}
          height={256}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transition}
        />

        <motion.div
          className='relative mt-8 h-[6px] w-[150px] overflow-hidden rounded-full bg-tertiary'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transition}
        >
          <div className='absolute h-[6px] animate-loading rounded-full bg-black dark:bg-white' style={{
            width: '50%',
            transform: 'translateX(-100%)'
          }} />
        </motion.div>
      </div>
    </AnimatePresence>
  );
}