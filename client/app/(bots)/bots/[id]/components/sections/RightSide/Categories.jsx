'use client';

import config from '@/config';
import { t } from '@/stores/language';
import { motion } from 'framer-motion';

export default function Categories({ bot }) {
  return (
    <>
      <motion.h2
        animate={{ opacity: 1, y: 0 }}
        className='mt-4 text-xl font-semibold'
        initial={{ opacity: 0, y: -10 }}
        transition={{ damping: 10, delay: .4, duration: 0.3, stiffness: 100, type: 'spring' }}
      >
        {t('botPage.categories.title')}
      </motion.h2>

      <motion.div
        animate={{ opacity: 1 }}
        className='mt-4 grid w-full grid-cols-2 gap-2'
        initial={{ opacity: 0 }}
        transition={{ damping: 10, delay: .6, duration: 0.3, stiffness: 100, type: 'spring' }}
      >
        {bot.categories.map((category, index) => (
          <motion.span
            animate={{ opacity: 1, y: 0 }}
            className='flex w-full max-w-full items-center gap-x-1.5 rounded-lg bg-secondary px-3 py-2 text-center text-sm font-medium text-tertiary'
            initial={{ opacity: 0, y: -10 }}
            key={category}
            transition={{ damping: 10, delay: 0.40 + (.20 * index), duration: 0.3, stiffness: 100, type: 'spring' }}
          >
            <span className='inline-block text-primary'>
              {config.botCategoriesIcons[category]}
            </span>

            <span className='truncate'>
              {t(`categories.${category}`)}
            </span>
          </motion.span>
        ))}
      </motion.div>
    </>
  );
}