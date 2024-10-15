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
      loading: t('accountPage.tabs.mySounds.sections.addSound.toast.addingSound'),
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

        return t('accountPage.tabs.mySounds.sections.addSound.toast.soundAdded');
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
      if (soundName !== '') {
        setSoundName(file.name.replace('.mp3', ''));
      }
    }
  }, [file, soundName]);

  return (
    <>
      <div className="fixed pointer-events-none z-[10] top-0 left-0 w-full h-[100svh]">
        <Lottie options={{ loop: false, autoplay: false, animationData: confetti }} isStopped={!renderConfetti} height="100%" width="100%"/>
      </div>

      <div className="flex justify-center w-full gap-y-4 max-w-[800px] flex-col">
        <div className="flex items-center gap-x-4">
          <button className="p-1.5 rounded-xl bg-secondary hover:bg-tertiary" onClick={() => {
            setSoundName('');
            setSoundCategories([]);
            setFile(null);
            setCurrentlyAddingSound(false);
          }}>
            <MdChevronLeft size={24}/>
          </button>

          <h1 className="flex flex-wrap items-center text-lg font-bold sm:text-3xl gap-x-1">
            {t('accountPage.tabs.mySounds.sections.addSound.title')}
          </h1>
        </div>

        <p className="text-sm sm:text-base max-w-[800px] text-tertiary">
          {t('accountPage.tabs.mySounds.sections.addSound.subtitle')}
        </p>

        <div className="flex items-center justify-center w-full mt-12">
          <div className="max-w-[800px] w-full flex flex-col gap-y-1">
            <h2 className="text-lg font-semibold">
              File
            </h2>

            <p className="text-sm sm:text-base text-tertiary">
              Upload your sound file here. Only mp3 files are allowed.
            </p>

            <label
              className={cn(
                'w-full bg-quaternary cursor-pointer group hover:bg-purple-500/10 hover:border-purple-500 transition-all gap-y-2 flex-col border-2 border-primary h-[150px] mt-4 rounded-xl flex items-center justify-center',
                (file || dragging) && 'border-purple-500 bg-purple-500/10'
              )}
              htmlFor="file"
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
                className="hidden"
                id="file"
                type="file"
                accept=".mp3"
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

              <p className="flex items-center text-sm font-medium transition-all gap-x-2 text-tertiary group-hover:text-white">
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

            <h2 className="mt-8 text-lg font-semibold">
              {t('accountPage.tabs.mySounds.sections.addSound.fields.name.label')}
            </h2>

            <p className="text-sm sm:text-base text-tertiary">
              {t('accountPage.tabs.mySounds.sections.addSound.fields.name.description')}
            </p>

            <input
              className="block w-full p-2 mt-4 text-sm border-2 border-transparent rounded-lg outline-none bg-secondary text-placeholder focus-visible:text-primary focus-visible:border-purple-500"
              onChange={event => setSoundName(event.target.value)}
              value={soundName}
              maxLength={config.soundNameMaxLength}
            />

            <h2 className="mt-8 text-lg font-semibold">
              {t('accountPage.tabs.mySounds.sections.addSound.fields.categories.label')}
            </h2>

            <p className="text-sm text-tertiary">
              {t('accountPage.tabs.mySounds.sections.addSound.fields.categories.description')}
            </p>

            <div className="flex flex-wrap mt-4 gap-x-2 gap-y-2">
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

            <h2 className="mt-8 text-lg font-semibold">
              {t('accountPage.tabs.mySounds.sections.addSound.fields.contentPolicy.label')}
            </h2>

            <p className="flex flex-col text-sm sm:text-base gap-y-1 text-tertiary">
              {t('accountPage.tabs.mySounds.sections.addSound.fields.contentPolicy.description', {
                note: <span className="mt-2 text-xs text-tertiary">{t('accountPage.tabs.mySounds.sections.addSound.fields.contentPolicy.note')}</span>
              })}
            </p>

            <h2 className="mt-8 text-lg font-semibold">
              {t('accountPage.tabs.mySounds.sections.addSound.fields.areYouReady.label')}
            </h2>

            <div className="flex flex-col w-full gap-2 mt-2 sm:flex-row">
              <button
                className="flex items-center gap-x-1.5 px-3 py-1.5 rounded-lg font-semibold text-white bg-black w-full justify-center hover:bg-black/70 dark:bg-white dark:text-black dark:hover:bg-white/70 text-sm disabled:pointer-events-none disabled:opacity-70"
                disabled={
                  loading ||
                  soundName.trim().length <= 0 ||
                  soundCategories.length < 1 ||
                  !file
                }
                onClick={addSound}
              >
                {loading && <TbLoader className="animate-spin"/>}
                {t('buttons.addSound')}
              </button>

              <button className="flex items-center justify-center w-full py-2 text-sm font-medium rounded-lg hover:bg-quaternary disabled:pointer-events-none disabled:opacity-70"
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