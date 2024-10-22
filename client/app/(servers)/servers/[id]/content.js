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
import useLanguageStore, { t } from '@/stores/language';
import ServerBanner from '@/app/components/ImageFromHash/ServerBanner';
import ServerIcon from '@/app/components/ImageFromHash/ServerIcon';

export default function Content({ server }) {
  const theme = useThemeStore(state => state.theme);
  const language = useLanguageStore(state => state.language);

  return (
    <div className='mt-32 flex w-full justify-center'>
      <Script id='apexChart' src='https://cdn.jsdelivr.net/npm/apexcharts' />

      <div className='mb-8 flex w-full max-w-[1000px] flex-col px-2 lg:px-0'>
        <div className='relative h-[300px] w-full rounded-xl bg-secondary'>
          {server.banner && (
            <ServerBanner
              id={server.id}
              hash={server.banner}
              className='absolute left-0 top-0 z-[1] size-full rounded-xl object-cover'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              size={2048}
              width={2048}
              height={2048}
            />
          )}

          <div className='absolute -bottom-14 left-10 z-[3] w-[calc(100%_-_2.5rem)]'>
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

        <div className='mt-[70px] flex w-full px-8 lg:px-0'>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10 }}
            className='text-3xl font-bold'
          >
            {server.name}
          </motion.h1>

          <div className='ml-4 flex items-center gap-x-2'>
            {server.badges.length > 0 && (
              server.badges.map(badge => (
                <Tooltip
                  key={badge}
                  content={t(`badges.${badge.toLowerCase()}`, {
                    premiumSince: server.ownerSubscriptionCreatedAt,
                    lng: language,
                    formatParams: {
                      premiumSince: { year: 'numeric', month: 'long', day: 'numeric' }
                    }
                  })}
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
              ))
            )}

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
        </div>

        <div className='mt-8 flex flex-col gap-8 px-8 lg:flex-row lg:px-0'>
          <About server={server} />
          <RightSide server={server} />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10, delay: .8 }}
        >
          <Tabs server={server} />
        </motion.div>
      </div>
    </div>
  );
}