'use client';

import ReactCountdown from 'react-countdown';

export default function Countdown({ date, renderer }) {
  return (
    <span suppressHydrationWarning={true}>
      <ReactCountdown
        date={date}
        renderer={renderer}
        daysInHours={true}
      />
    </span>
  );
}
