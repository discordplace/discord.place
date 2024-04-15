'use client';

import cn from '@/lib/cn';
import { motion } from 'framer-motion';
import { nanoid } from 'nanoid';
import { Source_Serif_4 } from 'next/font/google';
import MotionLink from '@/app/components/Motion/Link';
import Square from './components/Background/Square';
import { CgProfile } from 'react-icons/cg';
import { IoPeople } from 'react-icons/io5';
import { RiRobot2Fill } from 'react-icons/ri';
import { MdEmojiEmotions } from 'react-icons/md';
import { MdArrowForward } from 'react-icons/md';

const SourceSerif4 = Source_Serif_4({ subsets: ['latin'] });

export default function Page() {
  const links = [
    {
      label: 'Profiles',
      href: '/profiles',
      icon: CgProfile,
      description: 'Find, share and explore the customized page of Discord profiles! Tons of users are sharing their profiles, and you can too!',
      color: '#3b82f6',
    },
    {
      label: 'Servers',
      href: '/servers',
      icon: IoPeople,
      description: 'Find, share and explore the best servers and communities on Discord! There are tons of servers to join and explore!',
      color: '#7c3aed'
    },
    {
      label: 'Bots',
      href: '#',
      icon: RiRobot2Fill,
      description: 'Find, share and explore the best bots on Discord! There are tons of bots to add to your server and explore!',
      color: '#db2777'
    },
    {
      label: 'Emojis',
      href: '/emojis',
      icon: MdEmojiEmotions,
      description: 'Explore, find and download the perfect emoji for your Discord server! There are tons of emojis to add to your server!',
      color: '#14b8a6'
    }
  ];

  return (
    <div className="relative z-10 flex flex-col items-center justify-center w-full sm:h-[100dvh] my-8 sm:my-0">      
      <Square column='10' row='10' transparentEffectDirection='bottomToTop' blockColor='rgba(var(--bg-secondary))' />
      
      <h1 className={cn(
        'animated-h1 mt-32 select-none sm:mt-10',
        SourceSerif4.className
      )}>
        discord.place
      </h1>

      <motion.p
        className='px-4 sm:px-0 text-sm sm:text-base mt-4 max-w-[500px] text-tertiary text-center'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5, type: 'spring', stiffness: 100, damping: 20 }}
      >
        All things related to Discord in one place. Find the best bots, servers, and communities.
      </motion.p>

      <div className='grid grid-cols-1 grid-rows-1 gap-8 mt-12 select-none sm:grid-cols-2 lg:grid-cols-4'>
        {links.map((link, index) => (
          <MotionLink 
            className={cn(
              'group w-[250px] h-[200px] bg-secondary hover:bg-tertiary rounded-xl p-4 flex flex-col relative',
              link.href === '#' && 'pointer-events-none'
            )} 
            key={nanoid()} 
            href={link.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.35 + (.15 * index), duration: 0.5, type: 'spring', damping: 10, stiffness: 150 }}
          >
            <div className='flex items-center gap-x-4'>
              <div className='p-2.5 rounded-lg w-max' style={{
                borderColor: link.color,
                backgroundColor: `${link.color}20`,
                color: link.color
              }}>
                <link.icon size={24} />
              </div>

              <h2 className='text-xl font-bold text-primary'>{link.label}</h2>
            </div>

            <p className='mt-4 text-sm font-medium text-tertiary/70'>
              {link.description}
            </p>

            {link.href === '#' ? (
              <div className='absolute top-0 left-0 flex items-center justify-center w-full h-full text-xl font-bold rounded-xl bg-tertiary/50'>
                Coming Soon
              </div>
            ) : (
              <div className='absolute top-0 left-0 items-center justify-center hidden w-full h-full overflow-hidden text-xl font-bold transition-opacity duration-500 opacity-0 sm:flex group-hover:opacity-100 rounded-xl bg-tertiary/50'>
                <div className='flex items-center transition-transform duration-500 translate-y-full group-hover:translate-y-0 gap-x-2'>
                  Explore
                  <MdArrowForward />
                </div>
              </div>
            )}
          </MotionLink>
        ))}
      </div>
    </div>
  );
}