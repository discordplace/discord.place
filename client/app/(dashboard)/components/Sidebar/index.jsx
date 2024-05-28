'use client';

import Image from 'next/image';
import useThemeStore from '@/stores/theme';
import Link from 'next/link';
import { MdEmojiEmotions, MdHome } from 'react-icons/md';
import cn from '@/lib/cn';
import useDashboardStore from '@/stores/dashboard';
import useAuthStore from '@/stores/auth';
import { CgLogOut } from 'react-icons/cg';
import logout from '@/lib/request/auth/logout';
import { toast } from 'sonner';
import Tooltip from '@/app/components/Tooltip';
import { motion } from 'framer-motion';
import { RiRobot2Fill } from 'react-icons/ri';
import { FaEye } from 'react-icons/fa';

export default function Sidebar() {
  const theme = useThemeStore(state => state.theme);
  const data = useDashboardStore(state => state.data);

  const unapprovedEmojis = data?.queue?.emojis?.filter(emoji => !emoji.approved).length;
  const unapprovedBots = data?.queue?.bots?.filter(bot => !bot.verified).length;
  const unapprovedReviews = data?.queue?.reviews?.filter(review => !review.approved).length;

  const blocks = [
    {
      name: 'Main Menu',
      tabs: [
        {
          id: 'home',
          name: 'Home',
          icon: MdHome
        }
      ]
    },
    {
      name: 'Queue\'s',
      tabs: [
        {
          id: 'emojisQueue',
          name: `Emojis Queue${unapprovedEmojis ? ` (${unapprovedEmojis})` : ''}`,
          icon: MdEmojiEmotions
        },
        {
          id: 'botsQueue',
          name: `Bots Queue${unapprovedBots ? ` (${unapprovedBots})` : ''}`,
          icon: RiRobot2Fill
        },
        {
          id: 'reviewsQueue',
          name: `Reviews Queue${unapprovedReviews ? ` (${unapprovedReviews})` : ''}`,
          icon: FaEye
        }
      ]
    }
  ];

  const activeTab = useDashboardStore(state => state.activeTab);
  const setActiveTab = useDashboardStore(state => state.setActiveTab);

  const user = useAuthStore(state => state.user);
  const setUser = useAuthStore(state => state.setUser);
  const loggedIn = useAuthStore(state => state.loggedIn);
  const setLoggedIn = useAuthStore(state => state.setLoggedIn);

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

  return (
    <div className='bg-secondary sticky left-0 top-0 h-[100dvh] z-[10] border-r border-r-[rgba(var(--bg-quaternary))] min-w-[300px] flex flex-col gap-y-8 p-6'>
      <Link 
        className='flex items-center transition-opacity gap-x-6 hover:opacity-70 w-max'
        href='/'
      >
        <Image 
          src={theme === 'dark' ? '/symbol_white.png' : '/symbol_black.png'} 
          width={200} 
          height={200} 
          className='w-[48px] h-[48px]' 
          alt='discord.placeLogo' 
        />

        <h1 className='text-lg font-semibold'>Dashboard</h1>
      </Link>

      {blocks.map(block => (
        <div className='flex flex-col gap-y-2' key={block.name}>
          <h2 className='text-sm font-semibold select-none text-tertiary'>{block.name}</h2>

          {block.tabs.map(link => (
            <div
              key={link.name}
              className={cn(
                'relative transition-colors cursor-pointer flex items-center px-3 py-2 rounded-lg hover:bg-tertiary font-medium gap-x-2 select-noe text-secondary hover:text-primary',
                activeTab === link.id && 'bg-quaternary text-primary pointer-events-none'
              )}
              onClick={() => setActiveTab(link.id)}
            >
              <link.icon size={20} />
              {link.name}

              {activeTab === link.id && (
                <motion.div
                  layoutId='activeTabIndicator'
                  className='absolute -left-6 bg-black dark:bg-white w-[3px] h-[50%] rounded-lg'
                />
              )}
            </div>
          ))}
        </div>
      ))}

      <div className='flex justify-between pt-6 mt-auto mb-6 border-t border-t-primary'>
        <div className='flex items-center gap-x-4'>          
          {loggedIn && (
            <>
              <Image
                src={user.avatar_url}
                width={32}
                height={32}
                className='rounded-full'
                alt={`${user.username}'s avatar`}
              />

              <div className='flex flex-col select-none'>
                <h2 className='text-lg font-semibold'>
                  {user.global_name}
                </h2>

                <span className='text-sm font-medium text-tertiary'>
                  @{user.username}
                </span>
              </div>
            </>
          )}
        </div>

        <Tooltip content='Log Out'>
          <button
            className='flex items-center justify-between text-lg outline-none text-secondary hover:text-primary'
            onClick={logOut}
          >
            <CgLogOut />
          </button>
        </Tooltip>
      </div>
    </div>
  );
}