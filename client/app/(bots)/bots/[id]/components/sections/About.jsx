import { motion } from 'framer-motion';
import { TbSquareRoundedChevronUp } from 'react-icons/tb';
import { FaCompass, FaGithub } from 'react-icons/fa';
import { TiStarFullOutline } from 'react-icons/ti';
import Markdown from '@/app/components/Markdown';
import { RiSlashCommands2, RiUserAddLine } from 'react-icons/ri';
import Image from 'next/image';
import Link from 'next/link';
import cn from '@/lib/cn';
import { PiGitForkBold } from 'react-icons/pi';
import { useMedia } from 'react-use';

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
  const keys = [
    {
      key: 'owner',
      label: 'Owner',
      icon: <RiUserAddLine />,
      component: (
        <Link 
          className='flex items-center transition-opacity gap-x-2 hover:opacity-50'
          href={`/profile/u/${bot.owner.id}`}
        >
          <span className='font-medium truncate'>
            @{bot.owner.username}
          </span>

          <Image
            src={bot.owner.avatar_url}
            alt={`${bot.owner.username}'s avatar`}
            width={16}
            height={16}
            className='rounded-full w-[16px] h-[16px]'
          />
        </Link>
      )
    },
    {
      key: 'servers',
      label: 'Total Servers',
      icon: <FaCompass />,
      component: (
        <>
          {serversFormatter.format(bot.servers)} <span className='opacity-50'>(Updated at {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })})</span>
        </>
      )
    },
    {
      key: 'votes',
      label: 'Votes',
      icon: <TbSquareRoundedChevronUp />,
      value: formatter.format(bot.votes)
    },
    {
      key: 'commands',
      label: 'Commands',
      icon: <RiSlashCommands2 />,
      component: (
        <>
          {formatter.format(bot.commands)} <span className='opacity-50'>(Updated at {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })})</span>
        </>
      )
    }
  ];

  const isMobile = useMedia('(max-width: 640px)', false);

  if (bot.github_repository?.data) keys.push({
    key: 'GitHub Repository',
    label: 'GitHub Repository',
    icon: <FaGithub />,
    component: <>
      {isMobile ? (
        <Link
          className='underline text-tertiary hover:text-primary'
          href={bot.github_repository.data.html_url}
        >
          This bot is open-source and available on GitHub.
        </Link>
      ) : (
        <p className='text-tertiary'>
        This bot is open-source and available on GitHub.
        </p>
      )}

      <Link
        className='hidden sm:flex flex-col p-4 mt-6 border-2 max-w-[90%] rounded-lg cursor-pointer gap-y-3 h-max bg-tertiary hover:bg-quaternary border-primary'
        href={bot.github_repository.data.html_url}
        target='_blank'
        rel='noopener noreferrer'
      >
        <span className='px-2 py-0.5 text-xs font-medium dark:bg-white/20 border dark:border-white/40 select-none bg-blasck/20 border-black/40 rounded-full text-primary w-max'>
          {bot.github_repository.data.language}
        </span>

        <div className='flex items-center text-secondary'>
          {bot.github_repository.data.owner.avatar_url && (
            <>
              <Image
                src={bot.github_repository.data.owner.avatar_url}
                alt={`${bot.github_repository.data.owner.login}'s avatar`}
                width={16}
                height={16}
                className='mr-2 rounded-full'
              />
              {' '}
            </>
          )}
          {bot.github_repository.data.owner.login}/

          <span className='font-semibold truncate text-primary'>
            {bot.github_repository.data.name}
          </span>
        </div>

        <p className='-mt-2 text-xs whitespace-pre-wrap text-tertiary line-clamp-3'>
          {bot.github_repository.data.description}
        </p>

        <div className='flex items-center gap-x-2 text-tertiary'>
          <div className='font-medium text-tertiary text-ms flex gap-x-1.5 items-center'>
            <TiStarFullOutline />
            {formatter.format(bot.github_repository.data.stargazers_count)}
          </div>

          <div className='font-medium text-tertiary text-sm flex gap-x-1.5 items-center'>
            <PiGitForkBold />
            {formatter.format(bot.github_repository.data.forks_count)}
          </div>
        </div>
      </Link>
    </>
  });

  return (
    <div className='w-full lg:w-[70%] flex flex-col'>
      <motion.h2 
        className='text-xl font-semibold' 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10 }}
      >
        About
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
        <Markdown>
          {bot.description}
        </Markdown>
      </motion.div>

      <motion.div 
        className='grid grid-cols-1 gap-8 p-4 py-8 mt-8 sm:grid-cols-2 h-max rounded-xl bg-secondary'
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
            <div className='p-3 rounded-full bg-tertiary text-secondary'>
              {icon}
            </div>

            <div className='flex flex-col w-full'>
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