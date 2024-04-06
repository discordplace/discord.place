import { useNewspaperStore } from '@/stores/newspaper';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useLockBodyScroll, useClickAway } from 'react-use';
import { IoCloseSharp } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function OpenSourceAnnouncement() {
  const isOpen = useNewspaperStore(state => state.isOpen);
  const setIsOpen = useNewspaperStore(state => state.setIsOpen);

  useEffect(() => {
    setIsOpen(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLockBodyScroll(isOpen);

  const contentRef = useRef(null);
  useClickAway(contentRef, () => setIsOpen(false));  

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed top-0 left-0 w-full h-full z-[100001] bg-background/70 backdrop-blur-sm'
        >
          <motion.div
            initial={{ translateY: 400, scale: 0.9, opacity: 0 }}
            animate={{ translateY: 0, scale: 1, opacity: 1 }}
            exit={{ translateY: 400, scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className='flex items-center justify-center w-full h-full px-4 sm:px-0'
          >
            <div className='relative bg-secondary w-[600px] h-max rounded-md flex flex-col' ref={contentRef}>
              <Image
                src='/newspaper/open-source.png'
                width={600}
                height={450}
                className='rounded-t-md w-full h-[200px] object-cover'
                alt='Open Source Announcement Banner'
              />

              <div className='absolute right-4 top-4' onClick={() => setIsOpen(false)}>
                <button className='p-1 text-white rounded-full bg-black/20 hover:bg-black/40'>
                  <IoCloseSharp size={20} />
                </button>
              </div>

              <div className='flex flex-col items-center justify-center w-full px-2 my-12 sm:px-8 gap-y-2'>
                <h1 className='text-xl font-bold text-center sm:text-2xl text-primary'>discord.place Goes Open Source on GitHub!</h1>
                
                <p className='text-xs text-center sm:text-sm text-secondary'>
                  We{'\''}re thrilled to announce that the discord.place codebase is now open source on GitHub! Join us in our journey of transparency, collaboration, and innovation. Explore, contribute, and learn with us!
                </p>

                <Link 
                  className='px-3 py-1 mt-2.5 text-sm font-semibold dark:text-black text-white dark:bg-white bg-black rounded-lg hover:bg-black/70 dark:hover:bg-white/70'
                  href='https://github.com/discordplace/discord.place'
                  target='_blank'
                >
                  GitHub Repository
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
  /*
  return (
    <div className={cn(
      'fixed top-0 left-0 w-full h-full z-[100001] bg-background/70 backdrop-blur-sm transition-all duration-500',
      !isOpen && 'pointer-events-none opacity-0'
    )}>
      <div className={cn(
        'flex items-center justify-center w-full h-full transition-all duration-500',
        isOpen ? 'translate-y-[0px] opacity-100' : 'translate-y-[250px] opacity-0'
      )}>
        <div className='relative bg-tertiary w-[600px] h-max rounded-md flex flex-col'>
          <Image
            src='/newspaper/open-source.png'
            width={600}
            height={450}
            className='rounded-t-md w-full h-[250px] object-cover'
            alt='Open Source Announcement Banner'
          />

          <div className='absolute right-4 top-4' onClick={() => setIsOpen(false)}>
            <button className='p-1 text-black rounded-full bg-white/20'>
              <IoCloseSharp size={20} />
            </button>
          </div>

          <div className='flex flex-col items-center justify-center w-full px-8 my-12 gap-y-2'>
            <h1 className='text-2xl font-bold text-center text-primary'>discord.place is now open source!</h1>
            
            <p className='text-sm font-medium text-center text-secondary'>
              We have open sourced our codebase on GitHub. Feel free to contribute to our project. We are looking forward to your contributions.
            </p>

            <button className='px-3 py-1 mt-2.5 text-sm font-semibold dark:text-black text-white dark:bg-white bg-black rounded-lg hover:bg-black/70 dark:hover:bg-white/70'>
              GitHub Repository
            </button>
          </div>
        </div>
      </div>
    </div>
  );*/
}