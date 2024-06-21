import Graph from '@/app/(dashboard)/components/Home/Graph/index';
import cn from '@/lib/cn';
import { MdOutlineArrowOutward } from 'react-icons/md';
import Tooltip from '@/app/components/Tooltip';
import { useMedia } from 'react-use';

export default function ViewsGraph({ profile }) {
  const data = profile.dailyStats || [];
  const latestValue = data[data.length - 1]?.views || 0;
  const previousValue = data[data.length - 2]?.views || 0;
  const difference = latestValue - previousValue;
  const isIncreased = difference > 0;
  const isDecreased = difference < 0;
  const isEqual = difference === 0;
  const diffInPercent = ((latestValue - previousValue) / previousValue) * 100;
  const diffInPercentClean = diffInPercent === Infinity ? 100 : isNaN(diffInPercent) ? 0 : diffInPercent;

  const isMobile = useMedia('(max-width: 640px)', false);

  return (
    <>
      <h2 className='flex items-center text-xl font-semibold gap-x-2'>
        Views Graph

        <Tooltip
          side={isMobile ? 'bottom' : 'right'}
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
      </h2>

      <p className='mt-2 whitespace-pre-wrap text-tertiary'>
        The amount of views this profile has received over time.
      </p>

      <div className='w-full mt-8'>
        <Graph
          id='views'
          data={profile.dailyStats.map(({ createdAt, views }) => ({ createdAt, value: views })).reverse()}
          tooltipFormatter={value => value.toLocaleString('en-US')}
          tooltipLabel='Views'
          tooltipIcon='<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="20px" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="M256 105c-101.8 0-188.4 62.4-224 151 35.6 88.6 122.2 151 224 151s188.4-62.4 224-151c-35.6-88.6-122.2-151-224-151zm0 251.7c-56 0-101.8-45.3-101.8-100.7S200 155.3 256 155.3 357.8 200.6 357.8 256 312 356.7 256 356.7zm0-161.1c-33.6 0-61.1 27.2-61.1 60.4s27.5 60.4 61.1 60.4 61.1-27.2 61.1-60.4-27.5-60.4-61.1-60.4z"></path></svg>'
          color={
            isIncreased ? '#64b071' :
              isDecreased ? '#e75f62' :
                '#b4b4b4'
          }
        />
      </div>
    </>
  );
}