'use client';

import useThemeStore from '@/stores/theme';
import Image from 'next/image';
import Link from 'next/link';
import Grainient from '@/app/components/Background/Grainient';
import { useTranslation } from 'react-i18next';
import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function Error({ error }) {
  const { t } = useTranslation();
  const theme = useThemeStore(state => state.theme);

  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

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
          {t('errorPage.title')}
        </h2>

        <div className='rounded-2xl bg-black/10 p-3 text-sm text-secondary backdrop-blur-xs'>
          <pre className='max-w-[500px] text-left font-mono break-words whitespace-pre-wrap'>
            Error: {error.message}
          </pre>
        </div>

        <div className='mt-6 flex w-full items-center justify-between'>
          <Link
            className='pointer-events-auto w-max rounded-full bg-black/5 px-4 py-1.5 text-sm font-semibold text-primary backdrop-blur-xs hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10'
            href='/'
          >
            {t('buttons.goHome')}
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