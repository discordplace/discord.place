'use client';

import { TiStarFullOutline, TbSquareRoundedChevronUp, RiSlashCommands2, RiUserAddLine, PiGitForkBold, FaCompass, FaGithub } from '@/icons';
import { motion } from 'framer-motion';
import Markdown from '@/app/components/Markdown';
import Image from 'next/image';
import Link from 'next/link';
import cn from '@/lib/cn';
import { useMedia } from 'react-use';
import useLanguageStore, { t } from '@/stores/language';
import UserAvatar from '@/app/components/ImageFromHash/UserAvatar';

const formatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  compactDisplay: 'short'
});

const serversFormatter = new Intl.NumberFormat('en-US', {
  style: 'decimal',
  notation: 'compact',
  maximumFractionDigits: 2
});

export default function About({ bot }) {
  const language = useLanguageStore(state => state.language);

  const keys = [
    {
      key: 'owner',
      label: t('botPage.about.labels.owner'),
      icon: <RiUserAddLine />,
      component: (
        <Link
          className='flex items-center gap-x-2 transition-opacity hover:opacity-50'
          href={`/profile/u/${bot.owner.id}`}
        >
          <span className='truncate font-medium'>
            @{bot.owner.username}
          </span>

          <UserAvatar
            id={bot.owner.id}
            hash={bot.owner.avatar}
            size={16}
            width={16}
            height={16}
            className='size-[16px] rounded-full'
          />
        </Link>
      )
    },
    {
      key: 'servers',
      label: t('botPage.about.labels.servers'),
      icon: <FaCompass />,
      component: (
        <>
          {serversFormatter.format(bot.servers)} <span className='opacity-50'>(Updated at {new Date(bot.servers_updated_at).toLocaleDateString(language, { year: 'numeric', month: 'short', day: 'numeric' })})</span>
        </>
      )
    },
    {
      key: 'votes',
      label: t('botPage.about.labels.votes'),
      icon: <TbSquareRoundedChevronUp />,
      value: formatter.format(bot.votes)
    },
    {
      key: 'commands',
      label: t('botPage.about.labels.commands'),
      icon: <RiSlashCommands2 />,
      component: (
        <>
          {formatter.format(bot.commands)} <span className='opacity-50'>(Updated at {new Date().toLocaleDateString(language, { year: 'numeric', month: 'short', day: 'numeric' })})</span>
        </>
      )
    }
  ];

  const isMobile = useMedia('(max-width: 640px)', false);

  if (bot.github_repository?.data) keys.push({
    key: 'GitHub Repository',
    label: t('botPage.about.labels.githubRepository.label'),
    icon: <FaGithub />,
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
        target='_blank'
        rel='noopener noreferrer'
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
                src={bot.github_repository.data.owner.avatar_url}
                alt={`${bot.github_repository.data.owner.login}'s avatar`}
                width={16}
                height={16}
                className='mr-2 rounded-full'
                // Unoptimized because owner avatar urls is not ends with extensions like .png or .jpg
                // and Next.js /_next/image route will not be able to optimize it
                unoptimized={true}
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
    </>
  });

  return (
    <div className='flex w-full flex-col lg:w-[70%]'>
      <motion.h2
        className='text-xl font-semibold'
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10 }}
      >
        {t('botPage.about.title')}
      </motion.h2>

      <motion.p className='mt-2 whitespace-pre-wrap text-tertiary'
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10, delay: 0.15 }}
      >
        {bot.short_description}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10, delay: 0.3 }}
      >
        <Markdown className='mt-8'>
          {bot.description}
        </Markdown>
      </motion.div>

      <motion.div
        className='mt-8 grid h-max grid-cols-1 gap-8 rounded-xl bg-secondary p-4 py-8 sm:grid-cols-2'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10, delay: 0.35 }}
      >
        {keys.map(({ key, label, icon, value, component }, index) => (
          <motion.div
            key={key}
            className={cn(
              'flex w-full items-start h-max gap-x-4',
              index === keys.length - 1 && index % 2 === 0 && 'sm:col-span-2'
            )}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10, delay: 0.20 + (.05 * index) }}
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