'use client';

import { MdSunny, IoIosMoon, FaXTwitter, FaDiscord, FaGithub, FaLinkedin } from '@/icons';
import useThemeStore from '@/stores/theme';
import { nanoid } from 'nanoid';
import Link from 'next/link';
import cn from '@/lib/cn';
import Image from 'next/image';
import config from '@/config';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import useLanguageStore, { t } from '@/stores/language';
import Select from '@/app/components/Select';

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
      title: t('footer.blocks.0.title'), // Pages
      links: [
        {
          label: t('footer.blocks.0.links.0'),
          href: '/'
        },
        {
          label: t('footer.blocks.0.links.1'),
          href: config.docsUrl,
          target: '_blank'
        },
        {
          label: t('footer.blocks.0.links.2'),
          href: config.statusUrl,
          target: '_blank'
        },
        {
          label: t('footer.blocks.0.links.3'),
          href: '/premium'
        },
        {
          label: t('footer.blocks.0.links.4'),
          href: '/blogs'
        }
      ]
    },
    {
      title: t('footer.blocks.1.title'), // Our Services
      links: [
        {
          label: t('footer.blocks.1.links.0'),
          href: '/profiles'
        },
        {
          label: t('footer.blocks.1.links.1'),
          href: '/servers'
        },
        {
          label: t('footer.blocks.1.links.2'),
          href: '/bots'
        },
        {
          label: t('footer.blocks.1.links.3'),
          href: '/emojis'
        },
        {
          label: t('footer.blocks.1.links.4'),
          href: '/templates'
        },
        {
          label: t('footer.blocks.1.links.5'),
          href: '/sounds'
        },
        {
          label: t('footer.blocks.1.links.6'),
          href: '/themes',
          new: true
        },
        {
          label: 'Lantern',
          href: 'https://github.com/discordplace/lantern'
        }
      ]
    },
    {
      title: t('footer.blocks.2.title'), // Legal
      links: [
        {
          label: t('footer.blocks.2.links.0'),
          href: '/legal/privacy'
        },
        {
          label: t('footer.blocks.2.links.1'),
          href: '/legal/terms'
        },
        {
          label: t('footer.blocks.2.links.2'),
          href: '/legal/cookie-policy'
        },
        {
          label: t('footer.blocks.2.links.3'),
          href: '/legal/content-policy'
        },
        {
          label: t('footer.blocks.2.links.4'),
          href: '/legal/purchase-policy'
        }
      ]
    },
    {
      title: t('footer.blocks.3.title'), // Social
      links: [
        {
          label: 'X',
          href: 'https://x.com/discord_place',
          icon: FaXTwitter,
          disabled: false,
          target: '_blank'
        },
        {
          label: 'Discord',
          href: 'https://invite.discord.place',
          icon: FaDiscord,
          target: '_blank'
        },
        {
          label: 'GitHub',
          href: 'https://github.com/discordplace',
          icon: FaGithub,
          target: '_blank'
        },
        {
          label: 'LinkedIn',
          href: '#',
          icon: FaLinkedin,
          disabled: true,
          target: '_blank'
        }
      ]
    }
  ];

  return (
    <section
      className='mt-auto flex w-full flex-1 flex-col flex-wrap gap-16 border-t border-primary bg-secondary px-6 py-16 sm:px-24 xl:px-32 2xl:max-h-[800px] 2xl:flex-row 2xl:gap-x-48'
      id='footer'
    >
      <div className='flex w-full max-w-[400px] flex-col gap-y-6'>
        <Image
          src={theme === 'dark' ? '/symbol_white.png' : '/symbol_black.png'}
          width={200}
          height={200}
          className='size-[48px]'
          alt='discord.place Logo'
        />

        <h2 className='max-w-[350px] text-2xl font-bold text-primary'>
          {t('footer.title')}
        </h2>

        <span className='text-sm text-secondary'>
          {t('footer.subtitle')}
        </span>

        <iframe
          src={`${config.statusBadgeUrl}?theme=${theme === 'dark' ? 'dark' : 'light'}`}
          width='250'
          height='30'
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
                  key={nanoid()}
                  href={link.href}
                  className={cn(
                    'flex items-center gap-x-2 text-secondary w-max',
                    link.disabled ? 'pointer-events-none opacity-70' : 'hover:text-primary'
                  )}
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
            href='https://nodesty.com'
            target='_blank'
            className='w-max'
          >
            <Image
              src={theme === 'dark' ? '/nodesty-logo-white.png' : '/nodesty-logo-blue.png'}
              className='h-[25px] w-auto max-w-[100px]'
              width={100}
              height={25}
              alt='nodesty.com Logo'
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
                    duration: 0.5,
                    type: 'spring',
                    stiffness: 300,
                    damping: 25
                  }}
                />
              )}
            </button>
          </div>

          <Select
            triggerClassName='w-max bg-background py-1.5 hover:bg-quaternary'
            itemContainerClassName='py-2'
            position='popper'
            sideOffset={10}
            options={config.availableLocales.map(locale => ({
              label: (
                <div
                  key={locale.code}
                  className='flex items-center gap-x-2 text-sm'
                >
                  <Image
                    src={`https://hatscripts.github.io/circle-flags/flags/${locale.countryCode}.svg`}
                    width={20}
                    height={20}
                    className='size-4'
                    alt={`Flag of ${locale.countryCode}`}
                  />

                  {t(`footer.language.${locale.code}`)}
                </div>
              ),
              value: locale.code
            }))}
            value={language}
            onChange={setLanguage}
          />
        </div>
      </div>
    </section>
  );
}