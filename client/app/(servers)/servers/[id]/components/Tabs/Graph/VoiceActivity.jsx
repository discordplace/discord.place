import useThemeStore from '@/stores/theme';
import { useEffect } from 'react';

export default function VoiceActivityGraph({ server }) {
  const theme = useThemeStore(state => state.theme);

  useEffect(() => {
    // eslint-disable-next-line no-undef
    if (!ApexCharts) return;

    // eslint-disable-next-line no-undef
    const createdChart = new ApexCharts(document.getElementById('voiceActivityGraph'), {
      series: [{
        name: 'total_members_in_voice',
        data: server.voiceActivity
          ?.filter(activity => new Date(activity.createdAt) > new Date(Date.now() - 86400000))
          ?.map(activity => activity.data)
      }],
      chart: {
        type: 'area',
        height: 350,
        zoom: {
          enabled: false
        }
      },
      grid: {
        show: true,
        borderColor: theme === 'dark' ? '#333' : '#6c757d',
      },
      fill: {
        colors: ['#9c84ef'],
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
        colors: ['#9c84ef'],
        strokeColors: ['#574a83'],
        strokeWidth: 4,
        shape: 'circle'
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth', 
        colors: ['#9c84ef'],
        width: 4
      },
      tooltip: {
        x: {
          show: false
        },
        y: {
          formatter: (value) => value + ' members'
        },
        custom: ({ series, seriesIndex, dataPointIndex }) => {
          return `<div class="bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-xl font-semibold flex gap-x-2 items-center apexcharts-arrow-container">
            <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 24 24" width="18" fill="currentColor"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 15c1.66 0 2.99-1.34 2.99-3L15 6c0-1.66-1.34-3-3-3S9 4.34 9 6v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 15 6.7 12H5c0 3.42 2.72 6.23 6 6.72V22h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/></svg>
            ${series[seriesIndex][dataPointIndex]} members
          </div>`;
        }
      },
      xaxis: {
        range: 12,
        categories: server.voiceActivity
          ?.filter(activity => new Date(activity.createdAt) > new Date(Date.now() - 86400000))
          ?.map(activity => new Date(activity.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })),
        tooltip: {
          enabled: false
        },
        crosshairs: {
          show: true,
          width: 1,       
          stroke: {
            color: theme === 'dark' ? '#666' : '#242a31',
            width: 1,
            dashArray: 5,
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
          color: theme === 'dark' ? '#333' : '#6c757d'
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
      }
    });

    createdChart.render();

    return () => document.getElementById('voiceActivityGraph')?.firstChild?.remove?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  return (
    <div id='voiceActivityGraph' className='px-8 lg:px-0 [&_tspan]:!font-sans' />
  );
}