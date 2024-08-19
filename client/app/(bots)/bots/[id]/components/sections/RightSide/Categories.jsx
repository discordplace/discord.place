'use client';

import config from '@/config';
import { motion } from 'framer-motion';
import { t } from '@/stores/language';

export default function Categories({ bot }) {
  return (
    <>
      <motion.h2 
        className='mt-4 text-xl font-semibold' 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10, delay: .4 }}
      >
        {t('botPage.categories.title')}
      </motion.h2>

      <motion.div 
        className='grid w-full grid-cols-2 gap-2 mt-4'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10, delay: .6 }}
      >
        {bot.categories.map((category, index) => (
          <motion.span
            key={category}
            className='flex items-center gap-x-1.5 text-tertiary text-center w-full max-w-[100%] px-3 py-2 text-sm font-medium bg-secondary rounded-lg'
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10, delay: 0.40 + (.20 * index) }}
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