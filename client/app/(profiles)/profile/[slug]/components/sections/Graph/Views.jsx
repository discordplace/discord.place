'use client';

import Graph from '@/app/(dashboard)/components/Home/Graph/index';
import cn from '@/lib/cn';
import { MdOutlineArrowOutward } from 'react-icons/md';
import Tooltip from '@/app/components/Tooltip';
import { useMedia } from 'react-use';
import { t } from '@/stores/language';

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
        {t('profilePage.graph.views.title')}

        <Tooltip
          side={isMobile ? 'bottom' : 'right'}
          content={t(`graph.tooltip.${isIncreased ? 'increased' : isDecreased ? 'decreased' : 'noChanges'}`, { postProcess: 'interval', count: 0, difference })}
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
        {t('profilePage.graph.views.subtitle')}
      </p>

      <div className='w-full mt-8'>
        <Graph
          id='profileViews'
          data={profile.dailyStats.map(({ createdAt, views }) => ({ createdAt, value: views })).reverse()}
          tooltipFormatter={value => value.toLocaleString('en-US')}
          color={(isIncreased || isDecreased) ? 'rgb(168, 85, 247)' : '#b4b4b4'}
        />
      </div>
    </>
  );
}