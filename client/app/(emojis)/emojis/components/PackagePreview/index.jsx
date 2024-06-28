import Image from 'next/image';
import { MdEmojiEmotions } from 'react-icons/md';
import { FaRegTrashAlt } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import useThemeStore from '@/stores/theme';
import { motion } from 'framer-motion';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { toast } from 'sonner';
import getEmojiUploadableGuilds from '@/lib/request/auth/getEmojiUploadableGuilds';
import { TbLoader } from 'react-icons/tb';
import useModalsStore from '@/stores/modals';
import { useShallow } from 'zustand/react/shallow';
import UploadEmojiToDiscordModal from '@/app/(emojis)/emojis/components/UploadEmojiToDiscordModal';
import useGeneralStore from '@/stores/general';
import uploadEmojiToGuild from '@/lib/request/emojis/uploadEmojiToGuild';
import Lottie from 'react-lottie';
import confetti from '@/lib/lotties/confetti.json';
import config from '@/config';
import Tooltip from '@/app/components/Tooltip';
import useAuthStore from '@/stores/auth';
import cn from '@/lib/cn';

export default function PackagePreview({ image_urls, setImageURLs, setIsPackage, setEmojiURL, ableToChange }) {
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
      toast.error('Please select a server to upload the emoji to.');
      return;
    }

    disableButton('upload-emoji-to-discord', 'upload');

    toast.promise(uploadEmojiToGuild(config.getEmojiIdFromURL(emojiUrl), guildId, image_urls.indexOf(emojiUrl)), {
      loading: 'Emoji is being uploaded to guild...',
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
  const selectedEmojiURL = useGeneralStore(state => state.uploadEmojiToDiscordModal.selectedEmojiURL);
  const setSelectedEmojiURL = useGeneralStore(state => state.uploadEmojiToDiscordModal.setSelectedEmojiURL);

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
            action: () => continueUploadEmojiToGuild(selectedEmojiURL, selectedGuildId)
          }
        ]
      });

      return;
    }

    openModal('upload-emoji-to-discord', {
      title: <>
        <Image
          src={selectedEmojiURL}
          alt='Emoji Preview'
          width={48}
          height={48}
          className='h-[20px] w-auto inline'
        />

        Upload to Discord
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
          action: () => continueUploadEmojiToGuild(selectedEmojiURL, selectedGuildId)
        }
      ]
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadableGuilds, selectedGuildId, selectedEmojiURL]);


  return (
    <div className='flex flex-col gap-y-4'>
      <div className="fixed pointer-events-none z-[10] top-0 left-0 w-full h-[100dvh]">
        <Lottie options={{ loop: false, autoplay: false, animationData: confetti }} isStopped={!renderConfetti} height="100%" width="100%"/>
      </div>
      
      {ableToChange && (
        <div className='flex w-full gap-x-2'>
          <button 
            className='px-3 py-1.5 w-full text-sm font-medium rounded-lg cursor-pointer bg-black hover:bg-black/70 text-white dark:hover:bg-white/70 dark:bg-white dark:text-black' 
            onClick={() => setPatternDarkMode(!patternDarkMode)}
          >
            {patternDarkMode ? 'Light' : 'Dark'} Mode
          </button>

          <button 
            className='px-3 py-1.5 w-full text-sm font-medium rounded-lg cursor-pointer bg-black hover:bg-black/70 text-white dark:hover:bg-white/70 dark:bg-white dark:text-black' 
            onClick={() => {
              setImageURLs([]);
              setIsPackage(false);
              setEmojiURL(null);
            }}
          >
            Remove All
          </button>
        </div>
      )}
      <div className='grid w-full h-full grid-cols-3 gap-4 place-content-center'>
        {image_urls.map(url => (
          <motion.div 
            className='relative flex items-center justify-center w-full h-full rounded-xl bg-tertiary min-h-[120px] group' 
            key={url} 
            style={{
              backgroundImage: `url(/${patternDarkMode ? 'transparent-pattern-dark' : 'transparent-pattern-light'}.png)`
            }} 
            layoutId={url}
          >
            <Tooltip
              content={loggedIn ? 'Upload to Discord' : 'Login with Discord to Upload'}
              sideOffset={15}
            >
              <div
                className={cn(
                  'absolute p-1 text-sm text-white dark:text-black bg-black dark:bg-white rounded-md cursor-pointer disabled:opacity-70 left-1 bottom-1',
                  loggedIn && 'dark:hover:bg-white/70 hover:bg-black/70'
                )}
                onClick={() => {
                  if (!loggedIn) return;

                  setSelectedEmojiURL(url);
                  uploadToDiscord();
                }}
                disabled={!loggedIn || (setSelectedEmojiURL === url && uploadToDiscordButtonLoading)}
              >
                {(setSelectedEmojiURL === url && uploadToDiscordButtonLoading) ? (
                  <TbLoader className='animate-spin' /> 
                ) : (
                  <FaCloudUploadAlt />
                )}
              </div>
            </Tooltip>

            <Image
              src={url}
              width={64}
              height={64}
              alt={''}
              className='w-[46px] h-[46px] sm:w-[64px] sm:h-[64px] object-contain'
            />

            {ableToChange && (
              <div className='absolute flex items-center justify-center w-full h-full transition-opacity opacity-0 bg-quaternary/80 rounded-xl group-hover:opacity-100 overflow-clip'>
                <div className='transition-all opacity-0 group-hover:opacity-100 ease-in-out duration-500 translate-y-[-100px] group-hover:translate-y-0 gap-x-2 flex'>
                  <button className='p-2 text-sm font-semibold text-white transition-all bg-black rounded-lg cursor-pointer hover:bg-black/70 dark:bg-white dark:text-black dark:hover:bg-white/70' onClick={() => setImageURLs(oldImageURLs => oldImageURLs.filter(imageURL => imageURL !== url))}>
                    <FaRegTrashAlt />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
        {new Array(9 - image_urls.length).fill(0).map((_, index) => (
          <div className='flex items-center justify-center w-full h-full rounded-xl bg-secondary min-h-[120px]' key={index}>
            <MdEmojiEmotions size={64} className='text-tertiary' />
          </div>
        ))}
      </div>
    </div>
  );
}