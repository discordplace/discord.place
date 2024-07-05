'use client';

import useThemeStore from '@/stores/theme';
import { useEffect, useState } from 'react';
import WavesurferPlayer from '@wavesurfer/react';
import { HiPlay } from 'react-icons/hi2';
import { FaPause } from 'react-icons/fa6';
import { MdOutlineArrowOutward } from 'react-icons/md';
import Link from 'next/link';
import useGeneralStore from '@/stores/general';
import { useShallow } from 'zustand/react/shallow';
import VolumePopover from '@/app/(sounds)/sounds/components/SoundPreview/VolumePopover';
import { useLocalStorage } from 'react-use';
import config from '@/config';

export default function Waveform({ id }) {
  const theme = useThemeStore(state => state.theme);

  const { currentlyPlaying, setCurrentlyPlaying, removeCurrentlyPlaying } = useGeneralStore(useShallow(state => ({
    currentlyPlaying: state.sounds.currentlyPlaying,
    setCurrentlyPlaying: state.sounds.setCurrentlyPlaying,
    removeCurrentlyPlaying: state.sounds.removeCurrentlyPlaying
  })));  

  const [wavesurfer, setWavesurfer] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [volume, setVolume] = useLocalStorage('soundplayer_volume', 1);

  const onPlayPause = () => {
    wavesurfer && wavesurfer.playPause();
  };

  useEffect(() => {
    if (!wavesurfer) return;

    wavesurfer.on('audioprocess', time => setCurrentTime(time));
  }, [wavesurfer]);

  useEffect(() => {
    if (!wavesurfer) return;

    wavesurfer.setVolume(volume);
  
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [volume]);

  return (
    <div className='flex flex-col'>
      <WavesurferPlayer
        key={id}
        waveColor={theme === 'dark' ? '#585858' : '#aaaaaa'}
        progressColor={theme === 'dark' ? '#ffffff' : '#000000'}
        barWidth={3}
        barHeight={1}
        barRadius={5}
        barGap={2}
        height={50}
        responsive
        cursorWidth={0}
        cursorHeight={20}
        dragToSeek={true}
        backend='WebAudio'
        url={config.getSoundURL(id)}
        onReady={wavesurfer => {
          setTotalTime(wavesurfer.getDuration());
          setWavesurfer(wavesurfer);
        }}
        onPlay={() => setCurrentlyPlaying(id)}
        onPause={() => removeCurrentlyPlaying(id)}
        onSeeking={wavesurfer => setCurrentTime(wavesurfer.getCurrentTime())}
      />

      <div className='flex items-center justify-between mt-2 select-none'>
        <span className='min-w-[40px] text-xs font-medium text-tertiary'>
          {currentTime > totalTime ? totalTime.toFixed(2) : currentTime.toFixed(2)}s
        </span>
          
        <div className='flex items-center text-lg gap-x-4'>
          <VolumePopover
            volume={volume}
            setVolume={setVolume}
          />

          <button
            className='outline-none text-[rgba(var(--bg-secondary))] bg-black hover:bg-black/70 dark:bg-white dark:hover:bg-white/70 w-[30px] h-[30px] items-center flex justify-center rounded-full'
            onClick={onPlayPause}
          >
            {currentlyPlaying.includes(id) ? (
              <FaPause />
            ) : (
              <HiPlay className='relative left-[1px]' />
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