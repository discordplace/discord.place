'use client';

import useThemeStore from '@/stores/theme';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import MotionImage from '@/app/components/Motion/Image';
import cn from '@/lib/cn';
import { FaCloudUploadAlt } from 'react-icons/fa';
import getEmojiUploadableGuilds from '@/lib/request/auth/getEmojiUploadableGuilds';
import { toast } from 'sonner';
import { TbLoader } from 'react-icons/tb';
import useModalsStore from '@/stores/modals';
import { useShallow } from 'zustand/react/shallow';
import UploadEmojiToDiscordModal from '@/app/(emojis)/emojis/components/UploadEmojiToDiscordModal';
import Image from 'next/image';
import useGeneralStore from '@/stores/general';
import uploadEmojiToGuild from '@/lib/request/emojis/uploadEmojiToGuild';
import Lottie from 'react-lottie';
import confetti from '@/lib/lotties/confetti.json';
import useAuthStore from '@/stores/auth';
import Tooltip from '@/app/components/Tooltip';

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
      toast.error('Please select a server to upload the emoji to.');
      return;
    }

    disableButton('upload-emoji-to-discord', 'upload');

    toast.promise(uploadEmojiToGuild(id, guildId, false), {
      loading: `Emoji ${name} is being uploaded to guild...`,
      success: () => {
        closeModal('upload-emoji-to-discord');
        setRenderConfetti(true);

        return 'Emoji uploaded successfully!';
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
            label: 'Cancel',
            variant: 'ghost',
            actionType: 'close'
          },
          {
            id: 'upload',
            label: 'Upload',
            variant: 'solid',
            action: () => continueUploadEmojiToGuild(selectedGuildId)
          }
        ]
      });

      return;
    }

    openModal('upload-emoji-to-discord', {
      title: <>
        Upload
        <Image
          src={image_url}
          alt='Emoji Preview'
          width={48}
          height={48}
          className='h-[20px] w-auto inline'
        />
        {name} {' '}
        to Discord
      </>,
      description: 'Quickly upload this emoji to Discord by selecting a server below.',
      content: <UploadEmojiToDiscordModal guilds={uploadableGuilds} />,
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
          action: () => continueUploadEmojiToGuild(selectedGuildId)
        }
      ]
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadableGuilds, selectedGuildId]);

  return (
    <div className='w-full h-[250px] bg-secondary rounded-md overflow-hidden flex items-center justify-center flex-col gap-y-2 relative' style={{
      backgroundImage: `url(/${patternDarkMode ? 'transparent-pattern-dark' : 'transparent-pattern-light'}.png)`
    }}>

      <div className="fixed pointer-events-none z-[10] top-0 left-0 w-full h-[100dvh]">
        <Lottie options={{ loop: false, autoplay: false, animationData: confetti }} isStopped={!renderConfetti} height="100%" width="100%"/>
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
              className='absolute flex w-full left-2 bottom-2 gap-x-2'
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
                  Change
                </label>
              ) : (
                <Tooltip content={loggedIn ? 'Upload to Discord' : 'Login with Discord to Upload'}>
                  <button
                    className={cn(
                      'px-3 py-1.5 flex items-center gap-x-1 text-sm font-medium disabled:opacity-70 rounded-lg cursor-pointer',
                      patternDarkMode ? 'hover:bg-white/70 bg-white text-black' : 'hover:bg-black/70 bg-black text-white'
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
                {patternDarkMode ? 'Light' : 'Dark'} Mode
              </button>

              <button 
                className={cn(
                  'px-3 py-1.5 text-sm font-medium rounded-lg cursor-pointer',
                  patternDarkMode ? 'hover:bg-white/70 bg-white text-black' : 'hover:bg-black/70 bg-black text-white'
                )}  
                onClick={() => setPreviewSize(previewSize === 32 ? 96 : 32)}
              >
                {previewSize === 32 ? 'Enlarge' : 'Shrink'}
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
              Select Emoji
            </motion.label>
          )
        )}
      </AnimatePresence>
    </div>
  );
}