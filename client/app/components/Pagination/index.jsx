import { motion } from 'framer-motion';
import Tooltip from '@/app/components/Tooltip';
import { CgChevronLeft, CgChevronRight } from 'react-icons/cg';

export default function Pagination({ page, next, previous, maxReached, loading }) {
  return !loading ? (
    <motion.div className='flex items-center mt-6' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Tooltip content={page <= 1 ? null : `Go back to page ${page - 1}`}>
        <button className='border-y border-l border-primary text-sm h-[38px] px-3 font-medium rounded-l-md bg-secondary text-secondary hover:bg-tertiary disabled:cursor-default disabled:opacity-70 flex items-center gap-x-1.5' onClick={() => !(page <= 1 || loading) && previous()} disabled={page <= 1 || loading}>
          <CgChevronLeft />
        </button>
      </Tooltip>

      <span className='h-[38px] px-3 items-center flex text-sm font-semibold border pointer-events-none opacity-70 text-secondary bg-secondary border-x border-primary'>
        Page {page}
      </span>

      <Tooltip content={maxReached ? null : `Go to page ${page + 1}`}>
        <button className='h-[38px] border-y border-r border-primary text-sm px-3 font-medium rounded-r-md bg-secondary text-secondary hover:bg-tertiary disabled:cursor-default disabled:opacity-70 flex items-center gap-x-1.5' onClick={() => !(maxReached || loading) && next()} disabled={maxReached || loading}>
          <CgChevronRight />
        </button>
      </Tooltip>
    </motion.div>
  ) : null;
}
