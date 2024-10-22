'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { Suspense } from 'react';

export default function ProgressBarProvider({ children }) {
  return (
    <>
      {children}
      <Suspense fallback={null}>
        <ProgressBar
          color='rgb(var(--bg-quaternary))'
          height='4px'
          options={{ showSpinner: true }}
          shallowRouting
        />
      </Suspense>
    </>
  );
}