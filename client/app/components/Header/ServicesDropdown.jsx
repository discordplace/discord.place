'use client';

import cn from '@/lib/cn';
import useGeneralStore from '@/stores/general';
import { t } from '@/stores/language';
import Link from 'next/link';
import { FaCompass } from 'react-icons/fa';
import { HiTemplate } from 'react-icons/hi';
import { HiUserGroup } from 'react-icons/hi2';
import { MdEmojiEmotions } from 'react-icons/md';
import { PiWaveformBold } from 'react-icons/pi';
import { RiBrush2Fill, RiRobot2Fill } from 'react-icons/ri';

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
    }
  ];

  return (
    <div className="grid grid-cols-2 max-w-[500px] h-max relative">
      {links.map((link, index) => (
        <Link
          key={index}
          href={link.href}
          onClick={() => {
            setHoveringHeaderTab('');
            setLastMouseOut(Date.now());
          }}
          className={cn(
            links.length % 2 === 1 && index === links.length - 1 ? 'col-span-2' : 'col-span-1'
          )}
        >
          <div className="flex items-center px-4 py-2 cursor-pointer gap-x-3 group hover:bg-tertiary rounded-xl">
            <div className="flex items-center justify-center flex-shrink-0 rounded-lg w-[40px] h-[40px] text-lg text-primary bg-quaternary">
              <link.icon className='transition-all group-hover:scale-110' />
            </div>

            <div className="flex flex-col">
              <h1 className="text-sm font-semibold text-secondary group-hover:text-primary">{link.name}</h1>
              <p className="overflow-hidden text-xs font-medium whitespace-pre-wrap group-hover:text-secondary text-tertiary line-clamp-2">{link.description}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}