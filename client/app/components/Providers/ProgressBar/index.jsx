'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { Suspense } from 'react';

export default function ProgressBarProvider({ children }) {
  return (
    <>
      {children}
      <Suspense fallback={null}>
        <ProgressBar
          height='4px'
          color='rgb(var(--bg-quaternary))'
          options={{ showSpinner: true }}
          shallowRouting
        />
      </Suspense>
    </>
  );
}