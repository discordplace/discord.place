import { useEffect, useState } from 'react';
import { PiHeart, PiHeartFill } from 'react-icons/pi';
import Waveform from '@/app/(sounds)/sounds/components/SoundPreview/Waveform';
import cn from '@/lib/cn';
import useGeneralStore from '@/stores/general';
import { PiWaveformBold } from 'react-icons/pi';
import { MdAccountCircle, MdDownload } from 'react-icons/md';
import { IoMdCalendar } from 'react-icons/io';
import { toast } from 'sonner';
import useAuthStore from '@/stores/auth';
import likeSound from '@/lib/request/sounds/likeSound';
import revalidateSound from '@/lib/revalidate/sound';
import { TbLoader } from 'react-icons/tb';
import useSearchStore from '@/stores/sounds/search';
import Tooltip from '@/app/components/Tooltip';
import useThemeStore from '@/stores/theme';
import { FaCloudUploadAlt } from 'react-icons/fa';
import UploadSoundToDiscordModal from '@/app/(sounds)/sounds/components/SoundPreview/UploadSoundToDiscordModal';
import getSoundUploadableGuilds from '@/lib/request/auth/getSoundUploadableGuilds';
import uploadSoundToGuild from '@/lib/request/sounds/uploadSoundToGuild';
import confetti from '@/lib/lotties/confetti.json';
import useModalsStore from '@/stores/modals';
import { useShallow } from 'zustand/react/shallow';
import Lottie from 'react-lottie';
import useLanguageStore, { t } from '@/stores/language';

export default function SoundPreview({ sound, overridedSort, showUploadToGuildButton }) {
  const loggedIn = useAuthStore(state => state.loggedIn);
  const language = useLanguageStore(state => state.language);
  const [liked, setLiked] = useState(sound.isLiked);
  const [loading, setLoading] = useState(false);

  const handleLike = () => {
    if (!loggedIn) return toast.error(t('soundCard.toast.notLoggedIn'));

    setLoading(true);

    toast.promise(likeSound(sound.id), {
      loading: t(`soundCard.toast.${liked ? 'unliking' : 'liking'}`, { soundName: sound.name }),
      success: isLiked => {
        setLiked(isLiked);
        setLoading(false);
        revalidateSound(sound.id);

        return t(`soundCard.toast.${isLiked ? 'liked' : 'unliked'}`, { soundName: sound.name });
      },
      error: error => {
        setLoading(false);

        return error;
      }
    });
  };

  const currentlyPlaying = useGeneralStore(state => state.sounds.currentlyPlaying);

  const storedSort = useSearchStore(state => state.sort);
  const sort = overridedSort || storedSort;

  const formatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short'
  });

  const info = [
    {
      icon: MdDownload,
      value: formatter.format(sound.downloadsCount),
      condition: sort === 'Downloads'
    },
    {
      icon: PiHeartFill,
      value: formatter.format(sound.likesCount),
      condition: sort === 'Likes'
    },
    {
      icon: IoMdCalendar,
      value: new Date(sound.createdAt).toLocaleDateString(language, { year: 'numeric', month: 'short', day: 'numeric' }),
      condition: sort === 'Newest' || sort === 'Oldest'
    }
  ];

  const theme = useThemeStore(state => state.theme);

  const [uploadToDiscordButtonLoading, setUploadToDiscordButtonLoading] = useState(false);
  const [uploadableGuilds, setUploadableGuilds] = useState(null);
  const [renderConfetti, setRenderConfetti] = useState(false);

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
      loading: t('soundCard.uploadSoundToDiscordModal.toast.uploadingSound', { soundName: sound.name }),
      success: () => {
        closeModal('upload-sound-to-discord');
        setRenderConfetti(true);
        revalidateSound(sound.id);

        return t('soundCard.uploadSoundToDiscordModal.toast.soundUploaded', { soundName: sound.name });
      },
      error: error => {
        enableButton('upload-sound-to-discord', 'upload');

        return error;
      }
    });
  }

  const { openModal, openedModals, updateModal, closeModal, disableButton, enableButton } = useModalsStore(useShallow(state => ({
    openModal: state.openModal,
    openedModals: state.openedModals,
    updateModal: state.updateModal,
    closeModal: state.closeModal,
    disableButton: state.disableButton,
    enableButton: state.enableButton
  })));

  const selectedGuildId = useGeneralStore(state => state.uploadSoundToDiscordModal.selectedGuildId);

  useEffect(() => {
    if (!uploadableGuilds) return;
    if (openedModals.some(modal => modal.id === 'upload-sound-to-discord')) {
      updateModal('upload-sound-to-discord', {
        buttons: [
          {
            id: 'cancel',
            label: t('buttons.cancel'),
            variant: 'ghost',
            actionType: 'close'
          },
          {
            id: 'upload',
            label: t('buttons.upload'),
            variant: 'solid',
            action: () => continueUploadSoundToGuild(selectedGuildId)
          }
        ]
      });

      return;
    }

    openModal('upload-sound-to-discord', {
      title: <>
        <PiWaveformBold className='mr-1 inline' />
        {sound.name}
      </>,
      description: t('soundCard.uploadSoundToDiscordModal.description'),
      content: <UploadSoundToDiscordModal guilds={uploadableGuilds} />,
      buttons: [
        {
          id: 'cancel',
          label: 'Cancel',
          variant: 'ghost',
          actionType: 'close'
        },
        {
          id: 'uplaod',
          label: 'Upload',
          variant: 'solid',
          action: () => continueUploadSoundToGuild(selectedGuildId)
        }
      ]
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadableGuilds, selectedGuildId]);

  return (
    <div
      className={cn(
        'flex flex-col gap-y-4 rounded-3xl overflow-hidden w-full h-max bg-secondary border-2 transition-all p-6',
        currentlyPlaying === sound.id ? 'border-purple-500' : 'border-primary'
      )}
    >
      <div className="pointer-events-none fixed left-0 top-0 z-10 h-svh w-full">
        {renderConfetti && (
          <Lottie
            options={{
              loop: false,
              autoplay: true,
              animationData: confetti
            }}
            height="100%"
            width="100%"
          />
        )}
      </div>

      <div className="flex items-start justify-between">
        <div className="flex max-w-[90%] flex-col">
          <h2 className="truncate text-base font-semibold text-primary">
            <PiWaveformBold className='mr-2 inline' />
            {sound.name}
          </h2>

          <div className="flex items-center gap-2 text-base font-medium text-tertiary">
            <div className='flex items-center gap-x-2'>
              <MdAccountCircle />

              <span className='text-xs'>
                @{sound.publisher.username}
              </span>
            </div>

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
            ) : liked ? (
              <PiHeartFill />
            ) : (
              <PiHeart />
            )}
          </button>

          {showUploadToGuildButton && (
            <Tooltip content={t(`soundCard.buttons.${loggedIn ? 'upload' : 'login'}`)}>
              <button
                className={cn(
                  'px-1.5 py-1 flex items-center gap-x-1 text-sm font-medium disabled:opacity-70 rounded-lg cursor-pointer',
                  theme === 'dark' ? 'bg-white text-black' : ' bg-black text-white',
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

      <Waveform id={sound.id} />
    </div>
  );
}