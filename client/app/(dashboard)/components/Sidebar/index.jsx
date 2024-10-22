'use client';

import BlockItem from '@/app/(dashboard)/components/Sidebar/BlockItem';
import CollapseIcon from '@/app/(dashboard)/components/Sidebar/Icons/Collapse';
import UserAvatar from '@/app/components/ImageFromHash/UserAvatar';
import Tooltip from '@/app/components/Tooltip';
import config from '@/config';
import cn from '@/lib/cn';
import logout from '@/lib/request/auth/logout';
import syncLemonSqueezyPlans from '@/lib/request/auth/syncLemonSqueezyPlans';
import useAuthStore from '@/stores/auth';
import useDashboardStore from '@/stores/dashboard';
import useThemeStore from '@/stores/theme';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Bricolage_Grotesque } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next-nprogress-bar';
import { useEffect } from 'react';
import { BiSolidChevronRight } from 'react-icons/bi';
import { CgBlock } from 'react-icons/cg';
import { FaCompass, FaEye, FaUsers } from 'react-icons/fa';
import { FaUserTimes } from 'react-icons/fa';
import { FiLink } from 'react-icons/fi';
import { HiTemplate } from 'react-icons/hi';
import { IoMdLogOut } from 'react-icons/io';
import { MdAccountCircle, MdEmojiEmotions, MdHome, MdSync } from 'react-icons/md';
import { MdMyLocation } from 'react-icons/md';
import { PiWaveformBold } from 'react-icons/pi';
import { RiBrush2Fill, RiRobot2Fill } from 'react-icons/ri';
import { SiGoogleanalytics } from 'react-icons/si';
import { TbSquareRoundedChevronUp } from 'react-icons/tb';
import { useMedia } from 'react-use';
import { toast } from 'sonner';

const BricolageGrotesque = Bricolage_Grotesque({ adjustFontFallback: false, display: 'swap', subsets: ['latin'] });

export default function Sidebar() {
  const theme = useThemeStore(state => state.theme);
  const data = useDashboardStore(state => state.data);
  const isCollapsed = useDashboardStore(state => state.isCollapsed);
  const setIsCollapsed = useDashboardStore(state => state.setIsCollapsed);

  const blocks = [
    {
      icon: MdHome,
      id: 'home',
      name: 'Home'
    },
    {
      icon: FaUsers,
      id: 'users',
      name: 'Users'
    },
    {
      icon: FaCompass,
      id: 'guilds',
      name: 'Guilds'
    },
    {
      name: 'Queues',
      tabs: [
        {
          badge: data?.importantCounts?.emojis,
          disabled: data?.permissions?.canApproveEmojis === false,
          icon: MdEmojiEmotions,
          id: 'emojisQueue',
          name: 'Emojis'
        },
        {
          badge: data?.importantCounts?.bots,
          disabled: data?.permissions?.canApproveBots === false,
          icon: RiRobot2Fill,
          id: 'botsQueue',
          name: 'Bots'
        },
        {
          badge: data?.importantCounts?.templates,
          disabled: data?.permissions?.canApproveTemplates === false,
          icon: HiTemplate,
          id: 'templatesQueue',
          name: 'Templates'
        },
        {
          badge: data?.importantCounts?.sounds,
          disabled: data?.permissions?.canApproveSounds === false,
          icon: PiWaveformBold,
          id: 'soundsQueue',
          name: 'Sounds'
        },
        {
          badge: data?.importantCounts?.reviews,
          disabled: data?.permissions?.canApproveReviews === false && data?.permissions?.canDeleteReviews === false,
          icon: FaEye,
          id: 'reviewsQueue',
          name: 'Reviews'
        },
        {
          badge: data?.importantCounts?.themes,
          disabled: data?.permissions?.canApproveThemes === false,
          icon: RiBrush2Fill,
          id: 'themesQueue',
          name: 'Themes'
        }
      ]
    },
    {
      name: 'Extra',
      tabs: [
        {
          disabled: data?.permissions?.canDeleteLinks === false,
          icon: FiLink,
          id: 'links',
          name: 'Links'
        },
        {
          disabled: data?.permissions?.canDeleteBotDenies === false,
          icon: FaUserTimes,
          id: 'botDenies',
          name: `Bot Denies${data?.botDenies?.length ? ` (${data.botDenies.length})` : ''}`
        },
        {
          disabled: data?.permissions?.canViewTimeouts === false || data?.permissions?.canDeleteTimeouts === false,
          icon: TbSquareRoundedChevronUp,
          id: 'timeouts',
          name: 'Timeouts'
        },
        {
          disabled: data?.permissions?.canViewQuarantines === false || data?.permissions?.canCreateQuarantines === false,
          icon: CgBlock,
          id: 'quarantines',
          name: 'Quarantines'
        },
        {
          disabled: data?.permissions?.canViewBlockedIps === false || data?.permissions?.canDeleteBlockedIps === false,
          icon: MdMyLocation,
          id: 'blockedIPs',
          name: `Blocked IPs${data?.blockedIps?.length ? ` (${data.blockedIps.length})` : ''}`
        },
        {
          href: `${config.analytics.url}/websites/${config.analytics.websiteId}`,
          icon: SiGoogleanalytics,
          id: 'analytics',
          name: 'Analytics',
          type: 'redirect'
        },
        {
          disabled: data?.permissions?.canSyncLemonSqueezyPlans === false,
          icon: MdSync,
          id: 'syncPlans',
          name: 'Sync Plans',
          onClick: () => toast.promise(syncLemonSqueezyPlans(), {
            error: message => message,
            loading: 'Syncing Lemon Squeezy plans..',
            success: () => 'Successfully synced Lemon Squeezy plans.'
          })
        }
      ]
    }
  ];

  const user = useAuthStore(state => state.user);
  const setUser = useAuthStore(state => state.setUser);
  const setLoggedIn = useAuthStore(state => state.setLoggedIn);

  function logOut() {
    toast.promise(logout(), {
      error: message => message,
      loading: 'Please wait while we log you out..',
      success: () => {
        setLoggedIn(false);
        setUser(null);

        return 'Logged out successfully.';
      }
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
              alt='discord.place Logo'
              className='size-6'
              height={64}
              src={theme === 'dark' ? '/symbol_white.png' : '/symbol_black.png'}
              width={64}
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
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    size={20}
                  />
                ) : (
                  <CollapseIcon
                    className='text-secondary hover:text-tertiary'
                    height={20}
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    width={20}
                  />
                )}
              </span>
            </Tooltip>
          )}
        </div>

        <div className='mt-8 flex w-full flex-col gap-y-1 pl-4'>
          {blocks.filter(({ tabs }) => !tabs).map(block => (
            <BlockItem
              icon={block.icon}
              id={block.id}
              key={block.id}
              name={block.name}
            />
          ))}

          {blocks.filter(({ tabs }) => tabs).map(block => (
            <div
              className={cn(
                'flex flex-col gap-y-1',
                !isCollapsed && 'mt-3'
              )}
              key={block.id}
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
                    badge={tab.badge}
                    disabled={tab.disabled}
                    href={tab.href}
                    icon={tab.icon}
                    id={tab.id}
                    key={tab.id}
                    name={tab.name}
                    onClick={tab.onClick}
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
                className='min-h-[36px] min-w-[36px] rounded-full'
                hash={user?.avatar}
                height={36}
                id={user?.id}
                size={64}
                width={36}
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
              side={isCollapsed ? 'right' : 'bottom'}
              sideOffset={5}
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