'use client';

import Square from '@/app/components/Background/Square';
import cn from '@/lib/cn';
import useThemeStore from '@/stores/theme';
import { motion } from 'framer-motion';
import { Bricolage_Grotesque } from 'next/font/google';
import Image from 'next/image';
import Card from '@/app/(blogs)/blogs/Hero/Card';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import fetchBlogs from '@/lib/request/fetchBlogs';
import { t } from '@/stores/language';

const BricolageGrotesque = Bricolage_Grotesque({ subsets: ['latin'], display: 'swap', adjustFontFallback: false });

export default function Hero() {
  const sequenceTransition = {
    duration: 0.25,
    type: 'spring',
    stiffness: 260,
    damping: 20
  };

  const theme = useThemeStore(state => state.theme);

  const [activeTag, setActiveTag] = useState('All');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchBlogs()
      .then(data => setData(data))
      .catch(toast.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className='relative z-0 flex flex-col items-center px-6 pt-56 mobile:px-12 lg:px-0'>
      <Square column='10' row='10' transparentEffectDirection='bottomToTop' blockColor='rgba(var(--bg-secondary))' />

      <div className='absolute top-[-15%] h-[300px] w-full max-w-[800px] rounded-[5rem] bg-[#ffffff10] blur-[15rem]' />

      <div className='flex w-full max-w-5xl flex-col items-center sm:items-start'>
        <motion.h1
          className={cn(
            'text-5xl relative font-medium max-w-[800px] text-center text-primary',
            BricolageGrotesque.className
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...sequenceTransition, delay: 0.1 }}
        >
          {t('blogsPage.title')}

          <Image
            src={`/sketch/${theme === 'dark' ? 'white' : 'black'}_line.svg`}
            alt=''
            width={32}
            height={5}
            className='absolute -right-8 -top-2 hidden -rotate-12 sm:block'
          />
        </motion.h1>

        <motion.span className='mt-8 max-w-[700px] text-center text-tertiary sm:text-left sm:text-lg' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sequenceTransition, delay: 0.2 }}>
          {t('blogsPage.subtitle')}
        </motion.span>

        <motion.div
          className='mt-24 flex w-full flex-wrap items-center gap-2 lg:gap-x-6 lg:border-b-2 lg:border-b-primary'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...sequenceTransition, delay: 0.3 }}
        >
          {['All', ...new Set(data.map(data => data.tags).flat())]
            .sort((a, b) => b === 'All' ? 1 : a.localeCompare(b))
            .map(tag => (
              <button
                key={tag}
                className={cn(
                  'bg-secondary border border-primary lg:border-none rounded-full px-3 py-1.5 lg:pt-0 lg:px-0 lg:bg-[unset] relative select-none lg:pb-4 font-medium cursor-pointer text-tertiary outline-none',
                  tag === activeTag ? 'text-primary select-none pointer-events-none' : 'hover:text-secondary active:text-primary'
                )}
                onClick={() => setActiveTag(tag)}
              >
                {tag === 'All' ? t('buttons.all') : tag}

                {tag === activeTag && (
                  <motion.div
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    layoutId='blogActiveTagIndicator'
                    className='absolute -bottom-0.5 left-0 hidden h-[2px] w-full bg-black dark:bg-white lg:block'
                  />
                )}
              </button>
            ))}
        </motion.div>

        <motion.div
          className='mb-24 mt-12 flex w-full flex-wrap gap-12'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...sequenceTransition, delay: 0.4 }}
        >
          {loading ? (
            new Array(3).fill().map((_, index) => (
              <Card key={index} loading />
            ))
          ) : (
            data
              .filter(data => activeTag === 'All' || data.tags.includes(activeTag))
              .sort((a, b) => b.date - a.date)
              .map(data => (
                <Card
                  key={data.id}
                  data={data}
                />
              ))
          )}
        </motion.div>
      </div>
    </div>
  );
}