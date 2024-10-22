'use client';

import VolumePopover from '@/app/(sounds)/sounds/components/SoundPreview/VolumePopover';
import config from '@/config';
import useGeneralStore from '@/stores/general';
import useThemeStore from '@/stores/theme';
import WavesurferPlayer from '@wavesurfer/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaPause } from 'react-icons/fa6';
import { HiPlay } from 'react-icons/hi2';
import { MdOutlineArrowOutward } from 'react-icons/md';
import { useLocalStorage } from 'react-use';
import { useShallow } from 'zustand/react/shallow';

export default function Waveform({ id }) {
  const theme = useThemeStore(state => state.theme);

  const { currentlyPlaying, setCurrentlyPlaying, setVolume, volume } = useGeneralStore(useShallow(state => ({
    currentlyPlaying: state.sounds.currentlyPlaying,
    setCurrentlyPlaying: state.sounds.setCurrentlyPlaying,
    setVolume: state.sounds.setVolume,
    volume: state.sounds.volume
  })));

  const [wavesurfer, setWavesurfer] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [localVolume, setLocalVolume] = useLocalStorage('volume', 1);

  const onPlayPause = () => {
    if (!wavesurfer) return;

    if (currentlyPlaying === id) setCurrentlyPlaying('');
    else setCurrentlyPlaying(id);
  };

  useEffect(() => {
    if (!wavesurfer) return;

    wavesurfer.on('audioprocess', time => setCurrentTime(time));
    wavesurfer.setVolume(volume);
    setLocalVolume(volume);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [volume, wavesurfer]);

  useEffect(() => {
    setVolume(localVolume);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!wavesurfer) return;

    if (currentlyPlaying === id) {
      wavesurfer.play();
      wavesurfer.on('finish', () => setCurrentlyPlaying(''));
    } else wavesurfer.pause();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentlyPlaying]);

  return (
    <div className='flex flex-col'>
      <WavesurferPlayer
        barGap={2}
        barHeight={1}
        barRadius={5}
        barWidth={3}
        cursorHeight={20}
        cursorWidth={0}
        dragToSeek={true}
        height={50}
        key={id}
        onReady={wavesurfer => {
          setTotalTime(wavesurfer.getDuration());
          setWavesurfer(wavesurfer);
        }}
        onSeeking={wavesurfer => setCurrentTime(wavesurfer.getCurrentTime())}
        progressColor={theme === 'dark' ? '#ffffff' : '#000000'}
        responsive
        url={config.getSoundURL(id)}
        waveColor={theme === 'dark' ? '#3e3e54' : '#aaaaaa'}
      />

      <div className='mt-2 flex select-none items-center justify-between'>
        <span className='min-w-[40px] text-xs font-medium text-tertiary'>
          {currentTime > totalTime ? totalTime.toFixed(2) : currentTime.toFixed(2)}s
        </span>

        <div className='flex items-center gap-x-4 text-lg'>
          <VolumePopover />

          <button
            className='flex size-[30px] items-center justify-center rounded-full bg-black text-[rgba(var(--bg-secondary))] outline-none hover:bg-black/70 dark:bg-white dark:hover:bg-white/70'
            onClick={onPlayPause}
          >
            {currentlyPlaying === id ? (
              <FaPause />
            ) : (
              <HiPlay className='relative left-px' />
            )}
          </button>

          <Link
            className='text-tertiary hover:text-secondary'
            href={`/sounds/${id}`}
          >
            <MdOutlineArrowOutward />
          </Link>
        </div>

        <span className='min-w-[40px] text-xs font-medium text-tertiary'>
          {totalTime.toFixed(2)}s
        </span>
      </div>
    </div>
  );
}