'use client';

import { TbLoader, TbSquareRoundedChevronUp, TbSquareRoundedChevronUpFilled, PiShareFat, PiShareFatFill, FaBell, FaRegBell, BsFire, BiPencil, BiSolidEnvelope, AiOutlineRise } from '@/icons';
import CopyButton from '@/app/components/CopyButton';
import MotionLink from '@/app/components/Motion/Link';
import { AnimatePresence, motion } from 'framer-motion';
import useAuthStore from '@/stores/auth';
import cn from '@/lib/cn';
import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import voteServer from '@/lib/request/servers/voteServer';
import createReminder from '@/lib/request/servers/createReminder';
import VoteCountdown from '@/app/components/Countdown/Vote';
import Tooltip from '@/app/components/Tooltip';
import revalidateServer from '@/lib/revalidate/server';
import createTripledVotesCheckout from '@/lib/request/servers/createTripledVotesCheckout';
import createStandedOutCheckout from '@/lib/request/servers/createStandedOutCheckout';
import { useRouter } from 'next-nprogress-bar';
import { t } from '@/stores/language';

export default function Actions({ server }) {
  const [serverVotes, setServerVotes] = useState(server.votes);
  const [voteTimeout, setVoteTimeout] = useState(server.vote_timeout);
  const [canSetReminder, setCanSetReminder] = useState(server.can_set_reminder);
  const loggedIn = useAuthStore(state => state.loggedIn);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createReminderLoading, setCreateReminderLoading] = useState(false);
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

          toast.promise(voteServer(server.id, response), {
            loading: t('serverPage.actions.toast.voting', { serverName: server.name }),
            success: data => {
              setLoading(false);
              setServerVotes(serverVotes + (server.badges.includes('Premium') ? 2 : 1));
              setVoteTimeout({ createdAt: new Date().getTime() + 86400000 });
              setCanSetReminder(data.inGuild);
              revalidateServer(server.id);

              return t('serverPage.actions.toast.voted', { serverName: server.name });
            },
            error: () => setLoading(false)
          });
        }
      }, 100);
    } else clearInterval(captchaIntervalRef.current);

    return () => clearInterval(captchaIntervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCaptcha]);

  function setReminder() {
    setCreateReminderLoading(true);

    toast.promise(createReminder(server.id), {
      loading: t('serverPage.actions.toast.creatingReminder', { serverName: server.name }),
      success: () => {
        setCreateReminderLoading(false);
        setCanSetReminder(false);

        return t('serverPage.actions.toast.reminderCreated', { serverName: server.name });
      },
      error: () => setCreateReminderLoading(false)
    });
  }

  function buyTripledVotes() {
    setBuyTripledVotesLoading(true);

    toast.promise(createTripledVotesCheckout(server.id), {
      loading: t('serverPage.actions.toast.creatingCheckout'),
      success: data => {
        setTimeout(() => router.push(data.url), 3000);

        return t('serverPage.actions.toast.checkoutCreated');
      },
      error: () => setBuyTripledVotesLoading(false)
    });
  }

  function buyStandedOut() {
    setBuyStandedOutLoading(true);

    toast.promise(createStandedOutCheckout(server.id), {
      loading: t('serverPage.actions.toast.creatingCheckout'),
      success: data => {
        setTimeout(() => router.push(data.url), 3000);

        return t('serverPage.actions.toast.checkoutCreated');
      },
      error: () => setBuyStandedOutLoading(false)
    });
  }

  const inviteLinkNotAvailable = server.invite_code.type === 'Deleted' || (server.invite_code.type === 'Vanity' && server.vanity_url === null);

  return (
    <div>
      <motion.h2
        className='text-xl font-semibold'
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10 }}
      >
        {t('serverPage.actions.title')}
      </motion.h2>

      <motion.div
        className='mt-4 grid grid-cols-1 gap-2 mobile:grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-col'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10, delay: .15 }}
      >
        {loggedIn && (
          <Script
            src='https://challenges.cloudflare.com/turnstile/v0/api.js'
            async={true}
            defer={true}
          />
        )}

        <AnimatePresence>
          {showCaptcha && (
            /* eslint-disable-next-line tailwindcss/no-custom-classname */
            <motion.div className='cf-turnstile [&>iframe]:max-w-full' data-sitekey={process.env.NEXT_PUBLIC_CF_SITE_KEY} ref={captchaRef} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          )}
        </AnimatePresence>

        {canSetReminder && (
          <motion.button
            className={cn(
              'flex items-center justify-between w-full px-3 py-2 text-sm font-semibold text-white bg-black rounded-lg group gap-x-2 hover:bg-black/70 dark:bg-white dark:text-black dark:hover:bg-white/70',
              createReminderLoading && 'cursor-default !opacity-70 hover:bg-black dark:hover:bg-white'
            )}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10 }}
            onClick={() => {
              if (!loggedIn) return toast.error(t('serverPage.actions.toast.loginRequiredForVote'));

              setReminder();
            }}
          >
            <div className='flex items-center gap-x-1.5'>
              {createReminderLoading && <TbLoader className='animate-spin' />}
              {t('buttons.createReminder')}
            </div>

            <div className='flex items-center gap-x-1 font-bold'>
              <div className='relative'>
                <FaBell className='absolute opacity-0 transition-transform group-hover:scale-[1.2] group-hover:opacity-100' />
                <FaRegBell className='opacity-100 transition-transform group-hover:opacity-0' />
              </div>
            </div>
          </motion.button>
        )}

        <motion.button
          className={cn(
            'flex items-center justify-between w-full px-3 py-2 text-sm font-semibold text-white bg-black rounded-lg group gap-x-2 hover:bg-black/70 dark:bg-white dark:text-black dark:hover:bg-white/70',
            loading && 'cursor-default !opacity-70 hover:bg-black dark:hover:bg-white'
          )}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10 }}
          onClick={() => {
            if (!loggedIn) return toast.error(t('serverPage.actions.toast.loginRequiredForVote'));
            if (voteTimeout && new Date(voteTimeout.createdAt).getTime() + 86400000 > new Date().getTime()) return;

            setShowCaptcha(true);
          }}
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

            {formatter.format(serverVotes)}
          </div>
        </motion.button>

        {inviteLinkNotAvailable ? (
          <Tooltip content={t('serverPage.actions.tooltip.noInviteLinkAvailable')}>
            <motion.div
              className='flex w-full cursor-default items-center justify-between gap-x-2 rounded-lg bg-secondary px-3 py-2 text-sm font-semibold text-secondary !opacity-70'
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10 }}
            >
              <s>
                {t('buttons.joinServer')}
              </s>
              <BiSolidEnvelope />
            </motion.div>
          </Tooltip>
        ) : (
          <MotionLink
            className='group flex w-full items-center justify-between gap-x-2 rounded-lg bg-secondary px-3 py-2 text-sm font-semibold text-secondary hover:bg-tertiary hover:text-primary disabled:pointer-events-none disabled:opacity-70'
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10 }}
            href={server.vanity_url ? server.vanity_url : `https://discord.com/invite/${server.invite_code.code}`}
          >
            {t('buttons.joinServer')}
            <BiSolidEnvelope />
          </MotionLink>
        )}

        <motion.button className='cursor-auto' initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10 }}>
          <CopyButton
            className='group flex w-full cursor-pointer items-center justify-between gap-x-2 rounded-lg bg-secondary px-3 py-2 text-sm font-semibold text-secondary hover:bg-tertiary hover:text-primary disabled:pointer-events-none disabled:opacity-70'
            successText={t('serverPage.actions.toast.serverUrlCopied')}
            copyText={server.vanity_url ? server.vanity_url : `https://discord.com/invite/${server.invite_code.code}`}
            defaultIcon={PiShareFat}
            hoverIcon={PiShareFatFill}
          >
            {t('buttons.shareServer')}
          </CopyButton>
        </motion.button>

        {server.permissions.canEdit && (
          <>
            <MotionLink
              className='group flex w-full items-center justify-between gap-x-2 rounded-lg bg-secondary px-3 py-2 text-sm font-semibold text-secondary hover:bg-tertiary hover:text-primary disabled:pointer-events-none disabled:opacity-70'
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10 }}
              href={`/servers/${server.id}/manage`}
            >
              {t('buttons.manageServer')}
              <BiPencil />
            </MotionLink>

            {!server.vote_triple_enabled?.created_at && (
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
                <div className='flex items-center gap-x-1.5'>
                  {buyTripledVotesLoading && <TbLoader className='animate-spin' />}
                  {t('buttons.buyTripleVotes')}
                </div>

                <div className='flex items-center gap-x-1 font-bold'>
                  <BsFire />
                </div>
              </motion.button>
            )}

            {!server.standed_out?.created_at && (
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