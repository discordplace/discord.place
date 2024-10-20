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
import { MdSunny } from 'react-icons/md';
import { motion } from 'framer-motion';
import { IoIosMoon } from 'react-icons/io';
import useLanguageStore, { t } from '@/stores/language';
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
          {t('footer.title')}
        </h2>

        <span className='text-sm text-secondary'>
          {t('footer.subtitle')}
        </span>

        <iframe
          src={`${config.statusBadgeUrl}?theme=${theme === 'dark' ? 'dark' : 'light'}`}
          width="250"
          height="30"
        />
      </div>

      <div className='grid grid-cols-1 mobile:grid-cols-2 lg:flex justify-between 2xl:w-[calc(100%_-_400px_-_12rem)] gap-8 sm:gap-16'>
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
                    <span className='px-2.5 py-0.5 text-xs font-bold bg-purple-500 rounded-full text-white'>
                      {t('footer.newBadge')}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className='lg:mt-24 w-full h-[1px] bg-[rgb(var(--border-primary))]' />

      <div className='flex flex-col items-center justify-between w-full gap-4 -mt-8 lg:flex-row'>
        <div className='flex flex-col items-center lg:items-start gap-y-4'>
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
              width={100}
              height={25}
              alt='nodesty.com Logo'
            />
          </Link>
        </div>

        <div className='flex flex-col items-center mt-4 lg:items-end gap-y-2'>
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
                {t('footer.theme.light')}
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
                {t('footer.theme.dark')}
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

          <div className='gap-1 justify-center lg:justify-end flex rounded-xl p-[3px] flex-wrap lg:bg-quaternary lg:dark:bg-background'>
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
                  
                  {t(`footer.language.${locale.code}`)}
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