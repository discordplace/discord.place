'use client';

import { useEffect } from 'react';
import { Bricolage_Grotesque } from 'next/font/google';import cn from '@/lib/cn';
import Square from '@/app/components/Background/Square';
import SearchInput from '@/app/(profiles)/profiles/components/Hero/Profiles/SearchInput';
import AnimatedCount from '@/app/components/AnimatedCount';
import useSearchStore from '@/stores/profiles/search';
import { motion } from 'framer-motion';

const BricolageGrotesque = Bricolage_Grotesque({ subsets: ['latin'] });

export default function Hero() {
  const fetchProfiles = useSearchStore(state => state.fetchProfiles);
  const totalProfiles = useSearchStore(state => state.totalProfiles);
  
  useEffect(() => {
    fetchProfiles('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sequenceTransition = {
    duration: 0.25,
    type: 'spring',
    stiffness: 260,
    damping: 20
  };

  return (
    <>
      <div className="z-0 relative flex flex-col pt-[14rem] items-center px-4 sm:px-0">
        <Square column='10' row='10' transparentEffectDirection='bottomToTop' blockColor='rgba(var(--bg-secondary))' />

        <div className='absolute top-[-50%] max-w-[800px] w-full h-[300px] rounded-[5rem] bg-[#ffffff10] blur-[15rem]' />

        <div className='max-w-[700px] flex flex-col w-full'>
          <motion.h1 
            className={cn(
              'text-5xl font-medium max-w-[700px] text-center text-primary',
              BricolageGrotesque.className
            )}
            initial={{ opacity: 0, y: -25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...sequenceTransition, delay: 0.1 }}
          >
            Discover the profiles
          </motion.h1>
          <motion.p className="sm:text-lg max-w-[700px] text-center mt-8 text-neutral-400" initial={{ opacity: 0, y: -25 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sequenceTransition, delay: 0.2 }}>
            Find, share and explore the customized page of Discord profiles!<br/>You have <span className='inline-flex'><AnimatedCount data={totalProfiles} /></span> profiles to explore. 
          </motion.p>

          <SearchInput />
        </div>
      </div>
    </>
  );
}