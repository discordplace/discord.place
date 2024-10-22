'use client';

import { t } from '@/stores/language';
import { motion } from 'framer-motion';
import { FaSlackHash } from 'react-icons/fa';

export default function Keywords({ server }) {
  return (
    <>
      <motion.h2
        animate={{ opacity: 1, y: 0 }}
        className='mt-4 text-xl font-semibold'
        initial={{ opacity: 0, y: -10 }}
        transition={{ damping: 10, delay: .4, duration: 0.3, stiffness: 100, type: 'spring' }}
      >
        {t('serverPage.keywords.title')}
      </motion.h2>

      <motion.div
        animate={{ opacity: 1 }}
        className='mt-4 grid w-full grid-cols-2 gap-2'
        initial={{ opacity: 0 }}
        transition={{ damping: 10, delay: .6, duration: 0.3, stiffness: 100, type: 'spring' }}
      >
        {server.keywords.map((keyword, index) => (
          <motion.span
            animate={{ opacity: 1, y: 0 }}
            className='w-full max-w-full truncate rounded-lg bg-secondary px-3 py-2 text-center text-sm font-medium text-tertiary'
            initial={{ opacity: 0, y: -10 }}
            key={keyword}
            transition={{ damping: 10, delay: 0.40 + (.20 * index), duration: 0.3, stiffness: 100, type: 'spring' }}
          >
            <FaSlackHash className='mr-1.5 inline-block text-primary' />
            {keyword}
          </motion.span>
        ))}
      </motion.div>
    </>
  );
}