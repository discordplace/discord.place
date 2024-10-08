'use client';

import config from '@/config';
import cn from '@/lib/cn';
import { FaCirclePlus } from 'react-icons/fa6';
import { IoMdCheckmarkCircle } from 'react-icons/io';
import getData from '@/lib/request/auth/getData';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import ServerIcon from '@/app/(servers)/servers/components/ServerIcon';
import HashServerIcon from '@/app/components/ImageFromHash/ServerIcon';
import { BsGithub } from 'react-icons/bs';
import Input from '../Input';
import { TbLoader } from 'react-icons/tb';
import { IoCheckmarkCircle } from 'react-icons/io5';
import editBot from '@/lib/request/bots/editBot';
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
    <div className='flex flex-col w-full gap-y-4'>
      <h3 className='flex items-center text-xl font-semibold gap-x-4'>
        <FaCirclePlus size={24} className='text-purple-500' />
        {t('botManagePage.other.title')}
      </h3>

      <p className='text-sm sm:text-base text-tertiary'>
        {t('botManagePage.other.subtitle')}
      </p>

      <div className='flex flex-col w-full gap-8 mt-4'>
        <div className='flex flex-col flex-1 gap-y-2'>
          <label
            className='font-medium text-secondary'
          >
            {t('botManagePage.other.inputs.categories.label')}
          </label>

          <p className='text-sm text-tertiary'>
            {t('botManagePage.other.inputs.categories.description')}
          </p>

          <div className='flex flex-wrap items-center gap-2 mt-2'>
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

        <div className='flex flex-col flex-1 gap-y-2'>
          <div className='flex flex-col items-center justify-between w-full sm:flex-row'>
            <div className='flex flex-col gap-y-2'>
              <h3 className='flex items-center font-medium text-secondary gap-x-2'>
                <BsGithub className='text-2xl text-black dark:text-white' />
                {t('botManagePage.other.githubRepository.title')}

                <span className='text-xs text-white dark:text-white px-2 py-0.5 dark:bg-white/30 bg-black/30 rounded-full'>
                  {t('botManagePage.other.githubRepository.optionalBadge')}
                </span>
              </h3>

              <p className='text-sm text-tertiary'>
                {t('botManagePage.other.githubRepository.subtitle')}
              </p>
            </div>

            <div className='flex justify-end flex-1 w-full mt-4 sm:mt-0 gap-x-2'>
              <button
                className='px-4 w-full justify-center sm:w-max flex text-white disabled:opacity-70 disabled:pointer-events-none items-center gap-x-1 py-1.5 font-semibold bg-black/30 hover:bg-black/40 dark:hover:bg-white/40 dark:bg-white/30 rounded-xl'
                disabled={githubRepository === defaultGithubRepository || savingGithubRepository}
                onClick={saveGithubRepository}
              >
                {savingGithubRepository ? <TbLoader size={18} className='animate-spin' /> : <IoCheckmarkCircle size={18} />}
                {t('buttons.saveRepository')}
              </button>
            </div>
          </div>
          
          <div className='relative flex items-center'>
            <span className='absolute mt-2 pointer-events-none text-primary left-4'>
              github.com/
            </span>
            
            <Input
              className='pl-[6.525rem] -mt-2 focus-visible:text-secondary'
              type='text'
              value={githubRepository}
              onChange={event => event.target.value === '' ? setGithubRepository(undefined) : setGithubRepository(event.target.value)}
              placeholder={t('botManagePage.other.githubRepository.usernameRepositoryInputPlaceholder')}
              onKeyUp={event => event.key === 'Enter' && saveGithubRepository()}
            />
          </div>
        </div>

        {canEditSupportServer && (
          <div className='flex flex-col flex-1 gap-y-2'>
            <label
              className='font-medium text-secondary'
            >
              {t('botManagePage.other.supportServer.title')}

              <span className='ml-2 text-xs text-white dark:text-white px-2 py-0.5 dark:bg-white/30 bg-black/30 rounded-full'>
                {t('botManagePage.other.supportServer.optionalBadge')}
              </span>
            </label>
        
            <p className='text-sm text-tertiary'>
              {t('botManagePage.other.supportServer.subtitle')}
            </p>

            <div className='flex flex-wrap w-full gap-4 mt-2'>
              {ownedServersLoading ? (
                new Array(9).fill().map((_, index) => (
                  <div key={index} className='w-24 h-24 rounded-xl bg-secondary animate-pulse' />
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
                          className='cursor-pointer hover:opacity-70 rounded-xl'
                          width={96}
                          height={96}
                        />
                      ) : (
                        <ServerIcon
                          width={96}
                          height={96}
                          name={server.name}
                          icon_url={server.icon_url}
                          className='cursor-pointer hover:opacity-70 rounded-xl'
                        />
                      )}

                      {supportServerId === server.id && (
                        <div className='absolute p-1 text-2xl rounded-full pointer-events-none -right-1 -bottom-1 bg-background'>
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