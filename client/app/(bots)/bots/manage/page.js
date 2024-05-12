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
import Image from 'next/image';
import Countdown from '@/app/components/Countdown';
import { CgDanger } from 'react-icons/cg';

export default function Page() {
  const [bots, setBots] = useState([]);
  const [denies, setDenies] = useState([]);
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOwnedBots()
      .then(data => {
        setBots(data.bots);
        setDenies(data.denies);
      })
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

            {denies.length > 0 && (
              <div className='flex flex-col gap-y-4'>
                {denies.map(deny => (
                  <div 
                    className='relative flex flex-col gap-y-2 w-full max-w-[1000px] bg-red-500/10 border border-red-500 p-4 rounded-xl mt-8 transition-[margin,opacity] duration-1000 ease-in-out' 
                    key={deny.bot.id}
                  >
                    <h2 className='flex flex-wrap items-center text-lg font-semibold gap-x-2'>
                      <CgDanger /> 
                      Your bot 
                      <Image
                        src={deny.bot.avatar_url}
                        alt={`${deny.bot.username}'s avatar`}
                        width={24}
                        height={24}
                        className='rounded-full'
                      />
                      {deny.bot.username}#{deny.bot.discriminator} was denied
                    </h2>
    
                    <p className='flex flex-wrap text-sm font-medium text-tertiary gap-x-1'>
                      The bot was denied by
                      <Image
                        src={deny.reviewer.avatar_url}
                        alt={`${deny.reviewer.username}'s avatar`}
                        width={20}
                        height={20}
                        className='rounded-full'
                      />
                      <span className='text-secondary'>
                        @{deny.reviewer.username}
                      </span>
                    </p>

                    <div className='flex flex-col gap-y-1'>
                      <h3 className='text-lg font-semibold text-secondary'>
                        {deny.reason.title}
                      </h3>

                      <p className='text-sm text-tertiary'>
                        {deny.reason.description}
                      </p>
                    </div>

                    <div className='mt-2 text-xs text-tertiary'>
                      {new Date(deny.createdAt).getTime() + 21600000 > Date.now() ? (
                        <span>
                          This denial will expire in <Countdown date={new Date(deny.createdAt).getTime() + 21600000} renderer={({ hours, minutes, seconds, completed }) => {
                            if (completed) return 'now';
                            return `${hours} hours ${minutes} minutes ${seconds} seconds.`;
                          }} /> You can{'\''}t add the bot again until then.
                        </span>
                      ) : (
                        <>
                          You can add the bot again now.
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

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