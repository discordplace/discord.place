'use client';

import { TbLoader, IoCheckmarkCircle, IoMdCheckmarkCircle, FaCirclePlus, BsGithub } from '@/icons';
import config from '@/config';
import cn from '@/lib/cn';import getData from '@/lib/request/auth/getData';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import ServerIcon from '@/app/(servers)/servers/components/ServerIcon';
import HashServerIcon from '@/app/components/ImageFromHash/ServerIcon';import Input from '../Input';import editBot from '@/lib/request/bots/editBot';
import revalidateBot from '@/lib/revalidate/bot';
import { t } from '@/stores/language';

export default function Other({ botId, categories, setCategories, canEditSupportServer, supportServerId, setSupportServerId, githubRepository: currentGithubRepository }) {
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
      loading: t('botManagePage.other.githubRepository.toast.savingRepository'),
      success: () => {
        setSavingGithubRepository(false);
        setDefaultGithubRepository(githubRepository);
        revalidateBot(botId);

        return t('botManagePage.other.githubRepository.toast.repositorySaved');
      },
      error: error => {
        setSavingGithubRepository(false);

        return error;
      }
    });
  }

  return (
    <div className='flex w-full flex-col gap-y-4'>
      <h3 className='flex items-center gap-x-4 text-xl font-semibold'>
        <FaCirclePlus size={24} className='text-purple-500' />
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
                key={category}
                className={cn(
                  'rounded-lg flex items-center gap-x-1 font-semibold w-max h-max text-sm px-3 py-1.5 bg-secondary hover:bg-tertiary',
                  categories.includes(category) && 'bg-quaternary'
                )}
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
                {savingGithubRepository ? <TbLoader size={18} className='animate-spin' /> : <IoCheckmarkCircle size={18} />}
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
              type='text'
              value={githubRepository}
              onChange={event => event.target.value === '' ? setGithubRepository(undefined) : setGithubRepository(event.target.value)}
              placeholder={t('botManagePage.other.githubRepository.usernameRepositoryInputPlaceholder')}
              onKeyUp={event => event.key === 'Enter' && saveGithubRepository()}
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
                  <div key={index} className='size-24 animate-pulse rounded-xl bg-secondary' />
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
                          id={server.id}
                          name={server.name}
                          hash={server.icon}
                          size={96}
                          className='cursor-pointer rounded-xl hover:opacity-70'
                          width={96}
                          height={96}
                        />
                      ) : (
                        <ServerIcon
                          width={96}
                          height={96}
                          name={server.name}
                          icon_url={server.icon_url}
                          className='cursor-pointer rounded-xl hover:opacity-70'
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