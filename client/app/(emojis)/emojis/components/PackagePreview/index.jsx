'use client';

import UploadEmojiToDiscordModal from '@/app/(emojis)/emojis/components/UploadEmojiToDiscordModal';
import Tooltip from '@/app/components/Tooltip';
import config from '@/config';
import cn from '@/lib/cn';
import confetti from '@/lib/lotties/confetti.json';
import getEmojiUploadableGuilds from '@/lib/request/auth/getEmojiUploadableGuilds';
import uploadEmojiToGuild from '@/lib/request/emojis/uploadEmojiToGuild';
import useAuthStore from '@/stores/auth';
import useGeneralStore from '@/stores/general';
import { t } from '@/stores/language';
import useModalsStore from '@/stores/modals';
import useThemeStore from '@/stores/theme';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { MdEmojiEmotions } from 'react-icons/md';
import { TbLoader } from 'react-icons/tb';
import Lottie from 'react-lottie';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

export default function PackagePreview({ ableToChange, image_urls, setEmojiURL, setImageURLs, setIsPackage }) {
  const loggedIn = useAuthStore(state => state.loggedIn);
  const theme = useThemeStore(state => state.theme);
  const [patternDarkMode, setPatternDarkMode] = useState(theme === 'dark');
  const [renderConfetti, setRenderConfetti] = useState(false);

  useEffect(() => {
    setPatternDarkMode(theme === 'dark');
  }, [theme]);

  useEffect(() => {
    if (image_urls.length <= 0) setIsPackage(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const { closeModal, disableButton, enableButton, openedModals, openModal, updateModal } = useModalsStore(useShallow(state => ({
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
          alt='Emoji Preview'
          className='inline h-[20px] w-auto'
          height={48}
          src={selectedEmojiURL}
          width={48}
        />

        {t('createEmojiPage.emojisPreview.uploadEmojiToDiscordModal.title')}
      </>
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadableGuilds, selectedGuildId, selectedEmojiURL]);

  return (
    <div className='flex flex-col gap-y-4'>
      <div className='pointer-events-none fixed left-0 top-0 z-10 h-svh w-full'>
        <Lottie height='100%' isStopped={!renderConfetti} options={{ animationData: confetti, autoplay: false, loop: false }} width='100%'/>
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
            layoutId={url}
            style={{
              backgroundImage: `url(/${patternDarkMode ? 'transparent-pattern-dark' : 'transparent-pattern-light'}.png)`
            }}
          >
            {!ableToChange && (
              <Tooltip
                content={loggedIn ? t('createEmojiPage.emojisPreview.tooltip.uploadToDiscord') : t('createEmojiPage.emojisPreview.tooltip.loginToUpload')}
                sideOffset={15}
              >
                <div
                  className={cn(
                    'absolute p-1 text-sm text-white dark:text-black bg-black dark:bg-white rounded-md cursor-pointer disabled:opacity-70 left-1 bottom-1',
                    loggedIn && 'dark:hover:bg-white/70 hover:bg-black/70'
                  )}
                  disabled={!loggedIn || (selectedEmojiURL === url && uploadToDiscordButtonLoading)}
                  onClick={() => {
                    if (!loggedIn) return;

                    setSelectedEmojiURL(url);
                    uploadToDiscord();
                  }}
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
              alt={''}
              className='size-[46px] object-contain sm:size-[64px]'
              height={64}
              src={url}
              width={64}
            />
          </motion.div>
        ))}

        {new Array(9 - image_urls.length).fill(0).map((_, index) => (
          <div className='flex size-full min-h-[120px] items-center justify-center rounded-xl bg-secondary' key={index}>
            <MdEmojiEmotions className='text-tertiary' size={64} />
          </div>
        ))}
      </div>
    </div>
  );
}