import Image from 'next/image';
import { MdEmojiEmotions } from 'react-icons/md';
import { FaRegTrashAlt } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import useThemeStore from '@/stores/theme';
import { motion } from 'framer-motion';

export default function PackagePreview({ image_urls, setImageURLs, setIsPackage, setEmojiURL, ableToChange }) {
  const theme = useThemeStore(state => state.theme);
  const [patternDarkMode, setPatternDarkMode] = useState(theme === 'dark' ? true : false);

  useEffect(() => {
    setPatternDarkMode(theme === 'dark' ? true : false);
  }, [theme]);

  useEffect(() => {
    if (image_urls.length <= 0) setIsPackage(false);
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image_urls]);

  return (
    <div className='flex flex-col gap-y-4'>
      {ableToChange && (
        <div className='flex w-full gap-x-2'>
          <button 
            className='px-3 py-1.5 w-full text-sm font-medium rounded-lg cursor-pointer bg-black hover:bg-black/70 text-white dark:hover:bg-white/70 dark:bg-white dark:text-black' 
            onClick={() => setPatternDarkMode(!patternDarkMode)}
          >
            {patternDarkMode ? 'Light' : 'Dark'} Mode
          </button>

          <button 
            className='px-3 py-1.5 w-full text-sm font-medium rounded-lg cursor-pointer bg-black hover:bg-black/70 text-white dark:hover:bg-white/70 dark:bg-white dark:text-black' 
            onClick={() => {
              setImageURLs([]);
              setIsPackage(false);
              setEmojiURL(null);
            }}
          >
            Remove All
          </button>
        </div>
      )}
      <div className='grid w-full h-full grid-cols-3 gap-4 place-content-center'>
        {image_urls.map(url => (
          <motion.div 
            className='relative flex items-center justify-center w-full h-full rounded-xl bg-tertiary min-h-[120px] group' 
            key={url} 
            style={{
              backgroundImage: `url(/${patternDarkMode ? 'transparent-pattern-dark' : 'transparent-pattern-light'}.png)`
            }} 
            layoutId={url}
          >
            <Image
              src={url}
              width={64}
              height={64}
              alt={''}
              className='w-[46px] h-[46px] sm:w-[64px] sm:h-[64px] object-contain'
            />

            {ableToChange && (
              <div className='absolute flex items-center justify-center w-full h-full transition-opacity opacity-0 bg-quaternary/80 rounded-xl group-hover:opacity-100 overflow-clip'>
                <div className='transition-all opacity-0 group-hover:opacity-100 ease-in-out duration-500 translate-y-[-100px] group-hover:translate-y-0 gap-x-2 flex'>
                  <button className='p-2 text-sm font-semibold text-white transition-all bg-black rounded-lg cursor-pointer hover:bg-black/70 dark:bg-white dark:text-black dark:hover:bg-white/70' onClick={() => setImageURLs(oldImageURLs => oldImageURLs.filter(imageURL => imageURL !== url))}>
                    <FaRegTrashAlt />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
        {new Array(9 - image_urls.length).fill(0).map((_, index) => (
          <div className='flex items-center justify-center w-full h-full rounded-xl bg-secondary min-h-[120px]' key={index}>
            <MdEmojiEmotions size={64} className='text-tertiary' />
          </div>
        ))}
      </div>
    </div>
  );
}