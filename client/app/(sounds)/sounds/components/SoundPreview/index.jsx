import { FaCloudUploadAlt } from 'react-icons/fa';
import { IoMdCalendar } from 'react-icons/io';
import { MdAccountCircle, MdDownload } from 'react-icons/md';
import { PiHeart, PiHeartFill, PiWaveformBold } from 'react-icons/pi';
import { TbLoader } from 'react-icons/tb';
import { Suspense, useEffect, useRef, useState } from 'react';
import Waveform from '@/app/(sounds)/sounds/components/SoundPreview/Waveform';
import cn from '@/lib/cn';
import useGeneralStore from '@/stores/general';
import { toast } from 'sonner';
import useAuthStore from '@/stores/auth';
import likeSound from '@/lib/request/sounds/likeSound';
import revalidateSound from '@/lib/revalidate/sound';
import useSearchStore from '@/stores/sounds/search';
import Tooltip from '@/app/components/Tooltip';
import useThemeStore from '@/stores/theme';
import UploadSoundToDiscordModal from '@/app/(sounds)/sounds/components/SoundPreview/UploadSoundToDiscordModal';
import getSoundUploadableGuilds from '@/lib/request/auth/getSoundUploadableGuilds';
import uploadSoundToGuild from '@/lib/request/sounds/uploadSoundToGuild';
import confetti from '@/lib/lotties/confetti.json';
import useModalsStore from '@/stores/modals';
import { useShallow } from 'zustand/react/shallow';
import Lottie from 'lottie-react';
import useLanguageStore, { t } from '@/stores/language';
import Link from 'next/link';

export default function SoundPreview({ sound, overridedSort, showUploadToGuildButton }) {
  const loggedIn = useAuthStore(state => state.loggedIn);
  const language = useLanguageStore(state => state.language);
  const [liked, setLiked] = useState(sound.isLiked);
  const [loading, setLoading] = useState(false);
  const [renderConfetti, setRenderConfetti] = useState(false);
  const lottieRef = useRef(null);

  useEffect(() => {
    if (renderConfetti) {
      lottieRef.current?.play();

      const timer = setTimeout(() => {
        setRenderConfetti(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [renderConfetti]);

  function handleLike() {
    if (!loggedIn) return toast.error(t('soundCard.toast.notLoggedIn'));

    setLoading(true);

    toast.promise(likeSound(sound.id), {
      error: error => {
        setLoading(false);

        return error;
      },
      loading: t(`soundCard.toast.${liked ? 'unliking' : 'liking'}`, { soundName: sound.name }),
      success: isLiked => {
        setLiked(isLiked);
        setLoading(false);
        revalidateSound(sound.id);

        return t(`soundCard.toast.${isLiked ? 'liked' : 'unliked'}`, { soundName: sound.name });
      }
    });
  };

  const currentlyPlaying = useGeneralStore(state => state.sounds.currentlyPlaying);

  const storedSort = useSearchStore(state => state.sort);
  const sort = overridedSort || storedSort;

  const formatter = new Intl.NumberFormat('en-US', {
    compactDisplay: 'short',
    notation: 'compact'
  });

  const info = [
    {
      condition: sort === 'Downloads',
      icon: MdDownload,
      value: formatter.format(sound.downloadsCount)
    },
    {
      condition: sort === 'Likes',
      icon: PiHeartFill,
      value: formatter.format(sound.likesCount)
    },
    {
      condition: sort === 'Newest' || sort === 'Oldest',
      icon: IoMdCalendar,
      value: new Date(sound.createdAt).toLocaleDateString(language, { day: 'numeric', month: 'short', year: 'numeric' })
    }
  ];

  const theme = useThemeStore(state => state.theme);

  const [uploadToDiscordButtonLoading, setUploadToDiscordButtonLoading] = useState(false);
  const [uploadableGuilds, setUploadableGuilds] = useState(null);

  function uploadToDiscord() {
    setUploadToDiscordButtonLoading(true);

    getSoundUploadableGuilds()
      .then(setUploadableGuilds)
      .catch(toast.error)
      .finally(() => setUploadToDiscordButtonLoading(false));
  }

  function continueUploadSoundToGuild(guildId) {
    if (!guildId) {
      toast.error(t('soundCard.uploadSoundToDiscordModal.toast.guildNotFound'));

      return;
    }

    disableButton('upload-sound-to-discord', 'upload');

    toast.promise(uploadSoundToGuild(sound.id, guildId), {
      error: error => {
        enableButton('upload-sound-to-discord', 'upload');

        return error;
      },
      loading: t('soundCard.uploadSoundToDiscordModal.toast.uploadingSound', { soundName: sound.name }),
      success: () => {
        closeModal('upload-sound-to-discord');
        setRenderConfetti(true);
        revalidateSound(sound.id);

        return t('soundCard.uploadSoundToDiscordModal.toast.soundUploaded', { soundName: sound.name });
      }
    });
  }

  const { openModal, openedModals, updateModal, closeModal, disableButton, enableButton } = useModalsStore(useShallow(state => ({
    closeModal: state.closeModal,
    disableButton: state.disableButton,
    enableButton: state.enableButton,
    openedModals: state.openedModals,
    openModal: state.openModal,
    updateModal: state.updateModal
  })));

  const selectedGuildId = useGeneralStore(state => state.uploadSoundToDiscordModal.selectedGuildId);

  useEffect(() => {
    if (!uploadableGuilds) return;
    if (openedModals.some(modal => modal.id === 'upload-sound-to-discord')) {
      updateModal('upload-sound-to-discord', {
        buttons: [
          {
            actionType: 'close',
            id: 'cancel',
            label: t('buttons.cancel'),
            variant: 'ghost'
          },
          {
            action: () => continueUploadSoundToGuild(selectedGuildId),
            id: 'upload',
            label: t('buttons.upload'),
            variant: 'solid'
          }
        ]
      });

      return;
    }

    openModal('upload-sound-to-discord', {
      buttons: [
        {
          actionType: 'close',
          id: 'cancel',
          label: 'Cancel',
          variant: 'ghost'
        },
        {
          action: () => continueUploadSoundToGuild(selectedGuildId),
          id: 'uplaod',
          label: 'Upload',
          variant: 'solid'
        }
      ],
      content: <UploadSoundToDiscordModal guilds={uploadableGuilds} />,
      description: t('soundCard.uploadSoundToDiscordModal.description'),
      title: <>
        <PiWaveformBold className='mr-1 inline' />
        {sound.name}
      </>
    });
  }, [uploadableGuilds, selectedGuildId]);

  return (
    <div
      className={cn(
        'flex h-max w-full flex-col gap-y-4 overflow-hidden rounded-3xl border-2 bg-secondary p-6 transition-all',
        currentlyPlaying === sound.id ? 'border-purple-500' : 'border-primary'
      )}
    >
      <div className='pointer-events-none fixed top-0 left-0 z-10 h-svh w-full'>
        <Lottie lottieRef={lottieRef} loop={false} autoplay={false} animationData={confetti} height='100%' width='100%' />
      </div>

      <div className='flex items-start justify-between'>
        <div className='flex max-w-[90%] flex-col'>
          <h2 className='truncate text-base font-semibold text-primary'>
            <PiWaveformBold className='mr-2 inline' />
            {sound.name}
          </h2>

          <div className='flex items-center gap-2 text-base font-medium text-tertiary'>
            <Link
              className='flex items-center gap-x-2 transition-colors hover:text-primary'
              href={`/profile/u/${sound.publisher.id}`}
            >
              <MdAccountCircle />

              <span className='text-xs'>
                @{sound.publisher.username}
              </span>
            </Link>

            {info.filter(({ condition }) => condition === true).map(({ icon: Icon, value }) => (
              <div
                className='flex items-center gap-x-2'
                key={`sound-${sound.id}-info`}
              >
                <Icon />

                <span className='text-xs'>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className='flex gap-x-2'>
          <button
            className='text-lg hover:opacity-60 disabled:pointer-events-none disabled:opacity-60'
            onClick={handleLike}
            disabled={loading}
          >
            {loading ? (
              <TbLoader className='animate-spin' />
            ) : (liked ? (
              <PiHeartFill />
            ) : (
              <PiHeart />
            ))}
          </button>

          {showUploadToGuildButton && (
            <Tooltip content={t(`soundCard.buttons.${loggedIn ? 'upload' : 'login'}`)}>
              <button
                className={cn(
                  'flex cursor-pointer items-center gap-x-1 rounded-lg px-1.5 py-1 text-sm font-medium disabled:opacity-70',
                  theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white',
                  loggedIn && (theme === 'dark' ? 'hover:bg-white/70' : 'hover:bg-black/70')
                )}
                onClick={() => {
                  if (!loggedIn) return;

                  uploadToDiscord();
                }}
                disabled={!loggedIn || uploadToDiscordButtonLoading}
              >
                {uploadToDiscordButtonLoading ? (
                  <TbLoader className='animate-spin' />
                ) : (
                  <FaCloudUploadAlt />
                )}
              </button>
            </Tooltip>
          )}
        </div>
      </div>

      <Suspense fallback={<></>}>
        <Waveform
          id={sound.id}
          name={sound.name}
        />
      </Suspense>
    </div>
  );
}