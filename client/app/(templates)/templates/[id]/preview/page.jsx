'use client';

import Sidebar from '@/app/(templates)/templates/[id]/preview/components/Sidebar';
import Channels from '@/app/(templates)/templates/[id]/preview/components/Sidebar/Channels';
import Header from '@/app/(templates)/templates/[id]/preview/components/Header';
import Chat from '@/app/(templates)/templates/[id]/preview/components/Chat';
import Tooltip from '@/app/components/Tooltip';
import { toast } from 'sonner';
import { FaDiscord } from 'react-icons/fa';
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

  function getRandomBrandColor() {
    const colors = ['#5865F2', '#757e8a', '#3ba55c', '#faa61a', '#ed4245', '#eb459f'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  return (
    <div className="w-full h-full min-h-[100dvh] flex">
      <Sidebar />

      <Channels data={searchQuery.channels} focusedChannel={focusedChannel} setFocusedChannel={setFocusedChannel} />
      
      <div className='flex flex-col w-full'>
        <Header focusedChannel={focusedChannel} />

        <div className='flex w-full h-full'>
          <Chat focusedChannel={focusedChannel} />
          
          <div className='px-4 pt-6 max-w-[250px] flex flex-col overflow-y-auto gap-y-6 h-full bg-[#2b2d31] w-full'>
            {searchQuery.roles.map((role, index) => (
              <div className='flex flex-col' key={index}>
                <h2 className='flex items-center gap-x-2 uppercase text-[#949ba4] font-semibold text-sm'>
                  {role.name} — 1
                </h2>

                <div className='flex flex-col mt-2 gap-y-0.5'>
                  <Tooltip
                    content='Click to copy the role color.'
                    side='left'
                  >
                    <div
                      className='select-none -ml-2 cursor-pointer flex items-center gap-x-2 group hover:bg-[#35373c] px-1.5 py-1 rounded-md'
                      onClick={() => {
                        navigator.clipboard.writeText(role.color);
                        toast.success('Role color copied to clipboard.');
                      }}
                    >
                      <div className='w-[32px] h-[32px] rounded-full flex items-center justify-center relative' style={{ backgroundColor: getRandomBrandColor() }}>
                        <FaDiscord className='text-white' size={20} />

                        <span className='absolute -bottom-0.5 border-4 border-[#2b2d31] -right-1 w-4 h-4 rounded-full bg-[#3ba55c]' />
                      </div>

                      <div className='text-sm font-medium' style={{ color: role.color }}>
                        {role.color}
                      </div>
                    </div>
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}