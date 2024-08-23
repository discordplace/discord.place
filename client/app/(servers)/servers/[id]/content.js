'use client';

import MotionImage from '@/app/components/Motion/Image';
import { motion } from 'framer-motion';
import About from '@/app/(servers)/servers/[id]/components/sections/About';
import RightSide from '@/app/(servers)/servers/[id]/components/sections/RightSide';
import Tabs from '@/app/(servers)/servers/[id]/components/Tabs';
import Tooltip from '@/app/components/Tooltip';
import Script from 'next/script';
import cn from '@/lib/cn';
import useThemeStore from '@/stores/theme';
import Countdown from '@/app/components/Countdown';
import { t } from '@/stores/language';
import ServerBanner from '@/app/components/ImageFromHash/ServerBanner';
import ServerIcon from '@/app/components/ImageFromHash/ServerIcon';

export default function Content({ server }) {
  const theme = useThemeStore(state => state.theme);

  return (
    <div className='flex justify-center w-full mt-32'>
      <Script id='apexChart' src='https://cdn.jsdelivr.net/npm/apexcharts' />
      
      <div className='flex flex-col max-w-[1000px] w-full mb-8 px-2 lg:px-0'>
        <div className='relative bg-secondary w-full h-[300px] rounded-xl'>
          {server.banner && (
            <ServerBanner
              id={server.id}
              hash={server.banner}
              className='absolute top-0 left-0 w-full h-full rounded-xl z-[1] object-cover'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              size={2048}
              width={2048}
              height={2048}
            />
          )}

          <div className='absolute w-[calc(100%_-_2.5rem)] -bottom-14 left-10 z-[3]'>
            <ServerIcon
              id={server.id}
              hash={server.icon}
              size={256}
              width={150}
              height={150}
              className={cn(
                'border-[10px] border-[rgb(var(--bg-background))] rounded-3xl w-[128px] h-[128px]',
                server.icon && 'bg-background'
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
                        if (completed) return t('serverPage.countdown.tripledVoteExpired');

                        return t('serverPage.countdown.votesTripledFor', { hours, minutes });
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
                      date={new Date(server.standed_out.created_at).getTime() + 43200000}
                      renderer={({ completed, hours, minutes }) => {
                        if (completed) return t('serverPage.countdown.standedOutExpired');

                        return t('serverPage.countdown.standedOutFor', { hours, minutes });
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