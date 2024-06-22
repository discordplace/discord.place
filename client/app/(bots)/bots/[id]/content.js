'use client';

import MotionImage from '@/app/components/Motion/Image';
import { motion } from 'framer-motion';
import About from '@/app/(bots)/bots/[id]/components/sections/About';
import RightSide from '@/app/(bots)/bots/[id]/components/sections/RightSide';
import Tooltip from '@/app/components/Tooltip';
import Tabs from '@/app/(bots)/bots/[id]/components/Tabs';
import { RiErrorWarningFill } from 'react-icons/ri';
import Link from 'next/link';
import config from '@/config';
import useThemeStore from '@/stores/theme';
import Countdown from '@/app/components/Countdown';

export default function Content({ bot }) {
  const theme = useThemeStore(state => state.theme);

  return (
    <div className='flex justify-center w-full mt-32'>      
      <div className='flex flex-col max-w-[1000px] w-full mb-8 px-2 lg:px-0'>
        {!bot.verified && (
          <div className='flex flex-col p-4 mb-4 border border-yellow-500 gap-y-2 bg-yellow-500/10 rounded-xl'>
            <h1 className='text-lg text-primary flex items-center font-semibold gap-x-1.5'>
              <RiErrorWarningFill />
              Beep beep!
            </h1>
            <p className='text-sm font-medium text-tertiary'>
              For the moment, only you can see the bot. Once the bot is verified, it will become public. Until then, you can come to <Link target='_blank' href={config.supportInviteUrl} className='text-secondary hover:text-primary'>our support server</Link> and get a notification from our bot when your bot is approved. Make sure you open your DMs.
            </p>
          </div>
        )}

        <div className='relative bg-secondary w-full h-[300px] rounded-xl'>
          {bot.banner_url && (
            <MotionImage
              src={bot.banner_url}
              alt={`${bot.username}'s banner`}
              className='absolute top-0 left-0 w-full h-full rounded-xl z-[1] object-cover'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              width={2048}
              height={2048}
            />
          )}

          <div className='absolute w-[calc(100%_-_2.5rem)] -bottom-14 left-10 z-[3]'>
            <MotionImage
              src={bot.avatar_url || 'https://cdn.discordapp.com/embed/avatars/0.png'}
              alt={`${bot.username}'s icon`}
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
            className='flex items-center text-3xl font-bold gap-x-2'
          >
            {bot.username}
            <span className='text-sm font-medium select-none text-tertiary'>#{bot.discriminator}</span>
          </motion.h1>

          {bot.badges.length > 0 && (
            <div className='flex items-center ml-4 gap-x-2'>
              {bot.badges.map(badge => (
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
              
              {bot.vote_triple_enabled?.created_at && (
                <Tooltip content={
                  <>
                    <Countdown
                      date={new Date(bot.vote_triple_enabled.created_at).getTime() + 86400000}
                      renderer={({ completed, hours, minutes }) => {
                        if (completed) return 'Votes tripled ended!';
                        
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

              {bot.standed_out?.created_at && (
                <Tooltip content={
                  <>
                    <Countdown
                      date={new Date(bot.standed_out.created_at).getTime() + 86400000}
                      renderer={({ completed, hours, minutes }) => {
                        if (completed) return 'Standed out ended!';
                        
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
          <About bot={bot} />
          <RightSide bot={bot} />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10, delay:  .8 }}
        >
          <Tabs bot={bot} />
        </motion.div>
      </div>
    </div>
  );
}