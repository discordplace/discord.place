import Graph from '@/app/(dashboard)/components/Home/Graph/index';
import cn from '@/lib/cn';
import { MdOutlineArrowOutward } from 'react-icons/md';
import Tooltip from '@/app/components/Tooltip';
import { useMedia } from 'react-use';

export default function MonthlyVotesGraph({ server }) {
  const data = server.monthly_votes || [];
  const latestValue = data[data.length - 1]?.votes || 0;
  const previousValue = data[data.length - 2]?.votes || 0;
  const difference = latestValue - previousValue;
  const isIncreased = difference > 0;
  const isDecreased = difference < 0;
  const isEqual = difference === 0;
  const diffInPercent = ((latestValue - previousValue) / previousValue) * 100;
  const diffInPercentClean = diffInPercent === Infinity ? 100 : isNaN(diffInPercent) ? 0 : diffInPercent;

  const isMobile = useMedia('(max-width: 640px)', false);

  return (
    <div className='lg:max-w-[70%] w-full px-8 lg:px-0'>
      <h2 className='flex items-center text-xl font-semibold gap-x-2'>
        Monthly Votes Graph

        <Tooltip
          side={isMobile ? 'bottom' : 'right'}
          content={`${isIncreased ? 'Increased' : isDecreased ? 'Decreased' : 'No change'} since last month (${difference})`}
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

      <p className='mt-2 text-sm whitespace-pre-wrap text-tertiary'>
        The amount of votes this server has received over time.
      </p>

      <div className='w-full mt-8'>
        <Graph
          id='monthlyVotes'
          data={server.monthly_votes.map(({ created_at, votes }) => ({ createdAt: created_at, value: votes })).reverse()}
          tooltipFormatter={value => value.toLocaleString('en-US')}
          tooltipLabel='Votes'
          tooltipIcon='<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="20px" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="M9 13l3 -3l3 3"></path><path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z"></path></svg>'
          color={
            isIncreased ? '#64b071' :
              isDecreased ? '#e75f62' :
                '#b4b4b4'
          }
          xaxisRange={server.monthly_votes.length}
          xAxisCategories={server.monthly_votes.map(({ created_at }) => new Date(created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }))}
        />
      </div>
    </div>
  );
}