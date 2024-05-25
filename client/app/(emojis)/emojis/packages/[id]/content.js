'use client';

import PackagePreview from '@/app/(emojis)/emojis/components/PackagePreview';
import AnimatedCount from '@/app/components/AnimatedCount';
import config from '@/config';
import Image from 'next/image';
import { LuShieldQuestion } from 'react-icons/lu';
import FaQs from '@/app/(emojis)/emojis/packages/[id]/components/FaQs';
import { MdEmojiEmotions } from 'react-icons/md';
import EmojiPackageCard from '@/app/(emojis)/emojis/components/Hero/EmojiPackageCard';
import { motion } from 'framer-motion';
import { RiErrorWarningFill } from 'react-icons/ri';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next-nprogress-bar';
import deleteEmoji from '@/lib/request/emojis/deleteEmoji';
import { TbLoader } from 'react-icons/tb';

export default function Content({ emoji }) {
  const [imageURLs, setImageURLs] = useState(emoji.emoji_ids.map(({ id, animated }) => config.getEmojiURL(`packages/${emoji.id}/${id}`, animated)));
  const [showDeleteConsent, setShowDeleteConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function continueDeleteEmojiPackage() {
    setLoading(true);

    toast.promise(deleteEmoji(emoji.id, true), {
      loading: `${emoji.name} is deleting..`,
      success: () => {
        setTimeout(() => router.push('/'), 3000);
        return `${emoji.name} successfully deleted. You will be redirected to home page after 3 seconds.`;
      },
      error: error => {
        setLoading(false);
        return error;
      }
    });
  }

  return (
    <div className='flex items-center justify-center w-full'>
      <div className='flex w-full max-w-[1000px] mt-48 mb-16 flex-col gap-y-4 px-4 lg:px-0'>
        {!emoji.approved && (
          <div className='flex flex-col p-4 border border-yellow-500 gap-y-2 bg-yellow-500/10 rounded-xl'>
            <h1 className='text-lg text-primary flex items-center font-semibold gap-x-1.5'>
              <RiErrorWarningFill />
              Beep beep!
            </h1>
            <p className='text-sm font-medium text-tertiary'>
              For the moment, only you can see the emoji package. Once the emoji package is approved, it will become public. Until then, you can come to <Link target='_blank' href={config.supportInviteUrl} className='text-secondary hover:text-primary'>our support server</Link> and get a notification from our bot when your emoji package is approved. Make sure you open your DMs.
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

          <div className='grid w-full gap-4 grid-cols-21 sm:grid-cols-3'>
            <div className='flex flex-col items-center justify-center w-full h-full px-2 rounded-md bg-secondary gap-y-2 min-h-[115px]'>
              <h1 className='text-base font-semibold text-tertiary'>
                Name
              </h1>
              <span className='flex items-center text-sm text-center text-primary gap-x-1'>
                {emoji.name}
              </span>
            </div>

            <div className='flex flex-col items-center justify-center w-full h-full px-2 rounded-md bg-secondary gap-y-2 min-h-[115px]'>
              <h1 className='text-base font-semibold text-tertiary'>
                Uploaded
              </h1>
              <span className='flex items-center text-sm text-center text-primary gap-x-1'>
                {new Date(emoji.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(/,/g,'')}
              </span>
            </div>

            <div className='flex flex-col items-center justify-center w-full h-full px-2 rounded-md bg-secondary gap-y-2 min-h-[115px]'>
              <h1 className='text-base font-semibold text-tertiary'>
                Downloads
              </h1>
              <span className='flex items-center text-sm text-center text-primary gap-x-1'>
                <AnimatedCount data={emoji.downloads} />
              </span>
            </div>

            <div className='flex flex-col items-center justify-center w-full h-full px-2 rounded-md bg-secondary gap-y-2 min-h-[115px]'>
              <h1 className='text-base font-semibold text-tertiary'>
                Emoji Count
              </h1>
              <span className='flex items-center text-sm text-center text-primary gap-x-1'>
                <AnimatedCount data={emoji.emoji_ids.length} />
              </span>
            </div>

            <div className='flex flex-col items-center justify-center w-full h-full px-2 rounded-md bg-secondary gap-y-2 min-h-[115px]'>
              <h1 className='text-base font-semibold text-tertiary'>
                Categories
              </h1>
              <span className='flex items-center text-sm text-center text-primary gap-x-1'>
                {emoji.categories.join(', ')}
              </span>
            </div>

            <div className='flex flex-col items-center justify-center w-full h-full px-2 rounded-md bg-secondary gap-y-2 min-h-[115px]'>
              <h1 className='text-base font-semibold text-tertiary'>
                Publisher
              </h1>
              <Link 
                className='flex items-center text-sm text-center transition-opacity hover:opacity-50 text-primary gap-x-1'
                href={`/profile/u/${emoji.user.id}`}
              >
                <div className='flex items-center gap-x-1'>
                  <Image
                    src={emoji.user.avatar_url}
                    width={18}
                    height={18}
                    alt={`@${emoji.user.username} Avatar's`}
                    className='rounded-full'
                  />
                  {emoji.user.username}
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className='flex flex-col w-full gap-4 lg:flex-row'>
          <div className='flex lg:max-w-[400px] w-full flex-col'>
            <div className='mt-4 lg:max-w-[400px] w-full flex flex-col gap-y-2'>
              <h2 className='flex items-center text-lg font-semibold sm:text-xl gap-x-1'>
                <MdEmojiEmotions />
                Similar Emoji Packs
              </h2>

              {emoji.similarEmojiPacks.length <= 0 ? (
                <div className='text-sm text-tertiary'>
                  It{'\''}s a bit sad, but I couldn{'\''}t find any similar emoji packs..
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
          
          <div className='flex flex-col w-full gap-y-4'>
            <h2 className='flex items-center mt-4 text-lg font-semibold sm:text-xl gap-x-1'>
              <LuShieldQuestion />
              Frequently Asked Questions
            </h2>

            <FaQs emoji={emoji} />
          </div>
        </div>

        {emoji.permissions.canDelete && (
          <div className='flex flex-col p-4 mt-8 border border-red-500 gap-y-2 bg-red-500/10 rounded-xl'>
            <h1 className='text-lg text-primary flex items-center font-semibold gap-x-1.5'>
              <RiErrorWarningFill />
              Danger Zone
            </h1>
            <p className='text-sm font-medium text-tertiary'>
              {showDeleteConsent ? (
                <>
                  Are you sure you really want to delete this emoji package?
                </>
              ) : (
                <>
                  You can delete the emoji pakcage using the button below, but be careful not to delete it by mistake :)
                </>
              )}
            </p>
            
            <div className='flex mt-1 gap-x-2'>
              {showDeleteConsent ? (
                <>
                  <button className='flex items-center gap-x-1.5 px-3 py-1 text-sm font-medium text-white bg-black rounded-lg w-max dark:bg-white dark:text-black dark:hover:bg-white/70 hover:bg-black/70 disabled:pointer-events-none disabled:opacity-70' onClick={continueDeleteEmojiPackage} disabled={loading}>
                    {loading && (
                      <TbLoader className='animate-spin' />
                    )}
                    Confirm
                  </button>

                  <button className='px-3 py-1 text-sm font-medium text-white bg-black rounded-lg w-max dark:bg-white dark:text-black dark:hover:bg-white/70 hover:bg-black/70 disabled:pointer-events-none disabled:opacity-70' onClick={() => setShowDeleteConsent(false)} disabled={loading}>
                    Cancel
                  </button>
                </>
              ) : (
                <button className='px-3 py-1 text-sm font-medium text-white bg-black rounded-lg w-max dark:bg-white dark:text-black dark:hover:bg-white/70 hover:bg-black/70' onClick={() => setShowDeleteConsent(true)}>
                  Delete
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}