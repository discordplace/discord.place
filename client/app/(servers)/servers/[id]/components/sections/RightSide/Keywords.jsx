'use client';

import { motion } from 'framer-motion';
import { FaSlackHash } from 'react-icons/fa';
import { t } from '@/stores/language';

export default function Keywords({ server }) {
  return (
    <>
      <motion.h2
        className='mt-4 text-xl font-semibold'
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10, delay: .4 }}
      >
        {t('serverPage.keywords.title')}
      </motion.h2>

      <motion.div
        className='mt-4 grid w-full grid-cols-2 gap-2'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10, delay: .6 }}
      >
        {server.keywords.map((keyword, index) => (
          <motion.span
            key={keyword}
            className='w-full max-w-full truncate rounded-lg bg-secondary px-3 py-2 text-center text-sm font-medium text-tertiary'
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10, delay: 0.40 + (.20 * index) }}
          >
            <FaSlackHash className='mr-1.5 inline-block text-primary' />
            {keyword}
          </motion.span>
        ))}
      </motion.div>
    </>
  );
}