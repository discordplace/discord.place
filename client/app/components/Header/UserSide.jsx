import useAuthStore from '@/stores/auth';
import Image from 'next/image';
import Link from 'next/link';
import { FaDiscord } from 'react-icons/fa';
import config from '@/config';
import { usePathname } from 'next/navigation';
import cn from '@/lib/cn';
import { useEffect, useState } from 'react';
import { useWindowScroll } from 'react-use';

export default function UserSide({ className }) {
  const loggedIn = useAuthStore(state => state.loggedIn);

  const user = useAuthStore(state => state.user);
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const { y } = useWindowScroll();

  useEffect(() => {
    setOpen(false);
  }, [y]);

  return (
    <div className={cn(
      'flex items-center gap-x-2',
      className
    )}>
      {loggedIn ? (
        <Link
          className="flex items-center font-medium rounded outline-none pointer-events-auto gap-x-2"
          onClick={() => setOpen(!open)}
          href='/account'  
        >
          <Image src={user.avatar_url} width={32} height={32} className='rounded-full' alt='User Avatar' />
        </Link>
      ) : (
        <Link className="relative flex items-center px-4 py-2 overflow-hidden font-medium rounded pointer-events-auto text-secondary hover:bg-tertiary gap-x-2 group" href={config.getLoginURL(pathname)}>
          <span className="relative flex items-center gap-x-2">
            <FaDiscord size={20} />
            Login with Discord
          </span>
          <div className="opacity-0 group-hover:opacity-100 group-hover:animate-shine absolute inset-0 -top-[20px] flex h-[calc(100%+40px)] w-full justify-center blur-[12px]">
            <div className="relative h-full w-8 bg-white/10 rotate-[45deg]" />
          </div>
        </Link>
      )}
    </div>
  );
}