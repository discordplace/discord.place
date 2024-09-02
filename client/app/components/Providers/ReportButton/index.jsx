'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import Tooltip from '@/app/components/Tooltip';
import { HiFlag } from 'react-icons/hi';
import useGeneralStore from '@/stores/general';
import { IoClose } from 'react-icons/io5';
import cn from '@/lib/cn';
import { motion, useAnimationControls } from 'framer-motion';
import { MdBugReport } from 'react-icons/md';
import ReportableArea from '@/app/components/ReportableArea';
import useAuthStore from '@/stores/auth';

export default function ReportButtonProvider() {
  const loggedIn = useAuthStore(state => state.loggedIn);
  const pathname = usePathname();

  const showReportableAreas = useGeneralStore(state => state.showReportableAreas);
  const setShowReportableAreas = useGeneralStore(state => state.setShowReportableAreas);

  useEffect(() => {
    if (showReportableAreas) setShowReportableAreas(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reportSomethingTriggerButtonRef = useRef(null);

  return (
    <motion.div
      className='fixed z-[999] right-4 bottom-4'
      animate={animate}
    >
      <Tooltip content={'Hide'}>
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

      <Tooltip content={'Just report something'}>
        <button
          className={cn(
            'absolute p-2 text-xl rounded-full transition-[opacity,transform] duration-300 ease-in-out bg-quaternary dark:hover:bg-white dark:hover:text-black hover:text-white hover:bg-black',
            !showReportableAreas ? 'scale-50 opacity-0 pointer-events-none translate-y-[30px] translate-x-[-45px]' : 'delay-150 scale-100 translate-y-[0px] translate-x-[-45px]'
          )}
          onClick={() => reportSomethingTriggerButtonRef.current?.click?.()}
        >
          <MdBugReport />
        </button>
      </Tooltip>

      {showReportableAreas && (
        <ReportableArea
          triggerButtonRef={reportSomethingTriggerButtonRef}
          active={false}
          type='something'
          identifier={`report-something-${pathname}`}
        />
      )}

      <Tooltip
        content={loggedIn ? 'Report something on this page' : 'You need to be logged in to report something'}
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