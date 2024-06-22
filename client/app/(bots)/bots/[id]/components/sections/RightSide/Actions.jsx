'use client';

import CopyButton from '@/app/components/CopyButton';
import MotionLink from '@/app/components/Motion/Link';
import { AnimatePresence, motion } from 'framer-motion';
import { BiPencil, BiSolidEnvelope } from 'react-icons/bi';
import { PiShareFat, PiShareFatFill } from 'react-icons/pi';
import { MdFlag } from 'react-icons/md';
import config from '@/config';
import { TbLoader, TbSquareRoundedChevronUpFilled, TbSquareRoundedChevronUp } from 'react-icons/tb';
import useAuthStore from '@/stores/auth';
import cn from '@/lib/cn';
import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import voteBot from '@/lib/request/bots/voteBot';
import VoteCountdown from '@/app/components/Countdown/Vote';
import revalidateBot from '@/lib/revalidate/bot';
import useThemeStore from '@/stores/theme';
import { BsFire } from 'react-icons/bs';
import createTripledVotesCheckout from '@/lib/request/bots/createTripledVotesCheckout';
import createStandedOutCheckout from '@/lib/request/bots/createStandedOutCheckout';
import { useRouter } from 'next-nprogress-bar';
import { AiOutlineRise } from 'react-icons/ai';

export default function Actions({ bot }) {
  const theme = useThemeStore(state => state.theme);
  const [voteTimeout, setVoteTimeout] = useState(bot.vote_timeout);
  const loggedIn = useAuthStore(state => state.loggedIn);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [buyTripledVotesLoading, setBuyTripledVotesLoading] = useState(false);
  const [buyStandedOutLoading, setBuyStandedOutLoading] = useState(false);
  const router = useRouter();

  const formatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short'
  });

  const captchaRef = useRef(null);
  const captchaIntervalRef = useRef(null);

  useEffect(() => {
    if (showCaptcha) {
      if (!window.turnstile) return setShowCaptcha(false);
      
      setLoading(true);
      const turnstile = window.turnstile;
      turnstile?.render('.cf-turnstile');

      captchaIntervalRef.current = setInterval(() => {
        const response = turnstile?.getResponse();
        if (response) {
          setShowCaptcha(false);
          clearInterval(captchaIntervalRef.current);

          toast.promise(voteBot(bot.id, response), {
            loading: `Voting ${bot.username}..`,
            success: () => {
              setLoading(false);
              setVoteTimeout({ createdAt: new Date().getTime() + 86400000 });
              revalidateBot(bot.id);

              return `Successfully voted for ${bot.username}!`;
            },
            error: error => {
              setLoading(false);
              return error;
            }
          });
        }
      }, 100);
    } else clearInterval(captchaIntervalRef.current);

    return () => clearInterval(captchaIntervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCaptcha]);

  function buyTripledVotes() {
    setBuyTripledVotesLoading(true);

    toast.promise(createTripledVotesCheckout(bot.id), {
      loading: 'We are creating a checkout for you..',
      success: data => {        
        setTimeout(() => router.push(data.url), 3000);

        return 'Checkout created! Redirecting you to the payment page in few seconds..';
      },
      error: error => {
        setBuyTripledVotesLoading(false);
        
        return error;
      }
    });
  }

  function buyStandedOut() {
    setBuyStandedOutLoading(true);

    toast.promise(createStandedOutCheckout(bot.id), {
      loading: 'We are creating a checkout for you..',
      success: data => {        
        setTimeout(() => router.push(data.url), 3000);

        return 'Checkout created! Redirecting you to the payment page in few seconds..';
      },
      error: error => {
        setBuyStandedOutLoading(false);
        
        return error;
      }
    });
  }

  return (
    <div>
      <motion.h2 
        className='text-xl font-semibold' 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10 }}
      >
        Actions
      </motion.h2>

      <motion.div 
        className='grid grid-cols-1 gap-2 mt-4 mobile:grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-col'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10, delay: .15 }}
      >
        {loggedIn && (
          <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js"
            async={true}
            defer={true}
          />
        )}
        
        <AnimatePresence>
          {showCaptcha && (
            <motion.div 
              className="cf-turnstile [&>iframe]:max-w-[100%]" 
              data-sitekey={process.env.NEXT_PUBLIC_CF_SITE_KEY} 
              ref={captchaRef} 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              data-theme={theme === 'dark' ? 'dark' : 'light'}
            />
          )}
        </AnimatePresence>

        <motion.button 
          className={cn(
            'flex items-center justify-between w-full px-3 py-2 text-sm font-semibold text-white bg-black rounded-lg group gap-x-2 hover:bg-black/70 dark:bg-white dark:text-black dark:hover:bg-white/70',
            (loading || voteTimeout) && 'cursor-default !opacity-70 hover:bg-black dark:hover:bg-white'
          )}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10 }}
          onClick={() => {
            if (!loggedIn) return toast.error('You need to be logged in to vote for a bot.');
            if (voteTimeout) return;
            
            setShowCaptcha(true);
          }}
        >
          <div className='flex gap-x-1.5 items-center'>
            {loading && <TbLoader className='animate-spin' />}
            {voteTimeout ? (
              <VoteCountdown date={new Date(voteTimeout.createdAt).getTime() + 86400000} />
            ) : 'Vote'}
          </div>

          <div className='flex items-center font-bold gap-x-1'>
            <div className='relative'>
              <TbSquareRoundedChevronUpFilled className='absolute transition-transform opacity-0 group-hover:opacity-100 group-hover:scale-[1.2]' />
              <TbSquareRoundedChevronUp className='opacity-100 transition-[transform] group-hover:opacity-0' />
            </div>
            {formatter.format(bot.votes)}
          </div>
        </motion.button>
        

        <MotionLink 
          className='flex items-center justify-between w-full px-3 py-2 text-sm font-semibold rounded-lg group disabled:pointer-events-none disabled:opacity-70 hover:text-primary hover:bg-tertiary bg-secondary gap-x-2 text-secondary'
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10 }}
          href={bot.invite_url}
          target='_blank'
        >
          Invite Bot
          <BiSolidEnvelope />
        </MotionLink>
        
        <motion.button className='cursor-auto' initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10 }}>
          <CopyButton
            className='flex items-center justify-between w-full px-3 py-2 text-sm font-semibold rounded-lg cursor-pointer group disabled:pointer-events-none disabled:opacity-70 hover:text-primary hover:bg-tertiary bg-secondary gap-x-2 text-secondary'
            successText='Bot URL copied to clipboard!'
            copyText={bot.invite_url}
            defaultIcon={PiShareFat}
            hoverIcon={PiShareFatFill}
          >
            Share Bot
          </CopyButton>
        </motion.button>

        <MotionLink
          className='flex items-center justify-between w-full px-3 py-2 text-sm font-semibold rounded-lg group disabled:pointer-events-none disabled:opacity-70 hover:text-primary hover:bg-tertiary bg-secondary gap-x-2 text-secondary'
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10 }}
          href={config.supportInviteUrl}
        >
          Report Bot
          <MdFlag />
        </MotionLink>

        {bot.permissions.canEdit && (
          <>
            <MotionLink
              className='flex items-center justify-between w-full px-3 py-2 text-sm font-semibold rounded-lg group disabled:pointer-events-none disabled:opacity-70 hover:text-primary hover:bg-tertiary bg-secondary gap-x-2 text-secondary'
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10 }}
              href={`/bots/${bot.id}/manage`}
            >
              Manage Bot
              <BiPencil />
            </MotionLink>

            {!bot.vote_triple_enabled?.created_at && (
              <motion.button 
                className={cn(
                  'flex items-center justify-between w-full px-3 py-2 text-sm font-semibold text-white bg-orange-500 rounded-lg group gap-x-2 hover:bg-orange-600',
                  buyTripledVotesLoading && '!opacity-70 pointer-events-none'
                )}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10 }}
                onClick={buyTripledVotes}
              >
                <div className='flex gap-x-1.5 items-center'>
                  {buyTripledVotesLoading && <TbLoader className='animate-spin' />}
                  Buy Triple Votes
                </div>

                <div className='flex items-center font-bold gap-x-1'>
                  <BsFire />
                </div>
              </motion.button>
            )}

            {!bot.standed_out?.created_at && (
              <motion.button 
                className={cn(
                  'flex items-center justify-between w-full px-3 py-2 text-sm font-semibold text-white bg-green-800 rounded-lg group gap-x-2 hover:bg-green-900',
                  buyStandedOutLoading && '!opacity-70 pointer-events-none'
                )}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10 }}
                onClick={buyStandedOut}
              >
                <div className='flex gap-x-1.5 items-center'>
                  {buyStandedOutLoading && <TbLoader className='animate-spin' />}
                  Stand Out
                </div>

                <div className='flex items-center font-bold gap-x-1'>
                  <AiOutlineRise />
                </div>
              </motion.button>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}