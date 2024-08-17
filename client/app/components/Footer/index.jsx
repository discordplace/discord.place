'use client';

import useThemeStore from '@/stores/theme';
import { nanoid } from 'nanoid';
import Link from 'next/link';
import { FaDiscord, FaLinkedin, FaGithub } from 'react-icons/fa';
import cn from '@/lib/cn';
import Image from 'next/image';
import config from '@/config';
import { FaXTwitter } from 'react-icons/fa6';
import { usePathname } from 'next/navigation';
import useGeneralStore from '@/stores/general';
import { MdSunny } from 'react-icons/md';
import { motion } from 'framer-motion';
import { IoIosMoon } from 'react-icons/io';
import useLanguageStore from '@/stores/language';
import Twemoji from 'react-twemoji';

export default function Footer() {
  const theme = useThemeStore(state => state.theme);
  const toggleTheme = useThemeStore(state => state.toggleTheme);
  const summary = useGeneralStore(state => state.status.summary);
  const language = useLanguageStore(state => state.language);
  const setLanguage = useLanguageStore(state => state.setLanguage);
  
  const pathname = usePathname();
  
  const isDashboard = pathname === '/dashboard';
  const isTemplatePreview = pathname.startsWith('/templates/') && pathname.endsWith('/preview'); 
  const isAccount = pathname === '/account'; 

  if (isDashboard || isTemplatePreview || isAccount) return null;

  const blocks = [
    {
      title: 'Pages',
      links: [
        {
          label: 'Home',
          href: '/'
        },
        {
          label: 'API Documentation',
          href: config.docsUrl
        },
        {
          label: 'Service Status',
          href: config.instatus.baseUrl
        },
        {
          label: 'Premium',
          href: '/premium'
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
        },
        {
          label: 'Templates',
          href: '/templates'
        },
        {
          label: 'Sounds',
          href: '/sounds'
        }
      ]
    },
    {
      title: 'Legal',
      links: [
        {
          label: 'Privacy Policy',
          href: '/legal/privacy'
        },
        {
          label: 'Terms of Service',
          href: '/legal/terms'
        },
        {
          label: 'Cookie Policy',
          href: '/legal/cookie-policy'
        },
        {
          label: 'Content Policy',
          href: '/legal/content-policy'
        },
        {
          label: 'Purchase Policy',
          href: '/legal/purchase-policy'
        }
      ]
    },
    {
      title: 'Socials',
      links: [
        {
          label: 'X',
          href: 'https://x.com/discord_place',
          icon: FaXTwitter,
          disabled: false
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

  function StatusButton({ status }) {

    const statusText = status === 'UP' ?
      'All systems operational' : 
      status === 'HASISSUES' ? 
        'Partial outage' :
        'Major outage';

    return (
      <Link
        className='flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-tertiary hover:bg-quaternary border border-primary hover:border-[rgba(var(--bg-secondary))] gap-x-3 text-secondary w-max ring-2 ring-[rgba(var(--bg-secondary))] transition-all hover:ring-purple-500 ring-offset-2 ring-offset-[rgba(var(--bg-secondary))]'
        href={config.instatus.baseUrl}
      >
        <span
          className={cn(
            'w-2.5 h-2.5 rounded-full animate-ping',
            status === 'UP' && 'bg-green-500',
            status === 'HASISSUES' && 'bg-yellow-500',
            status === 'DOWN' && 'bg-red-500'
          )}
        />

        <span
          className={cn(
            'w-2.5 h-2.5 rounded-full absolute',
            status === 'UP' && 'bg-green-500',
            status === 'HASISSUES' && 'bg-yellow-500',
            status === 'DOWN' && 'bg-red-500'
          )}
        />
  
        {statusText}
      </Link>
    );
  }

  return (
    <section className="flex flex-col 2xl:max-h-[800px] flex-wrap flex-1 w-full gap-16 px-6 py-16 mt-auto border-t 2xl:flex-row 2xl:gap-x-48 sm:px-24 xl:px-32 bg-secondary border-primary">
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

        {summary?.page?.status && (
          <StatusButton status={summary.page.status} />
        )}
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

      <div className='flex flex-col items-center justify-between w-full gap-4 -mt-8 sm:flex-row'>
        <p className='text-sm text-tertiary'>
          &copy; {new Date().getFullYear()} discord.place. All rights reserved.
        </p>

        <div className='flex flex-col items-end mt-4 gap-y-2'>
          <div className='gap-x-1 flex rounded-xl p-[3px] bg-quaternary dark:bg-background'>
            <button
              className={cn(
                'z-10 select-none justify-center relative flex items-center text-sm font-medium px-3 py-1',
                theme !== 'light' ? 'text-tertiary hover:text-secondary' : 'pointer-events-none'
              )}
              onClick={() => toggleTheme('light')}
            >
              <span className='relative z-10 flex items-center gap-x-1.5'>
                <MdSunny size={16} />
                Light
              </span>

              {theme === 'light' && (
                <motion.div
                  className='absolute w-full h-full rounded-xl bg-secondary dark:bg-quaternary'
                  layoutId='theme-switcher-button-background'
                />
              )}
            </button>

            <button
              className={cn(
                'z-10 select-none justify-center relative flex items-center text-sm font-semibold px-3 py-1',
                theme !== 'dark' ? 'text-tertiary hover:text-secondary' : 'pointer-events-none'
              )}
              onClick={() => toggleTheme('dark')}
            >
              <span className='flex items-center gap-x-1.5 z-10 relative'>
                <IoIosMoon size={16} />
                Dark
              </span>

              {theme === 'dark' && (
                <motion.div
                  className='absolute w-full h-full rounded-xl bg-secondary dark:bg-quaternary'
                  layoutId='theme-switcher-button-background'
                  transition={{ 
                    duration: 0.5,
                    type: 'spring',
                    stiffness: 300,
                    damping: 25
                  }}
                />
              )}
            </button>
          </div>

          <div className='gap-x-1 flex rounded-xl p-[3px] bg-quaternary dark:bg-background'>
            {config.availableLocales.map(locale => (
              <button
                key={locale.code}
                className={cn(
                  'select-none justify-center relative gap-x-1.5 flex items-center text-sm font-semibold px-3 py-1',
                  locale.code !== language ? 'text-tertiary hover:text-secondary' : 'pointer-events-none'
                )}
                onClick={() => setLanguage(locale.code)}
              >
                <span className='relative z-10 flex items-center gap-x-1.5'>
                  <Twemoji
                    options={{
                      className: 'w-4 h-4'
                    }}
                  >
                    {locale.flag}
                  </Twemoji>
                  
                  {locale.code.toUpperCase()}
                </span>

                {locale.code === language && (
                  <motion.div
                    className='absolute w-full h-full rounded-xl bg-secondary dark:bg-quaternary'
                    layoutId='language-switcher-button-background'
                    transition={{ 
                      duration: 0.5,
                      type: 'spring',
                      stiffness: 300,
                      damping: 25
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}