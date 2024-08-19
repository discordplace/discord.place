'use client';

import ServerIcon from '@/app/(servers)/servers/components/ServerIcon';
import useAccountStore from '@/stores/account';
import { t } from '@/stores/language';

export default function UnlistedCard({ server }) {
  const setCurrentlyAddingServer = useAccountStore(state => state.setCurrentlyAddingServer);

  return (
    <div 
      className='flex items-center gap-4 p-4 transition-opacity cursor-pointer bg-secondary rounded-xl hover:opacity-70'
      onClick={() => setCurrentlyAddingServer(server)}
    >
      <div className='relative w-12 h-12'>
        <ServerIcon
          width={48}
          height={48}
          icon_url={server.icon_url}
          name={server.name}
          className='[&>h2]:text-base'
        />
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