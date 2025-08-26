'use client';

import { HiPlay, FaPause, BsThreeDots, LuCloudDownload, TiArrowUpOutline, PiShareFat } from '@/icons';
import useThemeStore from '@/stores/theme';
import { useEffect, useState } from 'react';
import WavesurferPlayer from '@wavesurfer/react';
import useGeneralStore from '@/stores/general';
import { useShallow } from 'zustand/react/shallow';
import VolumePopover from '@/app/(sounds)/sounds/components/SoundPreview/VolumePopover';
import config from '@/config';
import { useLocalStorage } from 'react-use';
import useModalsStore from '@/stores/modals';
import { t } from '@/stores/language';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';
import downloadSound from '@/lib/utils/sounds/downloadSound';

export default function Waveform({ id, name: soundName }) {
  const theme = useThemeStore(state => state.theme);

  const { currentlyPlaying, setCurrentlyPlaying, volume, setVolume } = useGeneralStore(useShallow(state => ({
    currentlyPlaying: state.sounds.currentlyPlaying,
    setCurrentlyPlaying: state.sounds.setCurrentlyPlaying,
    volume: state.sounds.volume,
    setVolume: state.sounds.setVolume
  })));

  const { openModal, closeModal } = useModalsStore(useShallow(state => ({
    openModal: state.openModal,
    disableButton: state.disableButton,
    enableButton: state.enableButton,
    closeModal: state.closeModal,
    updateModal: state.updateModal
  })));

  const [wavesurfer, setWavesurfer] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [localVolume, setLocalVolume] = useLocalStorage('volume', 1);
  const [isLoud, setIsLoud] = useState(false);
  const [localLoudSoundsIgnored, setLocalLoudSoundsIgnored] = useLocalStorage('soundplayer_loudSoundsIgnored', false);
  const loudSoundsIgnored = useGeneralStore(state => state.soundPlayer.loudSoundsIgnored);
  const setLoudSoundsIgnored = useGeneralStore(state => state.soundPlayer.setLoudSoundsIgnored);

  function onPlayPause() {
    if (!wavesurfer) return;

    if (currentlyPlaying === id) setCurrentlyPlaying('');
    else if (isLoud && !loudSoundsIgnored) {
      openModal(`sound-${id}-is-loud`, {
        title: t('soundPlayer.loudWarningModal.title', { soundName }),
        description: t('soundPlayer.loudWarningModal.description'),
        content: t('soundPlayer.loudWarningModal.content'),
        buttons: [
          {
            id: 'dont-show-again',
            label: t('buttons.dontShowAgain'),
            variant: 'ghost',
            action: () => {
              closeModal(`sound-${id}-is-loud`);
              setLocalLoudSoundsIgnored(true);
              setCurrentlyPlaying(id);
            }
          },
          {
            id: 'cancel',
            label: t('buttons.cancel'),
            variant: 'outlined',
            actionType: 'close'
          },
          {
            id: 'continue',
            label: t('buttons.continue'),
            variant: 'solid',
            action: () => {
              closeModal(`sound-${id}-is-loud`);
              setCurrentlyPlaying(id);
            }
          }
        ]
      });
    } else setCurrentlyPlaying(id);
  }

  useEffect(() => {
    if (!wavesurfer) return;

    function handleAudioProcess(time) {
      setCurrentTime(time);
    }

    wavesurfer.on('audioprocess', handleAudioProcess);
    wavesurfer.setVolume(volume);
    setLocalVolume(volume);

    return () => wavesurfer.un('audioprocess', handleAudioProcess);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [volume, wavesurfer]);

  useEffect(() => {
    setVolume(localVolume);
    setLoudSoundsIgnored(localLoudSoundsIgnored);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLoudSoundsIgnored(localLoudSoundsIgnored);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localLoudSoundsIgnored]);

  useEffect(() => {
    if (!wavesurfer) return;

    if (currentlyPlaying === id) {
      wavesurfer.play();
      wavesurfer.on('finish', () => setCurrentlyPlaying(''));
    } else wavesurfer.pause();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentlyPlaying]);

  const pathname = usePathname();

  return (
    <div className='flex flex-col'>
      <WavesurferPlayer
        key={id}
        waveColor={theme === 'dark' ? '#3e3e54' : '#aaaaaa'}
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
        url={config.getSoundURL(id)}
        onReady={wavesurfer => {
          setTotalTime(wavesurfer.getDuration());
          setWavesurfer(wavesurfer);

          const decodedData = wavesurfer.decodedData;
          if (!decodedData) return;

          const channelData = decodedData.getChannelData(0);
          const frameSize = 1024;
          let maxAmplitude = 0;

          for (let i = 0; i < channelData.length; i += frameSize) {
            const chunk = channelData.slice(i, i + frameSize);
            const peak = Math.max(...chunk);
            if (peak > maxAmplitude) maxAmplitude = peak;
          }

          setIsLoud(maxAmplitude > 0.7);
        }}
        onSeeking={wavesurfer => setCurrentTime(wavesurfer.getCurrentTime())}
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

          <DropdownMenu.Root modal={false}>
            <DropdownMenu.Trigger asChild>
              <button className='flex max-w-[200px] text-tertiary outline-none hover:text-primary'>
                <BsThreeDots />
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content className='relative top-2 z-10 flex min-w-[200px] flex-col gap-y-0.5 rounded-2xl border border-primary bg-secondary p-1.5 outline-none'>
                <DropdownMenu.Arrow className='fill-[rgba(var(--border-primary))]' />

                {!pathname.startsWith('/sounds/') && (
                  <DropdownMenu.Item asChild>
                    <Link
                      className='flex cursor-pointer items-center gap-x-2 rounded-xl p-2 text-sm font-medium text-tertiary outline-none transition-colors data-[highlighted]:bg-tertiary data-[highlighted]:text-primary'
                      href={`/sounds/${id}`}
                    >
                      <TiArrowUpOutline className='rotate-45' size={20} />
                      <span className='relative right-0.5'>
                        View Sound
                      </span>
                    </Link>
                  </DropdownMenu.Item>
                )}

                <DropdownMenu.Item
                  className='flex cursor-pointer items-center gap-x-2 rounded-xl p-2 text-sm font-medium text-tertiary outline-none transition-colors data-[highlighted]:bg-tertiary data-[highlighted]:text-primary'
                  onSelect={() => downloadSound({ id, name: soundName })}
                >
                  <LuCloudDownload size={18} />
                  Download
                </DropdownMenu.Item>

                <DropdownMenu.Item
                  className='flex cursor-pointer items-center gap-x-2 rounded-xl p-2 text-sm font-medium text-tertiary outline-none transition-colors data-[highlighted]:bg-tertiary data-[highlighted]:text-primary'
                  onSelect={() => {
                    if ('clipboard' in navigator === false) return toast.error(t('errorMessages.clipboardNotSupported'));

                    navigator.clipboard.writeText(`https://discord.place/sounds/${id}`);

                    toast.success(t('soundPlayer.linkCopiedToClipboardToast'));
                  }}
                >
                  <PiShareFat size={18} />
                  Share
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>

        <span className='min-w-[40px] text-xs font-medium text-tertiary'>
          {totalTime.toFixed(2)}s
        </span>
      </div>
    </div>
  );
}