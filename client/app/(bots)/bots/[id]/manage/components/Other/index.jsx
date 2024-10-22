'use client';

import ServerIcon from '@/app/(servers)/servers/components/ServerIcon';
import HashServerIcon from '@/app/components/ImageFromHash/ServerIcon';
import config from '@/config';
import cn from '@/lib/cn';
import getData from '@/lib/request/auth/getData';
import editBot from '@/lib/request/bots/editBot';
import revalidateBot from '@/lib/revalidate/bot';
import { t } from '@/stores/language';
import { useEffect, useState } from 'react';
import { BsGithub } from 'react-icons/bs';
import { FaCirclePlus } from 'react-icons/fa6';
import { IoMdCheckmarkCircle } from 'react-icons/io';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { TbLoader } from 'react-icons/tb';
import { toast } from 'sonner';

import Input from '../Input';

export default function Other({ botId, canEditSupportServer, categories, githubRepository: currentGithubRepository, setCategories, setSupportServerId, supportServerId }) {
  const [ownedServers, setOwnedServers] = useState([]);
  const [ownedServersLoading, setOwnedServersLoading] = useState(true);

  useEffect(() => {
    if (!canEditSupportServer) return;

    setOwnedServersLoading(true);

    getData(['servers'])
      .then(data => setOwnedServers(data.servers))
      .catch(toast.error)
      .finally(() => setOwnedServersLoading(false));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [defaultGithubRepository, setDefaultGithubRepository] = useState(currentGithubRepository);
  const [githubRepository, setGithubRepository] = useState(defaultGithubRepository);
  const [savingGithubRepository, setSavingGithubRepository] = useState(false);

  function saveGithubRepository() {
    if (githubRepository === defaultGithubRepository) return toast.info(t('botManagePage.other.toast.noChangesMade'));

    if (githubRepository) {
      const usernameRepositoryRegex = /^([a-zA-Z\d]{1}[-a-zA-Z\d]+)(\/){1}([-\w.]+)$/i;
      if (!usernameRepositoryRegex.test(githubRepository)) return toast.error(t('botManagePage.other.toast.notValidRepositoryFormat'));
    }

    setSavingGithubRepository(true);

    toast.promise(editBot(botId, [{ key: 'github_repository', value: githubRepository }]), {
      error: error => {
        setSavingGithubRepository(false);

        return error;
      },
      loading: t('botManagePage.other.githubRepository.toast.savingRepository'),
      success: () => {
        setSavingGithubRepository(false);
        setDefaultGithubRepository(githubRepository);
        revalidateBot(botId);

        return t('botManagePage.other.githubRepository.toast.repositorySaved');
      }
    });
  }

  return (
    <div className='flex w-full flex-col gap-y-4'>
      <h3 className='flex items-center gap-x-4 text-xl font-semibold'>
        <FaCirclePlus className='text-purple-500' size={24} />
        {t('botManagePage.other.title')}
      </h3>

      <p className='text-sm text-tertiary sm:text-base'>
        {t('botManagePage.other.subtitle')}
      </p>

      <div className='mt-4 flex w-full flex-col gap-8'>
        <div className='flex flex-1 flex-col gap-y-2'>
          <label
            className='font-medium text-secondary'
          >
            {t('botManagePage.other.inputs.categories.label')}
          </label>

          <p className='text-sm text-tertiary'>
            {t('botManagePage.other.inputs.categories.description')}
          </p>

          <div className='mt-2 flex flex-wrap items-center gap-2'>
            {config.botCategories.map(category => (
              <button
                className={cn(
                  'rounded-lg flex items-center gap-x-1 font-semibold w-max h-max text-sm px-3 py-1.5 bg-secondary hover:bg-tertiary',
                  categories.includes(category) && 'bg-quaternary'
                )}
                key={category}
                onClick={() => {
                  if (categories.includes(category)) setCategories(oldCategories => oldCategories.filter(oldCategory => oldCategory !== category));
                  else setCategories(oldCategories => [...oldCategories, category]);
                }}
              >
                {categories.includes(category) ? <IoMdCheckmarkCircle /> : config.botCategoriesIcons[category]}
                {t(`categories.${category}`)}
              </button>
            ))}
          </div>
        </div>

        <div className='flex flex-1 flex-col gap-y-2'>
          <div className='flex w-full flex-col items-center justify-between sm:flex-row'>
            <div className='flex flex-col gap-y-2'>
              <h3 className='flex items-center gap-x-2 font-medium text-secondary'>
                <BsGithub className='text-2xl text-black dark:text-white' />
                {t('botManagePage.other.githubRepository.title')}

                <span className='rounded-full bg-black/30 px-2 py-0.5 text-xs text-white dark:bg-white/30 dark:text-white'>
                  {t('botManagePage.other.githubRepository.optionalBadge')}
                </span>
              </h3>

              <p className='text-sm text-tertiary'>
                {t('botManagePage.other.githubRepository.subtitle')}
              </p>
            </div>

            <div className='mt-4 flex w-full flex-1 justify-end gap-x-2 sm:mt-0'>
              <button
                className='flex w-full items-center justify-center gap-x-1 rounded-xl bg-black/30 px-4 py-1.5 font-semibold text-white hover:bg-black/40 disabled:pointer-events-none disabled:opacity-70 dark:bg-white/30 dark:hover:bg-white/40 sm:w-max'
                disabled={githubRepository === defaultGithubRepository || savingGithubRepository}
                onClick={saveGithubRepository}
              >
                {savingGithubRepository ? <TbLoader className='animate-spin' size={18} /> : <IoCheckmarkCircle size={18} />}
                {t('buttons.saveRepository')}
              </button>
            </div>
          </div>

          <div className='relative flex items-center'>
            <span className='pointer-events-none absolute left-4 mt-2 text-primary'>
              github.com/
            </span>

            <Input
              className='-mt-2 pl-[6.525rem] focus-visible:text-secondary'
              onChange={event => event.target.value === '' ? setGithubRepository(undefined) : setGithubRepository(event.target.value)}
              onKeyUp={event => event.key === 'Enter' && saveGithubRepository()}
              placeholder={t('botManagePage.other.githubRepository.usernameRepositoryInputPlaceholder')}
              type='text'
              value={githubRepository}
            />
          </div>
        </div>

        {canEditSupportServer && (
          <div className='flex flex-1 flex-col gap-y-2'>
            <label
              className='font-medium text-secondary'
            >
              {t('botManagePage.other.supportServer.title')}

              <span className='ml-2 rounded-full bg-black/30 px-2 py-0.5 text-xs text-white dark:bg-white/30 dark:text-white'>
                {t('botManagePage.other.supportServer.optionalBadge')}
              </span>
            </label>

            <p className='text-sm text-tertiary'>
              {t('botManagePage.other.supportServer.subtitle')}
            </p>

            <div className='mt-2 flex w-full flex-wrap gap-4'>
              {ownedServersLoading ? (
                new Array(9).fill().map((_, index) => (
                  <div className='size-24 animate-pulse rounded-xl bg-secondary' key={index} />
                ))
              ) : (
                ownedServers.length === 0 ? (
                  <p className='text-xs text-tertiary'>
                    {t('botManagePage.other.supportServer.emptyErrorState')}
                  </p>
                ) : (
                  ownedServers.map(server => (
                    <div
                      className='relative'
                      key={server.id}
                      onClick={() => supportServerId === server.id ? setSupportServerId('0') : setSupportServerId(server.id)}
                    >
                      {server.icon ? (
                        <HashServerIcon
                          className='cursor-pointer rounded-xl hover:opacity-70'
                          hash={server.icon}
                          height={96}
                          id={server.id}
                          name={server.name}
                          size={96}
                          width={96}
                        />
                      ) : (
                        <ServerIcon
                          className='cursor-pointer rounded-xl hover:opacity-70'
                          height={96}
                          icon_url={server.icon_url}
                          name={server.name}
                          width={96}
                        />
                      )}

                      {supportServerId === server.id && (
                        <div className='pointer-events-none absolute -bottom-1 -right-1 rounded-full bg-background p-1 text-2xl'>
                          <IoMdCheckmarkCircle />
                        </div>
                      )}
                    </div>
                  ))
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}