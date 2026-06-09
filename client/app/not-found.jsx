'use client';

import useThemeStore from '@/stores/theme';
import Image from 'next/image';
import Link from 'next/link';
import Grainient from '@/app/components/Background/Grainient';
import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { t } from '@/stores/language';

export default function NotFound() {
  const theme = useThemeStore(state => state.theme);

  const timeoutRef = useRef(null);
  const remainingTimeIntervalRef = useRef(null);
  const router = useRouter();
  const [remainingTime, setRemainingTime] = useState(10);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => router.push('/'), 10_000);
    remainingTimeIntervalRef.current = setInterval(() => setRemainingTime(prev => (prev <= 1 ? 0 : prev - 1)), 1000);

    return () => {
      clearTimeout(timeoutRef.current);
      clearInterval(remainingTimeIntervalRef.current);
    };
  }, []);

  return (
    <div className='relative z-0 flex h-svh w-full flex-col items-center justify-center px-8 sm:px-0'>
      <div className='absolute top-0 left-0 z-[-1] size-full overflow-hidden rounded-lg'>
        <Grainient
          color1={theme === 'dark' ? '#0f0f14' : '#eeeeee'}
          color2="#5b3f76"
          color3={theme === 'dark' ? '#0f0f14' : '#eeeeee'}
          timeSpeed={0.25}
          colorBalance={0}
          warpStrength={1}
          warpFrequency={5}
          warpSpeed={2}
          warpAmplitude={50}
          blendAngle={0}
          blendSoftness={0.05}
          rotationAmount={500}
          noiseScale={2}
          grainAmount={0.1}
          grainScale={2}
          grainAnimated={false}
          contrast={1.5}
          gamma={1}
          saturation={1}
          centerX={0}
          centerY={0}
          zoom={0.9}
        />
      </div>

      <div className='flex flex-col'>
        <h2 className='font-oranienbaum text-3xl'>
          {t('notFoundPage.title')}
        </h2>

        <p className='mt-6 max-h-[200px] w-full max-w-[500px] text-base text-secondary'>
          {t('notFoundPage.description')}
        </p>

        <span className='mt-2 text-xs text-tertiary'>
          {t('notFoundPage.redirectText', { count: remainingTime })}
        </span>

        <div className='mt-6 flex w-full items-center justify-between'>
          <Link
            className='pointer-events-auto w-max rounded-full bg-black/5 px-4 py-1.5 text-sm font-semibold text-primary backdrop-blur-sm hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10'
            href='/'
          >
            {t('notFoundPage.goHome')}
          </Link>

          <Image
            src={theme === 'dark' ? '/symbol_white.png' : '/symbol_black.png'}
            width={64}
            height={64}
            alt='discord.place Logo'
            className='size-[24px]'
            priority={true}
          />
        </div>
      </div>
    </div>
  );
}