'use client';

import ThemeCard from '@/app/(themes)/themes/components/ThemeCard';
import config from '@/config';
import cn from '@/lib/cn';
import confetti from '@/lib/lotties/confetti.json';
import createTheme from '@/lib/request/themes/createTheme';
import useAccountStore from '@/stores/account';
import { t } from '@/stores/language';
import isEqual from 'lodash/isEqual';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { IoMdCheckmarkCircle } from 'react-icons/io';
import { MdChevronLeft } from 'react-icons/md';
import { TbLoader } from 'react-icons/tb';
import Lottie from 'react-lottie';
import { toast } from 'sonner';

export default function NewTheme() {
  const setCurrentlyAddingTheme = useAccountStore(state => state.setCurrentlyAddingTheme);

  const [loading, setLoading] = useState(false);
  const [renderConfetti, setRenderConfetti] = useState(false);

  const [colors, setColors] = useState({
    primary: null,
    secondary: null
  });

  const [themeCategories, setThemeCategories] = useState([]);

  const router = useRouter();

  function addTheme() {
    if (!isEqual(colors.primary, colors.secondary) && !themeCategories.includes('Gradient')) return toast.error(t('accountPage.tabs.myThemes.sections.addTheme.toast.gradientCategoryRequired'));

    setLoading(true);

    toast.promise(createTheme({ categories: themeCategories, colors }), {
      error: error => {
        setLoading(false);

        return error;
      },
      loading: t('accountPage.tabs.myThemes.sections.addTheme.toast.addingTheme'),
      success: data => {
        setTimeout(() => {
          router.push(`/themes/${data.id}`);

          // Reset states
          setColors({ primary: null, secondary: null });
          setThemeCategories([]);
          setCurrentlyAddingTheme(false);
        }, 3000);

        setRenderConfetti(true);

        return t('accountPage.tabs.myThemes.sections.addTheme.toast.themeAdded');
      }
    });
  }

  return (
    <>
      <div className='pointer-events-none fixed left-0 top-0 z-10 h-svh w-full'>
        <Lottie height='100%' isStopped={!renderConfetti} options={{ animationData: confetti, autoplay: false, loop: false }} width='100%'/>
      </div>

      <div className='flex w-full max-w-[800px] flex-col justify-center gap-y-4'>
        <div className='flex items-center gap-x-4'>
          <button
            className='rounded-xl bg-secondary p-1.5 hover:bg-tertiary'
            onClick={() => {
              setThemeCategories([]);
              setCurrentlyAddingTheme(false);
            }}
          >
            <MdChevronLeft size={24}/>
          </button>

          <h1 className='flex flex-wrap items-center gap-x-1 text-lg font-bold sm:text-3xl'>
            {t('accountPage.tabs.myThemes.sections.addTheme.title')}
          </h1>
        </div>

        <p className='max-w-[800px] text-sm text-tertiary sm:text-base'>
          {t('accountPage.tabs.myThemes.sections.addTheme.subtitle')}
        </p>

        <div className='mt-12 flex w-full items-center justify-center'>
          <div className='flex w-full max-w-[800px] flex-col gap-y-1'>

            <h2 className='text-lg font-semibold'>
              {t('accountPage.tabs.myThemes.sections.addTheme.fields.colors.label')}
            </h2>

            <p className='text-sm text-tertiary'>
              {t('accountPage.tabs.myThemes.sections.addTheme.fields.colors.description')}
            </p>

            <div className='flex items-center gap-x-16 gap-y-4'>
              <div className='flex items-center gap-x-4'>
                <div className='mt-4 flex flex-col gap-y-2'>
                  <h2 className='flex items-center gap-x-2 text-sm font-medium text-secondary'>
                    {t('accountPage.tabs.myThemes.sections.addTheme.fields.colors.primaryLabel')}

                    <div className='size-3 rounded-full' style={{ backgroundColor: colors.primary || '#000000' }} />
                  </h2>

                  <div className='[&_.react-colorful\_\_hue]:!h-[10px] [&_.react-colorful\_\_pointer]:size-[10px] [&_.react-colorful]:size-[120px]'>
                    <HexColorPicker
                      color={colors.primary || '#000000'}
                      onChange={color => setColors(oldColors => ({ ...oldColors, primary: color }))}
                    />

                    <input
                      className='mt-4 w-full max-w-[120px] rounded-md bg-secondary px-2 py-1 text-sm font-medium text-secondary outline-none placeholder:text-placeholder hover:bg-quaternary focus-visible:bg-quaternary'
                      maxLength={7}
                      onChange={event => setColors(oldColors => ({ ...oldColors, primary: event.target.value }))}
                      type='text'
                      value={colors.primary || '#000000'}
                    />
                  </div>
                </div>

                <div className='mt-4 flex flex-col gap-y-2'>
                  <h2 className='flex items-center gap-x-2 text-sm font-medium text-secondary'>
                    {t('accountPage.tabs.myThemes.sections.addTheme.fields.colors.secondaryLabel')}

                    <div className='size-3 rounded-full' style={{ backgroundColor: colors.secondary || '#000000' }} />
                  </h2>

                  <div className='[&_.react-colorful\_\_hue]:!h-[10px] [&_.react-colorful\_\_pointer]:size-[10px] [&_.react-colorful]:size-[120px]'>
                    <HexColorPicker
                      color={colors.secondary || '#000000'}
                      onChange={color => setColors(oldColors => ({ ...oldColors, secondary: color }))}
                    />

                    <input
                      className='mt-4 w-full max-w-[120px] rounded-md bg-secondary px-2 py-1 text-sm font-medium text-secondary outline-none placeholder:text-placeholder hover:bg-quaternary focus-visible:bg-quaternary'
                      maxLength={7}
                      onChange={event => setColors(oldColors => ({ ...oldColors, secondary: event.target.value }))}
                      type='text'
                      value={colors.secondary || '#000000'}
                    />
                  </div>
                </div>
              </div>

              <ThemeCard
                className='w-[250px]'
                id={null}
                primaryColor={colors.primary || '#000000'}
                secondaryColor={colors.secondary || '#000000'}
              />
            </div>

            <h2 className='mt-8 text-lg font-semibold'>
              {t('accountPage.tabs.myThemes.sections.addTheme.fields.categories.label')}
            </h2>

            <p className='text-sm text-tertiary'>
              {t('accountPage.tabs.myThemes.sections.addTheme.fields.categories.description')}
            </p>

            <div className='mt-4 flex flex-wrap gap-2'>
              {config.themeCategories
                .map(category => (
                  <button
                    className={cn(
                      'rounded-lg flex items-center gap-x-1 font-semibold w-max h-max text-sm px-3 py-1.5 bg-secondary hover:bg-quaternary',
                      themeCategories.includes(category) && 'bg-quaternary'
                    )}
                    key={category}
                    onClick={() => {
                      if (themeCategories.includes(category)) setThemeCategories(oldCategories => oldCategories.filter(oldCategory => oldCategory !== category));
                      else setThemeCategories(oldCategories => [...oldCategories, category]);
                    }}
                  >
                    {themeCategories.includes(category) ? <IoMdCheckmarkCircle/> : config.themeCategoriesIcons[category]}
                    {t(`categories.${category}`)}
                  </button>
                ))}
            </div>

            <h2 className='mt-8 text-lg font-semibold'>
              {t('accountPage.tabs.myThemes.sections.addTheme.fields.contentPolicy.label')}
            </h2>

            <p className='flex flex-col gap-y-1 text-sm text-tertiary sm:text-base'>
              {t('accountPage.tabs.myThemes.sections.addTheme.fields.contentPolicy.description', {
                note: <span className='mt-2 text-xs text-tertiary'>{t('accountPage.tabs.myThemes.sections.addTheme.fields.contentPolicy.note')}</span>
              })}
            </p>

            <h2 className='mt-8 text-lg font-semibold'>
              {t('accountPage.tabs.myThemes.sections.addTheme.fields.areYouReady.label')}
            </h2>

            <div className='mt-2 flex w-full flex-col gap-2 sm:flex-row'>
              <button
                className='flex w-full items-center justify-center gap-x-1.5 rounded-lg bg-black px-3 py-1.5 text-sm font-semibold text-white hover:bg-black/70 disabled:pointer-events-none disabled:opacity-70 dark:bg-white dark:text-black dark:hover:bg-white/70'
                disabled={
                  loading ||
                  themeCategories.length < 1
                }
                onClick={addTheme}
              >
                {loading && <TbLoader className='animate-spin'/>}
                {t('buttons.addTheme')}
              </button>

              <button
                className='flex w-full items-center justify-center rounded-lg py-2 text-sm font-medium hover:bg-quaternary disabled:pointer-events-none disabled:opacity-70'
                disabled={loading}
                onClick={() => {
                  setThemeCategories([]);
                  setCurrentlyAddingTheme(false);
                }}
              >
                {t('buttons.cancel')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}