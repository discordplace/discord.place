'use client';

import useThemeStore from '@/stores/theme';
import Image from 'next/image';
import { IoEarth } from 'react-icons/io5';
import { MdArrowOutward } from 'react-icons/md';
import { motion } from 'framer-motion';
import getIconPath from '@/lib/utils/profiles/getIconPath';
import getDisplayableURL from '@/lib/utils/profiles/getDisplayableURL';
import { t } from '@/stores/language';
import MotionLink from '@/app/components/Motion/Link';

export default function Social({ data }) {
  const colors = {
    instagram: '225 48 108',
    x: '0 0 0',
    twitter: '29 161 242',
    tiktok: '255 0 80',
    facebook: '66 103 178',
    steam: '0 0 0',
    github: '110 84 148',
    twitch: '145 70 255',
    youtube: '255 0 0',
    telegram: '36 161 222',
    custom: '150 150 150',
    unknown: '0 0 0'
  };

  const theme = useThemeStore(state => state.theme);

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

        {data.map((social, index) => (
          <MotionLink
            className='group flex h-10 w-full items-center justify-between gap-x-2 rounded-lg border-2 border-[rgb(var(--brand-color)/0.5)] bg-gradient-to-r from-[rgb(var(--brand-color)/0.2)] px-2 text-sm font-semibold text-secondary hover:border-[rgb(var(--brand-color)/0.8)] hover:bg-secondary hover:from-[rgb(var(--brand-color)/0.3)]'
            key={social.link}
            style={{
              '--brand-color': colors[social.type]
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10, delay: 0.40 + (.20 * index) }}
            href={social.link}
            target='_blank'
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
                  <Image src={getIconPath(social.type, theme)} width={20} height={20} alt={`${social.type} Icon`} />
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