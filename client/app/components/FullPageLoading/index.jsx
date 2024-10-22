'use client';

import MotionImage from '@/app/components/Motion/Image';
import useThemeStore from '@/stores/theme';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

export default function FullPageLoading() {
  const theme = useThemeStore(state => state.theme);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const transition = { damping: 10, duration: 0.25, stiffness: 100, type: 'spring' };

  return (
    <AnimatePresence>
      <div className='fixed top-0 z-10 flex size-full flex-col items-center justify-center bg-background'>
        <MotionImage
          alt='discord.place Logo'
          animate={{ opacity: 1 }}
          className='size-[64px]'
          exit={{ opacity: 0 }}
          height={256}
          initial={{ opacity: 0 }}
          src={theme === 'dark' ? '/symbol_white.png' : '/symbol_black.png'}
          transition={transition}
          width={256}
        />

        <motion.div
          animate={{ opacity: 1 }}
          className='relative mt-8 h-[6px] w-[150px] overflow-hidden rounded-full bg-tertiary'
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          transition={transition}
        >
          <div className='absolute h-[6px] animate-loading rounded-full bg-black dark:bg-white' style={{
            transform: 'translateX(-100%)',
            width: '50%'
          }} />
        </motion.div>
      </div>
    </AnimatePresence>
  );
}