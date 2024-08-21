'use client';

import useThemeStore from '@/stores/theme';
import dynamic from 'next/dynamic';
import useLanguageStore, { t } from '@/stores/language';

const DynamicApexCharts = dynamic(() => import('react-apexcharts'), {
  ssr: false
});

export default function Graph({ id, data, tooltipFormatter, tooltipIcon, color, extraGraphOptions = {}, xAxisCategories, xaxisRange }) {
  const theme = useThemeStore(state => state.theme);
  const language = useLanguageStore(state => state.language);

  const reversedData = [...data].reverse();

  return (
    <DynamicApexCharts
      type='area'
      height={300}
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
          borderColor: theme === 'dark' ? '#333' : '#c5c5c5'
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
          colors: [theme === 'dark' ? '#333' : '#c5c5c5'],
          strokeColors: [color],
          strokeWidth: 4,
          shape: 'circle'
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth', 
          colors: [color],
          width: 4
        },
        tooltip: {
          x: {
            show: false
          },
          y: {
            formatter: tooltipFormatter
          },
          custom: ({ series, seriesIndex, dataPointIndex }) => {
            return `<div class="bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-xl font-semibold flex gap-x-2 items-center apexcharts-arrow-container">
              ${tooltipIcon}
              ${t(`graph.tooltip.${id}`, { count: series[seriesIndex][dataPointIndex] })}              
            </div>`;
          }
        },
        xaxis: {
          range: xaxisRange || 6,
          categories: xAxisCategories || reversedData.map(({ createdAt }) => {
            const date = new Date(createdAt);
            const day = date.getDate();
            const month = date.toLocaleString(language, { month: 'short' });
  
            return `${day} ${month}`;
          }),
          tooltip: {
            enabled: false
          },
          crosshairs: {
            show: true,
            width: 1,       
            stroke: {
              color: theme === 'dark' ? '#666' : '#242a31',
              width: 1,
              dashArray: 5
            }
          },
          show: false,
          labels: {
            show: true,
            style: {
              colors: theme === 'dark' ? '#999' : '#495057',
              fontSize: '12px',
              fontWeight: 400
            },
            offsetY: 5
          },
          axisBorder: {
            show: true,
            color: theme === 'dark' ? '#333' : '#c5c5c5'
          },
          axisTicks: {
            show: true,
            color: theme === 'dark' ? '#333' : '#6c757d',
            height: 5
          }
        },
        yaxis: {
          show: true,
          tickAmount: 4,
          labels: {
            style: {
              colors: theme === 'dark' ? '#666' : '#242a31',
              fontSize: '12px',
              fontWeight: 600
            }
          }
        },
        ...extraGraphOptions
      }}
    />
  );
}