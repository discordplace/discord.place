'use client';

import { TbLoader, FaCloudUploadAlt } from '@/icons';
import useThemeStore from '@/stores/theme';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import MotionImage from '@/app/components/Motion/Image';
import cn from '@/lib/cn';import getEmojiUploadableGuilds from '@/lib/request/auth/getEmojiUploadableGuilds';
import { toast } from 'sonner';import useModalsStore from '@/stores/modals';
import { useShallow } from 'zustand/react/shallow';
import UploadEmojiToDiscordModal from '@/app/(emojis)/emojis/components/UploadEmojiToDiscordModal';
import Image from 'next/image';
import useGeneralStore from '@/stores/general';
import uploadEmojiToGuild from '@/lib/request/emojis/uploadEmojiToGuild';
import Lottie from 'react-lottie';
import confetti from '@/lib/lotties/confetti.json';
import useAuthStore from '@/stores/auth';
import Tooltip from '@/app/components/Tooltip';
import { t } from '@/stores/language';

export default function EmojiPreview({ id, name, image_url, ableToChange, defaultSize }) {
  const loggedIn = useAuthStore(state => state.loggedIn);
  const [previewSize, setPreviewSize] = useState(defaultSize === 'shrink' ? 32 : 96);
  const theme = useThemeStore(state => state.theme);
  const [patternDarkMode, setPatternDarkMode] = useState(theme === 'dark');
  const [renderConfetti, setRenderConfetti] = useState(false);

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
      loading: t('createEmojiPage.emojisPreview.toast.uploadingEmojis'),
      success: () => {
        closeModal('upload-emoji-to-discord');
        setRenderConfetti(true);

        return t('createEmojiPage.emojisPreview.toast.emojisUploaded');
      },
      error: error => {
        enableButton('upload-emoji-to-discord', 'upload');

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

  const selectedGuildId = useGeneralStore(state => state.uploadEmojiToDiscordModal.selectedGuildId);

  useEffect(() => {
    if (!uploadableGuilds) return;
    if (openedModals.some(modal => modal.id === 'upload-emoji-to-discord')) {
      updateModal('upload-emoji-to-discord', {
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
            action: () => continueUploadEmojiToGuild(selectedGuildId)
          }
        ]
      });

      return;
    }

    openModal('upload-emoji-to-discord', {
      title: (
        t('createEmojiPage.emojisPreview.uploadEmojiToDiscordModal.titleWithEmoji', {
          emojiImage: <Image src={image_url} alt={name} width={24} height={24} className='inline h-[16px] w-auto' />,
          emojiName: name
        })
      ),
      description: t('createEmojiPage.emojisPreview.uploadEmojiToDiscordModal.description'),
      content: <UploadEmojiToDiscordModal guilds={uploadableGuilds} />,
      buttons: [
        {
          id: 'cancel',
          label: t('buttons.cancel'),
          variant: 'ghost',
          actionType: 'close'
        },
        {
          id: 'uplaod',
          label: t('buttons.upload'),
          variant: 'solid',
          action: () => continueUploadEmojiToGuild(selectedGuildId)
        }
      ]
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadableGuilds, selectedGuildId]);

  return (
    <div className='relative flex h-[250px] w-full flex-col items-center justify-center gap-y-2 overflow-hidden rounded-md bg-secondary' style={{
      backgroundImage: `url(/${patternDarkMode ? 'transparent-pattern-dark' : 'transparent-pattern-light'}.png)`
    }}>

      <div className='pointer-events-none fixed left-0 top-0 z-10 h-svh w-full'>
        <Lottie options={{ loop: false, autoplay: false, animationData: confetti }} isStopped={!renderConfetti} height='100%' width='100%'/>
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
                    'px-3 py-1.5 text-sm font-medium rounded-lg cursor-pointer',
                    patternDarkMode ? 'hover:bg-white/70 bg-white text-black' : 'hover:bg-black/70 bg-black text-white'
                  )}
                  htmlFor='emojiFiles'
                >
                  {t('buttons.change')}
                </label>
              ) : (
                <Tooltip content={loggedIn ? t('createEmojiPage.emojisPreview.tooltip.uploadToDiscord') : t('createEmojiPage.emojisPreview.tooltip.loginToUpload')}>
                  <button
                    className={cn(
                      'px-3 py-1.5 flex items-center gap-x-1 text-sm font-medium disabled:opacity-70 rounded-lg cursor-pointer',
                      patternDarkMode ? 'bg-white text-black' : ' bg-black text-white',
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
                  'px-3 py-1.5 text-sm font-medium rounded-lg cursor-pointer',
                  patternDarkMode ? 'hover:bg-white/70 bg-white text-black' : 'hover:bg-black/70 bg-black text-white'
                )}
                onClick={() => setPatternDarkMode(!patternDarkMode)}
              >
                {patternDarkMode ? t('buttons.lightMode') : t('buttons.darkMode')}
              </button>

              <button
                className={cn(
                  'px-3 py-1.5 text-sm font-medium rounded-lg cursor-pointer',
                  patternDarkMode ? 'hover:bg-white/70 bg-white text-black' : 'hover:bg-black/70 bg-black text-white'
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
                'px-3 py-1.5 text-sm font-medium rounded-lg cursor-pointer',
                patternDarkMode ? 'hover:bg-white/70 bg-white text-black' : 'hover:bg-black/70 bg-black text-white'
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