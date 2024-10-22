'use client';

import UploadEmojiToDiscordModal from '@/app/(emojis)/emojis/components/UploadEmojiToDiscordModal';
import MotionImage from '@/app/components/Motion/Image';
import Tooltip from '@/app/components/Tooltip';
import cn from '@/lib/cn';
import confetti from '@/lib/lotties/confetti.json';
import getEmojiUploadableGuilds from '@/lib/request/auth/getEmojiUploadableGuilds';
import uploadEmojiToGuild from '@/lib/request/emojis/uploadEmojiToGuild';
import useAuthStore from '@/stores/auth';
import useGeneralStore from '@/stores/general';
import { t } from '@/stores/language';
import useModalsStore from '@/stores/modals';
import useThemeStore from '@/stores/theme';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { TbLoader } from 'react-icons/tb';
import Lottie from 'react-lottie';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

export default function EmojiPreview({ ableToChange, defaultSize, id, image_url, name }) {
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

  const { closeModal, disableButton, enableButton, openedModals, openModal, updateModal } = useModalsStore(useShallow(state => ({
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
          emojiImage: <Image alt={name} className='inline h-[16px] w-auto' height={24} src={image_url} width={24} />,
          emojiName: name
        })
      )
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadableGuilds, selectedGuildId]);

  return (
    <div className='relative flex h-[250px] w-full flex-col items-center justify-center gap-y-2 overflow-hidden rounded-md bg-secondary' style={{
      backgroundImage: `url(/${patternDarkMode ? 'transparent-pattern-dark' : 'transparent-pattern-light'}.png)`
    }}>

      <div className='pointer-events-none fixed left-0 top-0 z-10 h-svh w-full'>
        <Lottie height='100%' isStopped={!renderConfetti} options={{ animationData: confetti, autoplay: false, loop: false }} width='100%'/>
      </div>

      <AnimatePresence>
        {image_url ? (
          <>
            <MotionImage
              alt='Emoji Preview'
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              height={previewSize}
              initial={{ opacity: 0 }}
              key={image_url}
              layoutId='emoji'
              src={image_url}
              width={previewSize}
            />

            <motion.div
              animate={{ opacity: 1 }}
              className='absolute bottom-2 left-2 flex w-full gap-x-2'
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
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
                    disabled={!loggedIn || uploadToDiscordButtonLoading}
                    onClick={() => {
                      if (!loggedIn) return;

                      uploadToDiscord();
                    }}
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
              animate={{ opacity: 1 }}
              className={cn(
                'px-3 py-1.5 text-sm font-medium rounded-lg cursor-pointer',
                patternDarkMode ? 'hover:bg-white/70 bg-white text-black' : 'hover:bg-black/70 bg-black text-white'
              )}
              exit={{ opacity: 0 }}
              htmlFor='emojiFiles'
              initial={{ opacity: 0 }}
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