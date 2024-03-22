'use client';

import useThemeStore from '@/stores/theme';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import MotionImage from '@/app/components/Motion/Image';
import cn from '@/lib/cn';

export default function EmojiPreview({ image_url, ableToChange, defaultSize }) {
  const [previewSize, setPreviewSize] = useState(defaultSize === 'shrink' ? 32 : 96);
  const theme = useThemeStore(state => state.theme);
  const [patternDarkMode, setPatternDarkMode] = useState(theme === 'dark' ? true : false);

  useEffect(() => {
    setPatternDarkMode(theme === 'dark' ? true : false);
  }, [theme]);

  return (
    <div className='w-full h-[250px] bg-secondary rounded-md overflow-hidden flex items-center justify-center flex-col gap-y-2 relative' style={{
      backgroundImage: `url(/${patternDarkMode ? 'transparent-pattern-dark' : 'transparent-pattern-light'}.png)`
    }}>
      <AnimatePresence>
        {image_url ? (
          <>
            <MotionImage
              key={image_url}
              width={previewSize}
              height={previewSize}
              src={image_url}
              alt='Emoji Preview'
              layoutId='emoji'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div 
              className='absolute flex w-full left-2 bottom-2 gap-x-2'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              layoutId='base'
            >
              {ableToChange && (
                <label 
                  className={cn(
                    'px-3 py-1.5 text-sm font-medium rounded-lg cursor-pointer',
                    patternDarkMode ? 'hover:bg-white/70 bg-white text-black' : 'hover:bg-black/70 bg-black text-white'
                  )} 
                  htmlFor='emojiFiles' 
                >
                  Change
                </label>
              )}

              <button 
                className={cn(
                  'px-3 py-1.5 text-sm font-medium rounded-lg cursor-pointer',
                  patternDarkMode ? 'hover:bg-white/70 bg-white text-black' : 'hover:bg-black/70 bg-black text-white'
                )} 
                onClick={() => setPatternDarkMode(!patternDarkMode)}
              >
                {patternDarkMode ? 'Light' : 'Dark'} Mode
              </button>

              <button 
                className={cn(
                  'px-3 py-1.5 text-sm font-medium rounded-lg cursor-pointer',
                  patternDarkMode ? 'hover:bg-white/70 bg-white text-black' : 'hover:bg-black/70 bg-black text-white'
                )}  
                onClick={() => setPreviewSize(previewSize === 32 ? 96 : 32)}
              >
                {previewSize === 32 ? 'Enlarge' : 'Shrink'}
              </button>
            </motion.div>
          </>
        ) : (
          ableToChange && (
            <motion.label 
              className={cn(
                'px-3 py-1.5 text-sm font-medium rounded-lg cursor-pointer',
                patternDarkMode ? 'hover:bg-white/70 bg-white text-black' : 'hover:bg-black/70 bg-black text-white'
              )}  
              htmlFor='emojiFiles'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              layoutId='base'
            >
              Select Emoji
            </motion.label>
          )
        )}
      </AnimatePresence>
    </div>
  );
}