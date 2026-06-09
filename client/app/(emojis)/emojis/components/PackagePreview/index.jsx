'use client';

import { FaCloudUploadAlt } from 'react-icons/fa';
import { MdEmojiEmotions } from 'react-icons/md';
import { TbLoader } from 'react-icons/tb';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import useThemeStore from '@/stores/theme';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import getEmojiUploadableGuilds from '@/lib/request/auth/getEmojiUploadableGuilds';
import useModalsStore from '@/stores/modals';
import { useShallow } from 'zustand/react/shallow';
import UploadEmojiToDiscordModal from '@/app/(emojis)/emojis/components/UploadEmojiToDiscordModal';
import useGeneralStore from '@/stores/general';
import uploadEmojiToGuild from '@/lib/request/emojis/uploadEmojiToGuild';
import Lottie from 'lottie-react';
import confetti from '@/lib/lotties/confetti.json';
import config from '@/config';
import Tooltip from '@/app/components/Tooltip';
import useAuthStore from '@/stores/auth';
import cn from '@/lib/cn';
import { t } from '@/stores/language';

export default function PackagePreview({ image_urls, setImageURLs, setIsPackage, setEmojiURL, ableToChange }) {
  const loggedIn = useAuthStore(state => state.loggedIn);
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

  useEffect(() => {
    if (image_urls.length <= 0) setIsPackage(false);
  }, [image_urls]);

  const [uploadToDiscordButtonLoading, setUploadToDiscordButtonLoading] = useState(false);
  const [uploadableGuilds, setUploadableGuilds] = useState(null);

  function uploadToDiscord() {
    setUploadToDiscordButtonLoading(true);

    getEmojiUploadableGuilds()
      .then(setUploadableGuilds)
      .catch(toast.error)
      .finally(() => setUploadToDiscordButtonLoading(false));
  }

  function continueUploadEmojiToGuild(emojiUrl, guildId) {
    if (!guildId) {
      toast.error(t('createEmojiPage.emojisPreview.toast.guildNotFound'));

      return;
    }

    disableButton('upload-emoji-to-discord', 'upload');

    toast.promise(uploadEmojiToGuild(config.getEmojiIdFromURL(emojiUrl), guildId, image_urls.indexOf(emojiUrl)), {
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
  const selectedEmojiURL = useGeneralStore(state => state.uploadEmojiToDiscordModal.selectedEmojiURL);
  const setSelectedEmojiURL = useGeneralStore(state => state.uploadEmojiToDiscordModal.setSelectedEmojiURL);

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
            action: () => continueUploadEmojiToGuild(selectedEmojiURL, selectedGuildId),
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
          action: () => continueUploadEmojiToGuild(selectedEmojiURL, selectedGuildId),
          id: 'uplaod',
          label: t('buttons.upload'),
          variant: 'solid'
        }
      ],
      content: <UploadEmojiToDiscordModal guilds={uploadableGuilds} />,
      description: t('createEmojiPage.emojisPreview.uploadEmojiToDiscordModal.description'),
      title: <>
        <Image
          src={selectedEmojiURL}
          alt='Emoji Preview'
          width={48}
          height={48}
          className='inline h-[20px] w-auto'
          unoptimized={selectedEmojiURL.endsWith('.gif')}
        />

        {t('createEmojiPage.emojisPreview.uploadEmojiToDiscordModal.title')}
      </>
    });
  }, [uploadableGuilds, selectedGuildId, selectedEmojiURL]);

  return (
    <div className='flex flex-col gap-y-4'>
      <div className='pointer-events-none fixed top-0 left-0 z-10 h-svh w-full'>
        <Lottie lottieRef={lottieRef} loop={false} autoplay={false} animationData={confetti} height='100%' width='100%'/>
      </div>

      {ableToChange && (
        <div className='flex w-full gap-x-2'>
          <button
            className='w-full cursor-pointer rounded-lg bg-black px-3 py-1.5 text-sm font-medium text-white hover:bg-black/70 dark:bg-white dark:text-black dark:hover:bg-white/70'
            onClick={() => setPatternDarkMode(!patternDarkMode)}
          >
            {patternDarkMode ? t('buttons.lightMode') : t('buttons.darkMode')}
          </button>

          <button
            className='w-full cursor-pointer rounded-lg bg-black px-3 py-1.5 text-sm font-medium text-white hover:bg-black/70 dark:bg-white dark:text-black dark:hover:bg-white/70'
            onClick={() => {
              setImageURLs([]);
              setIsPackage(false);
              setEmojiURL(null);
            }}
          >
            {t('buttons.removeAll')}
          </button>
        </div>
      )}

      <div className='grid size-full grid-cols-3 place-content-center gap-4'>
        {image_urls.map(url => (
          <motion.div
            className='group relative flex size-full min-h-[120px] items-center justify-center rounded-xl bg-tertiary'
            key={url}
            style={{
              backgroundImage: `url(/${patternDarkMode ? 'transparent-pattern-dark' : 'transparent-pattern-light'}.png)`
            }}
            layoutId={url}
          >
            {!ableToChange && (
              <Tooltip
                content={loggedIn ? t('createEmojiPage.emojisPreview.tooltip.uploadToDiscord') : t('createEmojiPage.emojisPreview.tooltip.loginToUpload')}
                sideOffset={15}
              >
                <div
                  className={cn(
                    'absolute bottom-1 left-1 cursor-pointer rounded-md bg-black p-1 text-sm text-white disabled:opacity-70 dark:bg-white dark:text-black',
                    loggedIn && 'hover:bg-black/70 dark:hover:bg-white/70'
                  )}
                  onClick={() => {
                    if (!loggedIn) return;

                    setSelectedEmojiURL(url);
                    uploadToDiscord();
                  }}
                  disabled={!loggedIn || (selectedEmojiURL === url && uploadToDiscordButtonLoading)}
                >
                  {(selectedEmojiURL === url && uploadToDiscordButtonLoading) ? (
                    <TbLoader className='animate-spin' />
                  ) : (
                    <FaCloudUploadAlt />
                  )}
                </div>
              </Tooltip>
            )}

            <Image
              src={url}
              width={64}
              height={64}
              alt=""
              className='size-[46px] object-contain sm:size-[64px]'
              unoptimized={url.endsWith('.gif')}
            />
          </motion.div>
        ))}

        {Array.from({ length: 9 - image_urls.length }).fill(0).map((_, index) => (
          <div className='flex size-full min-h-[120px] items-center justify-center rounded-xl bg-secondary' key={index}>
            <MdEmojiEmotions size={64} className='text-tertiary' />
          </div>
        ))}
      </div>
    </div>
  );
}