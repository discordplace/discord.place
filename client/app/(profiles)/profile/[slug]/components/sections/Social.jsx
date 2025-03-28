'use client';import { MdArrowOutward } from '@/icons';
import { motion } from 'framer-motion';
import getDisplayableURL from '@/lib/utils/profiles/getDisplayableURL';
import { t } from '@/stores/language';
import MotionLink from '@/app/components/Motion/Link';
import getIcon from '@/lib/utils/profiles/getIcon';
import colors from '@/lib/utils/profiles/colors';

export default function Social({ data }) {
  return (
    <div className='flex w-full flex-col'>
      <motion.h2
        className='text-xl font-semibold'
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10 }}
      >
        {t('profilePage.social.title')}
      </motion.h2>

      <motion.div
        className='mt-4 grid grid-cols-1 gap-2 mobile:grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-col'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10, delay: 0.15 }}
      >
        {data.length === 0 && (
          <p className='text-tertiary'>
            {t('profilePage.social.noSocials')}
          </p>
        )}

        {data.map((social, index) => {
          const SocialIcon = getIcon(social.type);

          return (
            <MotionLink
              className='group flex items-center justify-between gap-x-1 rounded-2xl border border-primary bg-secondary px-2 py-3 transition-colors hover:bg-tertiary'
              key={social.link}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10, delay: 0.20 + (.20 * index) }}
              href={social.link}
              target='_blank'
              style={{
                '--brand-color': colors[social.type]
              }}
            >
              <div className='flex items-center gap-x-2 text-sm text-tertiary transition-colors group-hover:text-primary'>
                <SocialIcon
                  className='text-tertiary transition-colors group-hover:text-[rgb(var(--brand-color))]'
                  size={20}
                />

                <span className='font-semibold'>
                  {social.type === 'custom' ? getDisplayableURL(social.link) : social.handle}
                </span>
              </div>

              <MdArrowOutward
                className='text-tertiary opacity-0 transition-opacity group-hover:opacity-100'
                size={18}
              />
            </MotionLink>
          );
        })}
      </motion.div>
    </div>
  );
}