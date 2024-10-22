'use client';

import Graph from '@/app/(dashboard)/components/Home/Graph/index';
import Tooltip from '@/app/components/Tooltip';
import cn from '@/lib/cn';
import { t } from '@/stores/language';
import { MdOutlineArrowOutward } from 'react-icons/md';
import { useMedia } from 'react-use';

export default function LikesGraph({ profile }) {
  const data = profile.dailyStats || [];
  const latestValue = data[data.length - 1]?.likes || 0;
  const previousValue = data[data.length - 2]?.likes || 0;
  const difference = latestValue - previousValue;
  const isIncreased = difference > 0;
  const isDecreased = difference < 0;
  const isEqual = difference === 0;
  const diffInPercent = ((latestValue - previousValue) / previousValue) * 100;
  const diffInPercentClean = diffInPercent === Infinity ? 100 : isNaN(diffInPercent) ? 0 : diffInPercent;

  const isMobile = useMedia('(max-width: 640px)', false);

  return (
    <>
      <h2 className='flex items-center gap-x-2 text-xl font-semibold'>
        {t('profilePage.graph.likes.title')}

        <Tooltip
          content={t(`graph.tooltip.${isIncreased ? 'increased' : isDecreased ? 'decreased' : 'noChanges'}`, { count: 0, difference, postProcess: 'interval' })}
          side={isMobile ? 'bottom' : 'right'}
        >
          <div
            className={cn(
              'select-none flex w-max gap-x-1 px-2 items-center py-1 text-xs font-semibold rounded-lg',
              isIncreased && 'dark:bg-emerald-300/10 dark:text-emerald-300 bg-emerald-600/10 text-emerald-600',
              isDecreased && 'dark:bg-red-400/10 dark:text-red-400 bg-red-600/10 text-red-600',
              isEqual && 'bg-quaternary text-tertiary'
            )}
          >
            <span>{diffInPercentClean.toFixed(1)}%</span>

            {isIncreased && <MdOutlineArrowOutward />}
            {isDecreased && <MdOutlineArrowOutward className='rotate-180' />}
          </div>
        </Tooltip>
      </h2>

      <p className='mt-2 whitespace-pre-wrap text-tertiary'>
        {t('profilePage.graph.likes.subtitle')}
      </p>

      <div className='mt-8 w-full'>
        <Graph
          color={(isIncreased || isDecreased) ? 'rgb(168, 85, 247)' : '#b4b4b4'}
          data={profile.dailyStats.map(({ createdAt, likes }) => ({ createdAt, value: likes })).reverse()}
          id='profileLikes'
          tooltipFormatter={value => value.toLocaleString('en-US')}
        />
      </div>
    </>
  );
}