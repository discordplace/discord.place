'use client';

import { MdBugReport, IoClose, HiFlag } from '@/icons';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Tooltip from '@/app/components/Tooltip';
import useGeneralStore from '@/stores/general';
import cn from '@/lib/cn';
import { motion, useAnimationControls } from 'framer-motion';
import useAuthStore from '@/stores/auth';
import { t } from '@/stores/language';
import config from '@/config';
import Link from 'next/link';

export default function ReportButtonProvider() {
  const loggedIn = useAuthStore(state => state.loggedIn);
  const pathname = usePathname();

  const showReportableAreas = useGeneralStore(state => state.showReportableAreas);
  const setShowReportableAreas = useGeneralStore(state => state.setShowReportableAreas);

  useEffect(() => {
    if (showReportableAreas) setShowReportableAreas(false);
  }, [pathname]);

  const animate = useAnimationControls();

  useEffect(() => {
    /*
      I couldn't get this to work with animate-wiggle with custom keyframes in tailwind.config.js
      also tried with motion component props (animate, variants, etc)
      this is the only way I could get wiggle animation to work..
      time is 05:43 AM here rn and I don't want to spend more time on this
    */

    animate.start({
      transform: ['rotate(0deg)', 'rotate(20deg)', 'rotate(-20deg)', 'rotate(20deg)', 'rotate(-20deg)', 'rotate(20deg)', 'rotate(-20deg)', 'rotate(0deg)'],
      transition: { duration: 1, ease: 'linear' }
    });
  }, []);

  const disabledPaths = ['/dashboard'];

  if (disabledPaths.includes(pathname)) return null;

  return (
    <motion.div
      className='fixed bottom-4 right-4 z-[999]'
      animate={animate}
    >
      <Tooltip content={t('inAppReporting.tooltip.hide')}>
        <button
          className={cn(
            'absolute p-2 text-xl rounded-full transition-[opacity,transform] duration-300 ease-in-out bg-quaternary dark:hover:bg-white dark:hover:text-black hover:text-white hover:bg-black',
            !showReportableAreas ? 'scale-50 opacity-0 pointer-events-none translate-y-[30px] translate-x-[30px]' : 'scale-100 translate-y-[0px] translate-x-[0px]'
          )}
          onClick={() => setShowReportableAreas(false)}
        >
          <IoClose />
        </button>
      </Tooltip>

      <Tooltip content={t('inAppReporting.tooltip.reportSomething')}>
        <Link
          className={cn(
            'absolute p-2 text-xl rounded-full transition-[opacity,transform] duration-300 ease-in-out bg-quaternary dark:hover:bg-white dark:hover:text-black hover:text-white hover:bg-black',
            !showReportableAreas ? 'scale-50 opacity-0 pointer-events-none translate-y-[30px] translate-x-[-45px]' : 'delay-150 scale-100 translate-y-[0px] translate-x-[-45px]'
          )}
          href={config.githubIssuesUrl}
          target='_blank'
        >
          <MdBugReport />
        </Link>
      </Tooltip>

      <Tooltip
        content={loggedIn ? t('inAppReporting.tooltip.reportSomethingOnThisPage') : t('inAppReporting.tooltip.loginRequiredForReport')}
        side='left'
      >
        <button
          className={cn(
            'p-2 text-xl rounded-full transition-[opacity,transform] duration-300 ease-in-out bg-quaternary dark:hover:bg-white dark:hover:text-black hover:text-white hover:bg-black',
            showReportableAreas ? 'scale-50 opacity-0 pointer-events-none translate-y-[30px] translate-x-[-30px]' : 'scale-100 translate-y-[0px] translate-x-[0px]',
            !loggedIn && 'opacity-50 cursor-default'
          )}
          onClick={() => loggedIn && setShowReportableAreas(true)}
        >
          <HiFlag />
        </button>
      </Tooltip>
    </motion.div>
  );
}