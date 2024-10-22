'use client';

import UserAvatar from '@/app/components/ImageFromHash/UserAvatar';
import Markdown from '@/app/components/Markdown';
import cn from '@/lib/cn';
import useLanguageStore, { t } from '@/stores/language';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FaCompass, FaGithub } from 'react-icons/fa';
import { PiGitForkBold } from 'react-icons/pi';
import { RiSlashCommands2, RiUserAddLine } from 'react-icons/ri';
import { TbSquareRoundedChevronUp } from 'react-icons/tb';
import { TiStarFullOutline } from 'react-icons/ti';
import { useMedia } from 'react-use';

const formatter = new Intl.NumberFormat('en-US', {
  compactDisplay: 'short',
  notation: 'compact'
});

const serversFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
  notation: 'compact',
  style: 'decimal'
});

export default function About({ bot }) {
  const language = useLanguageStore(state => state.language);

  const keys = [
    {
      component: (
        <Link
          className='flex items-center gap-x-2 transition-opacity hover:opacity-50'
          href={`/profile/u/${bot.owner.id}`}
        >
          <span className='truncate font-medium'>
            @{bot.owner.username}
          </span>

          <UserAvatar
            className='size-[16px] rounded-full'
            hash={bot.owner.avatar}
            height={16}
            id={bot.owner.id}
            size={16}
            width={16}
          />
        </Link>
      ),
      icon: <RiUserAddLine />,
      key: 'owner',
      label: t('botPage.about.labels.owner')
    },
    {
      component: (
        <>
          {serversFormatter.format(bot.servers)} <span className='opacity-50'>(Updated at {new Date(bot.servers_updated_at).toLocaleDateString(language, { day: 'numeric', month: 'short', year: 'numeric' })})</span>
        </>
      ),
      icon: <FaCompass />,
      key: 'servers',
      label: t('botPage.about.labels.servers')
    },
    {
      icon: <TbSquareRoundedChevronUp />,
      key: 'votes',
      label: t('botPage.about.labels.votes'),
      value: formatter.format(bot.votes)
    },
    {
      component: (
        <>
          {formatter.format(bot.commands)} <span className='opacity-50'>(Updated at {new Date().toLocaleDateString(language, { day: 'numeric', month: 'short', year: 'numeric' })})</span>
        </>
      ),
      icon: <RiSlashCommands2 />,
      key: 'commands',
      label: t('botPage.about.labels.commands')
    }
  ];

  const isMobile = useMedia('(max-width: 640px)', false);

  if (bot.github_repository?.data) keys.push({
    component: <>
      {isMobile ? (
        <Link
          className='text-tertiary underline hover:text-primary'
          href={bot.github_repository.data.html_url}
        >
          {t('botPage.about.labels.githubRepository.openSourceDisclaimer')}
        </Link>
      ) : (
        <p className='text-tertiary'>
          {t('botPage.about.labels.githubRepository.openSourceDisclaimer')}
        </p>
      )}

      <Link
        className='mt-6 hidden h-max max-w-[90%] cursor-pointer flex-col gap-y-3 rounded-lg border-2 border-primary bg-tertiary p-4 hover:bg-quaternary sm:flex'
        href={bot.github_repository.data.html_url}
        rel='noopener noreferrer'
        target='_blank'
      >
        {bot.github_repository.data.language && (
          <span className='w-max select-none rounded-full border border-black/40 bg-black/20 px-2 py-0.5 text-xs font-medium text-primary dark:border-white/40 dark:bg-white/20'>
            {bot.github_repository.data.language}
          </span>
        )}

        <div className='flex items-center text-secondary'>
          {bot.github_repository.data.owner.avatar_url && (
            <>
              <Image
                alt={`${bot.github_repository.data.owner.login}'s avatar`}
                className='mr-2 rounded-full'
                height={16}
                src={bot.github_repository.data.owner.avatar_url}
                width={16}
              />
              {' '}
            </>
          )}
          {bot.github_repository.data.owner.login}/

          <span className='truncate font-semibold text-primary'>
            {bot.github_repository.data.name}
          </span>
        </div>

        <p className='-mt-2 line-clamp-3 whitespace-pre-wrap text-xs text-tertiary'>
          {bot.github_repository.data.description}
        </p>

        <div className='flex items-center gap-x-2 text-tertiary'>
          <div className='flex items-center gap-x-1.5 text-sm font-medium text-tertiary'>
            <TiStarFullOutline />
            {formatter.format(bot.github_repository.data.stargazers_count)}
          </div>

          <div className='flex items-center gap-x-1.5 text-sm font-medium text-tertiary'>
            <PiGitForkBold />
            {formatter.format(bot.github_repository.data.forks_count)}
          </div>
        </div>
      </Link>
    </>,
    icon: <FaGithub />,
    key: 'GitHub Repository',
    label: t('botPage.about.labels.githubRepository.label')
  });

  return (
    <div className='flex w-full flex-col lg:w-[70%]'>
      <motion.h2
        animate={{ opacity: 1, y: 0 }}
        className='text-xl font-semibold'
        initial={{ opacity: 0, y: -10 }}
        transition={{ damping: 10, duration: 0.3, stiffness: 100, type: 'spring' }}
      >
        {t('botPage.about.title')}
      </motion.h2>

      <motion.p animate={{ opacity: 1, y: 0 }}
        className='mt-2 whitespace-pre-wrap text-tertiary'
        initial={{ opacity: 0, y: -10 }}
        transition={{ damping: 10, delay: 0.15, duration: 0.3, stiffness: 100, type: 'spring' }}
      >
        {bot.short_description}
      </motion.p>

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -10 }}
        transition={{ damping: 10, delay: 0.3, duration: 0.3, stiffness: 100, type: 'spring' }}
      >
        <Markdown className='mt-8'>
          {bot.description}
        </Markdown>
      </motion.div>

      <motion.div
        animate={{ opacity: 1 }}
        className='mt-8 grid h-max grid-cols-1 gap-8 rounded-xl bg-secondary p-4 py-8 sm:grid-cols-2'
        initial={{ opacity: 0 }}
        transition={{ damping: 10, delay: 0.35, duration: 0.3, stiffness: 100, type: 'spring' }}
      >
        {keys.map(({ component, icon, key, label, value }, index) => (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'flex w-full items-start h-max gap-x-4',
              index === keys.length - 1 && index % 2 === 0 && 'sm:col-span-2'
            )}
            initial={{ opacity: 0, y: -10 }}
            key={key}
            transition={{ damping: 10, delay: 0.20 + (.05 * index), duration: 0.3, stiffness: 100, type: 'spring' }}
          >
            <div className='rounded-full bg-tertiary p-3 text-secondary'>
              {icon}
            </div>

            <div className='flex w-full flex-col'>
              <h3 className='font-semibold'>
                {label}
              </h3>

              <span className='text-sm text-tertiary'>
                {value || component}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}