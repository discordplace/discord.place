'use client';

import ServerIcon from '@/app/components/ImageFromHash/ServerIcon';
import ErrorState from '@/app/components/ErrorState';
import config from '@/config';
import useAccountStore from '@/stores/account';
import Link from 'next/link';
import { BsEmojiAngry, BsQuestionCircleFill } from 'react-icons/bs';
import UnlistedCard from '@/app/(account)/account/components/Content/Tabs/MyServers/UnlistedCard';
import NewServer from '@/app/(account)/account/components/Content/Tabs/MyServers/NewServer';
import { t } from '@/stores/language';
import Image from 'next/image';

export default function MyServers() {
  const data = useAccountStore(state => state.data);
  const currentlyAddingServer = useAccountStore(state => state.currentlyAddingServer);

  return (
    currentlyAddingServer !== null ? (
      <NewServer />
    ) : (
      <>
        <div className='flex flex-col gap-y-2'>
          <h1 className='text-xl font-bold text-primary'>
            {t('accountPage.tabs.myServers.title')}
          </h1>

          <p className='text-sm text-secondary'>
            {t('accountPage.tabs.myServers.subtitle')}
          </p>
        </div>

        <div className='mt-8 flex flex-col gap-y-2'>
          <h2 className='text-sm font-bold text-secondary'>
            {t('accountPage.tabs.myServers.sections.listedServers.title')}

            <span className='ml-2 text-xs font-medium text-tertiary'>
              {(data.servers || []).filter(server => server.is_created === true).length}
            </span>
          </h2>

          <p className='text-sm text-tertiary'>
            {t('accountPage.tabs.myServers.sections.listedServers.subtitle')}
          </p>

          {(data.servers || []).length === 0 ? (
            <div className='mt-20 max-w-[800px]'>
              <ErrorState
                title={
                  <div className='flex items-center gap-x-2'>
                    <BsEmojiAngry />
                    {t('accountPage.tabs.myServers.sections.listedServers.emptyErrorState.title')}
                  </div>
                }
                message={t('accountPage.tabs.myServers.sections.listedServers.emptyErrorState.message')}
              />
            </div>
          ) : (
            <div className='mt-2 flex max-w-[800px] flex-wrap gap-4'>
              {data.servers
                .filter(server => server.is_created === true)
                .map(server => (
                  <Link
                    key={server.id}
                    className='flex items-center gap-4 rounded-xl bg-secondary p-4 transition-opacity hover:opacity-70'
                    href={`/servers/${server.id}`}
                  >
                    <div className='relative size-12'>
                      {server.icon ? (
                        <ServerIcon
                          id={server.id}
                          hash={server.icon}
                          size={64}
                          width={48}
                          height={48}
                          className='rounded-xl'
                        />
                      ) : (
                        <Image
                          src='/default-discord-avatar.png'
                          alt='Server Icon'
                          width={48}
                          height={48}
                          className='rounded-xl'
                        />
                      )}
                    </div>

                    <div className='flex flex-col'>
                      <h3 className='text-sm font-bold text-primary'>
                        {server.name}
                      </h3>

                      <p className='text-xs text-tertiary'>
                        {t('accountPage.tabs.myServers.sections.listedServers.members', { count: server.members })}
                      </p>
                    </div>
                  </Link>
                ))}
            </div>
          )}
        </div>

        <div className='mt-8 flex flex-col gap-y-2'>
          <h2 className='text-sm font-bold text-secondary'>
            {t('accountPage.tabs.myServers.sections.unlistedServers.title')}

            <span className='ml-2 text-xs font-medium text-tertiary'>
              {(data.servers || []).filter(server => server.is_created === false).length}
            </span>
          </h2>

          <p className='text-sm text-tertiary'>
            {t('accountPage.tabs.myServers.sections.unlistedServers.subtitle')}
          </p>

          <div className='relative mt-4 flex w-full max-w-[800px] flex-col gap-y-2 rounded-xl border border-blue-500 bg-blue-500/10 p-4 transition-[margin,opacity] duration-1000 ease-in-out'>
            <h2 className='flex items-center gap-x-2 text-base font-semibold mobile:text-lg'>
              <BsQuestionCircleFill /> {t('accountPage.tabs.myServers.sections.unlistedServers.missingServerInfo.title')}
            </h2>

            <p className='text-sm font-medium text-tertiary'>
              {t('accountPage.tabs.myServers.sections.unlistedServers.missingServerInfo.description', {
                br: <br />,
                link: <Link className='text-secondary hover:text-primary' href={config.botInviteURL} target='_blank'>{t('accountPage.tabs.myServers.sections.unlistedServers.missingServerInfo.linkText')}</Link>
              })}
            </p>
          </div>

          {(data.servers || []).length === 0 ? (
            <div className='max-w-[800px]'>
              <ErrorState
                title={
                  <div className='flex items-center gap-x-2'>
                    <BsEmojiAngry />
                    {t('accountPage.tabs.myServers.sections.unlistedServers.emptyErrorState.title')}
                  </div>
                }
                message={t('accountPage.tabs.myServers.sections.unlistedServers.emptyErrorState.message')}
              />
            </div>
          ) : (
            <div className='mt-2 flex max-w-[800px] flex-wrap gap-4'>
              {data.servers
                .filter(server => server.is_created === false)
                .map(server => (
                  <UnlistedCard key={server.id} server={server} />
                ))}
            </div>
          )}
        </div>
      </>
    )
  );
}