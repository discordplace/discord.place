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
import { MdMyLocation } from 'react-icons/md';
import { IoChevronBackOutline } from 'react-icons/io5';
import { useMedia } from 'react-use';
import { useEffect } from 'react';
import { TbSquareRoundedChevronUp } from 'react-icons/tb';
import { FaUserTimes } from 'react-icons/fa';
import config from '@/config';
import { SiGoogleanalytics } from 'react-icons/si';
import { MdArrowOutward } from 'react-icons/md';
import { HiTemplate } from 'react-icons/hi';
import syncLemonSqueezyPlans from '@/lib/request/auth/syncLemonSqueezyPlans';
import { MdSync } from 'react-icons/md';
import { CgBlock } from 'react-icons/cg';
import { PiWaveformBold } from 'react-icons/pi';
import { FiLink } from 'react-icons/fi';

export default function Sidebar() {
  const theme = useThemeStore(state => state.theme);
  const data = useDashboardStore(state => state.data);

  const unapprovedEmojis = data?.queue?.emojis?.filter(emoji => !emoji.approved).length;
  const unapprovedBots = data?.queue?.bots?.filter(bot => !bot.verified).length;
  const unapprovedTemplates = data?.queue?.templates?.filter(template => !template.approved).length;
  const unapprovedSounds = data?.queue?.sounds?.filter(sound => !sound.approved).length;
  const unapprovedReviews = data?.queue?.reviews?.filter(review => !review.approved).length;

  const blocks = [
    {
      name: 'Main Menu',
      tabs: [
        {
          id: 'home',
          name: 'Home',
          icon: MdHome
        },
        {
          id: 'blockedIPs',
          name: `Blocked IPs${data?.blockedIps?.length ? ` (${data.blockedIps.length})` : ''}`,
          icon: MdMyLocation,
          disabled: data?.permissions?.canViewBlockedIps === false || data?.permissions?.canDeleteBlockedIps === false
        }
      ]
    },
    {
      name: 'Queues',
      tabs: [
        {
          id: 'emojisQueue',
          name: `Emojis Queue${unapprovedEmojis ? ` (${unapprovedEmojis})` : ''}`,
          icon: MdEmojiEmotions,
          disabled: data?.permissions?.canApproveEmojis === false
        },
        {
          id: 'botsQueue',
          name: `Bots Queue${unapprovedBots ? ` (${unapprovedBots})` : ''}`,
          icon: RiRobot2Fill,
          disabled: data?.permissions?.canApproveBots === false
        },
        {
          id: 'templatesQueue',
          name: `Templates Queue${unapprovedTemplates ? ` (${unapprovedTemplates})` : ''}`,
          icon: HiTemplate,
          disabled: data?.permissions?.canApproveTemplates === false
        },
        {
          id: 'soundsQueue',
          name: `Sounds Queue${unapprovedSounds ? ` (${unapprovedSounds})` : ''}`,
          icon: PiWaveformBold,
          disabled: data?.permissions?.canApproveSounds === false
        },
        {
          id: 'reviewsQueue',
          name: `Reviews Queue${unapprovedReviews ? ` (${unapprovedReviews})` : ''}`,
          icon: FaEye,
          disabled: data?.permissions?.canApproveReviews === false && data?.permissions?.canDeleteReviews === false
        }
      ]
    },
    {
      name: 'Extra',
      tabs: [
        {
          id: 'links',
          name: 'Links',
          icon: FiLink,
          disabled: data?.permissions?.canDeleteLinks === false
        },
        {
          id: 'botDenies',
          name: `Bot Denies${data?.botDenies?.length ? ` (${data.botDenies.length})` : ''}`,
          icon: FaUserTimes,
          disabled: data?.permissions?.canDeleteBotDenies === false
        },
        {
          type: 'redirect',
          id: 'analytics',
          href: `${config.analytics.url}/websites/${config.analytics.websiteId}`,
          name: 'Analytics',
          icon: SiGoogleanalytics
        },
        {
          id: 'timeouts',
          name: 'Timeouts',
          icon: TbSquareRoundedChevronUp,
          disabled: data?.permissions?.canViewTimeouts === false || data?.permissions?.canDeleteTimeouts === false
        },
        {
          id: 'quarantines',
          name: 'Quarantines',
          icon: CgBlock,
          disabled: data?.permissions?.canViewQuarantines === false || data?.permissions?.canCreateQuarantines === false
        },
        {
          id: 'syncPlans',
          name: 'Sync Plans',
          icon: MdSync,
          onClick: () => toast.promise(syncLemonSqueezyPlans(), {
            loading: 'Syncing Lemon Squeezy plans..',
            success: () => 'Successfully synced Lemon Squeezy plans.',
            error: message => message
          }),
          disabled: data?.permissions?.canSyncLemonSqueezyPlans === false
        }
      ]
    }
  ];

  const activeTab = useDashboardStore(state => state.activeTab);
  const setActiveTab = useDashboardStore(state => state.setActiveTab);
  const loading = useDashboardStore(state => state.loading);

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

  const isCollapsed = useDashboardStore(state => state.isCollapsed);
  const setIsCollapsed = useDashboardStore(state => state.setIsCollapsed);
  const isMobile = useMedia('(max-width: 768px)', false);

  useEffect(() => {
    if (isMobile) setIsCollapsed(true);

    // eslint-disable-next-line
  }, [isMobile]);

  return (
    <div className={cn(
      'bg-secondary sticky left-0 top-0 h-[100dvh] z-[10] border-r border-r-[rgba(var(--bg-quaternary))] min-w-[300px] flex flex-col gap-y-8 p-6',
      isCollapsed && 'min-w-[60px] max-w-[120px]',
      isMobile && isCollapsed && 'min-w-[0px] max-w-[0px] p-3',
      isMobile && !isCollapsed && 'scrollbar-hide fixed'
    )}>
      <div  className={cn(
        'flex items-center w-full',
        isCollapsed ? 'justify-center' : 'justify-between'
      )}>
        <Link 
          href='/'
          className='relative flex items-center transition-opacity gap-x-6 hover:opacity-70'
        >
          <Image 
            src={theme === 'dark' ? '/symbol_white.png' : '/symbol_black.png'} 
            width={200} 
            height={200} 
            className='w-[32px] h-[32px]' 
            alt='discord.placeLogo' 
          />

          <h1 className={cn(
            'text-lg font-semibold',
            isCollapsed && 'hidden'
          )}>Dashboard</h1>
        </Link>

        <div
          className='absolute ml-auto -right-[1rem] cursor-pointer bg-secondary p-1.5 hover:bg-quaternary text-secondary hover:text-primary rounded-full border border-[rgba(var(--bg-quaternary))]'
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <IoChevronBackOutline className={cn(
            'transition-transform transform duration-200 ease-in-out',
            isCollapsed && 'rotate-180'
          )} />
        </div>
      </div>

      {blocks.map(block => (
        <div className={cn(
          'flex flex-col gap-y-2',
          isMobile && isCollapsed && 'hidden'
        )} key={block.name}>
          <h2 className={cn(
            'text-sm font-semibold select-none text-tertiary',
            isCollapsed && 'text-xs truncate'
          )}>{block.name}</h2>

          {block.tabs.map(link => (
            isCollapsed ? (
              <Tooltip
                content={link.name}
                key={link.name}
                side='right'
              >
                <div
                  className={cn(
                    'relative group transition-all cursor-pointer flex items-center justify-center px-3 py-2 rounded-lg hover:bg-tertiary font-medium gap-x-2 select-noe text-secondary hover:text-primary',
                    activeTab === link.id && 'bg-quaternary text-primary pointer-events-none',
                    (loading || link.disabled) && 'opacity-50 pointer-events-none'
                  )}
                  onClick={() => {
                    if (link.onClick) return link.onClick();
                    if (link.type === 'redirect') return window.open(link.href, '_blank');

                    setActiveTab(link.id);
                    if (isMobile) setIsCollapsed(true);
                  }}
                >
                  <div className='relative'>
                    <link.icon size={20} />
                    {link.type === 'redirect' && (
                      <MdArrowOutward size={18} className='absolute p-0.5 -right-3 rounded-full bg-[rgba(var(--bg-secondary))] group-hover:bg-[rgba(var(--bg-tertiary))] -bottom-2 text-tertiary' />
                    )}
                  </div>

                  {activeTab === link.id && (
                    <motion.div
                      layoutId='activeTabIndicator'
                      className='absolute -left-6 bg-black dark:bg-white w-[3px] h-[50%] rounded-lg'
                    />
                  )}
                </div>
              </Tooltip>
            ) : (
              <div
                key={link.name}
                className={cn(
                  'relative transition-all cursor-pointer flex items-center px-3 py-2 rounded-lg hover:bg-tertiary font-medium gap-x-2 select-noe text-secondary hover:text-primary',
                  activeTab === link.id && 'bg-quaternary text-primary pointer-events-none',
                  (loading || link.disabled) && 'opacity-50 pointer-events-none'
                )}
                onClick={() => {
                  if (link.onClick) return link.onClick();
                  if (link.type === 'redirect') return window.open(link.href, '_blank');
                  
                  setActiveTab(link.id);
                  if (isMobile) setIsCollapsed(true);
                }}
              >
                <link.icon size={20} />
                {link.name}

                {link.type === 'redirect' && (
                  <MdArrowOutward size={18} className='ml-auto text-tertiary' />
                )}

                {activeTab === link.id && (
                  <motion.div
                    layoutId='activeTabIndicator'
                    className='absolute -left-6 bg-black dark:bg-white w-[3px] h-[50%] rounded-lg'
                  />
                )}
              </div>
            )
          ))}
        </div>
      ))}

      <div className={cn(
        'flex justify-between pt-6 mt-auto mb-6 border-t border-t-primary',
        isMobile && isCollapsed && 'hidden'
      )}>
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

              <div className={cn(
                'flex flex-col select-none',
                isCollapsed && 'hidden'
              )}>
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