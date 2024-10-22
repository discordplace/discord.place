'use client';

import cn from '@/lib/cn';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';

/*
  https://ui.aceternity.com/components/flip-words
  Used with few changes to animations.
*/

export default function FlipWords({ className, duration = 3000, onStartAnimation = null, words }) {
  const [currentWord, setCurrentWord] = useState(words[0]);
  const [isAnimating, setIsAnimating] = useState(false);

  // thanks for the fix Julian - https://github.com/Julian-AT
  const startAnimation = useCallback(() => {
    const word = words[words.indexOf(currentWord) + 1] || words[0];
    setCurrentWord(word);
    setIsAnimating(true);
  }, [currentWord, words]);

  useEffect(() => {
    if (!isAnimating)
      setTimeout(() => {
        startAnimation();
        onStartAnimation && onStartAnimation();
      }, duration);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAnimating, duration, startAnimation]);

  return (
    <AnimatePresence
      mode='wait'
      onExitComplete={() => {
        setIsAnimating(false);
      }}
    >
      <motion.div
        animate={{
          opacity: 1,
          y: 0
        }}
        className={cn(
          'z-10 inline-block w-fit min-w-fit relative text-left text-neutral-900 dark:text-neutral-100 px-2',
          className
        )}
        exit={{
          opacity: 0
        }}
        initial={{
          opacity: 0,
          y: 10
        }}
        key={currentWord}
        transition={{
          duration: 0.4,
          ease: 'easeInOut'
        }}
      >
        {currentWord?.split('').map((letter, index) => (
          <motion.span
            animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
            className='inline-block'
            initial={{ filter: 'blur(8px)', opacity: 0, y: 10 }}
            key={currentWord + index}
            transition={{
              delay: index * 0.08,
              duration: 0.4
            }}
          >
            {letter}
          </motion.span>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
