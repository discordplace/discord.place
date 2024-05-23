import useAuthStore from '@/stores/auth';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Image from 'next/image';
import Link from 'next/link';
import { CgLogOut } from 'react-icons/cg';
import { FaDiscord } from 'react-icons/fa';
import config from '@/config';
import { usePathname } from 'next/navigation';
import logout from '@/lib/request/auth/logout';
import { useShallow } from 'zustand/react/shallow';
import { toast } from 'sonner';
import cn from '@/lib/cn';
import { useEffect, useState } from 'react';
import { useWindowScroll } from 'react-use';
import { MdEmojiEmotions } from 'react-icons/md';
import { TiHome } from 'react-icons/ti';
import { RiPencilFill, RiRobot2Fill } from 'react-icons/ri';
import { FaCircleUser } from 'react-icons/fa6';

export default function UserSide({ className }) {
  const { loggedIn, setLoggedIn, setUser } = useAuthStore(useShallow(state => ({
    loggedIn: state.loggedIn,
    setLoggedIn: state.setLoggedIn,
    setUser: state.setUser
  })));

  const user = useAuthStore(state => state.user);
  const pathname = usePathname();

  function logOut() {
    toast.promise(logout(), {
      loading: 'Please wait while we log you out..',
      success: () => {
        setLoggedIn(false);
        setUser(null);

        return 'Logged out successfully.';
      },
      error: message => message
    });
  }

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
        <DropdownMenu.Root modal={false} open={open}>
          <DropdownMenu.Trigger asChild>
            <button className="flex items-center font-medium rounded outline-none pointer-events-auto gap-x-2" onClick={() => setOpen(!open)}>
              <Image src={user.avatar_url} width={32} height={32} className='rounded-full' alt='User Avatar' />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content className="pointer-events-auto flex flex-col p-4 min-w-[300px] bg-secondary rounded-xl border border-primary z-[9999] gap-y-2 mr-2 lg:mr-0 sm:mr-4" sideOffset={10}>  
              <div className='flex flex-col items-center justify-center w-full gap-y-2'>
                <Image src={user.avatar_url} width={128} height={128} className='rounded-full w-[64px] h-[64px]' alt='User Avatar' />
                <h2 className='text-xl font-medium'>
                  {user.username}
                </h2>
              </div>

              <div className='flex flex-col mt-2 gap-y-3'>
                <div className='flex flex-col gap-y-2'>
                  <h2 className='text-xs font-semibold select-none text-tertiary'>
                    Profiles
                  </h2>

                  {user?.profile ? (
                    <>
                      <DropdownMenu.Item className='outline-none' asChild onSelect={() => setOpen(false)}>
                        <Link href={`/profile/${user.profile.slug}`} className='flex items-center justify-between text-sm text-secondary hover:text-primary'>
                          My Profile
                          <FaCircleUser />
                        </Link>
                      </DropdownMenu.Item>

                      <DropdownMenu.Item className='outline-none' asChild onSelect={() => setOpen(false)}>
                        <Link href={`/profile/${user.profile.slug}/edit`} className='flex items-center justify-between text-sm text-secondary hover:text-primary'>
                          Edit Profile
                          <RiPencilFill />
                        </Link>
                      </DropdownMenu.Item>
                    </>
                  ) : (
                    <DropdownMenu.Item className='outline-none' asChild onSelect={() => setOpen(false)}>
                      <Link href='/profiles/create' className='flex items-center justify-between text-sm text-secondary hover:text-primary'>
                        Create Profile
                        <FaCircleUser />
                      </Link>
                    </DropdownMenu.Item>
                  )}
                </div>
                
                <div className='flex flex-col gap-y-2'>
                  <h2 className='text-xs font-semibold select-none text-tertiary'>
                    Servers
                  </h2>

                  <DropdownMenu.Item className='outline-none' asChild onSelect={() => setOpen(false)}>
                    <Link href='/servers/manage' className='flex items-center justify-between text-sm text-secondary hover:text-primary'>
                      My Servers
                      <TiHome />
                    </Link>
                  </DropdownMenu.Item>
                </div>

                
                <div className='flex flex-col gap-y-2'>
                  <h2 className='text-xs font-semibold select-none text-tertiary'>
                    Bots
                  </h2>

                  <DropdownMenu.Item className='outline-none' asChild onSelect={() => setOpen(false)}>
                    <Link href='/bots/manage' className='flex items-center justify-between text-sm text-secondary hover:text-primary'>
                      My Bots
                      <RiRobot2Fill />
                    </Link>
                  </DropdownMenu.Item>
                </div>

                <div className='flex flex-col gap-y-2'>
                  <h2 className='text-xs font-semibold select-none text-tertiary'>
                    Emojis
                  </h2>

                  <DropdownMenu.Item className='outline-none' asChild onSelect={() => setOpen(false)}>
                    <Link href='/emojis/create' className='flex items-center justify-between text-sm text-secondary hover:text-primary'>
                      Publish Emoji
                      <MdEmojiEmotions />
                    </Link>
                  </DropdownMenu.Item>
                </div>

                <div className='bg-quaternary w-full h-[1px]' />

                <DropdownMenu.Item className='outline-none' asChild onSelect={() => setOpen(false)}>
                  <button className='flex items-center justify-between text-sm text-secondary hover:text-primary' onClick={logOut}>
                    Log Out
                    <CgLogOut />
                  </button>
                </DropdownMenu.Item>
              </div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
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