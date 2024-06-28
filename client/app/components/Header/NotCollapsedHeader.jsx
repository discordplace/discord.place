'use client';

import LogoWithText from '@/app/components/Logo/WithText';
import config from '@/config';
import MotionLink from '@/app/components/Motion/Link';
import UserSide from './UserSide';
import cn from '@/lib/cn';
import { motion } from 'framer-motion';
import { Suspense } from 'react';

export default function NotCollapsedHeader({ pathname }) {
  return (
    <div className="absolute flex items-center justify-center w-full z-[9998] top-0">
      <div className='flex justify-between items-center max-w-[1000px] w-full mt-12'>
        <div className='flex items-center gap-x-8'>
          <motion.div
            className='transition-colors hover:opacity-70'
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.15, type: 'spring', stiffness: 100, damping: 20 }}
          >
            <LogoWithText />
          </motion.div>
          
          <div className='w-[1px] h-[50%] bg-quaternary'>&thinsp;</div>

          <div className='flex gap-x-6'>
            {config.headerLinks.map(headerLink => (
              <MotionLink
                href={headerLink.href}
                key={headerLink.href}
                className={cn(
                  'flex items-center font-medium transition-colors duration-200 outline-none select-none gap-x-1.5 text-tertiary hover:text-secondary',
                  pathname === headerLink.href && 'text-primary pointer-events-none'
                )}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.15 * config.headerLinks.indexOf(headerLink), type: 'spring', stiffness: 100, damping: 20 }}
              >
                <headerLink.icon />
                {headerLink.title}
              </MotionLink>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, type: 'spring', stiffness: 100, damping: 20 }}
        >
          <Suspense fallback={<></>}>
            <UserSide />
          </Suspense>
        </motion.div>
      </div>
    </div>
  );
}