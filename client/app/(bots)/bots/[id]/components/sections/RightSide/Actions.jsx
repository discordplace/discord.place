'use client';

import CopyButton from '@/app/components/CopyButton';
import VoteCountdown from '@/app/components/Countdown/Vote';
import MotionLink from '@/app/components/Motion/Link';
import cn from '@/lib/cn';
import createStandedOutCheckout from '@/lib/request/bots/createStandedOutCheckout';
import createTripledVotesCheckout from '@/lib/request/bots/createTripledVotesCheckout';
import voteBot from '@/lib/request/bots/voteBot';
import revalidateBot from '@/lib/revalidate/bot';
import useAuthStore from '@/stores/auth';
import { t } from '@/stores/language';
import useThemeStore from '@/stores/theme';
import { AnimatePresence, motion } from 'framer-motion';
import Script from 'next/script';
import { useRouter } from 'next-nprogress-bar';
import { useEffect, useRef, useState } from 'react';
import { AiOutlineRise } from 'react-icons/ai';
import { BiPencil, BiSolidEnvelope } from 'react-icons/bi';
import { BsFire } from 'react-icons/bs';
import { PiShareFat, PiShareFatFill } from 'react-icons/pi';
import { TbLoader, TbSquareRoundedChevronUp, TbSquareRoundedChevronUpFilled } from 'react-icons/tb';
import { toast } from 'sonner';

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
    compactDisplay: 'short',
    notation: 'compact'
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
            error: error => {
              setLoading(false);

              return error;
            },
            loading: t('botPage.actions.toast.voting', { botName: bot.username }),
            success: () => {
              setLoading(false);
              setVoteTimeout({ createdAt: new Date().getTime() + 86400000 });
              revalidateBot(bot.id);

              return t('botPage.actions.toast.voted', { botName: bot.username });
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
      error: error => {
        setBuyTripledVotesLoading(false);

        return error;
      },
      loading: t('botPage.actions.toast.creatingCheckout'),
      success: data => {
        setTimeout(() => router.push(data.url), 3000);

        return t('botPage.actions.toast.checkoutCreated');
      }
    });
  }

  function buyStandedOut() {
    setBuyStandedOutLoading(true);

    toast.promise(createStandedOutCheckout(bot.id), {
      error: error => {
        setBuyStandedOutLoading(false);

        return error;
      },
      loading: t('botPage.actions.toast.creatingCheckout'),
      success: data => {
        setTimeout(() => router.push(data.url), 3000);

        return t('botPage.actions.toast.checkoutCreated');
      }
    });
  }

  return (
    <div>
      <motion.h2
        animate={{ opacity: 1, y: 0 }}
        className='text-xl font-semibold'
        initial={{ opacity: 0, y: -10 }}
        transition={{ damping: 10, duration: 0.3, stiffness: 100, type: 'spring' }}
      >
        {t('botPage.actions.title')}
      </motion.h2>

      <motion.div
        animate={{ opacity: 1 }}
        className='mt-4 grid grid-cols-1 gap-2 mobile:grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-col'
        initial={{ opacity: 0 }}
        transition={{ damping: 10, delay: .15, duration: 0.3, stiffness: 100, type: 'spring' }}
      >
        {loggedIn && (
          <Script
            async={true}
            defer={true}
            src='https://challenges.cloudflare.com/turnstile/v0/api.js'
          />
        )}

        <AnimatePresence>
          {showCaptcha && (
            <motion.div
              animate={{ opacity: 1 }}
              /* eslint-disable-next-line tailwindcss/no-custom-classname */
              className='cf-turnstile [&>iframe]:max-w-full'
              data-sitekey={process.env.NEXT_PUBLIC_CF_SITE_KEY}
              data-theme={theme === 'dark' ? 'dark' : 'light'}
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              ref={captchaRef}
            />
          )}
        </AnimatePresence>

        <motion.button
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'flex items-center justify-between w-full px-3 py-2 text-sm font-semibold text-white bg-black rounded-lg group gap-x-2 hover:bg-black/70 dark:bg-white dark:text-black dark:hover:bg-white/70',
            loading && 'cursor-default !opacity-70 hover:bg-black dark:hover:bg-white'
          )}
          initial={{ opacity: 0, y: -10 }}
          onClick={() => {
            if (!loggedIn) return toast.error(t('botPage.actions.toast.loginRequiredForVote'));
            if (voteTimeout && new Date(voteTimeout.createdAt).getTime() + 86400000 > new Date().getTime()) return;

            setShowCaptcha(true);
          }}
          transition={{ damping: 10, duration: 0.3, stiffness: 100, type: 'spring' }}
        >
          <div className='flex items-center gap-x-1.5'>
            {loading && <TbLoader className='animate-spin' />}
            {voteTimeout ? (
              <VoteCountdown date={new Date(voteTimeout.createdAt).getTime() + 86400000} />
            ) : t('buttons.vote')}
          </div>

          <div className='flex items-center gap-x-1 font-bold'>
            <div className='relative'>
              <TbSquareRoundedChevronUpFilled className='absolute opacity-0 transition-transform group-hover:scale-[1.2] group-hover:opacity-100' />
              <TbSquareRoundedChevronUp className='opacity-100 transition-transform group-hover:opacity-0' />
            </div>

            {formatter.format(bot.votes)}
          </div>
        </motion.button>

        <MotionLink
          animate={{ opacity: 1, y: 0 }}
          className='group flex w-full items-center justify-between gap-x-2 rounded-lg bg-secondary px-3 py-2 text-sm font-semibold text-secondary hover:bg-tertiary hover:text-primary disabled:pointer-events-none disabled:opacity-70'
          href={bot.invite_url}
          initial={{ opacity: 0, y: -10 }}
          target='_blank'
          transition={{ damping: 10, duration: 0.3, stiffness: 100, type: 'spring' }}
        >
          {t('buttons.inviteBot')}
          <BiSolidEnvelope />
        </MotionLink>

        <motion.button animate={{ opacity: 1, y: 0 }} className='cursor-auto' initial={{ opacity: 0, y: -10 }} transition={{ damping: 10, duration: 0.3, stiffness: 100, type: 'spring' }}>
          <CopyButton
            className='group flex w-full cursor-pointer items-center justify-between gap-x-2 rounded-lg bg-secondary px-3 py-2 text-sm font-semibold text-secondary hover:bg-tertiary hover:text-primary disabled:pointer-events-none disabled:opacity-70'
            copyText={bot.invite_url}
            defaultIcon={PiShareFat}
            hoverIcon={PiShareFatFill}
            successText='Bot URL copied to clipboard!'
          >
            {t('buttons.shareBot')}
          </CopyButton>
        </motion.button>

        {bot.permissions.canEdit && (
          <>
            <MotionLink
              animate={{ opacity: 1, y: 0 }}
              className='group flex w-full items-center justify-between gap-x-2 rounded-lg bg-secondary px-3 py-2 text-sm font-semibold text-secondary hover:bg-tertiary hover:text-primary disabled:pointer-events-none disabled:opacity-70'
              href={`/bots/${bot.id}/manage`}
              initial={{ opacity: 0, y: -10 }}
              transition={{ damping: 10, duration: 0.3, stiffness: 100, type: 'spring' }}
            >
              {t('buttons.manageBot')}
              <BiPencil />
            </MotionLink>

            {!bot.vote_triple_enabled?.created_at && (
              <motion.button
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  'flex items-center justify-between w-full px-3 py-2 text-sm font-semibold text-white bg-orange-500 rounded-lg group gap-x-2 hover:bg-orange-600',
                  buyTripledVotesLoading && '!opacity-70 pointer-events-none'
                )}
                initial={{ opacity: 0, y: -10 }}
                onClick={buyTripledVotes}
                transition={{ damping: 10, duration: 0.3, stiffness: 100, type: 'spring' }}
              >
                <div className='flex items-center gap-x-1.5'>
                  {buyTripledVotesLoading && <TbLoader className='animate-spin' />}
                  {t('buttons.buyTripleVotes')}
                </div>

                <div className='flex items-center gap-x-1 font-bold'>
                  <BsFire />
                </div>
              </motion.button>
            )}

            {!bot.standed_out?.created_at && (
              <motion.button
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  'flex items-center justify-between w-full px-3 py-2 text-sm font-semibold text-white bg-green-800 rounded-lg group gap-x-2 hover:bg-green-900',
                  buyStandedOutLoading && '!opacity-70 pointer-events-none'
                )}
                initial={{ opacity: 0, y: -10 }}
                onClick={buyStandedOut}
                transition={{ damping: 10, duration: 0.3, stiffness: 100, type: 'spring' }}
              >
                <div className='flex items-center gap-x-1.5'>
                  {buyStandedOutLoading && <TbLoader className='animate-spin' />}
                  {t('buttons.standOut')}
                </div>

                <div className='flex items-center gap-x-1 font-bold'>
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