'use client';

import { FaDiscord, FaGithub } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { IoIosMoon } from 'react-icons/io';
import { MdSunny } from 'react-icons/md';
import useThemeStore from '@/stores/theme';
import Link from 'next/link';
import cn from '@/lib/cn';
import Image from 'next/image';
import config from '@/config';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import Select from '@/app/components/Select';
import StatusBadge from '@/app/components/Footer/StatusBadge';

export default function Footer() {
  const { t, i18n } = useTranslation();
  const theme = useThemeStore(state => state.theme);
  const setTheme = useThemeStore(state => state.setTheme);
  const pathname = usePathname();

  const isDashboard = pathname === '/dashboard';
  const isTemplatePreview = pathname.startsWith('/templates/') && pathname.endsWith('/preview');
  const isAccount = pathname === '/account';

  if (isDashboard || isTemplatePreview || isAccount) return null;

  return (
    <div
      className='relative mt-24 w-full lg:rounded-t-4xl lg:bg-secondary lg:p-10'
      id='footer'
    >
      <div className='mx-auto h-full max-w-[1000px] overflow-hidden rounded-3xl bg-background p-8 shadow-lg shadow-black/5 lg:p-16 dark:shadow-black/30'>
        <div className='flex flex-col justify-between max-sm:items-center sm:flex-row'>
          <div className='flex w-full flex-1 flex-col gap-y-8'>
            <div className='flex items-center gap-x-4'>
              <Image
                src={theme === 'dark' ? '/symbol_white.png' : '/symbol_black.png'}
                width={32}
                height={32}
                className='size-[32px]'
                alt='discord.place Logo'
                priority={true}
              />

              <span className='flex items-center text-lg font-medium'>
                discord.place
              </span>
            </div>

            <div className='flex flex-col gap-y-2'>
              <span className='text-xs font-medium text-secondary'>
                {t('footer.description')}
              </span>

              <p className='text-[10px] text-tertiary'>
                {t('footer.disclaimer')}
              </p>
            </div>

            <div className='flex flex-wrap items-center gap-4'>
              <Link
                href='https://nodesty.com'
                target='_blank'
                className='w-max'
              >
                <Image
                  src={theme === 'dark' ? '/nodesty-logo-white.png' : '/nodesty-logo-blue.png'}
                  className='h-[18px] w-auto'
                  width={100}
                  height={25}
                  alt='nodesty.com Logo'
                />
              </Link>

              <Link
                href='https://x.com/discord_place'
                className='text-xs text-secondary hover:text-primary'
              >
                <FaXTwitter size={20} />
              </Link>

              <Link
                href='https://invite.discord.place'
                className='text-xs text-secondary hover:text-primary'
              >
                <FaDiscord size={20} />
              </Link>

              <Link
                href='https://github.com/discordplace'
                className='text-xs text-secondary hover:text-primary'
              >
                <FaGithub size={20} />
              </Link>

              <StatusBadge />
            </div>
          </div>

          <div className='flex w-full flex-1 items-center justify-between sm:justify-end'>
            <div className='mt-[calc(2rem_+_32px)] flex w-full max-w-[250px] justify-between'>
              <div className='flex flex-col gap-y-2'>
                <span className='text-xs font-medium text-secondary'>
                  {t('footer.pages.title')}
                </span>

                <div className='flex flex-col gap-y-1'>
                  <Link
                    href='/'
                    className='text-[10px] text-tertiary hover:text-primary'
                  >
                    {t('footer.pages.home')}
                  </Link>

                  <Link
                    href={config.docsUrl}
                    target='_blank'
                    className='text-[10px] text-tertiary hover:text-primary'
                  >
                    {t('footer.pages.apiDocumentation')}
                  </Link>

                  <Link
                    href='/premium'
                    target='_blank'
                    className='text-[10px] text-tertiary hover:text-primary'
                  >
                    {t('footer.pages.premium')}
                  </Link>

                  <Link
                    href='/blogs'
                    target='_blank'
                    className='text-[10px] text-tertiary hover:text-primary'
                  >
                    {t('footer.pages.blogs')}
                  </Link>
                </div>
              </div>

              <div className='flex flex-col gap-y-2'>
                <span className='text-xs font-medium text-secondary'>
                  {t('footer.legal.title')}
                </span>

                <div className='flex flex-col gap-y-1'>
                  <Link
                    href='/legal/privacy'
                    className='text-[10px] text-tertiary hover:text-primary'
                  >
                    {t('footer.legal.privacy')}
                  </Link>

                  <Link
                    href='/legal/terms'
                    className='text-[10px] text-tertiary hover:text-primary'
                  >
                    {t('footer.legal.terms')}
                  </Link>

                  <Link
                    href='/legal/cookie-policy'
                    className='text-[10px] text-tertiary hover:text-primary'
                  >
                    {t('footer.legal.cookie')}
                  </Link>

                  <Link
                    href='/legal/content-policy'
                    className='text-[10px] text-tertiary hover:text-primary'
                  >
                    {t('footer.legal.content')}
                  </Link>

                  <Link
                    href='/legal/purchase-policy'
                    className='text-[10px] text-tertiary hover:text-primary'
                  >
                    {t('footer.legal.purchase')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='my-8 h-px w-full bg-tertiary' />

        <div className='flex flex-wrap items-center justify-between max-sm:gap-4'>
          <div className='text-xs text-tertiary'>
            {t('footer.copyRight', { year: new Date().getFullYear() })}
          </div>

          <div className='flex items-center gap-x-2'>
            <div className='flex gap-x-1 rounded-xl bg-secondary p-[3px]'>
              <button
                className={cn(
                  'relative z-10 flex items-center justify-center px-2 py-1 text-xs font-medium select-none',
                  theme !== 'light' ? 'text-tertiary hover:text-secondary' : 'pointer-events-none'
                )}
                onClick={() => {
                  if (!document.startViewTransition) return setTheme('light');

                  document.startViewTransition(() => setTheme('light'));
                }}
              >
                <span className='relative z-10 flex items-center gap-x-1.5'>
                  <MdSunny size={12} />
                  {t('footer.theme.light')}
                </span>

                {theme === 'light' && (
                  <div className='absolute size-full rounded-lg bg-quaternary' />
                )}
              </button>

              <button
                className={cn(
                  'relative z-10 flex items-center justify-center px-2 py-1 text-xs font-medium select-none',
                  theme !== 'dark' ? 'text-tertiary hover:text-secondary' : 'pointer-events-none'
                )}
                onClick={() => {
                  if (!document.startViewTransition) return setTheme('dark');

                  document.startViewTransition(() => setTheme('dark'));
                }}
              >
                <span className='relative z-10 flex items-center gap-x-1.5'>
                  <IoIosMoon size={12} />
                  {t('footer.theme.dark')}
                </span>

                {theme === 'dark' && (
                  <div className='absolute size-full rounded-lg bg-quaternary' />
                )}
              </button>
            </div>

            <Select
              triggerClassName='w-max border py-2 bg-background hover:bg-quaternary'
              itemContainerClassName='py-2'
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
              value={i18n.language}
              onChange={value => i18n.changeLanguage(value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}