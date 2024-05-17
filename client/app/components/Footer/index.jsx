'use client';

import useThemeStore from '@/stores/theme';
import { nanoid } from 'nanoid';
import Link from 'next/link';
import { FaDiscord, FaLinkedin, FaGithub } from 'react-icons/fa';
import cn from '@/lib/cn';
import Image from 'next/image';
import ThemeSwitcher from '@/app/components/Footer/ThemeSwitcher';
import config from '@/config';
import { FaXTwitter } from 'react-icons/fa6';

export default function Footer() {
  const theme = useThemeStore(state => state.theme);

  const blocks = [
    {
      title: 'Pages',
      links: [
        {
          label: 'Home',
          href: '/home'
        },
        {
          label: 'API Documentation',
          href: config.docsUrl
        },
        {
          label: 'Redeem Premium',
          href: '/redeem'
        }
      ]
    },
    {
      title: 'Our Services',
      links: [
        {
          label: 'Profiles',
          href: '/profiles'
        },
        {
          label: 'Servers',
          href: '/servers'
        },
        {
          label: 'Bots',
          href: '/bots'
        },
        {
          label: 'Emojis',
          href: '/emojis'
        }
      ]
    },
    {
      title: 'Legal',
      links: [
        {
          label: 'Privacy Policy',
          href: '#',
          disabled: true
        },
        {
          label: 'Terms of Service',
          href: '#',
          disabled: true
        },
        {
          label: 'Cookie Policy',
          href: '/legal/cookie-policy'
        },
        {
          label: 'Content Policy',
          href: '/legal/content-policy'
        }
      ]
    },
    {
      title: 'Socials',
      links: [
        {
          label: 'X',
          href: '#',
          icon: FaXTwitter,
          disabled: true
        },
        {
          label: 'Discord',
          href: 'https://invite.discord.place',
          icon: FaDiscord
        },
        {
          label: 'GitHub',
          href: 'https://github.com/discordplace',
          icon: FaGithub
        },
        {
          label: 'LinkedIn',
          href: '#',
          icon: FaLinkedin,
          disabled: true
        }
      ]
    }
  ];

  return (
    <section className="flex flex-col 2xl:max-h-[566px] flex-wrap flex-1 w-full gap-16 px-6 py-16 mt-auto border-t 2xl:flex-row 2xl:gap-x-48 sm:px-24 xl:px-48 bg-secondary border-primary">
      <div className='flex flex-col gap-y-6 max-w-[400px] w-full'>
        <Image 
          src={theme === 'dark' ? '/symbol_white.png' : '/symbol_black.png'} 
          width={200} 
          height={200} 
          className='w-[48px] h-[48px]' 
          alt='discord.placeLogo' 
        />

        <h2 className='text-2xl font-bold text-primary max-w-[350px]'>
          All things related to Discord in one place.
        </h2>

        <span className='text-sm text-secondary'>
          discord.place, {new Date().getFullYear()}
        </span>
      </div>

      <div className='flex flex-wrap justify-between 2xl:w-[calc(100%_-_400px_-_12rem)] gap-8 sm:gap-16'>
        {blocks.map(block => (
          <div className='flex flex-col gap-y-6' key={nanoid()}>
            <h2 className='text-sm font-medium text-tertiary'>
              {block.title}
            </h2>

            <div className='flex flex-col gap-y-4'>
              {block.links.map(link => (
                <Link 
                  key={nanoid()}
                  href={link.href}
                  className={cn(
                    'flex items-center gap-x-2 text-secondary w-max',
                    link.disabled ? 'pointer-events-none opacity-70' : 'hover:text-primary'
                  )}
                >
                  {link.icon && <link.icon />}
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className='lg:mt-24 w-full h-[1px] bg-[rgb(var(--border-primary))]' />

      <div className='flex flex-col justify-between w-full gap-4 sm:flex-row'>
        <p className='text-sm text-tertiary'>
          &copy; {new Date().getFullYear()} discord.place. All rights reserved.
        </p>

        <ThemeSwitcher />
      </div>
    </section>
  );
}