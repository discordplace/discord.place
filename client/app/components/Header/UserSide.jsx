'use client';

import { BiLogOut } from '@/icons';
import useAuthStore from '@/stores/auth';
import Link from 'next/link';
import config from '@/config';
import { usePathname } from 'next/navigation';
import cn from '@/lib/cn';
import { useEffect, useState } from 'react';
import { useCookie, useWindowScroll } from 'react-use';
import logout from '@/lib/request/auth/logout';
import { toast } from 'sonner';
import { t } from '@/stores/language';
import UserAvatar from '@/app/components/ImageFromHash/UserAvatar';

export default function UserSide({ className }) {
  const loggedIn = useAuthStore(state => state.loggedIn);

  const user = useAuthStore(state => state.user);
  const setUser = useAuthStore(state => state.setUser);
  const setLoggedIn = useAuthStore(state => state.setLoggedIn);
  const [,, deleteToken] = useCookie('token');

  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const { y } = useWindowScroll();

  useEffect(() => {
    setOpen(false);
  }, [y]);

  function logOut() {
    toast.promise(logout, {
      loading: 'Logging out..',
      success: () => {
        setUser(null);
        setLoggedIn(false);
        deleteToken();

        return 'Logged out successfully';
      },
      error: error => error
    });
  }

  return (
    <div
      className={cn(
        'flex items-center gap-x-4',
        className
      )}
    >
      {loggedIn ? (
        <>
          <button
            className='pointer-events-auto relative flex items-center gap-x-1 overflow-hidden rounded-full bg-black px-4 py-1.5 text-sm font-semibold text-white hover:bg-black/70 dark:bg-white dark:text-black dark:hover:bg-white/70'
            onClick={logOut}
          >
            {t('header.logout')}
            <BiLogOut />
          </button>

          <Link
            className='pointer-events-auto flex items-center gap-x-2 rounded font-medium outline-none'
            onClick={() => setOpen(!open)}
            href='/account'
          >
            <UserAvatar
              id={user.id}
              hash={user.avatar}
              size={32}
              width={32}
              height={32}
              className='rounded-full bg-tertiary'
            />
          </Link>
        </>
      ) : (
        <Link
          className='pointer-events-auto relative flex items-center gap-x-1 overflow-hidden rounded-full bg-black px-4 py-1.5 text-sm font-semibold text-white hover:bg-black/70 dark:bg-white dark:text-black dark:hover:bg-white/70'
          href={config.getLoginURL(pathname)}
        >
          {t('buttons.loginWithDiscord')}
        </Link>
      )}
    </div>
  );
}