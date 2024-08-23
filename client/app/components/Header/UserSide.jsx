import useAuthStore from '@/stores/auth';
import Link from 'next/link';
import config from '@/config';
import { usePathname } from 'next/navigation';
import cn from '@/lib/cn';
import { useEffect, useState } from 'react';
import { useWindowScroll } from 'react-use';
import { BiLogOut } from 'react-icons/bi';
import logout from '@/lib/request/auth/logout';
import { toast } from 'sonner';
import { t } from '@/stores/language';
import UserAvatar from '@/app/components/ImageFromHash/UserAvatar';

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
      loading: 'Logging out..',
      success: () => {
        setUser(null);
        setLoggedIn(false);

        return 'Logged out successfully';
      },
      error: error => `Failed to log out: ${error}`
    });
  }

  return (
    <div className={cn(
      'flex items-center gap-x-4',
      className
    )}>
      {loggedIn ? (
        <>
          <button 
            className='relative flex items-center px-4 py-1.5 overflow-hidden text-sm font-semibold text-white bg-black rounded-full pointer-events-auto dark:bg-white dark:text-black dark:hover:bg-white/70 hover:bg-black/70 gap-x-1'
            onClick={logOut}
          >
            {t('header.logout')}
            <BiLogOut />
          </button>

          <Link
            className="flex items-center font-medium rounded outline-none pointer-events-auto gap-x-2"
            onClick={() => setOpen(!open)}
            href='/account'  
          >
            <UserAvatar
              id={user.id}
              hash={user.avatar}
              size={32}
              width={32}
              height={32}
              format='png'
              className='rounded-full bg-tertiary'
            />
            {/* <Image src={user.avatar_url} width={32} height={32} className='rounded-full' alt='User Avatar' /> */}
          </Link>
        </>
      ) : (
        <Link 
          className='relative flex items-center px-4 py-1.5 overflow-hidden text-sm font-semibold text-white bg-black rounded-full pointer-events-auto dark:bg-white dark:text-black dark:hover:bg-white/70 hover:bg-black/70 gap-x-1'
          href={config.getLoginURL(pathname)}
        >
          {t('buttons.loginWithDiscord')}
        </Link>
      )}
    </div>
  );
}