'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BiLogOut } from 'react-icons/bi';
import { useCookie, useWindowScroll } from 'react-use';
import { toast } from 'sonner';

import UserAvatar from '@/app/components/ImageFromHash/UserAvatar';
import config from '@/config';
import cn from '@/lib/cn';
import getAuthenticatedUser from '@/lib/request/auth/getAuthenticatedUser';
import logout from '@/lib/request/auth/logout';
import useAuthStore from '@/stores/auth';

export default function UserSide({ className }) {
  const { t } = useTranslation();
  const loggedIn = useAuthStore(state => state.loggedIn);

  const user = useAuthStore(state => state.user);
  const setUser = useAuthStore(state => state.setUser);
  const setLoggedIn = useAuthStore(state => state.setLoggedIn);
  const deleteToken = useCookie(config.authCookieName)[2];

  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const { y } = useWindowScroll();

  const router = useRouter();

  useEffect(() => {
    function handleMessage(event) {
      if (event.origin !== process.env.NEXT_PUBLIC_SITE_URL) return;

      const data = event.data;

      switch (data.type) {
        case 'discord_oauth_done': {
          getAuthenticatedUser()
            .then(user => {
              setUser(user);
              setLoggedIn(true);
            })
            .catch(() => setUser(null));

          if (data.redirect) router.push(data.redirect);

          break;
        }
      }
    }

    window.addEventListener('message', handleMessage);

    return () => window.removeEventListener('message', handleMessage);
  }, [router]);

  useEffect(() => {
    setOpen(false);
  }, [y]);

  function logOut() {
    toast.promise(logout, {
      error: error => error,
      loading: 'Logging out..',
      success: () => {
        setUser(null);
        setLoggedIn(false);
        deleteToken();

        return 'Logged out successfully';
      }
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
            className='pointer-events-auto flex items-center gap-x-2 rounded-sm font-medium outline-hidden'
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
        <button
          className='pointer-events-auto relative flex items-center gap-x-1 overflow-hidden rounded-full bg-black px-4 py-1.5 text-sm font-semibold text-white hover:bg-black/70 dark:bg-white dark:text-black dark:hover:bg-white/70'
          onClick={() => {
            console.log(config.getLoginURL(pathname));
            window.open(config.getLoginURL(pathname), '_blank', 'width=600,height=700');
          }}
        >
          {t('buttons.loginWithDiscord')}
        </button>
      )}
    </div>
  );
}