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
    <div className="z-0 relative flex flex-col pt-[14rem] items-center px-6 mobile:px-12 lg:px-0">
      <Square column='10' row='10' transparentEffectDirection='bottomToTop' blockColor='rgba(var(--bg-secondary))' />

      <div className='absolute top-[-15%] max-w-[800px] w-full h-[300px] rounded-[5rem] bg-[#ffffff10] blur-[15rem]' />

      <div className='flex flex-col items-center w-full max-w-5xl sm:items-start'>
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
            className='absolute hidden sm:block -top-2 -right-8 -rotate-12'
          />
        </motion.h1>

        <motion.span className="sm:text-left text-center sm:text-lg max-w-[700px] mt-8 text-tertiary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sequenceTransition, delay: 0.2 }}>
          {t('blogsPage.subtitle')}
        </motion.span>

        <motion.div
          className='flex flex-wrap items-center w-full gap-2 mt-24 lg:border-b-2 lg:gap-x-6 lg:border-b-primary'
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
                    className='hidden lg:block absolute -bottom-0.5 left-0 w-full h-[2px] bg-black dark:bg-white'
                  />
                )}
              </button>
            ))}
        </motion.div>

        <motion.div
          className='flex flex-wrap w-full gap-12 mt-12 mb-24'
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