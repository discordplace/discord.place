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
    <div className='flex flex-col w-full'>
      <motion.h2 
        className='text-xl font-semibold'
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10 }}
      >
        {t('profilePage.social.title')}
      </motion.h2>

      <motion.div 
        className='grid grid-cols-1 gap-2 mt-4 mobile:grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-col'
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
            className='flex group items-center justify-between w-full h-10 px-2 text-sm font-semibold border-2 rounded-lg hover:bg-secondary border-[rgb(var(--brand-color)/0.5)] hover:border-[rgb(var(--brand-color)/0.8)] gap-x-2 bg-gradient-to-r from-[rgb(var(--brand-color)/0.2)] hover:from-[rgb(var(--brand-color)/0.3)] text-secondary'
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
            <div className='flex gap-x-2 max-w-[80%] sm:max-w-[90%] flex-auto'>
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