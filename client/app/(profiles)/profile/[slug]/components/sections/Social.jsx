'use client';

import { t } from '@/stores/language';
import getIcon from '@/lib/utils/profiles/getIcon';
import getDisplayableURL from '@/lib/utils/profiles/getDisplayableURL';
import config from '@/config';
import { motion } from 'framer-motion';
import MotionLink from '@/app/components/Motion/Link';

export default function Social({ data }) {
  const noSocialsFound = data.length === 0;

  const socialsThatHavePrefix = ['github', 'twitter', 'x', 'instagram', 'tiktok', 'telegram'];

  return (
    <div className='flex w-full flex-col'>
      <motion.h2
        className='text-xl font-semibold'
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10, delay: 0.5 }}
      >
        {t('profilePage.social.title')}
      </motion.h2>

      {noSocialsFound ? (
        <motion.p
          className='mt-2 truncate text-tertiary'
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10, delay: 0.615 }}
        >
          {t('profilePage.social.noSocials')}
        </motion.p>
      ) : (
        <>
          <motion.p
            className='mt-2 text-tertiary'
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10, delay: 0.615 }}
          >
            {t('profilePage.social.description', { count: data.length })}
          </motion.p>

          <div className='mt-8 grid grid-cols-1 gap-2'>
            {data
              .map((social, index) => (
                <MotionLink
                  key={social._id}
                  className='group relative flex w-full select-none items-center gap-x-5 rounded-2xl bg-secondary py-4 pl-6 ring-purple-500 transition-all hover:bg-tertiary hover:ring-2'
                  href={social.link}
                  target='_blank'
                  rel='noopener noreferrer'
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 25, delay: 0.715 + (.15 * index) }}
                >
                  {(() => {
                    const SocialIcon = getIcon(social.type);
                    if (!SocialIcon) {
                      return (
                        <div className='transition-transform duration-300 group-hover:scale-[1.2] group-active:scale-100'>
                          <div className='size-8 rounded-xl bg-quaternary'>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <SocialIcon
                        className='text-primary transition-transform duration-300 group-hover:scale-[1.2] group-active:scale-100'
                        size={32}
                      />
                    );
                  })()}

                  <div className='flex flex-col transition-transform duration-300 group-hover:translate-x-1 group-active:-translate-x-1 group-active:scale-[0.95]'>
                    <h3 className='text-lg font-semibold text-primary'>
                      {social.type === 'custom' ? t('profilePage.social.customSocialName') : config.socialNames[social.type]}
                    </h3>

                    <p className='text-sm text-tertiary'>
                      {socialsThatHavePrefix.includes(social.type) ? '@' : ''}
                      {social.type === 'custom' ? getDisplayableURL(social.link) : social.handle}
                    </p>
                  </div>
                </MotionLink>
              ))}
          </div>
        </>
      )}
    </div>
  );
}