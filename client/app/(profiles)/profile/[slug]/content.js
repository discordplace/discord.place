'use client';

import MotionImage from '@/app/components/Motion/Image';
import { motion } from 'framer-motion';
import Social from '@/app/(profiles)/profile/[slug]/components/sections/Social';
import About from '@/app/(profiles)/profile/[slug]/components/sections/About';
import Actions from '@/app/(profiles)/profile/[slug]/components/sections/Actions';
import incrementViews from '@/lib/request/profiles/incrementViews';
import Tooltip from '@/app/components/Tooltip';
import { useEffect, useState, useRef } from 'react';
import Servers from '@/app/(profiles)/profile/[slug]/components/sections/Servers';
import Script from 'next/script';
import cn from '@/lib/cn';

export default function Content({ profile }) {
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [showCaptchaFrame, setShowCaptchaFrame] = useState(false); 
  const [captchaScriptLoaded, setCaptchaScriptLoaded] = useState(false);

  const captchaRef = useRef(null);
  const captchaIntervalRef = useRef(null);

  useEffect(() => {
    if (showCaptcha) {
      if (!window.turnstile) return setShowCaptcha(false);
      
      const turnstile = window.turnstile;
      turnstile?.render('.cf-turnstile');

      captchaIntervalRef.current = setInterval(() => {
        const response = turnstile?.getResponse();
        if (response) {
          setShowCaptcha(false);
          setShowCaptchaFrame(false);
          clearInterval(captchaIntervalRef.current);
          incrementViews(profile.slug, response);
        } else {
          if (!showCaptchaFrame) setShowCaptchaFrame(true);
        }
      }, 100);
    } else clearInterval(captchaIntervalRef.current);

    return () => clearInterval(captchaIntervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCaptcha]);


  useEffect(() => {
    if (!captchaScriptLoaded) return;

    setShowCaptcha(true);
  }, [captchaScriptLoaded]);

  return (
    <div className='flex justify-center w-full mt-32'>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async={true}
        defer={true}
        onLoad={() => setCaptchaScriptLoaded(true)}
      />
          
      <div className='flex flex-col max-w-[1000px] w-full mb-8 px-2 lg:px-0'>
        <div className='relative bg-secondary w-full h-[300px] rounded-xl'>
          {profile.banner_url && (
            <>
              <MotionImage
                src={profile.banner_url}
                alt={`${profile.username}'s banner`}
                className='absolute top-0 left-0 w-full h-full rounded-xl z-[1] object-cover'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                width={2048}
                height={2048}
              />

              <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-secondary via-secondary/80 rounded-xl z-[2]' />
            </>
          )}

          <div className='absolute w-[calc(100%_-_2.5rem)] -bottom-14 left-10 z-[3]'>
            <MotionImage
              src={profile.avatar_url}
              alt={`${profile.username}'s avatar`}
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
              {profile.badges.map(badge => (
                <Tooltip key={badge} content={badge}>
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
          <About profile={profile} />
          <div className='flex flex-col lg:w-[30%] gap-y-8'>
            <Social data={profile.socials} />

            <div className={cn(
              'w-full flex-col',
              showCaptchaFrame ? 'flex' : 'hidden'
            )}>
              <motion.h2 
                className='text-xl font-semibold'
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10 }}
              >
                Captcha
              </motion.h2>

              <p className='mt-2 text-sm text-tertiary'>
                Please complete the captcha. This helps us prevent abuse and keep the site secure.
              </p>

              <div 
                className={cn(
                  'cf-turnstile mt-4',
                  showCaptcha ? 'block' : 'hidden'
                )} 
                data-sitekey={process.env.NEXT_PUBLIC_CF_SITE_KEY} 
                ref={captchaRef}
              />
            </div>
          </div>
        </div>

        {profile.servers.length > 0 && <Servers profile={profile} />}
      </div>
    </div>
  );
}