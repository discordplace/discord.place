'use client';

import EmojiPackageCard from '@/app/(emojis)/emojis/components/Hero/EmojiCard/Package';
import PackagePreview from '@/app/(emojis)/emojis/components/PackagePreview';
import FaQs from '@/app/(emojis)/emojis/packages/[id]/components/FaQs';
import AnimatedCount from '@/app/components/AnimatedCount';
import UserAvatar from '@/app/components/ImageFromHash/UserAvatar';
import config from '@/config';
import deleteEmoji from '@/lib/request/emojis/deleteEmoji';
import useLanguageStore, { t } from '@/stores/language';
import useModalsStore from '@/stores/modals';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next-nprogress-bar';
import { useState } from 'react';
import { LuShieldQuestion } from 'react-icons/lu';
import { MdEmojiEmotions } from 'react-icons/md';
import { RiErrorWarningFill } from 'react-icons/ri';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

export default function Content({ emoji }) {
  const language = useLanguageStore(state => state.language);
  const [imageURLs, setImageURLs] = useState(emoji.emoji_ids.map(({ animated, id }) => config.getEmojiURL(`packages/${emoji.id}/${id}`, animated)));
  const router = useRouter();

  const { closeModal, disableButton, enableButton, openModal } = useModalsStore(useShallow(state => ({
    closeModal: state.closeModal,
    disableButton: state.disableButton,
    enableButton: state.enableButton,
    openModal: state.openModal
  })));

  function continueDeleteEmojiPackage() {
    disableButton('delete-emoji-package', 'confirm');

    toast.promise(deleteEmoji(emoji.id), {
      error: error => {
        enableButton('delete-emoji-package', 'confirm');

        return error;
      },
      loading: t('emojiPackagePage.toast.deletingEmojiPackage'),
      success: () => {
        closeModal('emoji-package');
        setTimeout(() => router.push('/'), 3000);

        return t('emojiPackagePage.toast.emojiPackageDeleted');
      }
    });
  }

  return (
    <div className='flex w-full items-center justify-center'>
      <div className='mb-16 mt-48 flex w-full max-w-[1000px] flex-col gap-y-4 px-4 lg:px-0'>
        {!emoji.approved && (
          <div className='flex flex-col gap-y-2 rounded-xl border border-yellow-500 bg-yellow-500/10 p-4'>
            <h1 className='flex items-center gap-x-1.5 text-lg font-semibold text-primary'>
              <RiErrorWarningFill />
              Beep beep!
            </h1>

            <p className='text-sm font-medium text-tertiary'>
              {t('emojiPackagePage.notApprovedInfo.description', {
                link: <Link className='text-secondary hover:text-primary' href={config.supportInviteUrl} target='_blank'>{t('emojiPackagePage.notApprovedInfo.linkText')}</Link>
              })}
            </p>
          </div>
        )}

        <div className='flex flex-col gap-4 lg:flex-row'>
          <motion.div className='w-full lg:max-w-[400px]'>
            <PackagePreview
              ableToChange={false}
              image_urls={imageURLs}
              set_image_urls={setImageURLs}
            />
          </motion.div>

          <div className='grid w-full gap-4 sm:grid-cols-3'>
            <div className='flex size-full min-h-[115px] flex-col items-center justify-center gap-y-2 rounded-md bg-secondary px-2'>
              <h1 className='text-base font-semibold text-tertiary'>
                {t('emojiPackagePage.fields.name')}
              </h1>

              <span className='flex items-center gap-x-1 text-center text-sm text-primary'>
                {emoji.name}
              </span>
            </div>

            <div className='flex size-full min-h-[115px] flex-col items-center justify-center gap-y-2 rounded-md bg-secondary px-2'>
              <h1 className='text-base font-semibold text-tertiary'>
                {t('emojiPackagePage.fields.uploaded')}
              </h1>

              <span className='flex items-center gap-x-1 text-center text-sm text-primary'>
                {new Date(emoji.created_at).toLocaleDateString(language, { day: '2-digit', hour: '2-digit', minute: '2-digit', month: 'short', year: 'numeric' }).replace(/,/g,'')}
              </span>
            </div>

            <div className='flex size-full min-h-[115px] flex-col items-center justify-center gap-y-2 rounded-md bg-secondary px-2'>
              <h1 className='text-base font-semibold text-tertiary'>
                {t('emojiPackagePage.fields.downloads')}
              </h1>

              <span className='flex items-center gap-x-1 text-center text-sm text-primary'>
                <AnimatedCount data={emoji.downloads} />
              </span>
            </div>

            <div className='flex size-full min-h-[115px] flex-col items-center justify-center gap-y-2 rounded-md bg-secondary px-2'>
              <h1 className='text-base font-semibold text-tertiary'>
                {t('emojiPackagePage.fields.emojiCount')}
              </h1>

              <span className='flex items-center gap-x-1 text-center text-sm text-primary'>
                <AnimatedCount data={emoji.emoji_ids.length} />
              </span>
            </div>

            <div className='flex size-full min-h-[115px] flex-col items-center justify-center gap-y-2 rounded-md bg-secondary px-2'>
              <h1 className='text-base font-semibold text-tertiary'>
                {t('emojiPackagePage.fields.categories')}
              </h1>

              <span className='flex items-center gap-x-1 text-center text-sm text-primary'>
                {emoji.categories.map(category => t(`categories.${category}`)).join(', ')}
              </span>
            </div>

            <div className='flex size-full min-h-[115px] flex-col items-center justify-center gap-y-2 rounded-md bg-secondary px-2'>
              <h1 className='text-base font-semibold text-tertiary'>
                {t('emojiPackagePage.fields.publisher')}
              </h1>

              <span className='flex items-center gap-x-1 text-center text-sm text-primary'>
                <UserAvatar
                  className='rounded-full'
                  hash={emoji.user.avatar}
                  height={18}
                  id={emoji.user.id}
                  size={32}
                  width={18}
                />

                {emoji.user.username}
              </span>
            </div>
          </div>
        </div>

        <div className='flex w-full flex-col gap-4 lg:flex-row'>
          <div className='flex w-full flex-col lg:max-w-[400px]'>
            <div className='mt-4 flex w-full flex-col gap-y-2 lg:max-w-[400px]'>
              <h2 className='flex items-center gap-x-1 text-lg font-semibold sm:text-xl'>
                <MdEmojiEmotions />
                {t('emojiPackagePage.similarEmojiPacks.title')}
              </h2>

              {emoji.similarEmojiPacks.length <= 0 ? (
                <div className='text-sm text-tertiary'>
                  {t('emojiPackagePage.similarEmojiPacks.emptyErrorState')}
                </div>
              ) : (
                <div className='grid w-full grid-cols-1 gap-4 mobile:grid-cols-2 lg:grid-cols-2 lg:grid-rows-2'>
                  {emoji.similarEmojiPacks.map(similarEmoji => (
                    <EmojiPackageCard
                      categories={similarEmoji.categories}
                      downloads={similarEmoji.downloads}
                      emoji_ids={similarEmoji.emoji_ids}
                      id={similarEmoji.id}
                      key={similarEmoji.id}
                      name={similarEmoji.name}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className='flex w-full flex-col gap-y-4'>
            <h2 className='mt-4 flex items-center gap-x-1 text-lg font-semibold sm:text-xl'>
              <LuShieldQuestion />
              {t('emojiPackagePage.frequentlyAskedQuestions.title')}
            </h2>

            <FaQs emoji={emoji} />
          </div>
        </div>

        {emoji.permissions.canDelete && (
          <div className='mt-8 flex flex-col gap-y-2 rounded-xl border border-red-500 bg-red-500/10 p-4'>
            <h1 className='flex items-center gap-x-1.5 text-lg font-semibold text-primary'>
              <RiErrorWarningFill />
              {t('emojiPackagePage.dangerZone.title')}
            </h1>

            <p className='text-sm font-medium text-tertiary'>
              {t('emojiPackagePage.dangerZone.description')}
            </p>

            <div className='mt-1 flex gap-x-2'>
              <button
                className='w-max rounded-lg bg-black px-3 py-1 text-sm font-medium text-white hover:bg-black/70 dark:bg-white dark:text-black dark:hover:bg-white/70'
                onClick={() =>
                  openModal('delete-emoji-package', {
                    buttons: [
                      {
                        actionType: 'close',
                        id: 'cancel',
                        label: t('buttons.cancel'),
                        variant: 'ghost'
                      },
                      {
                        action: continueDeleteEmojiPackage,
                        id: 'confirm',
                        label: t('buttons.confirm'),
                        variant: 'solid'
                      }
                    ],
                    content: (
                      <p className='text-sm text-tertiary'>
                        {t('emojiPackagePage.dangerZone.deleteEmojiModal.content', { br: <br /> })}
                      </p>
                    ),
                    description: t('emojiPackagePage.dangerZone.deleteEmojiModal.description', { emojiName: emoji.name }),
                    title: t('emojiPackagePage.dangerZone.deleteEmojiModal.title')
                  })
                }
              >
                {t('buttons.delete')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}