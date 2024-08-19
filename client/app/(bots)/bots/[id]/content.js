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
import { t } from '@/stores/language';

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
              {t('botPage.notVerifiedInfo.description', { link: <Link target='_blank' href={config.supportInviteUrl} className='text-secondary hover:text-primary'>{t('botPage.notVerifiedInfo.linkText')}</Link> })}
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
              alt={`${bot.username}'s avatar`}
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
            className='flex items-center text-lg font-bold sm:text-3xl gap-x-2'
          >
            {bot.username}
            <span className='inline text-sm font-medium select-none text-tertiary'>#{bot.discriminator}</span>
          </motion.h1>

          {bot.badges.length > 0 && (
            <div className='flex items-center ml-4 gap-x-2'>
              {bot.badges.map(badge => (
                <Tooltip
                  key={badge}
                  content={t(`badges.${badge.toLowerCase()}`)}
                >
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
                        if (completed) return t('botPage.countdown.tripledVoteExpired');
                        
                        return t('botPage.countdown.votesTripledFor', { hours, minutes });
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
                      date={new Date(bot.standed_out.created_at).getTime() + 43200000}
                      renderer={({ completed, hours, minutes }) => {
                        if (completed) return t('botPage.countdown.standedOutExpired');
                        
                        return t('botPage.countdown.standedOutFor', { hours, minutes });
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