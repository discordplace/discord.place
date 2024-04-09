'use client';

import MotionImage from '@/app/components/Motion/Image';
import { motion } from 'framer-motion';
import About from '@/app/(servers)/servers/[id]/components/sections/About';
import RightSide from '@/app/(servers)/servers/[id]/components/sections/RightSide';
import Tabs from '@/app/(servers)/servers/[id]/components/Tabs';
import Tooltip from '@/app/components/Tooltip';
import { nanoid } from 'nanoid';
import Script from 'next/script';

export default function Content({ server }) {
  return (
    <div className='flex justify-center w-full mt-32'>
      <Script id='apexChart' src='https://cdn.jsdelivr.net/npm/apexcharts' />
      
      <div className='flex flex-col max-w-[1000px] w-full mb-8 px-2 lg:px-0'>
        <div className='relative bg-secondary w-full h-[300px] rounded-xl'>
          {server.banner_url && (
            <MotionImage
              src={server.banner_url}
              alt={`Guild ${server.name}'s banner`}
              className='absolute top-0 left-0 w-full h-full rounded-xl z-[1] object-cover'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              width={2048}
              height={2048}
            />
          )}

          <div className='absolute w-[calc(100%_-_2.5rem)] -bottom-14 left-10 z-[3]'>
            <MotionImage
              src={server.icon_url || 'https://cdn.discordapp.com/embed/avatars/0.png'}
              alt={`Guild ${server.name}'s icon`}
              width={150}
              height={150}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className='bg-background border-[10px] border-[rgb(var(--bg-background))] rounded-3xl w-[128px] h-[128px]'
            />
          </div>
        </div>

        <div className='flex w-full mt-[70px] px-8 lg:px-0'>
          <motion.h1 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10 }}
            className='text-3xl font-bold'
          >
            {server.name}
          </motion.h1>

          {server.badges.length > 0 && (
            <div className='flex items-center ml-4 gap-x-2'>
              {server.badges.map(badge => (
                <Tooltip key={nanoid()} content={badge}>
                  <MotionImage 
                    src={`/profile-badges/${badge.toLowerCase()}.svg`} 
                    width={24} 
                    height={24} 
                    alt={`${badge} Badge`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  />
                </Tooltip>
              ))}
            </div>
          )}
        </div>

        <div className='flex flex-col gap-8 px-8 mt-8 lg:flex-row lg:px-0'>
          <About server={server} />
          <RightSide server={server} />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10, delay:  .8 }}
        >
          <Tabs server={server} />
        </motion.div>
      </div>
    </div>
  );
}