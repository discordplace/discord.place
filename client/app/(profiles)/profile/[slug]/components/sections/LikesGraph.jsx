import { motion } from 'framer-motion';
import Graph from '@/app/(dashboard)/components/Home/Graph/index';
import cn from '@/lib/cn';
import { MdOutlineArrowOutward } from 'react-icons/md';
import Tooltip from '@/app/components/Tooltip';

export default function LikesGraph({ profile }) {
  // calculat if likes decrease or increase compared to the previous day
  const likes = profile.dailyLikes;
  const latestValue = likes[likes.length - 1]?.value || 0;
  const previousValue = likes[likes.length - 2]?.value || 0;
  const difference = latestValue - previousValue;
  const isIncreased = difference > 0;
  const isDecreased = difference < 0;
  const isEqual = difference === 0;
  const diffInPercent = ((latestValue - previousValue) / previousValue) * 100;
  const diffInPercentClean = diffInPercent === Infinity ? 100 : isNaN(diffInPercent) ? 0 : diffInPercent;

  return (
    <div className="px-8 mt-8 lg:px-0 rounded-3xl p-[.75rem]">
      <motion.h2
        className='flex items-center text-xl font-semibold gap-x-2' 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10, delay: 0.7 }}
      >
        Likes Graph

        <Tooltip
          side='right'
          content={`${isIncreased ? 'Increased' : isDecreased ? 'Decreased' : 'No change'} since yesterday (${difference})`}
        >
          <div className={cn(
            'select-none flex w-max gap-x-1 px-2 items-center py-1 text-xs font-semibold rounded-lg',
            isIncreased && 'dark:bg-emerald-300/10 dark:text-emerald-300 bg-emerald-600/10 text-emerald-600',
            isDecreased && 'dark:bg-red-400/10 dark:text-red-400 bg-red-600/10 text-red-600', 
            isEqual && 'bg-quaternary text-tertiary'
          )}>
            <span>{diffInPercentClean.toFixed(1)}%</span>
              
            {isIncreased && <MdOutlineArrowOutward />}
            {isDecreased && <MdOutlineArrowOutward className='rotate-180' />}
          </div>
        </Tooltip>
      </motion.h2>

      <motion.p className='mt-2 whitespace-pre-wrap text-tertiary' 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10, delay: 0.715 }}
      >
        The amount of likes this profile has received over time.
      </motion.p>

      <motion.div 
        className='w-full mt-8'
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10, delay: 0.785 }}
      >
        <Graph
          id='likes'
          data={profile.dailyLikes}
          tooltipFormatter={value => value.toLocaleString('en-US')}
          tooltipLabel='Likes'
          tooltipIcon='<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="20px" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="M256 448l-30.164-27.211C118.718 322.442 48 258.61 48 179.095 48 114.221 97.918 64 162.4 64c36.399 0 70.717 16.742 93.6 43.947C278.882 80.742 313.199 64 349.6 64 414.082 64 464 114.221 464 179.095c0 79.516-70.719 143.348-177.836 241.694L256 448z"></path></svg>'
          color='#9c84ef'
        />
      </motion.div>
    </div>
  );
}