'use client';

import config from '@/config';
import { MdChevronLeft } from 'react-icons/md';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import cn from '@/lib/cn';
import { IoMdCheckmarkCircle } from 'react-icons/io';
import createSound from '@/lib/request/sounds/createSound';
import { useRouter } from 'next/navigation';
import Lottie from 'react-lottie';
import confetti from '@/lib/lotties/confetti.json';
import { TbLoader } from 'react-icons/tb';
import useAccountStore from '@/stores/account';
import { t } from '@/stores/language';

export default function NewSound() {
  const setCurrentlyAddingSound = useAccountStore(state => state.setCurrentlyAddingSound);

  const [loading, setLoading] = useState(false);
  const [renderConfetti, setRenderConfetti] = useState(false);

  const [soundName, setSoundName] = useState('');
  const [soundCategories, setSoundCategories] = useState([]);
  const [file, setFile] = useState(null);

  const router = useRouter();

  function addSound() {
    setLoading(true);

    const formData = new FormData();
    formData.append('name', soundName);
    formData.append('categories', soundCategories.join(','));
    formData.append('file', file);

    toast.promise(createSound(formData), {
      loading: t('accountPage.tabs.mySounds.sections.addSound.toast.addingSound', { soundName }),
      success: data => {
        setTimeout(() => {
          router.push(`/sounds/${data.id}`);

          // Reset states
          setSoundName('');
          setSoundCategories([]);
          setFile(null);
          setCurrentlyAddingSound(false);
        }, 3000);

        setRenderConfetti(true);

        return t('accountPage.tabs.mySounds.sections.addSound.toast.soundAdded', { soundName });
      },
      error: error => {
        setLoading(false);

        return error;
      }
    });
  }

  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (file) {
      if (soundName === '') {
        setSoundName(file.name.replace('.mp3', ''));
      }
    }
  }, [file, soundName]);

  return (
    <>
      <div className='pointer-events-none fixed left-0 top-0 z-10 h-svh w-full'>
        <Lottie options={{ loop: false, autoplay: false, animationData: confetti }} isStopped={!renderConfetti} height='100%' width='100%'/>
      </div>

      <div className='flex w-full max-w-[800px] flex-col justify-center gap-y-4'>
        <div className='flex items-center gap-x-4'>
          <button className='rounded-xl bg-secondary p-1.5 hover:bg-tertiary' onClick={() => {
            setSoundName('');
            setSoundCategories([]);
            setFile(null);
            setCurrentlyAddingSound(false);
          }}>
            <MdChevronLeft size={24}/>
          </button>

          <h1 className='flex flex-wrap items-center gap-x-1 text-lg font-bold sm:text-3xl'>
            {t('accountPage.tabs.mySounds.sections.addSound.title')}
          </h1>
        </div>

        <p className='max-w-[800px] text-sm text-tertiary sm:text-base'>
          {t('accountPage.tabs.mySounds.sections.addSound.subtitle')}
        </p>

        <div className='mt-12 flex w-full items-center justify-center'>
          <div className='flex w-full max-w-[800px] flex-col gap-y-1'>
            <h2 className='text-lg font-semibold'>
              File
            </h2>

            <p className='text-sm text-tertiary sm:text-base'>
              Upload your sound file here. Only mp3 files are allowed.
            </p>

            <label
              className={cn(
                'w-full bg-quaternary cursor-pointer group hover:bg-purple-500/10 hover:border-purple-500 transition-all gap-y-2 flex-col border-2 border-primary h-[150px] mt-4 rounded-xl flex items-center justify-center',
                (file || dragging) && 'border-purple-500 bg-purple-500/10'
              )}
              htmlFor='file'
              draggable={true}
              onDragEnter={() => setDragging(true)}
              onDragLeave={() => setDragging(false)}
              onDragOver={event => event.preventDefault()}
              onDrop={event => {
                event.preventDefault();
                setDragging(false);

                const file = event.dataTransfer.files[0];
                if (file) {
                  if (file.type !== 'audio/mpeg') return toast.error(t('accountPage.tabs.mySounds.sections.addSound.toast.invalidFile'));

                  const reader = new FileReader();
                  reader.onload = () => {
                    const audio = new Audio(reader.result);
                    audio.onloadedmetadata = () => {
                      if (audio.duration >= 5) return toast.error(t('accountPage.tabs.mySounds.sections.addSound.toast.audioDurationExceeded', { duration: 5 }));
                      if (file.size >= 1024 * 1024) return toast.error(t('accountPage.tabs.mySounds.sections.addSound.toast.fileSizeExceeded', { size: 1 }));

                      setFile(file);
                    };

                    audio.src = reader.result;
                  };

                  reader.readAsDataURL(file);
                }
              }}
            >
              <input
                className='hidden'
                id='file'
                type='file'
                accept='.mp3'
                onChange={event => {
                  const file = event.target.files[0];
                  if (file) {
                    if (file.type !== 'audio/mpeg') return toast.error(t('accountPage.tabs.mySounds.sections.addSound.toast.invalidFile'));

                    const reader = new FileReader();
                    reader.onload = () => {
                      const audio = new Audio(reader.result);
                      audio.onloadedmetadata = () => {
                        if (audio.duration >= 5) return toast.error(t('accountPage.tabs.mySounds.sections.addSound.toast.audioDurationExceeded', { duration: 5 }));
                        if (file.size >= 1024 * 1024) return toast.error(t('accountPage.tabs.mySounds.sections.addSound.toast.fileSizeExceeded', { size: 1 }));

                        setFile(file);
                      };

                      audio.src = reader.result;
                    };

                    reader.readAsDataURL(file);
                  }
                }}
              />

              <p className='flex items-center gap-x-2 text-sm font-medium text-tertiary transition-all group-hover:text-white'>
                {file ? (
                  <>
                    <IoMdCheckmarkCircle/>
                    {file.name}
                  </>
                ) : (
                  dragging ? t('accountPage.tabs.mySounds.sections.addSound.dragAndDrop.drop') : t('accountPage.tabs.mySounds.sections.addSound.dragAndDrop.click')
                )}
              </p>
            </label>

            <h2 className='mt-8 text-lg font-semibold'>
              {t('accountPage.tabs.mySounds.sections.addSound.fields.name.label')}
            </h2>

            <p className='text-sm text-tertiary sm:text-base'>
              {t('accountPage.tabs.mySounds.sections.addSound.fields.name.description')}
            </p>

            <input
              className='mt-4 block w-full rounded-lg border-2 border-transparent bg-secondary p-2 text-sm text-placeholder outline-none focus-visible:border-purple-500 focus-visible:text-primary'
              onChange={event => setSoundName(event.target.value)}
              value={soundName}
              maxLength={config.soundNameMaxLength}
            />

            <h2 className='mt-8 text-lg font-semibold'>
              {t('accountPage.tabs.mySounds.sections.addSound.fields.categories.label')}
            </h2>

            <p className='text-sm text-tertiary'>
              {t('accountPage.tabs.mySounds.sections.addSound.fields.categories.description')}
            </p>

            <div className='mt-4 flex flex-wrap gap-2'>
              {config.soundCategories
                .filter(category => category !== 'All')
                .map(category => (
                  <button
                    key={category}
                    className={cn(
                      'rounded-lg flex items-center gap-x-1 font-semibold w-max h-max text-sm px-3 py-1.5 bg-secondary hover:bg-quaternary',
                      soundCategories.includes(category) && 'bg-quaternary'
                    )}
                    onClick={() => {
                      if (soundCategories.includes(category)) setSoundCategories(oldCategories => oldCategories.filter(oldCategory => oldCategory !== category));
                      else setSoundCategories(oldCategories => [...oldCategories, category]);
                    }}
                  >
                    {soundCategories.includes(category) ? <IoMdCheckmarkCircle/> : config.soundCategoriesIcons[category]}
                    {t(`categories.${category}`)}
                  </button>
                ))}
            </div>

            <h2 className='mt-8 text-lg font-semibold'>
              {t('accountPage.tabs.mySounds.sections.addSound.fields.contentPolicy.label')}
            </h2>

            <p className='flex flex-col gap-y-1 text-sm text-tertiary sm:text-base'>
              {t('accountPage.tabs.mySounds.sections.addSound.fields.contentPolicy.description', {
                note: <span className='mt-2 text-xs text-tertiary'>{t('accountPage.tabs.mySounds.sections.addSound.fields.contentPolicy.note')}</span>
              })}
            </p>

            <h2 className='mt-8 text-lg font-semibold'>
              {t('accountPage.tabs.mySounds.sections.addSound.fields.areYouReady.label')}
            </h2>

            <div className='mt-2 flex w-full flex-col gap-2 sm:flex-row'>
              <button
                className='flex w-full items-center justify-center gap-x-1.5 rounded-lg bg-black px-3 py-1.5 text-sm font-semibold text-white hover:bg-black/70 disabled:pointer-events-none disabled:opacity-70 dark:bg-white dark:text-black dark:hover:bg-white/70'
                disabled={
                  loading ||
                  soundName.trim().length <= 0 ||
                  soundCategories.length < 1 ||
                  !file
                }
                onClick={addSound}
              >
                {loading && <TbLoader className='animate-spin'/>}
                {t('buttons.addSound')}
              </button>

              <button className='flex w-full items-center justify-center rounded-lg py-2 text-sm font-medium hover:bg-quaternary disabled:pointer-events-none disabled:opacity-70'
                onClick={() => {
                  setSoundName('');
                  setSoundCategories([]);
                  setCurrentlyAddingSound(false);
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