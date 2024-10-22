'use client';

import MotionLink from '@/app/components/Motion/Link';
import getDisplayableURL from '@/lib/utils/profiles/getDisplayableURL';
import getIconPath from '@/lib/utils/profiles/getIconPath';
import { t } from '@/stores/language';
import useThemeStore from '@/stores/theme';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { IoEarth } from 'react-icons/io5';
import { MdArrowOutward } from 'react-icons/md';

export default function Social({ data }) {
  const colors = {
    custom: '150 150 150',
    facebook: '66 103 178',
    github: '110 84 148',
    instagram: '225 48 108',
    steam: '0 0 0',
    telegram: '36 161 222',
    tiktok: '255 0 80',
    twitch: '145 70 255',
    twitter: '29 161 242',
    unknown: '0 0 0',
    x: '0 0 0',
    youtube: '255 0 0'
  };

  const theme = useThemeStore(state => state.theme);

  return (
    <div className='flex w-full flex-col'>
      <motion.h2
        animate={{ opacity: 1, y: 0 }}
        className='text-xl font-semibold'
        initial={{ opacity: 0, y: -10 }}
        transition={{ damping: 10, duration: 0.3, stiffness: 100, type: 'spring' }}
      >
        {t('profilePage.social.title')}
      </motion.h2>

      <motion.div
        animate={{ opacity: 1 }}
        className='mt-4 grid grid-cols-1 gap-2 mobile:grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-col'
        initial={{ opacity: 0 }}
        transition={{ damping: 10, delay: 0.15, duration: 0.3, stiffness: 100, type: 'spring' }}
      >
        {data.length === 0 && (
          <p className='text-tertiary'>
            {t('profilePage.social.noSocials')}
          </p>
        )}

        {data.map((social, index) => (
          <MotionLink
            animate={{ opacity: 1, y: 0 }}
            className='group flex h-10 w-full items-center justify-between gap-x-2 rounded-lg border-2 border-[rgb(var(--brand-color)/0.5)] bg-gradient-to-r from-[rgb(var(--brand-color)/0.2)] px-2 text-sm font-semibold text-secondary hover:border-[rgb(var(--brand-color)/0.8)] hover:bg-secondary hover:from-[rgb(var(--brand-color)/0.3)]'
            href={social.link}
            initial={{ opacity: 0, y: -10 }}
            key={social.link}
            style={{
              '--brand-color': colors[social.type]
            }}
            target='_blank'
            transition={{ damping: 10, delay: 0.40 + (.20 * index), duration: 0.3, stiffness: 100, type: 'spring' }}
          >
            <div className='flex max-w-[80%] flex-auto gap-x-2 sm:max-w-[90%]'>
              {social.type === 'custom' ? (
                <>
                  <IoEarth className='flex-auto text-primary' size={20} />

                  <span className='w-full truncate'>
                    {getDisplayableURL(social.link)}
                  </span>
                </>
              ) : (
                <>
                  <Image alt={`${social.type} Icon`} height={20} src={getIconPath(social.type, theme)} width={20} />
                  <span className='w-full truncate'>
                    {social.handle}
                  </span>
                </>
              )}
            </div>

            <MdArrowOutward className='text-[rgba(var(--brand-color))]' size={18} />
          </MotionLink>
        ))}
      </motion.div>
    </div>
  );
}