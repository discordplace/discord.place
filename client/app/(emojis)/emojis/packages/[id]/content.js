'use client';

import { RiErrorWarningFill, MdEmojiEmotions, LuShieldQuestion } from '@/icons';
import PackagePreview from '@/app/(emojis)/emojis/components/PackagePreview';
import AnimatedCount from '@/app/components/AnimatedCount';
import config from '@/config';import FaQs from '@/app/(emojis)/emojis/packages/[id]/components/FaQs';import EmojiPackageCard from '@/app/(emojis)/emojis/components/Hero/EmojiCard/Package';
import { motion } from 'framer-motion';import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next-nprogress-bar';
import deleteEmoji from '@/lib/request/emojis/deleteEmoji';
import useModalsStore from '@/stores/modals';
import { useShallow } from 'zustand/react/shallow';
import useLanguageStore, { t } from '@/stores/language';
import UserAvatar from '@/app/components/ImageFromHash/UserAvatar';

export default function Content({ emoji }) {
  const language = useLanguageStore(state => state.language);
  const [imageURLs, setImageURLs] = useState(emoji.emoji_ids.map(({ id, animated }) => config.getEmojiURL(`packages/${emoji.id}/${id}`, animated)));
  const router = useRouter();

  const { openModal, disableButton, enableButton, closeModal } = useModalsStore(useShallow(state => ({
    openModal: state.openModal,
    disableButton: state.disableButton,
    enableButton: state.enableButton,
    closeModal: state.closeModal
  })));

  function continueDeleteEmojiPackage() {
    disableButton('delete-emoji-package', 'confirm');

    toast.promise(deleteEmoji(emoji.id), {
      loading: t('emojiPackagePage.toast.deletingEmojiPackage'),
      success: () => {
        closeModal('emoji-package');
        setTimeout(() => router.push('/'), 3000);

        return t('emojiPackagePage.toast.emojiPackageDeleted');
      },
      error: error => {
        enableButton('delete-emoji-package', 'confirm');

        return error;
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
                link: <Link target='_blank' href={config.supportInviteUrl} className='text-secondary hover:text-primary'>{t('emojiPackagePage.notApprovedInfo.linkText')}</Link>
              })}
            </p>
          </div>
        )}

        <div className='flex flex-col gap-4 lg:flex-row'>
          <motion.div className='w-full lg:max-w-[400px]'>
            <PackagePreview
              image_urls={imageURLs}
              set_image_urls={setImageURLs}
              ableToChange={false}
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
                {new Date(emoji.created_at).toLocaleDateString(language, { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(/,/g,'')}
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
                  id={emoji.user.id}
                  hash={emoji.user.avatar}
                  size={32}
                  width={18}
                  height={18}
                  className='rounded-full'
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
                      key={similarEmoji.id}
                      id={similarEmoji.id}
                      name={similarEmoji.name}
                      categories={similarEmoji.categories}
                      downloads={similarEmoji.downloads}
                      emoji_ids={similarEmoji.emoji_ids}
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
                    title: t('emojiPackagePage.dangerZone.deleteEmojiModal.title'),
                    description: t('emojiPackagePage.dangerZone.deleteEmojiModal.description', { emojiName: emoji.name }),
                    content: (
                      <p className='text-sm text-tertiary'>
                        {t('emojiPackagePage.dangerZone.deleteEmojiModal.content', { br: <br /> })}
                      </p>
                    ),
                    buttons: [
                      {
                        id: 'cancel',
                        label: t('buttons.cancel'),
                        variant: 'ghost',
                        actionType: 'close'
                      },
                      {
                        id: 'confirm',
                        label: t('buttons.confirm'),
                        variant: 'solid',
                        action: continueDeleteEmojiPackage
                      }
                    ]
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