import UserAvatar from '@/app/components/ImageFromHash/UserAvatar';
import config from '@/config';
import cn from '@/lib/cn';
import logout from '@/lib/request/auth/logout';
import useAuthStore from '@/stores/auth';
import { t } from '@/stores/language';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BiLogOut } from 'react-icons/bi';
import { useWindowScroll } from 'react-use';
import { toast } from 'sonner';

export default function UserSide({ className }) {
  const loggedIn = useAuthStore(state => state.loggedIn);

  const user = useAuthStore(state => state.user);
  const setUser = useAuthStore(state => state.setUser);
  const setLoggedIn = useAuthStore(state => state.setLoggedIn);
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const { y } = useWindowScroll();

  useEffect(() => {
    setOpen(false);
  }, [y]);

  function logOut() {
    toast.promise(logout, {
      error: error => `Failed to log out: ${error}`,
      loading: 'Logging out..',
      success: () => {
        setUser(null);
        setLoggedIn(false);

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
            className='pointer-events-auto flex items-center gap-x-2 rounded font-medium outline-none'
            href='/account'
            onClick={() => setOpen(!open)}
          >
            <UserAvatar
              className='rounded-full bg-tertiary'
              format='png'
              hash={user.avatar}
              height={32}
              id={user.id}
              size={32}
              width={32}
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