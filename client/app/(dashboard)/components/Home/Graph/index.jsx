'use client';

import dynamic from 'next/dynamic';
import useLanguageStore, { t } from '@/stores/language';

const DynamicApexCharts = dynamic(() => import('react-apexcharts'), {
  ssr: false
});

function generateEmptyData() {
  return [
    { value: 532, createdAt: new Date() },
    { value: 353, createdAt: new Date() },
    { value: 453, createdAt: new Date() },
    { value: 437, createdAt: new Date() },
    { value: 343, createdAt: new Date() },
    { value: 544, createdAt: new Date() },
    { value: 356, createdAt: new Date() }
  ];
}

export default function Graph({ id, data, tooltipFormatter, color, extraGraphOptions = {}, xAxisCategories, xaxisRange, height = 300 }) {
  const language = useLanguageStore(state => state.language);

  let reversedData = [...data].reverse();
  if (reversedData.length === 0) reversedData = generateEmptyData();

  return (
    <div
      className='relative'
      style={{
        minHeight: `calc(${height}px + 20px)`
      }}
    >
      {data.length === 0 && (
        <div className='absolute top-0 z-[11] left-0 flex items-center justify-center w-full h-full bg-background/50 backdrop-blur-sm'>
          <span className='text-sm font-medium select-none text-tertiary'>
            {t('graph.noData')}
          </span>
        </div>
      )}

      <DynamicApexCharts
        className='relative z-10'
        type='area'
        height={height}
        width='100%'
        series={[{
          name: id,
          data: reversedData.filter(({ createdAt }) => new Date(createdAt)).map(({ value }) => value)
        }]}
        options={{
          chart: {
            animations: {
              enabled: false
            },
            type: 'area',
            height: 350,
            zoom: {
              enabled: false
            }
          },
          grid: {
            show: true,
            borderColor: 'rgba(var(--bg-secondary))'
          },
          fill: {
            colors: [color],
            gradient: {
              enabled: true,
              opacityFrom: 0.6,
              opacityTo: 0
            }
          },
          markers: {
            size: 0,
            style: 'hollow',
            hover: {
              size: 6
            },
            colors: ['rgba(var(--bg-background))'],
            strokeColors: [color],
            strokeWidth: 2,
            shape: 'circle'
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: 'smooth', 
            colors: [color],
            width: 2
          },
          tooltip: {
            x: {
              show: false
            },
            y: {
              formatter: tooltipFormatter
            },
            custom: ({ series, seriesIndex, dataPointIndex }) => {
              return `
                <div class='w-full px-2 py-1.5 h-full bg-secondary rounded-lg border border-primary flex gap-x-2'>
                  <div class='w-[2px] h-full py-5 rounded-full' style='background-color: ${color}'></div>

                  <div class='flex flex-col gap-y-1'>
                    <span class='text-xs flex items-center gap-x-2 font-semibold text-primary'>
                      ${t(`graph.tooltip.${id}`, { count: series[seriesIndex][dataPointIndex] })}
                    </span>

                    <span class='text-xs font-medium text-secondary'>
                      ${xAxisCategories ? xAxisCategories[dataPointIndex] : new Date(reversedData[dataPointIndex].createdAt).toLocaleString(language, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              `;
            }
          },
          xaxis: {
            range: xaxisRange || 6,
            categories: xAxisCategories || reversedData.map(({ createdAt }) => {
              const date = new Date(createdAt);
    
              return date.toLocaleString(language, { month: 'short', day: 'numeric' });
            }),
            tooltip: {
              enabled: false
            },
            crosshairs: {
              show: true,
              width: 1,       
              stroke: {
                color: 'rgba(var(--bg-quaternary))',
                width: 1,
                dashArray: 8
              }
            },
            show: false,
            labels: {
              show: true,
              style: {
                colors: 'rgba(var(--text-tertiary), 0.5)',
                fontSize: '12px',
                fontWeight: 400
              },
              offsetY: 5
            },
            axisBorder: {
              show: true,
              color: 'rgba(var(--bg-secondary))'
            },
            axisTicks: {
              show: true,
              color: 'rgba(var(--bg-secondary))',
              height: 5
            }
          },
          yaxis: {
            show: true,
            tickAmount: 4,
            labels: {
              style: {
                colors: 'rgba(var(--text-tertiary), 0.5)',
                fontSize: '12px',
                fontWeight: 600
              }
            }
          },
          ...extraGraphOptions
        }}
      />
    </div>
  );
}