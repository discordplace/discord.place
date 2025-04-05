'use client';

import { RiBrush2Fill, RiRobot2Fill, PiWaveformBold, MdEmojiEmotions, HiUserGroup, HiTemplate, FaCompass, FaQuestion } from '@/icons';
import cn from '@/lib/cn';
import useGeneralStore from '@/stores/general';
import { t } from '@/stores/language';
import Link from 'next/link';

export default function ServicesDropdown() {
  const setHoveringHeaderTab = useGeneralStore(state => state.header.setHoveringHeaderTab);
  const setLastMouseOut = useGeneralStore(state => state.header.setLastMouseOut);

  const links = [
    {
      name: t('header.servicesDropdownLinks.0'),
      description: t('profilesPage.subtitle', { count: 0 }),
      href: '/profiles',
      icon: HiUserGroup
    },
    {
      name: t('header.servicesDropdownLinks.1'),
      description: t('serversPage.subtitle'),
      href: '/servers',
      icon: FaCompass
    },
    {
      name: t('header.servicesDropdownLinks.2'),
      description: t('botsPage.subtitle'),
      href: '/bots',
      icon: RiRobot2Fill
    },
    {
      name: t('header.servicesDropdownLinks.3'),
      description: t('emojisPage.subtitle', { count: 0 }),
      href: '/emojis',
      icon: MdEmojiEmotions
    },
    {
      name: t('header.servicesDropdownLinks.4'),
      description: t('templatesPage.subtitle'),
      href: '/templates',
      icon: HiTemplate
    },
    {
      name: t('header.servicesDropdownLinks.5'),
      description: t('soundsPage.subtitle'),
      href: '/sounds',
      icon: PiWaveformBold
    },
    {
      name: t('header.servicesDropdownLinks.6'),
      description: t('themesPage.subtitle'),
      href: '/themes',
      icon: RiBrush2Fill
    },
    {
      name: t('header.servicesDropdownLinks.7'),
      description: t('header.upcomingServiceDescription'),
      icon: function QuestionMarks() {
        return (
          <div className='flex -space-x-1 text-sm'>
            <FaQuestion className='relative top-[3px] rotate-[-10deg]' />
            <FaQuestion />
            <FaQuestion className='relative top-[3px] rotate-[10deg]' />
          </div>
        );
      }
    }
  ];

  return (
    <div className='relative grid h-max max-w-[500px] grid-cols-2'>
      {links.map((link, index) => {
        const Container = link.href ? Link : 'div';

        return (
          <Container
            key={index}
            href={link.href}
            onClick={() => {
              setHoveringHeaderTab('');
              setLastMouseOut(Date.now());
            }}
            className={cn(
              !link.href && 'pointer-events-none opacity-70',
              links.length % 2 === 1 && index === links.length - 1 ? 'col-span-2' : 'col-span-1'
            )}
          >
            <div className='group flex items-center gap-x-3 rounded-xl px-4 py-2 hover:bg-tertiary'>
              <div className={cn(
                'flex size-[40px] shrink-0 items-center justify-center rounded-lg text-lg',
                link.href ? 'bg-quaternary text-primary' : 'text-white bg-purple-700'
              )}>
                <link.icon className='transition-all group-hover:scale-110' />
              </div>

              <div className='flex flex-col'>
                <h1 className='text-sm font-semibold text-secondary group-hover:text-primary'>{link.name}</h1>
                <p className='line-clamp-2 overflow-hidden whitespace-pre-wrap text-xs font-medium text-tertiary group-hover:text-secondary'>{link.description}</p>
              </div>
            </div>
          </Container>
        );
      })}
    </div>
  );
}