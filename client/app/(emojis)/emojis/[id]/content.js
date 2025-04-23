'use client';

import { RiErrorWarningFill, MdEmojiEmotions, LuShieldQuestion } from '@/icons';
import EmojiPreview from '@/app/(emojis)/emojis/components/EmojiPreview';
import ChatMockup from '@/app/(emojis)/emojis/[id]/components/ChatMockup';
import AnimatedCount from '@/app/components/AnimatedCount';
import useAuthStore from '@/stores/auth';
import config from '@/config';
import FaQs from '@/app/(emojis)/emojis/[id]/components/FaQs';
import EmojiCard from '@/app/(emojis)/emojis/components/Hero/EmojiCard';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next-nprogress-bar';
import deleteEmoji from '@/lib/request/emojis/deleteEmoji';
import useModalsStore from '@/stores/modals';
import { useShallow } from 'zustand/react/shallow';
import useLanguageStore, { t } from '@/stores/language';
import UserAvatar from '@/app/components/ImageFromHash/UserAvatar';
import ReportableArea from '@/app/components/ReportableArea';

export default function Content({ emoji }) {
  const loggedIn = useAuthStore(state => state.loggedIn);
  const user = useAuthStore(state => state.user);
  const language = useLanguageStore(state => state.language);

  const router = useRouter();

  const { openModal, disableButton, enableButton, closeModal } = useModalsStore(useShallow(state => ({
    openModal: state.openModal,
    disableButton: state.disableButton,
    enableButton: state.enableButton,
    closeModal: state.closeModal
  })));

  function continueDeleteEmoji() {
    disableButton('delete-emoji', 'confirm');

    toast.promise(deleteEmoji(emoji.id), {
      loading: t('emojiPage.toast.deletingEmoji'),
      success: () => {
        closeModal('delete-emoji');
        setTimeout(() => router.push('/'), 3000);

        return t('emojiPage.toast.emojiDeleted', { emojiName: emoji.name });
      },
      error: error => {
        enableButton('delete-emoji', 'confirm');

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
              {t('emojiPage.notApprovedInfo.description', {
                link: <Link target='_blank' href={config.supportInviteUrl} className='text-secondary hover:text-primary'>{t('emojiPage.notApprovedInfo.linkText')}</Link>
              })}
            </p>
          </div>
        )}

        <div className='flex flex-col gap-4 lg:flex-row'>
          <motion.div className='w-full lg:max-w-[400px]'>
            <ReportableArea
              key={emoji.id}
              active={user?.id !== emoji.user.id}
              type='emoji'
              metadata={{
                id: emoji.id,
                name: emoji.name,
                animated: emoji.animated,
                emoji_ids: []
              }}
              identifier={`emoji-${emoji.id}`}
            >
              <EmojiPreview
                id={emoji.id}
                name={emoji.name}
                image_url={config.getEmojiURL(emoji.id, emoji.animated)}
                ableToChange={false}
                defaultSize='enlarge'
              />
            </ReportableArea>
          </motion.div>

          <div className='grid w-full grid-cols-2 grid-rows-2 gap-4 sm:grid-cols-3'>
            <div className='flex size-full min-h-[115px] flex-col items-center justify-center gap-y-2 rounded-md bg-secondary px-2'>
              <h1 className='text-base font-semibold text-tertiary'>
                {t('emojiPage.fields.name')}
              </h1>

              <span className='flex items-center gap-x-1 text-center text-sm text-primary'>
                {emoji.name}
              </span>
            </div>

            <div className='flex size-full min-h-[115px] flex-col items-center justify-center gap-y-2 rounded-md bg-secondary px-2'>
              <h1 className='text-base font-semibold text-tertiary'>
                {t('emojiPage.fields.uploaded')}
              </h1>

              <span className='flex items-center gap-x-1 text-center text-sm text-primary'>
                {new Date(emoji.created_at).toLocaleDateString(language, { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(/,/g,'')}
              </span>
            </div>

            <div className='flex size-full min-h-[115px] flex-col items-center justify-center gap-y-2 rounded-md bg-secondary px-2'>
              <h1 className='text-base font-semibold text-tertiary'>
                {t('emojiPage.fields.downloads')}
              </h1>

              <span className='flex items-center gap-x-1 text-center text-sm text-primary'>
                <AnimatedCount data={emoji.downloads} />
              </span>
            </div>

            <div className='flex size-full min-h-[115px] flex-col items-center justify-center gap-y-2 rounded-md bg-secondary px-2'>
              <h1 className='text-base font-semibold text-tertiary'>
                {t('emojiPage.fields.animated')}
              </h1>

              <span className='flex items-center gap-x-1 text-center text-sm text-primary'>
                {emoji.animated ? t('emojiPage.fields.yes') : t('emojiPage.fields.no')}
              </span>
            </div>

            <div className='flex size-full min-h-[115px] flex-col items-center justify-center gap-y-2 rounded-md bg-secondary px-2'>
              <h1 className='text-base font-semibold text-tertiary'>
                {t('emojiPage.fields.categories')}
              </h1>

              <span className='flex items-center gap-x-1 text-center text-sm text-primary'>
                {emoji.categories.map(category => t(`categories.${category}`)).join(', ')}
              </span>
            </div>

            <div className='flex size-full min-h-[115px] flex-col items-center justify-center gap-y-2 rounded-md bg-secondary px-2'>
              <h1 className='text-base font-semibold text-tertiary'>
                {t('emojiPage.fields.publisher')}
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
            <ChatMockup
              id={loggedIn ? user.id : emoji.user.id}
              avatar={loggedIn ? user.avatar : emoji.user.avatar}
              username={loggedIn ? user.username : emoji.user.username}
              message='Chipi chipi chapa chapa dubi dubi daba daba'
              emoji_url={config.getEmojiURL(emoji.id, emoji.animated)}
              theme='dark'
              index={0}
            />

            <ChatMockup
              id={loggedIn ? user.id : emoji.user.id}
              avatar={loggedIn ? user.avatar : emoji.user.avatar}
              username={loggedIn ? user.username : emoji.user.username}
              message='Chipi chipi chapa chapa dubi dubi daba daba'
              emoji_url={config.getEmojiURL(emoji.id, emoji.animated)}
              theme='light'
              index={1}
            />

            <div className='mt-4 flex w-full flex-col gap-y-2 lg:max-w-[400px]'>
              <h2 className='flex items-center gap-x-1 text-lg font-semibold sm:text-xl'>
                <MdEmojiEmotions />
                {t('emojiPage.similarEmojis.title')}
              </h2>

              {emoji.similarEmojis.length <= 0 ? (
                <div className='text-sm text-tertiary'>
                  {t('emojiPage.similarEmojis.emptyErrorState')}
                </div>
              ) : (
                <div className='grid w-full grid-cols-1 gap-4 mobile:grid-cols-2 lg:grid-cols-2 lg:grid-rows-2'>
                  {emoji.similarEmojis.map(similarEmoji => (
                    <EmojiCard
                      key={similarEmoji.id}
                      id={similarEmoji.id}
                      name={similarEmoji.name}
                      animated={similarEmoji.animated}
                      categories={similarEmoji.categories}
                      downloads={similarEmoji.downloads}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className='flex w-full flex-col gap-y-4'>
            <h2 className='mt-4 flex items-center gap-x-1 text-lg font-semibold sm:text-xl'>
              <LuShieldQuestion />
              {t('emojiPage.frequentlyAskedQuestions.title')}
            </h2>

            <FaQs emoji={emoji} />
          </div>
        </div>

        {emoji.permissions.canDelete && (
          <div className='mt-8 flex flex-col gap-y-2 rounded-xl border border-red-500 bg-red-500/10 p-4'>
            <h1 className='flex items-center gap-x-1.5 text-lg font-semibold text-primary'>
              <RiErrorWarningFill />
              {t('emojiPage.dangerZone.title')}
            </h1>

            <p className='text-sm font-medium text-tertiary'>
              {t('emojiPage.dangerZone.description')}
            </p>

            <div className='mt-1 flex gap-x-2'>
              <button
                className='w-max rounded-lg bg-black px-3 py-1 text-sm font-medium text-white hover:bg-black/70 dark:bg-white dark:text-black dark:hover:bg-white/70'
                onClick={() =>
                  openModal('delete-emoji', {
                    title: t('emojiPage.dangerZone.deleteEmojiModal.title'),
                    description: t('emojiPage.dangerZone.deleteEmojiModal.description', { emojiName: emoji.name }),
                    content: (
                      <p className='text-sm text-tertiary'>
                        {t('emojiPage.dangerZone.deleteEmojiModal.content', { br: <br /> })}
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
                        action: continueDeleteEmoji
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