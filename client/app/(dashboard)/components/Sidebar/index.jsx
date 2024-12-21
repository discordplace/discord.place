'use client';

import useThemeStore from '@/stores/theme';
import Image from 'next/image';
import { Bricolage_Grotesque } from 'next/font/google';
import cn from '@/lib/cn';
import { MdAccountCircle, MdEmojiEmotions, MdHome, MdSync } from 'react-icons/md';
import useDashboardStore from '@/stores/dashboard';
import { RiBrush2Fill, RiRobot2Fill } from 'react-icons/ri';
import { FaCompass, FaEye, FaUsers } from 'react-icons/fa';
import { MdMyLocation } from 'react-icons/md';
import { TbSquareRoundedChevronUp } from 'react-icons/tb';
import { FaUserTimes } from 'react-icons/fa';
import config from '@/config';
import { SiGoogleanalytics } from 'react-icons/si';
import { HiTemplate } from 'react-icons/hi';
import { CgBlock } from 'react-icons/cg';
import { PiWaveformBold } from 'react-icons/pi';
import { FiLink } from 'react-icons/fi';
import UserAvatar from '@/app/components/ImageFromHash/UserAvatar';
import useAuthStore from '@/stores/auth';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useRouter } from 'next-nprogress-bar';
import { IoMdLogOut } from 'react-icons/io';
import logout from '@/lib/request/auth/logout';
import { toast } from 'sonner';
import BlockItem from '@/app/(dashboard)/components/Sidebar/BlockItem';
import CollapseIcon from '@/app/(dashboard)/components/Sidebar/Icons/Collapse';
import { BiSolidChevronRight } from 'react-icons/bi';
import Tooltip from '@/app/components/Tooltip';
import Link from 'next/link';
import { useCookie, useMedia } from 'react-use';
import { useEffect } from 'react';
import syncLemonSqueezyPlans from '@/lib/request/auth/syncLemonSqueezyPlans';

const BricolageGrotesque = Bricolage_Grotesque({ subsets: ['latin'], display: 'swap', adjustFontFallback: false });

export default function Sidebar() {
  const theme = useThemeStore(state => state.theme);
  const data = useDashboardStore(state => state.data);
  const isCollapsed = useDashboardStore(state => state.isCollapsed);
  const setIsCollapsed = useDashboardStore(state => state.setIsCollapsed);

  const blocks = [
    {
      id: 'home',
      name: 'Home',
      icon: MdHome
    },
    {
      id: 'users',
      name: 'Users',
      icon: FaUsers
    },
    {
      id: 'guilds',
      name: 'Guilds',
      icon: FaCompass
    },
    {
      name: 'Queues',
      tabs: [
        {
          id: 'emojisQueue',
          name: 'Emojis',
          icon: MdEmojiEmotions,
          disabled: data?.permissions?.canApproveEmojis === false,
          badge: {
            data: data?.importantCounts?.emojis,
            style: 'danger'
          }
        },
        {
          id: 'botsQueue',
          name: 'Bots',
          icon: RiRobot2Fill,
          disabled: data?.permissions?.canApproveBots === false,
          badge: {
            data: data?.importantCounts?.bots,
            style: 'danger'
          }
        },
        {
          id: 'templatesQueue',
          name: 'Templates',
          icon: HiTemplate,
          disabled: data?.permissions?.canApproveTemplates === false,
          badge: {
            data: data?.importantCounts?.templates,
            style: 'danger'
          }
        },
        {
          id: 'soundsQueue',
          name: 'Sounds',
          icon: PiWaveformBold,
          disabled: data?.permissions?.canApproveSounds === false,
          badge: {
            data: data?.importantCounts?.sounds,
            style: 'danger'
          }
        },
        {
          id: 'reviewsQueue',
          name: 'Reviews',
          icon: FaEye,
          disabled: data?.permissions?.canApproveReviews === false && data?.permissions?.canDeleteReviews === false,
          badge: {
            data: data?.importantCounts?.reviews,
            style: 'danger'
          }
        },
        {
          id: 'themesQueue',
          name: 'Themes',
          icon: RiBrush2Fill,
          disabled: data?.permissions?.canApproveThemes === false,
          badge: {
            data: data?.importantCounts?.themes,
            style: 'danger'
          }
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
          disabled: data?.permissions?.canDeleteLinks === false,
          badge: {
            data: data?.counts?.links,
            style: 'primary'
          }
        },
        {
          id: 'botDenies',
          name: 'Bot Denies',
          icon: FaUserTimes,
          disabled: data?.permissions?.canDeleteBotDenies === false,
          badge: {
            data: data?.counts?.botDenies,
            style: 'primary'
          }
        },
        {
          id: 'timeouts',
          name: 'Timeouts',
          icon: TbSquareRoundedChevronUp,
          disabled: data?.permissions?.canViewTimeouts === false || data?.permissions?.canDeleteTimeouts === false,
          badge: {
            data: data?.counts?.timeouts,
            style: 'primary'
          }
        },
        {
          id: 'quarantines',
          name: 'Quarantines',
          icon: CgBlock,
          disabled: data?.permissions?.canViewQuarantines === false || data?.permissions?.canCreateQuarantines === false,
          badge: {
            data: data?.counts?.quarantines,
            style: 'primary'
          }
        },
        {
          id: 'blockedIPs',
          name: `Blocked IPs${data?.blockedIps?.length ? ` (${data.blockedIps.length})` : ''}`,
          icon: MdMyLocation,
          disabled: data?.permissions?.canViewBlockedIps === false || data?.permissions?.canDeleteBlockedIps === false,
          badge: {
            data: data?.counts?.blockedIps,
            style: 'primary'
          }
        },
        {
          type: 'redirect',
          id: 'analytics',
          href: `${config.analytics.url}/websites/${config.analytics.websiteId}`,
          name: 'Analytics',
          icon: SiGoogleanalytics
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

  const user = useAuthStore(state => state.user);
  const setUser = useAuthStore(state => state.setUser);
  const setLoggedIn = useAuthStore(state => state.setLoggedIn);
  const [,, deleteToken] = useCookie('token');

  function logOut() {
    toast.promise(logout(), {
      loading: 'Please wait while we log you out..',
      success: () => {
        setLoggedIn(false);
        setUser(null);
        deleteToken();

        return 'Logged out successfully.';
      },
      error: message => message
    });
  }

  const router = useRouter();
  const isMobile = useMedia('(max-width: 768px)');

  useEffect(() => {
    setIsCollapsed(isMobile);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  return (
    <div
      className={cn(
        'flex',
        isCollapsed ? 'min-w-[60px] w-[60px]' : 'min-w-[250px]'
      )}
    >
      <div className='sticky top-0 h-max w-full'>
        <div
          className={cn(
            'flex items-center pt-8 select-none gap-4',
            isCollapsed ? 'flex-col pl-4' : 'pl-8'
          )}
        >
          <Link
            className='flex gap-x-4 hover:opacity-60'
            href='/'
          >
            <Image
              src={theme === 'dark' ? '/symbol_white.png' : '/symbol_black.png'}
              width={64}
              height={64}
              alt='discord.place Logo'
              className='size-6'
              priority={true}
            />

            <h1
              className={cn(
                'text-lg font-semibold',
                isCollapsed && 'hidden',
                BricolageGrotesque.className
              )}
            >
              Dashboard
            </h1>
          </Link>

          {!isMobile && (
            <Tooltip
              content={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              side='right'
            >
              <span
                className={cn(
                  'cursor-pointer',
                  !isCollapsed && 'ml-auto'
                )}
              >
                {isCollapsed ? (
                  <BiSolidChevronRight
                    className='text-secondary hover:text-tertiary'
                    size={20}
                    onClick={() => setIsCollapsed(!isCollapsed)}
                  />
                ) : (
                  <CollapseIcon
                    className='text-secondary hover:text-tertiary'
                    height={20}
                    width={20}
                    onClick={() => setIsCollapsed(!isCollapsed)}
                  />
                )}
              </span>
            </Tooltip>
          )}
        </div>

        <div className='mt-8 flex w-full flex-col gap-y-1 pl-4'>
          {blocks.filter(({ tabs }) => !tabs).map(block => (
            <BlockItem
              key={block.id}
              id={block.id}
              name={block.name}
              icon={block.icon}
            />
          ))}

          {blocks.filter(({ tabs }) => tabs).map(block => (
            <div
              key={block.id}
              className={cn(
                'flex flex-col gap-y-1',
                !isCollapsed && 'mt-3'
              )}
            >
              <span
                className={cn(
                  'pl-4 text-sm font-semibold text-tertiary',
                  isCollapsed && 'hidden'
                )}
              >
                {block.name}
              </span>

              <div
                className={cn(
                  'h-[1px] bg-quaternary w-full',
                  !isCollapsed && 'hidden'
                )}
              />

              <div className='flex flex-col gap-y-1'>
                {block.tabs.map(tab => (
                  <BlockItem
                    key={tab.id}
                    id={tab.id}
                    name={tab.name}
                    icon={tab.icon}
                    href={tab.href}
                    onClick={tab.onClick}
                    badge={tab.badge}
                    disabled={tab.disabled}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <DropdownMenu.Root modal={false}>
          <DropdownMenu.Trigger asChild>
            <div
              className={cn(
                'my-2 w-full flex items-center gap-x-2 rounded-2xl max-w-[calc(100%-1rem)] cursor-pointer',
                isCollapsed ? 'ml-5' : 'ml-4 hover:bg-quaternary border bg-tertiary border-[rgba(var(--bg-quaternary))] p-3'
              )}
            >
              <UserAvatar
                id={user?.id}
                hash={user?.avatar}
                size={64}
                width={36}
                height={36}
                className='min-h-[36px] min-w-[36px] rounded-full'
              />

              <div
                className={cn(
                  'flex flex-col text-sm select-none',
                  isCollapsed && 'hidden'
                )}
              >
                <span className='font-semibold'>
                  {user?.global_name}
                </span>

                <span className='text-xs text-tertiary'>
                  @{user?.username}
                </span>
              </div>
            </div>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className={cn(
                'z-10 flex flex-col p-1.5 mb-4 border outline-none min-w-[235px] bg-secondary rounded-xl border-primary',
                isCollapsed ? 'shadow-[0px_-15px_20px_0px_rgba(var(--bg-background))]' : 'shadow-[0px_-15px_20px_0px_rgba(var(--bg-secondary))]'
              )}
              sideOffset={5}
              side={isCollapsed ? 'right' : 'bottom'}
            >
              <DropdownMenu.Item
                className='flex cursor-pointer items-center gap-x-2 rounded-xl px-2.5 py-2 font-medium text-tertiary outline-none data-[highlighted]:bg-quaternary data-[highlighted]:text-primary'
                onSelect={() => router.push('/account')}
              >
                <MdAccountCircle />
                My Account
              </DropdownMenu.Item>

              <DropdownMenu.Item
                className='flex cursor-pointer items-center gap-x-2 rounded-xl px-2.5 py-2 font-medium text-tertiary outline-none data-[highlighted]:bg-quaternary data-[highlighted]:text-primary'
                onSelect={logOut}
              >
                <IoMdLogOut />
                Logout
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </div>
  );
}