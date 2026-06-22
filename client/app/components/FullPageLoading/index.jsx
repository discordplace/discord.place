'use client';

import cn from '@/lib/cn';
import { useThemeStore } from '@/stores/theme';

export default function FullPageLoading({ position = 'fixed' }) {
  const theme = useThemeStore(state => state.theme);
  const logoBase64 = `/symbol_${theme === 'dark' ?'black': 'white'}_outline.svg`;

  return (
    <div
      className={cn(
        'pointer-events-none top-0 left-0 z-[99999] flex size-full items-center justify-center bg-background',
        position === 'fixed' ? 'fixed' : 'absolute'
      )}
    >
      <div className='relative'>
        <div
          className='absolute top-0 left-0 -z-[2] size-full drop-shadow-[0_0px_min(calc(1vw/2),calc(2560px*.01/2))_rgba(var(--bg-secondary))]'
          style={{
            animationDuration: '2.15s',
            animationFillMode: 'both',
            animationIterationCount: 'infinite',
            animationName: 'logoLoading',
            animationTimingFunction: 'cubic-bezier(.455, .03, .515, .955)',
            background: `url(${logoBase64}) 50%/cover no-repeat`
          }}
        />

        <div
          // oxlint-disable-next-line tailwindcss/no-unknown-classes
          className='logoLoadingInner relative z-[9999] size-[min(calc(24vw/2),calc(2560px*.24/2))] bg-secondary'
          style={{
            animationDuration: '2.15s',
            animationFillMode: 'both',
            animationIterationCount: 'infinite',
            animationName: 'logoLoadingInner',
            animationTimingFunction: 'cubic-bezier(.455, .03, .515, .955)',
            maskImage: `url(${logoBase64})`,
            maskSize: 'cover',
            WebkitMaskImage: `url(${logoBase64})`,
            WebkitMaskSize: 'cover'
          }}
        />
      </div>
    </div>
  );
}