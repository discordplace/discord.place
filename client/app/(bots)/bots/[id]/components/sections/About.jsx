import { motion } from 'framer-motion';
import { TbSquareRoundedChevronUp, TbBoxMultiple } from 'react-icons/tb';
import Markdown from '@/app/components/Markdown';
import { RiSlashCommands2, RiUserAddLine } from 'react-icons/ri';
import Image from 'next/image';

const formatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  compactDisplay: 'short'
});

export default function About({ bot }) {
  const keys = [
    {
      key: 'owner',
      label: 'Owner',
      icon: <RiUserAddLine />,
      component: (
        <div className='flex items-center gap-x-2'>
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
        </div>
      )
    },
    {
      key: 'servers',
      label: 'Total Servers',
      icon: <TbBoxMultiple />,
      component: (
        <>
          {formatter.format(bot.servers)} <span className='opacity-50'>(Updated at {new Date(bot.servers_updated_at).toLocaleDateString('en-US')})</span>
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
          {formatter.format(bot.commands)} <span className='opacity-50'>(Updated at {new Date(bot.commands_updated_at).toLocaleDateString('en-US')})</span>
        </>
      )
    }
  ];

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
            className='flex items-center h-max gap-x-4'
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10, delay: 0.20 + (.05 * index) }}
          >
            <div className='p-3 rounded-full bg-tertiary text-secondary'>
              {icon}
            </div>

            <div className='flex flex-col'>
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