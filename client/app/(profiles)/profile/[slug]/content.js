'use client';

import MotionImage from '@/app/components/Motion/Image';
import { motion } from 'framer-motion';
import Social from '@/app/(profiles)/profile/[slug]/components/sections/Social';
import About from '@/app/(profiles)/profile/[slug]/components/sections/About';
import Actions from '@/app/(profiles)/profile/[slug]/components/sections/Actions';
import incrementViews from '@/lib/request/profiles/incrementViews';
import Tooltip from '@/app/components/Tooltip';
import { useEffect } from 'react';
import Servers from '@/app/(profiles)/profile/[slug]/components/sections/Servers';
import Graph from '@/app/(profiles)/profile/[slug]/components/sections/Graph';
import useThemeStore from '@/stores/theme';
import UserBanner from '@/app/components/ImageFromHash/UserBanner';
import UserAvatar from '@/app/components/ImageFromHash/UserAvatar';
import useLanguageStore, { t } from '@/stores/language';

export default function Content({ profile }) {
  const theme = useThemeStore(state => state.theme);
  const language = useLanguageStore(state => state.language);

  useEffect(() => {
    incrementViews(profile.slug);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='mt-32 flex w-full justify-center'>
      <div className='mb-8 flex w-full max-w-[1000px] flex-col px-2 lg:px-0'>
        <div className='relative h-[300px] w-full rounded-xl bg-secondary'>
          {profile.banner && (
            <>
              <UserBanner
                id={profile.id}
                hash={profile.banner}
                className='absolute left-0 top-0 z-[1] size-full rounded-xl object-cover'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                size={2048}
                width={2048}
                height={2048}
              />

              <div className='absolute left-0 top-0 z-[2] size-full rounded-xl bg-gradient-to-b from-transparent via-secondary/80 to-secondary' />
            </>
          )}

          <div className='absolute -bottom-14 left-10 z-[3] w-[calc(100%_-_2.5rem)]'>
            <UserAvatar
              id={profile.id}
              hash={profile.avatar}
              size={256}
              width={150}
              height={150}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className='size-[128px] rounded-full border-[10px] border-[rgb(var(--bg-background))] bg-background'
            />
          </div>

          <Actions profile={profile} />
        </div>

        <div className='mt-[70px] flex w-full px-8 lg:px-0'>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10 }}
            className='text-3xl font-bold'
          >
            @{profile.username}
          </motion.h1>

          {profile.badges.length > 0 && (
            <div className='ml-4 flex items-center gap-x-2'>
              {profile.badges.map(badgeId => (
                <Tooltip
                  content={t(`badges.${badgeId}`, {
                    premiumSince: profile.subscriptionCreatedAt,
                    lng: language,
                    formatParams: {
                      premiumSince: { year: 'numeric', month: 'long', day: 'numeric' }
                    }
                  })}
                  key={badgeId}
                >
                  <MotionImage
                    src={`/profile-badges/${theme === 'dark' ? 'white' : 'black'}_${badgeId}.svg`}
                    width={24}
                    height={24}
                    alt={`${badgeId} Badge`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  />
                </Tooltip>
              ))}
            </div>
          )}
        </div>

        <div className='mt-8 flex flex-col gap-8 px-8 lg:flex-row lg:px-0'>
          <About profile={profile} />

          <div className='flex flex-col gap-y-8 lg:w-[30%]'>
            <Social data={profile.socials} />
          </div>
        </div>

        <Graph profile={profile} />

        {profile.servers.length > 0 && <Servers profile={profile} />}
      </div>
    </div>
  );
}