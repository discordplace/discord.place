'use client';

import cn from '@/lib/cn';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import getStatus from '@/lib/request/general/getStatus';
import config from '@/config';

export default function StatusBadge() {
  const [statusData, setStatusData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element || hasLoaded) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          fetchStatus();
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [hasLoaded]);

  async function fetchStatus() {
    setIsLoading(true);

    try {
      const data = await getStatus();
      setStatusData(data);
      setHasLoaded(true);
    } catch (error) {
      console.error('Failed to fetch status:', error);

      setStatusData({ message: 'Status Unknown', status: 'unknown' });
      setHasLoaded(true);
    } finally {
      setIsLoading(false);
    }
  };

  function getStatusColor(status) {
    switch (status) {
      case 'UP': { return 'bg-lime-500';
      }
      case 'DEGRADED': { return 'bg-amber-500';
      }
      case 'DOWN': { return 'bg-red-500';
      }
      case 'MAINTENANCE': { return 'bg-sky-500';
      }
      default: { return 'bg-quaternary';
      }
    }
  };

  function getStatusMessage(status) {
    switch (status) {
      case 'UP': { return 'All systems operational';
      }
      case 'DEGRADED': { return 'Degraded performance';
      }
      case 'DOWN': { return 'System outage';
      }
      case 'MAINTENANCE': { return 'Under maintenance';
      }
      default: { return 'Unknown';
      }
    }
  }

  if (isLoading || !statusData) {
    return (
      <div
        ref={containerRef}
        className='inline-flex items-center gap-2 rounded-lg border border-[rgba(var(--bg-secondary))] bg-secondary px-3 py-1.5'
      >
        <span className='relative flex size-1.5'>
          <span className='relative inline-flex size-1.5 rounded-full bg-tertiary' />
        </span>

        <span className='relative h-4 w-[169.63px] overflow-hidden rounded bg-tertiary'>
          <span className='absolute inset-0 -translate-x-full animate-shimmer bg-linear-to-r from-transparent to-transparent dark:via-white/5' />
        </span>
      </div>
    );
  }

  return (
    <Link
      href={config.statusUrl}
      target='_blank'
      rel='noopener noreferrer'
      className='inline-flex items-center gap-2 rounded-lg border border-primary px-3 py-1.5 transition-colors hover:border-[rgba(var(--bg-tertiary))] hover:bg-tertiary'
    >
      <span className='relative flex size-1.5'>
        {statusData.status === 'UP' && (
          <span className='absolute inline-flex size-full animate-ping rounded-full bg-green-500 opacity-75' />
        )}

        <span
          className={cn(
            'relative inline-flex size-1.5 rounded-full',
            getStatusColor(statusData.status)
          )}
        />
      </span>

      <span className='text-xs font-medium text-tertiary'>
        {getStatusMessage(statusData.status)}
      </span>
    </Link>
  );
}