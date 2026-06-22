'use client';

import dynamic from 'next/dynamic';
import { useTranslation } from 'react-i18next';

const DynamicApexCharts = dynamic(() => import('react-apexcharts'), {
  ssr: false
});

function generateEmptyData() {
  return [
    { createdAt: new Date(), value: 532 },
    { createdAt: new Date(), value: 353 },
    { createdAt: new Date(), value: 453 },
    { createdAt: new Date(), value: 437 },
    { createdAt: new Date(), value: 343 },
    { createdAt: new Date(), value: 544 },
    { createdAt: new Date(), value: 356 }
  ];
}

export default function Graph({ id, data, tooltipFormatter, color, extraGraphOptions = {}, xAxisCategories, xaxisRange, height = 300 }) {
  const { t, i18n } = useTranslation();

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
        <div className='absolute top-0 left-0 z-1 flex size-full items-center justify-center bg-background/50 backdrop-blur-xs'>
          <span className='text-sm font-medium text-tertiary select-none'>
            {t('graph.noData')}
          </span>
        </div>
      )}

      <DynamicApexCharts
        className='relative z-0'
        type='area'
        height={height}
        width='100%'
        series={[{
          data: reversedData.filter(({ createdAt }) => new Date(createdAt)).map(({ value }) => value),
          name: id
        }]}
        options={{
          chart: {
            animations: {
              enabled: false
            },
            height: 350,
            type: 'area',
            zoom: {
              enabled: false
            }
          },
          dataLabels: {
            enabled: false
          },
          fill: {
            colors: [color],
            gradient: {
              enabled: true,
              opacityFrom: 0.6,
              opacityTo: 0
            }
          },
          grid: {
            borderColor: 'rgba(var(--bg-secondary))',
            show: true
          },
          markers: {
            colors: ['rgba(var(--bg-background))'],
            hover: {
              size: 6
            },
            shape: 'circle',
            size: 0,
            strokeColors: [color],
            strokeWidth: 2,
            style: 'hollow'
          },
          stroke: {
            colors: [color],
            curve: 'smooth',
            width: 2
          },
          tooltip: {
            custom: ({ series, seriesIndex, dataPointIndex }) =>
              `
                <div class='w-full px-2 py-1.5 h-full bg-secondary rounded-lg border border-primary flex gap-x-2'>
                  <div class='w-[2px] h-full py-5 rounded-full' style='background-color: ${color}'></div>

                  <div class='flex flex-col gap-y-1'>
                    <span class='text-xs flex items-center gap-x-2 font-semibold text-primary'>
                      ${t(`graph.tooltip.${id}`, { count: series[seriesIndex][dataPointIndex] })}
                    </span>

                    <span class='text-xs font-medium text-secondary'>
                      ${xAxisCategories ? xAxisCategories[dataPointIndex] : new Date(reversedData[dataPointIndex].createdAt).toLocaleString(i18n.language, { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                </div>
              `
            ,
            x: {
              show: false
            },
            y: {
              formatter: tooltipFormatter
            }
          },
          xaxis: {
            axisBorder: {
              color: 'rgba(var(--bg-secondary))',
              show: true
            },
            axisTicks: {
              color: 'rgba(var(--bg-secondary))',
              height: 5,
              show: true
            },
            categories: xAxisCategories || reversedData.map(({ createdAt }) => {
              const date = new Date(createdAt);

              return date.toLocaleString(i18n.language, { day: 'numeric', month: 'short' });
            }),
            crosshairs: {
              show: true,
              stroke: {
                color: 'rgba(var(--bg-quaternary))',
                dashArray: 8,
                width: 1
              },
              width: 1
            },
            labels: {
              offsetY: 5,
              show: true,
              style: {
                colors: 'rgba(var(--text-tertiary), 0.5)',
                fontSize: '12px',
                fontWeight: 400
              }
            },
            range: xaxisRange || 6,
            show: false,
            tooltip: {
              enabled: false
            }
          },
          yaxis: {
            labels: {
              style: {
                colors: 'rgba(var(--text-tertiary), 0.5)',
                fontSize: '12px',
                fontWeight: 600
              }
            },
            show: true,
            tickAmount: 4
          },
          ...extraGraphOptions
        }}
      />
    </div>
  );
}