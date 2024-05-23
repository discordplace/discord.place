'use client';

import Square from '@/app/components/Background/Square';
import { useEffect, useState } from 'react';
import { MdCheckCircle } from 'react-icons/md';
import { toast } from 'sonner';
import { nanoid } from 'nanoid';
import cn from '@/lib/cn';
import config from '@/config';
import { Link } from 'next-view-transitions';
import createEmoji from '@/lib/request/emojis/createEmoji';
import { useRouter } from 'next-nprogress-bar';
import EmojiPreview from '@/app/(emojis)/emojis/components/EmojiPreview';
import PackagePreview from '@/app/(emojis)/emojis/components/PackagePreview';
import { RiErrorWarningFill } from 'react-icons/ri';
import AuthProtected from '@/app/components/Providers/Auth/Protected';

export default function Page() {
  const [isPackage, setIsPackage] = useState(false);
  const [emoji, setEmoji] = useState({});
  const [emojiURL, setEmojiURL] = useState(null);
  const [emojiURLs, setEmojiURLs] = useState([]);

  useEffect(() => {
    if (emoji.files?.length > 0) {
      if (emoji.files.length === 1) {
        setIsPackage(false);
        const url = URL.createObjectURL(emoji.files[0]);
        setEmojiURL(url);

        return () => URL.revokeObjectURL(url);
      } else {
        setIsPackage(true);
        setEmojiURLs(emoji.files.map(file => URL.createObjectURL(file)));

        return () => emojiURLs.map(URL.revokeObjectURL);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emoji.files]);

  const [selectedCategories, setSelectedCategories] = useState([]);

  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Details', 'Upload & Preview', 'Publish'];
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function publishEmoji() {
    if (isPackage && emoji.files.length < config.packagesMinEmojisLength) return toast.error(`Minimum ${config.packagesMinEmojisLength} emojis should be added to the package for publishing.`);
    if (isPackage && emoji.files.length > config.packagesMaxEmojisLength) return toast.error(`No more than ${config.packagesMaxEmojisLength} emojis can be added to the package.`);

    const regexp = /^[a-z0-9_]{0,20}$/;
    if (!regexp.test(emoji.name)) return toast.error('Emoji name can only contain lowercase letters, numbers, and underscores. Max 20 characters.');
    
    setLoading(true);
    
    const formData = new FormData();
    formData.append('name', emoji.name);
    formData.append('categories', selectedCategories);
    emoji.files.map(file => formData.append('file', file));
    
    toast.promise(createEmoji(formData), {
      loading: 'Publishing emoji(s)..',
      success: emojiId => {
        router.push(`/emojis/${isPackage ? 'packages/' : ''}${emojiId}`);
        return 'Emoji(s) published successfully.';
      },
      error: error => {
        setLoading(false);
        return error;
      }
    });
  }

  return (
    <AuthProtected>
      <div className="relative z-0 flex justify-center w-full px-6 lg:px-0">      
        <Square column='10' row='10' transparentEffectDirection='bottomToTop' blockColor='rgba(var(--bg-secondary))' />

        <div className="mt-48 mb-16 max-w-[600px] flex flex-col gap-y-2 w-full">
          <h1 className="text-4xl font-bold text-primary">
            Publish Emoji
          </h1>

          <p className="text-sm text-tertiary">
            Publish your emoji to the world.
          </p>

          <div className='flex flex-col mt-6 gap-y-4'>
            <div className='flex justify-between pb-4 border-b gap-x-4 border-y-primary'>
              {steps.map((step, index) => (
                <div className='flex flex-col items-center gap-x-2' key={step}>
                  <div className='text-xs uppercase text-tertiary'>
                    STEP {index + 1}
                  </div>
                  <h2 className={cn(
                    'text-sm mobile:text-base transition-colors font-medium text-secondary flex items-center',
                    activeStep === index && 'text-primary'
                  )}>
                    {step}
                  </h2>
                </div>
              ))}
            </div>
          </div>

          {activeStep === 0 && (
            <>
              <h2 className='mt-4 text-lg font-medium sm:text-xl text-primary'>
                Let{'\''}s start with the details.
              </h2>

              <p className='text-sm text-tertiary'>
                Choose a one or more categories for your emoji.
              </p>

              <div className='flex flex-wrap items-center justify-center gap-4 mt-4'>
                {config.emojiCategories
                  .filter(category => category !== 'All')
                  .map(category => (
                    <button
                      key={nanoid()}
                      className={cn(
                        'w-[100px] h-[100px] rounded-2xl font-semibold flex gap-x-1 items-center justify-center',
                        selectedCategories.includes(category) ? 'text-primary bg-tertiary hover:bg-quaternary' : 'bg-secondary hover:bg-tertiary',
                        selectedCategories.length >= config.emojiMaxCategoriesLength && !selectedCategories.includes(category) && 'pointer-events-none opacity-70',
                        emoji.file && emoji.file.type === 'image/gif' && category === 'Animated' && 'pointer-events-none opacity-70'
                      )}
                      onClick={() => {
                        if (selectedCategories.includes(category)) setSelectedCategories(selectedCategories.filter(selectedCategory => selectedCategory !== category));
                        else setSelectedCategories([...selectedCategories, category]);
                      }}
                    >
                      {category}
                      {selectedCategories.includes(category) && <MdCheckCircle className='text-primary' />}
                    </button>
                  ))}
              </div>

              <label className='flex flex-col mt-6 gap-y-2' htmlFor='emojiName'>
                <h2 className='text-xl font-medium text-primary'>
                  Emoji Name
                </h2>
                <p className='text-sm text-tertiary'>
                  Enter a name for your emoji.
                </p>
              </label>

              <input
                id='emojiName'
                className='w-full px-3 py-2 text-sm rounded-lg outline-none placeholder-placeholder bg-secondary hover:bg-tertiary focus-visible:bg-quaternary focus-visible:text-secondary text-tertiary'
                type='text'
                value={emoji.name}
                onChange={event => setEmoji({ ...emoji, name: event.target.value })}
                placeholder='Enter emoji name'
                maxLength={20}
              />
            </>
          )}

          {activeStep === 1 && (
            <>
              {isPackage ? (
                <PackagePreview ableToChange={true} image_urls={emojiURLs} setImageURLs={setEmojiURLs} setIsPackage={setIsPackage} setEmojiURL={setEmojiURL} />
              ) : (
                <EmojiPreview image_url={emojiURL} ableToChange={true} defaultSize='enlarge' />
              )}

              <input
                id='emojiFiles'
                className='hidden'
                type='file'
                accept='.png,.gif'
                multiple
                max={9}
                onChange={event => {
                  const files = event.target.files;
                  if (files.length <= 0) return;
                  if (files.length > 9) return toast.error('No more than 9 emojis can be added to the package.');

                  if ([...files].some(file => file.size > 256000)) return toast.error('File size should not exceed 256kb.');
                  if ([...files].some(file => file.type === 'image/gif' && !selectedCategories.includes('Animated'))) return toast.error('If you want to share an animated emoji, please go back and select the Animated category.');

                  setEmoji({ ...emoji, files: [...files] });
                }}
              />
            </>
          )}

          {activeStep === 2 && (
            <>
              <h2 className='mt-2 text-lg font-medium sm:text-xl text-primary'>
                Confirm your details and publish your emoji.
              </h2>

              <p className='text-sm text-tertiary'>
                Review the details and click on the publish button to publish your emoji.
              </p>

              {emoji.files.length > 1 && (
                <div className='flex flex-col p-4 mt-2 border border-blue-500 bg-blue-500/10 rounded-xl gap-y-2'>
                  <h3 className='flex items-center text-lg font-bold text-primary gap-x-1.5'>
                    <RiErrorWarningFill /> Hey!
                  </h3>
                  <span className='text-sm font-medium text-tertiary'>
                    It looks like you want to share more than one emoji at the same time. In this case, you will be sharing a package, not an emoji. Emoji packages have pages just like emojis and can be downloaded just like emojis, but as a rar file. 
                  </span>
                </div>
              )}

              <div className='flex flex-col mt-4 gap-y-2'>
                <div className='flex justify-between'>
                  <h3 className='text-sm text-tertiary'>
                    Categories
                  </h3>
                  <h3 className='text-sm text-tertiary'>
                    {selectedCategories.join(', ')}
                  </h3>
                </div>

                <div className='flex justify-between'>
                  <h3 className='text-sm text-tertiary'>
                    Emoji Name
                  </h3>
                  <h3 className='text-sm text-tertiary'>
                    {emoji.name}
                  </h3>
                </div>
              </div>

              <p className='mt-2 text-xs mobile:text-sm text-tertiary'>
                By publishing this emoji{emoji.files.length > 1 && ' package'}, you agree to our <Link href='/legal/content-policy' className='hover:text-primary hover:underline'>content policy</Link>.
              </p>
            </>
          )}

          <div className='flex justify-between w-full mt-8'>
            <button className='flex items-center px-3 py-1 text-sm font-semibold text-white bg-black rounded-lg gap-x-1 dark:bg-white dark:text-black dark:hover:bg-white/70 hover:bg-black/70 disabled:pointer-events-none disabled:opacity-70' onClick={() => setActiveStep(activeStep - 1)} disabled={activeStep === 0 || loading}>
              Previous
            </button>

            <button className='flex items-center px-3 py-1 text-sm font-semibold text-white bg-black rounded-lg gap-x-1 dark:bg-white dark:text-black dark:hover:bg-white/70 hover:bg-black/70 disabled:pointer-events-none disabled:opacity-70' onClick={() => {
              if (activeStep === steps.length - 1) publishEmoji();
              else setActiveStep(activeStep + 1);
            }} disabled={
              activeStep === 0 ? (selectedCategories.length <= 0 || !emoji.name) :
                activeStep === 1 ? emoji.files?.length <= 0 :
                  (loading === true || false)
            }>
              {activeStep === steps.length - 1 ? 'Publish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </AuthProtected>
  );
}