'use client';

import ServerIcon from '@/app/components/ImageFromHash/ServerIcon';
import useAccountStore from '@/stores/account';
import { t } from '@/stores/language';
import Image from 'next/image';

export default function UnlistedCard({ server }) {
  const setCurrentlyAddingServer = useAccountStore(state => state.setCurrentlyAddingServer);

  return (
    <div
      className='flex cursor-pointer items-center gap-4 rounded-xl bg-secondary p-4 transition-opacity hover:opacity-70'
      onClick={() => setCurrentlyAddingServer(server)}
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
          {t('accountPage.tabs.myServers.sections.unlistedServers.members', { count: server.members })}
        </p>
      </div>
    </div>
  );
}