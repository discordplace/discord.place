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
import Script from 'next/script';
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
    <div className='flex justify-center w-full mt-32'>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async={true}
        defer={true}
      />
          
      <div className='flex flex-col max-w-[1000px] w-full mb-8 px-2 lg:px-0'>
        <div className='relative bg-secondary w-full h-[300px] rounded-xl'>
          {profile.banner && (
            <>
              <UserBanner
                id={profile.id}
                hash={profile.banner}
                className='absolute top-0 left-0 w-full h-full rounded-xl z-[1] object-cover'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                size={2048}
                width={2048}
                height={2048}
              />

              <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-secondary via-secondary/80 rounded-xl z-[2]' />
            </>
          )}

          <div className='absolute w-[calc(100%_-_2.5rem)] -bottom-14 left-10 z-[3]'>
            <UserAvatar
              id={profile.id}
              hash={profile.avatar}
              size={256}
              width={150}
              height={150}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className='bg-background border-[10px] border-[rgb(var(--bg-background))] rounded-full w-[128px] h-[128px]'
            />
          </div>

          <Actions profile={profile} />
        </div>

        <div className='flex w-full mt-[70px] px-8 lg:px-0'>
          <motion.h1 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10 }}
            className='text-3xl font-bold'
          >
            @{profile.username}
          </motion.h1>

          {profile.badges.length > 0 && (
            <div className='flex items-center ml-4 gap-x-2'>
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

        <div className='flex flex-col gap-8 px-8 mt-8 lg:flex-row lg:px-0'>
          <About profile={profile} />
          
          <div className='flex flex-col lg:w-[30%] gap-y-8'>
            <Social data={profile.socials} />
          </div>
        </div>

        {profile.dailyStats?.length > 0 && <Graph profile={profile} />}

        {profile.servers.length > 0 && <Servers profile={profile} />}
      </div>
    </div>
  );
}