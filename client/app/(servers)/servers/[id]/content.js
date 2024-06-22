'use client';

import MotionImage from '@/app/components/Motion/Image';
import { motion } from 'framer-motion';
import About from '@/app/(servers)/servers/[id]/components/sections/About';
import RightSide from '@/app/(servers)/servers/[id]/components/sections/RightSide';
import Tabs from '@/app/(servers)/servers/[id]/components/Tabs';
import Tooltip from '@/app/components/Tooltip';
import ServerIcon from '@/app/(servers)/servers/components/ServerIcon';
import Script from 'next/script';
import { forwardRef } from 'react';
import cn from '@/lib/cn';
import useThemeStore from '@/stores/theme';
import Countdown from '@/app/components/Countdown';

export default function Content({ server }) {
  const theme = useThemeStore(state => state.theme);

  // eslint-disable-next-line react/display-name
  const ForwardedServerIcon = forwardRef((props, ref) => (
    <ServerIcon {...props} ref={ref} />
  ));
  const MotionServerIcon = motion(ForwardedServerIcon);

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
            <MotionServerIcon
              icon_url={server.icon_url}
              name={server.name}
              width={150}
              height={150}
              className={cn(
                server.icon_url ? 'bg-background' : '[&>h2]:text-[3rem]',
                'border-[10px] border-[rgb(var(--bg-background))] rounded-3xl w-[128px] h-[128px]'
              )}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
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
                <Tooltip key={badge} content={badge}>
                  <MotionImage 
                    src={`/profile-badges/${theme === 'dark' ? 'white' : 'black'}_${badge.toLowerCase()}.svg`} 
                    width={24} 
                    height={24} 
                    alt={`${badge} Badge`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  />
                </Tooltip>
              ))}

              {server.vote_triple_enabled?.created_at && (
                <Tooltip content={
                  <>
                    <Countdown
                      date={new Date(server.vote_triple_enabled.created_at).getTime() + 86400000}
                      renderer={({ completed, hours, minutes }) => {
                        if (completed) return 'Votes tripled expired!';
                        
                        return `Votes tripled for ${hours} hours, ${minutes} minutes!`;
                      }}
                    />
                  </>
                }>
                  <MotionImage 
                    src={`/profile-badges/${theme === 'dark' ? 'white' : 'black'}_votes_tripled.svg`} 
                    width={24} 
                    height={24} 
                    alt={'Votes Tripled Badge'}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  />
                </Tooltip>       
              )}

              {server.standed_out?.created_at && (
                <Tooltip content={
                  <>
                    <Countdown
                      date={new Date(server.standed_out.created_at).getTime() + 86400000}
                      renderer={({ completed, hours, minutes }) => {
                        if (completed) return 'Standed out expired!';
                        
                        return `Standed out for ${hours} hours, ${minutes} minutes!`;
                      }}
                    />
                  </>
                }>
                  <MotionImage 
                    src={`/profile-badges/${theme === 'dark' ? 'white' : 'black'}_standed_out.svg`} 
                    width={24} 
                    height={24} 
                    alt={'Standed Out Badge'}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  />
                </Tooltip>       
              )}
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