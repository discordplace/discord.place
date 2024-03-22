import { motion } from 'framer-motion';
import { FaSlackHash } from 'react-icons/fa';

export default function Keywords({ server }) {
  return (
    <>
      <motion.h2 
        className='mt-4 text-xl font-semibold' 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10, delay: .4 }}
      >
        Keywords
      </motion.h2>

      <motion.div 
        className='grid w-full grid-cols-2 gap-2 mt-4'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10, delay: .6 }}
      >
        {server.keywords.map((keyword, index) => (
          <motion.span
            key={keyword}
            className='text-tertiary text-center w-full max-w-[100%] truncate px-3 py-2 text-sm font-medium bg-secondary rounded-lg'
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