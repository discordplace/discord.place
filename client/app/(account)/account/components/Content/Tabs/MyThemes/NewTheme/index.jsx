'use client';

import config from '@/config';
import { MdChevronLeft } from 'react-icons/md';
import { useState } from 'react';
import { toast } from 'sonner';
import cn from '@/lib/cn';
import { IoMdCheckmarkCircle } from 'react-icons/io';
import createTheme from '@/lib/request/themes/createTheme';
import { useRouter } from 'next/navigation';
import Lottie from 'react-lottie';
import confetti from '@/lib/lotties/confetti.json';
import { TbLoader } from 'react-icons/tb';
import useAccountStore from '@/stores/account';
import { t } from '@/stores/language';
import { HexColorPicker } from 'react-colorful';
import { isEqual } from 'lodash';

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

    toast.promise(createTheme({ colors, categories: themeCategories }), {
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
      },
      error: error => {
        setLoading(false);

        return error;
      }
    });
  }

  return (
    <>
      <div className="fixed pointer-events-none z-[10] top-0 left-0 w-full h-[100dvh]">
        <Lottie options={{ loop: false, autoplay: false, animationData: confetti }} isStopped={!renderConfetti} height="100%" width="100%"/>
      </div>

      <div className="flex justify-center w-full gap-y-4 max-w-[800px] flex-col">
        <div className="flex items-center gap-x-4">
          <button
            className="p-1.5 rounded-xl bg-secondary hover:bg-tertiary"
            onClick={() => {
              setThemeCategories([]);
              setCurrentlyAddingTheme(false);
            }}
          >
            <MdChevronLeft size={24}/>
          </button>

          <h1 className="flex flex-wrap items-center text-lg font-bold sm:text-3xl gap-x-1">
            {t('accountPage.tabs.myThemes.sections.addTheme.title')}
          </h1>
        </div>

        <p className="text-sm sm:text-base max-w-[800px] text-tertiary">
          {t('accountPage.tabs.myThemes.sections.addTheme.subtitle')}
        </p>

        <div className="flex items-center justify-center w-full mt-12">
          <div className="max-w-[800px] w-full flex flex-col gap-y-1">

            <h2 className="text-lg font-semibold">
              {t('accountPage.tabs.myThemes.sections.addTheme.fields.colors.label')}
            </h2>

            <p className="text-sm text-tertiary">
              {t('accountPage.tabs.myThemes.sections.addTheme.fields.colors.description')}
            </p>

            <div className='flex items-center gap-x-4'>
              <div className="flex flex-col mt-4 gap-y-2">
                <h2 className='flex items-center text-sm font-medium text-secondary gap-x-2'>
                  {t('accountPage.tabs.myThemes.sections.addTheme.fields.colors.primaryLabel')}

                  <div className='w-3 h-3 rounded-full' style={{ backgroundColor: colors.primary || '#000000' }} />
                </h2>

                <div className='[&_.react-colorful]:h-[120px] [&_.react-colorful]:w-[120px] [&_.react-colorful\_\_hue]:!h-[10px] [&_.react-colorful\_\_pointer]:w-[10px] [&_.react-colorful\_\_pointer]:h-[10px]'>
                  <HexColorPicker
                    color={colors.primary || '#000000'}
                    onChange={color => setColors(oldColors => ({ ...oldColors, primary: color }))}
                  />

                  <input
                    type='text'
                    value={colors.primary || '#000000'}
                    maxLength={7}
                    onChange={event => setColors(oldColors => ({ ...oldColors, primary: event.target.value }))}
                    className='w-full px-2 py-1 mt-4 text-sm max-w-[120px] font-medium rounded-md outline-none text-secondary placeholder-placeholder bg-secondary hover:bg-quaternary focus-visible:bg-quaternary'
                  />
                </div>
              </div>

              <div className="flex flex-col mt-4 gap-y-2">
                <h2 className='flex items-center text-sm font-medium text-secondary gap-x-2'>
                  {t('accountPage.tabs.myThemes.sections.addTheme.fields.colors.secondaryLabel')}

                  <div className='w-3 h-3 rounded-full' style={{ backgroundColor: colors.secondary || '#000000' }} />
                </h2>

                <div className='[&_.react-colorful]:h-[120px] [&_.react-colorful]:w-[120px] [&_.react-colorful\_\_hue]:!h-[10px] [&_.react-colorful\_\_pointer]:w-[10px] [&_.react-colorful\_\_pointer]:h-[10px]'>
                  <HexColorPicker
                    color={colors.secondary || '#000000'}
                    onChange={color => setColors(oldColors => ({ ...oldColors, secondary: color }))}
                  />

                  <input
                    type='text'
                    value={colors.secondary || '#000000'}
                    maxLength={7}
                    onChange={event => setColors(oldColors => ({ ...oldColors, secondary: event.target.value }))}
                    className='w-full px-2 py-1 mt-4 text-sm max-w-[120px] font-medium rounded-md outline-none text-secondary placeholder-placeholder bg-secondary hover:bg-quaternary focus-visible:bg-quaternary'
                  />
                </div>
              </div>
            </div>

            <h2 className="mt-8 text-lg font-semibold">
              {t('accountPage.tabs.myThemes.sections.addTheme.fields.categories.label')}
            </h2>

            <p className="text-sm text-tertiary">
              {t('accountPage.tabs.myThemes.sections.addTheme.fields.categories.description')}
            </p>

            <div className="flex flex-wrap mt-4 gap-x-2 gap-y-2">
              {config.themeCategories
                .map(category => (
                  <button
                    key={category}
                    className={cn(
                      'rounded-lg flex items-center gap-x-1 font-semibold w-max h-max text-sm px-3 py-1.5 bg-secondary hover:bg-quaternary',
                      themeCategories.includes(category) && 'bg-quaternary'
                    )}
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

            <h2 className="mt-8 text-lg font-semibold">
              {t('accountPage.tabs.myThemes.sections.addTheme.fields.contentPolicy.label')}
            </h2>

            <p className="flex flex-col text-sm sm:text-base gap-y-1 text-tertiary">
              {t('accountPage.tabs.myThemes.sections.addTheme.fields.contentPolicy.description', {
                note: <span className="mt-2 text-xs text-tertiary">{t('accountPage.tabs.myThemes.sections.addTheme.fields.contentPolicy.note')}</span>
              })}
            </p>

            <h2 className="mt-8 text-lg font-semibold">
              {t('accountPage.tabs.myThemes.sections.addTheme.fields.areYouReady.label')}
            </h2>

            <div className="flex flex-col w-full gap-2 mt-2 sm:flex-row">
              <button
                className="flex items-center gap-x-1.5 px-3 py-1.5 rounded-lg font-semibold text-white bg-black w-full justify-center hover:bg-black/70 dark:bg-white dark:text-black dark:hover:bg-white/70 text-sm disabled:pointer-events-none disabled:opacity-70"
                disabled={
                  loading ||
                  themeCategories.length < 1
                }
                onClick={addTheme}
              >
                {loading && <TbLoader className="animate-spin"/>}
                {t('buttons.addTheme')}
              </button>

              <button
                className="flex items-center justify-center w-full py-2 text-sm font-medium rounded-lg hover:bg-quaternary disabled:pointer-events-none disabled:opacity-70"
                onClick={() => {
                  setThemeCategories([]);
                  setCurrentlyAddingTheme(false);
                }}
                disabled={loading}
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