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
      <div className="fixed top-0 flex flex-col items-center justify-center w-full h-full bg-background z-[10]">
        <MotionImage
          className='w-[64px] h-[64px]'
          src={theme === 'dark' ? '/symbol_white.png' : '/symbol_black.png'} 
          alt="discord.place Logo" 
          width={256} 
          height={256}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transition}
          key={theme === 'dark' ? 'white-logo' : 'black-logo'}
        />

        <motion.div 
          className='overflow-hidden mt-8 bg-tertiary w-[150px] h-[6px] rounded-full relative'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transition}
        >
          <div className='absolute h-[6px] dark:bg-white bg-black rounded-full animate-loading' style={{
            width: '50%',
            transform: 'translateX(-100%)'
          }} />
        </motion.div>
      </div>
    </AnimatePresence>
  );
}