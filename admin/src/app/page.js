'use client';

import AuthenticationWaiting from '@/app/components/AuthenticationWaiting';
import { useUserStore } from '@/stores/user';
import { useEffect, useState } from 'react';
import { get as fetchCurrentUser } from '@/utils/request/currentUser';
import { toast } from 'sonner';
import Unauthorized from '@/app/components/Unauthorized';
import { Box, Section } from '@radix-ui/themes';
import Image from 'next/image';

export default function Page() {
  const [authenticating, setAuthenticating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const user = useUserStore(state => state.user);
  const setUser = useUserStore(state => state.setUser);

  useEffect(() => {
    if (user === 'initial') {
      fetchCurrentUser()
        .then(data => {
          setUser(data);
          
          setIsAuthenticated(data.can_view_dashboard);
        })
        .catch(error => {
          toast.error(error);

          setIsAuthenticated(false);
        })
        .finally(() => setAuthenticating(false));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    authenticating ? <AuthenticationWaiting /> : (
      isAuthenticated ? (
        <div className='px-6 pt-8 flex-col gap-y-2 flex bg-[var(--gray-a2)] h-[100dvh] w-full max-w-[280px]'>
          <Image
            src='/symbol_white.png'
            alt='Logo'
            width={48}
            height={48}
          />

          <Section className='flex flex-col gap-y-2'>
            <Box as='h1' className='text-[var(--gray-a9)] font-bold text-lg'>Dashboard</Box>
            <Box as='p' className='text-[var(--gray-a9)]'>Welcome to the dashboard.</Box>
          </Section>
          
        </div>
      ) : (
        <Unauthorized />
      )
    )
  );
}