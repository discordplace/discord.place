'use client';

import { FaCloudUploadAlt } from 'react-icons/fa';
import { TbLoader } from 'react-icons/tb';
import useThemeStore from '@/stores/theme';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import MotionImage from '@/app/components/Motion/Image';
import cn from '@/lib/cn';
import getEmojiUploadableGuilds from '@/lib/request/auth/getEmojiUploadableGuilds';
import { toast } from 'sonner';
import useModalsStore from '@/stores/modals';
import { useShallow } from 'zustand/react/shallow';
import UploadEmojiToDiscordModal from '@/app/(emojis)/emojis/components/UploadEmojiToDiscordModal';
import Image from 'next/image';
import useGeneralStore from '@/stores/general';
import uploadEmojiToGuild from '@/lib/request/emojis/uploadEmojiToGuild';
import Lottie from 'lottie-react';
import confetti from '@/lib/lotties/confetti.json';
import useAuthStore from '@/stores/auth';
import Tooltip from '@/app/components/Tooltip';
import { useTranslation } from 'react-i18next';

export default function EmojiPreview({ id, name, image_url, ableToChange, defaultSize }) {
  const { t } = useTranslation();
  const loggedIn = useAuthStore(state => state.loggedIn);
  const [previewSize, setPreviewSize] = useState(defaultSize === 'shrink' ? 32 : 96);
  const theme = useThemeStore(state => state.theme);
  const [patternDarkMode, setPatternDarkMode] = useState(theme === 'dark');
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

  useEffect(() => {
    setPatternDarkMode(theme === 'dark');
  }, [theme]);

  const [uploadToDiscordButtonLoading, setUploadToDiscordButtonLoading] = useState(false);
  const [uploadableGuilds, setUploadableGuilds] = useState(null);

  function uploadToDiscord() {
    setUploadToDiscordButtonLoading(true);

    getEmojiUploadableGuilds()
      .then(setUploadableGuilds)
      .catch(toast.error)
      .finally(() => setUploadToDiscordButtonLoading(false));
  }

  function continueUploadEmojiToGuild(guildId) {
    if (!guildId) {
      toast.error(t('createEmojiPage.emojisPreview.toast.guildNotFound'));

      return;
    }

    disableButton('upload-emoji-to-discord', 'upload');

    toast.promise(uploadEmojiToGuild(id, guildId, false), {
      error: error => {
        enableButton('upload-emoji-to-discord', 'upload');

        return error;
      },
      loading: t('createEmojiPage.emojisPreview.toast.uploadingEmojis'),
      success: () => {
        closeModal('upload-emoji-to-discord');
        setRenderConfetti(true);

        return t('createEmojiPage.emojisPreview.toast.emojisUploaded');
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

  const selectedGuildId = useGeneralStore(state => state.uploadEmojiToDiscordModal.selectedGuildId);

  useEffect(() => {
    if (!uploadableGuilds) return;
    if (openedModals.some(modal => modal.id === 'upload-emoji-to-discord')) {
      updateModal('upload-emoji-to-discord', {
        buttons: [
          {
            actionType: 'close',
            id: 'cancel',
            label: t('buttons.cancel'),
            variant: 'ghost'
          },
          {
            action: () => continueUploadEmojiToGuild(selectedGuildId),
            id: 'upload',
            label: t('buttons.upload'),
            variant: 'solid'
          }
        ]
      });

      return;
    }

    openModal('upload-emoji-to-discord', {
      buttons: [
        {
          actionType: 'close',
          id: 'cancel',
          label: t('buttons.cancel'),
          variant: 'ghost'
        },
        {
          action: () => continueUploadEmojiToGuild(selectedGuildId),
          id: 'uplaod',
          label: t('buttons.upload'),
          variant: 'solid'
        }
      ],
      content: <UploadEmojiToDiscordModal guilds={uploadableGuilds} />,
      description: t('createEmojiPage.emojisPreview.uploadEmojiToDiscordModal.description'),
      title: (
        t('createEmojiPage.emojisPreview.uploadEmojiToDiscordModal.titleWithEmoji', {
          emojiImage: <Image src={image_url} alt={name} width={24} height={24} className='inline h-[16px] w-auto' unoptimized={image_url.endsWith('.gif')} />,
          emojiName: name
        })
      )
    });
  }, [uploadableGuilds, selectedGuildId]);

  return (
    <div className='relative flex h-[250px] w-full flex-col items-center justify-center gap-y-2 overflow-hidden rounded-md bg-secondary' style={{
      backgroundImage: `url(/${patternDarkMode ? 'transparent-pattern-dark' : 'transparent-pattern-light'}.png)`
    }}>
      <div className='pointer-events-none fixed top-0 left-0 z-10 h-svh w-full'>
        <Lottie lottieRef={lottieRef} loop={false} autoplay={false} animationData={confetti} height='100%' width='100%'/>
      </div>

      <AnimatePresence>
        {image_url ? (
          <>
            <MotionImage
              key={image_url}
              width={previewSize}
              height={previewSize}
              src={image_url}
              alt='Emoji Preview'
              layoutId='emoji'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className='absolute bottom-2 left-2 flex w-full gap-x-2'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              layoutId='base'
            >
              {ableToChange ? (
                <label
                  className={cn(
                    'cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium',
                    patternDarkMode ? 'bg-white text-black hover:bg-white/70' : 'bg-black text-white hover:bg-black/70'
                  )}
                  htmlFor='emojiFiles'
                >
                  {t('buttons.change')}
                </label>
              ) : (
                <Tooltip content={loggedIn ? t('createEmojiPage.emojisPreview.tooltip.uploadToDiscord') : t('createEmojiPage.emojisPreview.tooltip.loginToUpload')}>
                  <button
                    className={cn(
                      'flex cursor-pointer items-center gap-x-1 rounded-lg px-3 py-1.5 text-sm font-medium disabled:opacity-70',
                      patternDarkMode ? 'bg-white text-black' : 'bg-black text-white',
                      loggedIn && (patternDarkMode ? 'hover:bg-white/70' : 'hover:bg-black/70')
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

              <button
                className={cn(
                  'cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium',
                  patternDarkMode ? 'bg-white text-black hover:bg-white/70' : 'bg-black text-white hover:bg-black/70'
                )}
                onClick={() => setPatternDarkMode(!patternDarkMode)}
              >
                {patternDarkMode ? t('buttons.lightMode') : t('buttons.darkMode')}
              </button>

              <button
                className={cn(
                  'cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium',
                  patternDarkMode ? 'bg-white text-black hover:bg-white/70' : 'bg-black text-white hover:bg-black/70'
                )}
                onClick={() => setPreviewSize(previewSize === 32 ? 96 : 32)}
              >
                {previewSize === 32 ? t('buttons.enlarge') : t('buttons.shrink')}
              </button>
            </motion.div>
          </>
        ) : (
          ableToChange && (
            <motion.label
              className={cn(
                'cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium',
                patternDarkMode ? 'bg-white text-black hover:bg-white/70' : 'bg-black text-white hover:bg-black/70'
              )}
              htmlFor='emojiFiles'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              layoutId='base'
            >
              {t('buttons.selectEmoji')}
            </motion.label>
          )
        )}
      </AnimatePresence>
    </div>
  );
}