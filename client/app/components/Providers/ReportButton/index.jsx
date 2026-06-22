'use client';

import { HiFlag } from 'react-icons/hi';
import { IoClose } from 'react-icons/io5';
import { MdBugReport } from 'react-icons/md';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Tooltip from '@/app/components/Tooltip';
import useGeneralStore from '@/stores/general';
import cn from '@/lib/cn';
import { motion, useAnimationControls } from 'framer-motion';
import useAuthStore from '@/stores/auth';
import { useTranslation } from 'react-i18next';
import config from '@/config';
import Link from 'next/link';

export default function ReportButtonProvider() {
  const { t } = useTranslation();
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
      className='fixed right-4 bottom-4 z-999'
      animate={animate}
    >
      <Tooltip content={t('inAppReporting.tooltip.hide')}>
        <button
          className={cn(
            'absolute rounded-full bg-quaternary p-2 text-xl transition-all duration-300 ease-in-out hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black',
            !showReportableAreas ? 'pointer-events-none translate-x-[30px] translate-y-[30px] scale-50 opacity-0' : 'translate-x-0 translate-y-0 scale-100'
          )}
          onClick={() => setShowReportableAreas(false)}
        >
          <IoClose />
        </button>
      </Tooltip>

      <Tooltip content={t('inAppReporting.tooltip.reportSomething')}>
        <Link
          className={cn(
            'absolute rounded-full bg-quaternary p-2 text-xl transition-all duration-300 ease-in-out hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black',
            !showReportableAreas ? 'pointer-events-none translate-x-[-45px] translate-y-[30px] scale-50 opacity-0' : 'translate-x-[-45px] translate-y-0 scale-100 delay-150'
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
            'rounded-full bg-quaternary p-2 text-xl transition-all duration-300 ease-in-out hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black',
            showReportableAreas ? 'pointer-events-none translate-y-[30px] scale-50 opacity-0' : 'translate-y-0 scale-100',
            !loggedIn && 'cursor-default opacity-50'
          )}
          onClick={() => loggedIn && setShowReportableAreas(true)}
        >
          <HiFlag />
        </button>
      </Tooltip>
    </motion.div>
  );
}