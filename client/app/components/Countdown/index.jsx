'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const ReactCountdown = dynamic(() => import('react-countdown'), {
  ssr: false
});

function initialRender(date, renderer) {
  const total = Math.max(0, date - Date.now());
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 60_000) % 60);
  const hours = Math.floor(total / 3_600_000);

  return renderer({
    completed: total === 0,
    days: 0,
    hours,
    milliseconds: total,
    minutes,
    seconds,
    total
  });
}

export default function Countdown({ date, renderer }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) return <span suppressHydrationWarning={true}>{initialRender(date, renderer)}</span>;

  return (
    <ReactCountdown
      date={date}
      renderer={renderer}
      daysInHours={true}
    />
  );
}
