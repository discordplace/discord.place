'use client';

import config from '@/config';
import cn from '@/lib/cn';
import useLanguageStore, { t } from '@/stores/language';
import useThemeStore from '@/stores/theme';
import { motion } from 'framer-motion';
import { nanoid } from 'nanoid';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaDiscord, FaGithub, FaLinkedin } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { IoIosMoon } from 'react-icons/io';
import { MdSunny } from 'react-icons/md';
import Twemoji from 'react-twemoji';

export default function Footer() {
  const theme = useThemeStore(state => state.theme);
  const toggleTheme = useThemeStore(state => state.toggleTheme);
  const language = useLanguageStore(state => state.language);
  const setLanguage = useLanguageStore(state => state.setLanguage);

  const pathname = usePathname();

  const isDashboard = pathname === '/dashboard';
  const isTemplatePreview = pathname.startsWith('/templates/') && pathname.endsWith('/preview');
  const isAccount = pathname === '/account';

  if (isDashboard || isTemplatePreview || isAccount) return null;

  const blocks = [
    {
      links: [
        {
          href: '/',
          label: t('footer.blocks.0.links.0')
        },
        {
          href: config.docsUrl,
          label: t('footer.blocks.0.links.1'),
          target: '_blank'
        },
        {
          href: config.statusUrl,
          label: t('footer.blocks.0.links.2'),
          target: '_blank'
        },
        {
          href: '/premium',
          label: t('footer.blocks.0.links.3')
        },
        {
          href: '/blogs',
          label: t('footer.blocks.0.links.4')
        }
      ],
      title: t('footer.blocks.0.title') // Pages
    },
    {
      links: [
        {
          href: '/profiles',
          label: t('footer.blocks.1.links.0')
        },
        {
          href: '/servers',
          label: t('footer.blocks.1.links.1')
        },
        {
          href: '/bots',
          label: t('footer.blocks.1.links.2')
        },
        {
          href: '/emojis',
          label: t('footer.blocks.1.links.3')
        },
        {
          href: '/templates',
          label: t('footer.blocks.1.links.4')
        },
        {
          href: '/sounds',
          label: t('footer.blocks.1.links.5')
        },
        {
          href: '/themes',
          label: t('footer.blocks.1.links.6'),
          new: true
        },
        {
          href: 'https://github.com/discordplace/lantern',
          label: 'Lantern'
        }
      ],
      title: t('footer.blocks.1.title') // Our Services
    },
    {
      links: [
        {
          href: '/legal/privacy',
          label: t('footer.blocks.2.links.0')
        },
        {
          href: '/legal/terms',
          label: t('footer.blocks.2.links.1')
        },
        {
          href: '/legal/cookie-policy',
          label: t('footer.blocks.2.links.2')
        },
        {
          href: '/legal/content-policy',
          label: t('footer.blocks.2.links.3')
        },
        {
          href: '/legal/purchase-policy',
          label: t('footer.blocks.2.links.4')
        }
      ],
      title: t('footer.blocks.2.title') // Legal
    },
    {
      links: [
        {
          disabled: false,
          href: 'https://x.com/discord_place',
          icon: FaXTwitter,
          label: 'X',
          target: '_blank'
        },
        {
          href: 'https://invite.discord.place',
          icon: FaDiscord,
          label: 'Discord',
          target: '_blank'
        },
        {
          href: 'https://github.com/discordplace',
          icon: FaGithub,
          label: 'GitHub',
          target: '_blank'
        },
        {
          disabled: true,
          href: '#',
          icon: FaLinkedin,
          label: 'LinkedIn',
          target: '_blank'
        }
      ],
      title: t('footer.blocks.3.title') // Social
    }
  ];

  return (
    <section className='mt-auto flex w-full flex-1 flex-col flex-wrap gap-16 border-t border-primary bg-secondary px-6 py-16 sm:px-24 xl:px-32 2xl:max-h-[800px] 2xl:flex-row 2xl:gap-x-48'>
      <div className='flex w-full max-w-[400px] flex-col gap-y-6'>
        <Image
          alt='discord.placeLogo'
          className='size-[48px]'
          height={200}
          src={theme === 'dark' ? '/symbol_white.png' : '/symbol_black.png'}
          width={200}
        />

        <h2 className='max-w-[350px] text-2xl font-bold text-primary'>
          {t('footer.title')}
        </h2>

        <span className='text-sm text-secondary'>
          {t('footer.subtitle')}
        </span>

        <iframe
          height='30'
          src={`${config.statusBadgeUrl}?theme=${theme === 'dark' ? 'dark' : 'light'}`}
          width='250'
        />
      </div>

      <div className='grid grid-cols-1 justify-between gap-8 mobile:grid-cols-2 sm:gap-16 lg:flex 2xl:w-[calc(100%_-_400px_-_12rem)]'>
        {blocks.map(block => (
          <div className='flex flex-col gap-y-6' key={nanoid()}>
            <h2 className='text-sm font-medium text-tertiary'>
              {block.title}
            </h2>

            <div className='flex flex-col gap-y-4'>
              {block.links.map(link => (
                <Link
                  className={cn(
                    'flex items-center gap-x-2 text-secondary w-max',
                    link.disabled ? 'pointer-events-none opacity-70' : 'hover:text-primary'
                  )}
                  href={link.href}
                  key={nanoid()}
                  target={link.target || '_self'}
                >
                  {link.icon && <link.icon />}
                  {link.label}

                  {link.new && (
                    <span className='rounded-full bg-purple-500 px-2.5 py-0.5 text-xs font-bold text-white'>
                      {t('footer.newBadge')}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className='h-px w-full bg-[rgb(var(--border-primary))] lg:mt-24' />

      <div className='-mt-8 flex w-full flex-col items-center justify-between gap-4 lg:flex-row'>
        <div className='flex flex-col items-center gap-y-4 lg:items-start'>
          <p className='text-sm text-tertiary'>
            &copy; {t('footer.copyRight', { year: new Date().getFullYear() })}
          </p>

          <Link
            className='w-max'
            href='https://nodesty.com'
            target='_blank'
          >
            <Image
              alt='nodesty.com Logo'
              height={25}
              src={theme === 'dark' ? '/nodesty-logo-white.png' : '/nodesty-logo-blue.png'}
              width={100}
            />
          </Link>
        </div>

        <div className='mt-4 flex flex-col items-center gap-y-2 lg:items-end'>
          <div className='flex gap-x-1 rounded-xl bg-quaternary p-[3px] dark:bg-background'>
            <button
              className={cn(
                'z-10 select-none justify-center relative flex items-center text-sm font-medium px-3 py-1',
                theme !== 'light' ? 'text-tertiary hover:text-secondary' : 'pointer-events-none'
              )}
              onClick={() => toggleTheme('light')}
            >
              <span className='relative z-10 flex items-center gap-x-1.5'>
                <MdSunny size={16} />
                {t('footer.theme.light')}
              </span>

              {theme === 'light' && (
                <motion.div
                  className='absolute size-full rounded-xl bg-secondary dark:bg-quaternary'
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
              <span className='relative z-10 flex items-center gap-x-1.5'>
                <IoIosMoon size={16} />
                {t('footer.theme.dark')}
              </span>

              {theme === 'dark' && (
                <motion.div
                  className='absolute size-full rounded-xl bg-secondary dark:bg-quaternary'
                  layoutId='theme-switcher-button-background'
                  transition={{
                    damping: 25,
                    duration: 0.5,
                    stiffness: 300,
                    type: 'spring'
                  }}
                />
              )}
            </button>
          </div>

          <div className='flex flex-wrap justify-center gap-1 rounded-xl p-[3px] lg:justify-end lg:bg-quaternary lg:dark:bg-background'>
            {config.availableLocales.map(locale => (
              <button
                className={cn(
                  'select-none justify-center relative gap-x-1.5 flex items-center text-sm font-semibold px-3 py-1',
                  locale.code !== language ? 'text-tertiary hover:text-secondary' : 'pointer-events-none'
                )}
                key={locale.code}
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

                  {t(`footer.language.${locale.code}`)}
                </span>

                {locale.code === language && (
                  <motion.div
                    className='absolute size-full rounded-xl bg-secondary dark:bg-quaternary'
                    layoutId='language-switcher-button-background'
                    transition={{
                      damping: 25,
                      duration: 0.5,
                      stiffness: 300,
                      type: 'spring'
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