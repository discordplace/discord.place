'use client';

import AuthProtected from '@/app/components/Providers/Auth/Protected';
import { useState } from 'react';
import getOwnedBots from '@/lib/request/auth/getOwnedBots';
import getOwnedServers from '@/lib/request/auth/getOwnedServers';
import { useEffect } from 'react';
import { toast } from 'sonner';
import BotCard from '@/app/(bots)/bots/manage/components/BotCard';
import NewBot from '@/app/(bots)/bots/manage/components/NewBot';
import { RiAddCircleFill } from 'react-icons/ri';
import { useMedia } from 'react-use';
import useManageStore from '@/stores/bots/manage';

export default function Page() {
  const [bots, setBots] = useState([]);
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOwnedBots()
      .then(data => setBots(data))
      .finally(() => setLoading(false))
      .catch(toast.error);

    getOwnedServers()
      .then(data => setServers(data))
      .finally(() => setLoading(false))
      .catch(toast.error);
  }, []);

  const selectedBot = useManageStore(state => state.selectedBot);
  const setSelectedBot = useManageStore(state => state.setSelectedBot);

  const is2xLarge = useMedia('(max-width: 1280px)', false);
  const isLarge = useMedia('(min-width: 1024px)', false);
  const isMobile = useMedia('(max-width: 640px)', false);
  const placeholderServerCardLength = is2xLarge ? (isMobile ? 6 : (isLarge ? 20 : 12)) : 24;
  
  return (
    <AuthProtected>
      <div className='flex flex-col items-center justify-center h-full px-8 mt-48 mb-16 gap-y-4 lg:px-0'>
        {!selectedBot ? (
          <>
            <h1 className='text-3xl font-bold text-center'>
              My Bots
            </h1>

            <p className='max-w-[400px] text-tertiary text-center'>
              Here you can add new bots, edit existing ones and manage your bot{'\''}s settings.
            </p>

            <div className='max-w-[1000px] grid grid-cols-1 mobile:grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 w-full min-h-[600px] relative mt-4'>
              {!loading && (
                <>
                  {bots.map(bot => (
                    <BotCard key={bot.id} data={bot} />
                  ))}

                  <button className='flex flex-col text-tertiary hover:text-primary gap-y-4 hover:bg-tertiary w-full h-[180px] bg-secondary rounded-xl items-center justify-center' onClick={() => setSelectedBot('new')}>
                    <RiAddCircleFill className='text-4xl' />
                    <span className='text-sm font-medium'>
                      Add a bot
                    </span>
                  </button>
                </>
              )}

              {new Array(loading ? placeholderServerCardLength : (bots.length > 0 ? (placeholderServerCardLength - 1) - bots.length : (placeholderServerCardLength - 1))).fill(0).map((_, i) => (
                <div className='w-full h-[180px] bg-secondary rounded-xl' key={i} />
              ))}
            </div>
          </>
        ) : (
          selectedBot === 'new' && <NewBot owned_servers={servers} />
        )}
      </div>
    </AuthProtected>
  );
}