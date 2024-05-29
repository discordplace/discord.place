import Graph from '@/app/(dashboard)/components/Home/Graph';
import Tooltip from '@/app/components/Tooltip';
import cn from '@/lib/cn';
import { MdOutlineArrowOutward } from 'react-icons/md';
import { useMedia } from 'react-use';

export default function GraphBlock({ icon, label, description, data, tooltipFormatter, tooltipIcon, tooltipLabel, color }) {  
  const tooltipSide = useMedia('(max-width: 640px)', false) ? 'bottom' : 'right';

  const current = data?.[0]?.value || 0;
  const previous = data?.[1]?.value || 0;
  const isIncreased = current > previous;
  const isDecreased = current < previous;
  const isEqual = current === previous;
  const diffInPercent = ((current - previous) / previous) * 100;
  const diffInPercentClean = diffInPercent === Infinity ? 100 : isNaN(diffInPercent) ? 0 : diffInPercent;
  const diffInText = isIncreased ? current - previous : isDecreased ? previous - current : 0;

  return (
    <div className='flex flex-col min-h-[405px] px-6 pt-6 mt-8 mr-6 border rounded-xl border-primary bg-secondary gap-y-4'>
      <div className='flex flex-col gap-y-2'>
        <h2 className='flex items-center text-lg font-semibold gap-x-2 text-primary'>
          {icon}
          {label}
        </h2>

        <p className='text-sm text-tertiary'>
          {description}
        </p>

        <h2 className='flex items-center mt-4 text-3xl font-bold text-primary gap-x-2'>
          {current.toLocaleString('en-US')}
          
          <Tooltip
            side={tooltipSide}
            content={`${isIncreased ? 'Increased' : isDecreased ? 'Decreased' : 'No change'} since yesterday (${diffInText})`}
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

        <div className='w-full h-[1px] bg-quaternary my-4' />

        <Graph
          id={`graph-${label}`}
          data={data || []}
          tooltipFormatter={tooltipFormatter}
          tooltipIcon={tooltipIcon}
          tooltipLabel={tooltipLabel}
          color={color}
        />
      </div>
    </div>
  );
}