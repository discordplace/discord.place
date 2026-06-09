'use client';

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import cn from '@/lib/cn';

/*
  https://ui.aceternity.com/components/flip-words
  Used with few changes to animations.
*/

export default function FlipWords({ words, duration = 3000, className, onStartAnimation = null }) {
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
      {setTimeout(() => {
        startAnimation();
        if (onStartAnimation) onStartAnimation();
      }, duration);}
  }, [isAnimating, duration, startAnimation]);

  return (
    <AnimatePresence
      onExitComplete={() => {
        setIsAnimating(false);
      }}
      mode='wait'
    >
      <motion.div
        initial={{
          opacity: 0,
          y: 10
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.4,
          ease: 'easeInOut'
        }}
        exit={{
          opacity: 0
        }}
        className={cn(
          'z-10 inline-block w-fit min-w-fit relative text-left text-neutral-900 dark:text-neutral-100 px-2',
          className
        )}
        key={currentWord}
      >
        {[...currentWord].map((letter, index) => (
          <motion.span
            key={currentWord + index}
            initial={{ filter: 'blur(8px)', opacity: 0, y: 10 }}
            animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.08,
              duration: 0.4
            }}
            className='inline-block'
          >
            {letter}
          </motion.span>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}