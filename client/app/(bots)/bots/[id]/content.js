'use client';

import About from '@/app/(bots)/bots/[id]/components/sections/About';
import RightSide from '@/app/(bots)/bots/[id]/components/sections/RightSide';
import Tabs from '@/app/(bots)/bots/[id]/components/Tabs';
import Countdown from '@/app/components/Countdown';
import UserAvatar from '@/app/components/ImageFromHash/UserAvatar';
import UserBanner from '@/app/components/ImageFromHash/UserBanner';
import MotionImage from '@/app/components/Motion/Image';
import Tooltip from '@/app/components/Tooltip';
import config from '@/config';
import useLanguageStore, { t } from '@/stores/language';
import useThemeStore from '@/stores/theme';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { RiErrorWarningFill } from 'react-icons/ri';

export default function Content({ bot }) {
  const theme = useThemeStore(state => state.theme);
  const language = useLanguageStore(state => state.language);

  return (
    <div className='mt-32 flex w-full justify-center'>
      <div className='mb-8 flex w-full max-w-[1000px] flex-col px-2 lg:px-0'>
        {!bot.verified && (
          <div className='mb-4 flex flex-col gap-y-2 rounded-xl border border-yellow-500 bg-yellow-500/10 p-4'>
            <h1 className='flex items-center gap-x-1.5 text-lg font-semibold text-primary'>
              <RiErrorWarningFill />
              Beep beep!
            </h1>

            <p className='text-sm font-medium text-tertiary'>
              {t('botPage.notVerifiedInfo.description', { link: <Link className='text-secondary hover:text-primary' href={config.supportInviteUrl} target='_blank'>{t('botPage.notVerifiedInfo.linkText')}</Link> })}
            </p>
          </div>
        )}

        <div className='relative h-[300px] w-full rounded-xl bg-secondary'>
          {bot.banner && (
            <UserBanner
              animate={{ opacity: 1 }}
              className='absolute left-0 top-0 z-[1] size-full rounded-xl object-cover'
              hash={bot.banner}
              height={2048}
              id={bot.id}
              initial={{ opacity: 0 }}
              size={2048}
              width={2048}
            />
          )}

          <div className='absolute -bottom-14 left-10 z-[3] w-[calc(100%_-_2.5rem)]'>
            <UserAvatar
              animate={{ opacity: 1, y: 0 }}
              className='size-[128px] rounded-3xl border-[10px] border-[rgb(var(--bg-background))] bg-background'
              hash={bot.avatar}
              height={150}
              id={bot.id}
              initial={{ opacity: 0, y: 20 }}
              size={256}
              width={150}
            />
          </div>
        </div>

        <div className='mt-[70px] flex w-full px-8 lg:px-0'>
          <motion.h1
            animate={{ opacity: 1 }}
            className='flex items-center gap-x-2 text-lg font-bold sm:text-3xl'
            initial={{ opacity: 0 }}
            transition={{ damping: 10, duration: 0.3, stiffness: 100, type: 'spring' }}
          >
            {bot.username}

            <span className='inline select-none text-sm font-medium text-tertiary'>
              #{bot.discriminator}
            </span>
          </motion.h1>

          {bot.badges.length > 0 && (
            <div className='ml-4 flex items-center gap-x-2'>
              {bot.badges.map(badgeName => (
                <Tooltip
                  content={t(`badges.${badgeName.toLowerCase()}`, {
                    formatParams: {
                      premiumSince: { day: 'numeric', month: 'long', year: 'numeric' }
                    },
                    lng: language,
                    premiumSince: bot.owner.subscriptionCreatedAt
                  })}
                  key={badgeName}
                >
                  <MotionImage
                    alt={`${badgeName} Badge`}
                    animate={{ opacity: 1, y: 0 }}
                    height={24}
                    initial={{ opacity: 0, y: 20 }}
                    src={`/profile-badges/${theme === 'dark' ? 'white' : 'black'}_${badgeName.toLowerCase()}.svg`}
                    width={24}
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
                    alt={'Votes Tripled Badge'}
                    animate={{ opacity: 1, y: 0 }}
                    height={24}
                    initial={{ opacity: 0, y: 20 }}
                    src={`/profile-badges/${theme === 'dark' ? 'white' : 'black'}_votes_tripled.svg`}
                    width={24}
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
                    alt={'Standed Out Badge'}
                    animate={{ opacity: 1, y: 0 }}
                    height={24}
                    initial={{ opacity: 0, y: 20 }}
                    src={`/profile-badges/${theme === 'dark' ? 'white' : 'black'}_standed_out.svg`}
                    width={24}
                  />
                </Tooltip>
              )}
            </div>
          )}
        </div>

        <div className='mt-8 flex flex-col gap-8 px-8 lg:flex-row lg:px-0'>
          <About bot={bot} />
          <RightSide bot={bot} />
        </div>

        <motion.div
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          transition={{ damping: 10, delay: .8, duration: 0.3, stiffness: 100, type: 'spring' }}
        >
          <Tabs bot={bot} />
        </motion.div>
      </div>
    </div>
  );
}