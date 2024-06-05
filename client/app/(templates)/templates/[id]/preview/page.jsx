'use client';

import Sidebar from '@/app/(templates)/templates/[id]/preview/components/Sidebar';
import Channels from '@/app/(templates)/templates/[id]/preview/components/Sidebar/Channels';
import Header from '@/app/(templates)/templates/[id]/preview/components/Header';
import Chat from '@/app/(templates)/templates/[id]/preview/components/Chat';
import Members from '@/app/(templates)/templates/[id]/preview/components/Members';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import FullPageLoading from '@/app/components/FullPageLoading';

export default function Page() {
  const [searchQuery, setSearchQuery] = useState({
    channels: [],
    roles: []
  });

  const searchParams = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    try { 
      const channels = JSON.parse(decodeURIComponent(params.get('channels') || []));
      const roles = JSON.parse(decodeURIComponent(params.get('roles') || []));

      setSearchQuery({
        channels: channels,
        roles: roles
      });
    } catch (error) {
      console.error(error);
    }
  }, [searchParams]);

  const [focusedChannel, setFocusedChannel] = useState(null);

  useEffect(() => {
    setFocusedChannel(searchQuery.channels.find(channel => channel.defaultFocused));
  }, [searchQuery]);

  if (!focusedChannel) return <FullPageLoading />;
  
  return (
    <div className="w-full h-full min-h-[100dvh] flex">
      <Sidebar />

      <Channels data={searchQuery.channels} focusedChannel={focusedChannel} setFocusedChannel={setFocusedChannel} />
      
      <div className='flex flex-col w-full'>
        <Header focusedChannel={focusedChannel} />

        <div className='flex w-full h-full'>
          <Chat focusedChannel={focusedChannel} />
          <Members searchQuery={searchQuery} />
        </div>
      </div>
    </div>
  );
}