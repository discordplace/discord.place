'use client';

import EmojiPreview from '@/app/(emojis)/emojis/components/EmojiPreview';
import PackagePreview from '@/app/(emojis)/emojis/components/PackagePreview';
import Square from '@/app/components/Background/Square';
import AuthProtected from '@/app/components/Providers/Auth/Protected';
import config from '@/config';
import cn from '@/lib/cn';
import createEmoji from '@/lib/request/emojis/createEmoji';
import { t } from '@/stores/language';
import { nanoid } from 'nanoid';
import Link from 'next/link';
import { useRouter } from 'next-nprogress-bar';
import { useEffect, useState } from 'react';
import { MdCheckCircle } from 'react-icons/md';
import { RiErrorWarningFill } from 'react-icons/ri';
import { toast } from 'sonner';

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
  const steps = [
    t('createEmojiPage.steps.0.label'),
    t('createEmojiPage.steps.1.label'),
    t('createEmojiPage.steps.2.label')
  ];
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function publishEmoji() {
    if (isPackage && emoji.files.length < config.packagesMinEmojisLength) return toast.error(t('createEmojiPage.toast.minEmojisLength', { minLength: config.packagesMinEmojisLength }));
    if (isPackage && emoji.files.length > config.packagesMaxEmojisLength) return toast.error(t('createEmojiPage.toast.maxEmojisReached', { maxLength: config.packagesMaxEmojisLength }));

    const regexp = /^[a-z0-9_]{0,20}$/;
    if (!regexp.test(emoji.name)) return toast.error(t('createEmojiPage.toast.invalidEmojiName'));

    setLoading(true);

    const formData = new FormData();
    formData.append('name', emoji.name);
    formData.append('categories', selectedCategories);
    emoji.files.map(file => formData.append('file', file));

    toast.promise(createEmoji(formData), {
      error: error => {
        setLoading(false);

        return error;
      },
      loading: t('createEmojiPage.toast.publishingEmojis', { count: isPackage ? emoji.files.length : 1, postProcess: 'interval' }),
      success: emojiId => {
        router.push(`/emojis/${isPackage ? 'packages/' : ''}${emojiId}`);

        return t('createEmojiPage.toast.emojisPublished', { count: isPackage ? emoji.files.length : 1, postProcess: 'interval' });
      }
    });
  }

  return (
    <AuthProtected>
      <div className='relative z-0 flex w-full justify-center px-6 lg:px-0'>
        <Square blockColor='rgba(var(--bg-secondary))' column='10' row='10' transparentEffectDirection='bottomToTop' />

        <div className='mb-16 mt-48 flex w-full max-w-[600px] flex-col gap-y-2'>
          <h1 className='text-4xl font-bold text-primary'>
            {t('createEmojiPage.title')}
          </h1>

          <p className='text-sm text-tertiary'>
            {t('createEmojiPage.subtitle')}
          </p>

          <div className='mt-6 flex flex-col gap-y-4'>
            <div className='flex justify-between gap-x-4 border-b border-y-primary pb-4'>
              {steps.map((step, index) => (
                <div className='flex flex-col items-center gap-x-2' key={step}>
                  <div className='text-xs uppercase text-tertiary'>
                    {t('step', { currentStep: index + 1 })}
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
              <h2 className='mt-4 text-lg font-medium text-primary sm:text-xl'>
                {t('createEmojiPage.steps.0.inputs.emojiCategories.title')}
              </h2>

              <p className='text-sm text-tertiary'>
                {t('createEmojiPage.steps.0.inputs.emojiCategories.subtitle')}
              </p>

              <div className='mt-4 flex flex-wrap items-center justify-center gap-4'>
                {config.emojiCategories
                  .filter(category => category !== 'All')
                  .map(category => (
                    <button
                      className={cn(
                        'w-[100px] h-[100px] rounded-2xl font-semibold flex gap-x-1 items-center justify-center',
                        selectedCategories.includes(category) ? 'text-primary bg-tertiary hover:bg-quaternary' : 'bg-secondary hover:bg-tertiary',
                        selectedCategories.length >= config.emojiMaxCategoriesLength && !selectedCategories.includes(category) && 'pointer-events-none opacity-70',
                        emoji.file && emoji.file.type === 'image/gif' && category === 'Animated' && 'pointer-events-none opacity-70'
                      )}
                      key={nanoid()}
                      onClick={() => {
                        if (selectedCategories.includes(category)) setSelectedCategories(selectedCategories.filter(selectedCategory => selectedCategory !== category));
                        else setSelectedCategories([...selectedCategories, category]);
                      }}
                    >
                      {t(`categories.${category}`)}
                      {selectedCategories.includes(category) && <MdCheckCircle className='text-primary' />}
                    </button>
                  ))}
              </div>

              <label className='mt-6 flex flex-col gap-y-2' htmlFor='emojiName'>
                <h2 className='text-xl font-medium text-primary'>
                  {t('createEmojiPage.steps.0.inputs.emojiName.title')}
                </h2>

                <p className='text-sm text-tertiary'>
                  {t('createEmojiPage.steps.0.inputs.emojiName.subtitle')}
                </p>
              </label>

              <input
                className='w-full rounded-lg bg-secondary px-3 py-2 text-sm text-tertiary outline-none placeholder:text-placeholder hover:bg-tertiary focus-visible:bg-quaternary focus-visible:text-secondary'
                id='emojiName'
                maxLength={20}
                onChange={event => setEmoji({ ...emoji, name: event.target.value })}
                placeholder={t('createEmojiPage.steps.0.inputs.emojiName.placeholder')}
                type='text'
                value={emoji.name}
              />
            </>
          )}

          {activeStep === 1 && (
            <>
              {isPackage ? (
                <PackagePreview ableToChange={true} image_urls={emojiURLs} setEmojiURL={setEmojiURL} setImageURLs={setEmojiURLs} setIsPackage={setIsPackage} />
              ) : (
                <EmojiPreview ableToChange={true} defaultSize='enlarge' image_url={emojiURL} />
              )}

              <input
                accept='.png,.gif'
                className='hidden'
                id='emojiFiles'
                max={9}
                multiple
                onChange={event => {
                  const files = event.target.files;
                  if (files.length <= 0) return;
                  if (files.length > config.packagesMaxEmojisLength) return toast.error(t('createEmojiPage.toast.maxEmojisReached', { maxLength: config.packagesMaxEmojisLength }));

                  if ([...files].some(file => file.size > 256000)) return toast.error(t('createEmojiPage.toast.fileSizeExceeded', { size: 256 }));
                  if ([...files].some(file => file.type === 'image/gif' && !selectedCategories.includes('Animated'))) return toast.error(t('createEmojiPage.toast.animatedCategoryNotSelected'));

                  setEmoji({ ...emoji, files: [...files] });
                }}
                type='file'
              />
            </>
          )}

          {activeStep === 2 && (
            <>
              <h2 className='mt-2 text-lg font-medium text-primary sm:text-xl'>
                {t('createEmojiPage.steps.2.title')}
              </h2>

              <p className='text-sm text-tertiary'>
                {t('createEmojiPage.steps.2.subtitle')}
              </p>

              {emoji.files.length > 1 && (
                <div className='mt-2 flex flex-col gap-y-2 rounded-xl border border-blue-500 bg-blue-500/10 p-4'>
                  <h3 className='flex items-center gap-x-1.5 text-lg font-bold text-primary'>
                    <RiErrorWarningFill /> {t('createEmojiPage.steps.2.packageInfo.title')}
                  </h3>

                  <span className='text-sm font-medium text-tertiary'>
                    {t('createEmojiPage.steps.2.packageInfo.description')}
                  </span>
                </div>
              )}

              <div className='mt-4 flex flex-col gap-y-2'>
                <div className='flex justify-between'>
                  <h3 className='text-sm text-tertiary'>
                    {t('createEmojiPage.steps.2.fields.categories')}
                  </h3>

                  <h3 className='text-sm text-tertiary'>
                    {selectedCategories.join(', ')}
                  </h3>
                </div>

                <div className='flex justify-between'>
                  <h3 className='text-sm text-tertiary'>
                    {t('createEmojiPage.steps.2.fields.emojiName')}
                  </h3>

                  <h3 className='text-sm text-tertiary'>
                    {emoji.name}
                  </h3>
                </div>
              </div>

              <p className='mt-2 text-xs text-tertiary mobile:text-sm'>
                {t('createEmojiPage.steps.2.disclaimer.content', {
                  contentPolicyLink: <Link className='hover:text-primary hover:underline' href='/legal/content-policy'>{t('createEmojiPage.steps.2.disclaimer.linkText')}</Link>
                })}
              </p>
            </>
          )}

          <div className='mt-8 flex w-full justify-between'>
            <button className='flex items-center gap-x-1 rounded-lg bg-black px-3 py-1 text-sm font-semibold text-white hover:bg-black/70 disabled:pointer-events-none disabled:opacity-70 dark:bg-white dark:text-black dark:hover:bg-white/70' disabled={activeStep === 0 || loading} onClick={() => setActiveStep(activeStep - 1)}>
              {t('buttons.previous')}
            </button>

            <button className='flex items-center gap-x-1 rounded-lg bg-black px-3 py-1 text-sm font-semibold text-white hover:bg-black/70 disabled:pointer-events-none disabled:opacity-70 dark:bg-white dark:text-black dark:hover:bg-white/70' disabled={
              activeStep === 0 ? (selectedCategories.length <= 0 || !emoji.name) :
                activeStep === 1 ? emoji.files?.length <= 0 :
                  (loading === true || false)
            } onClick={() => {
              if (activeStep === steps.length - 1) publishEmoji();
              else setActiveStep(activeStep + 1);
            }}>
              {activeStep === steps.length - 1 ? t('buttons.publish') : t('buttons.next')}
            </button>
          </div>
        </div>
      </div>
    </AuthProtected>
  );
}