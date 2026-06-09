'use client';

import { FaUsers } from 'react-icons/fa';
import { FiArrowUpRight } from 'react-icons/fi';
import { ImTrophy } from 'react-icons/im';
import { TbSquareRoundedChevronUp } from 'react-icons/tb';
import { TiStar } from 'react-icons/ti';
import { motion } from 'framer-motion';import config from '@/config';
import useLanguageStore, { t } from '@/stores/language';

const formatter = new Intl.NumberFormat('en-US', {
  compactDisplay: 'short',
  notation: 'compact'
});

export default function About({ server }) {
  const language = useLanguageStore(state => state.language);

  const keys = [
    {
      icon: config.serverCategoriesIcons[server.category],
      key: 'category',
      label: t('serverPage.about.labels.category'),
      value: t(`categories.${server.category}`)
    },
    {
      icon: <FaUsers />,
      key: 'members',
      label: t('serverPage.about.labels.members'),
      value: formatter.format(server.total_members)
    },
    {
      icon: <ImTrophy />,
      key: 'rewards',
      label: t('serverPage.about.labels.rewards'),
      value: server.rewards.length > 0 ? t('serverPage.about.availableVoteRewards', { count: server.rewards.length }) : t('serverPage.about.noVoteRewards')
    },
    {
      icon: <TiStar />,
      key: 'boosts',
      label: t('serverPage.about.labels.boosts'),
      value: t('serverPage.about.boostsLabelValue', { count: server.total_boosts, level: server.boost_level })
    },
    {
      icon: <FiArrowUpRight />,
      key: 'joined_at',
      label: t('serverPage.about.labels.joinedAt'),
      value: new Date(server.joined_at).toLocaleDateString(language, { day: 'numeric', month: 'long', year: 'numeric' })
    },
    {
      icon: <TbSquareRoundedChevronUp />,
      key: 'votes',
      label: t('serverPage.about.labels.votes'),
      value: formatter.format(server.votes)
    }
  ];

  return (
    <div className='flex w-full flex-col lg:w-[70%]'>
      <motion.h2
        className='text-xl font-semibold'
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ damping: 10, duration: 0.3, stiffness: 100, type: 'spring' }}
      >
        {t('serverPage.about.title')}
      </motion.h2>

      <motion.p className='mt-2 whitespace-pre-wrap text-tertiary'
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ damping: 10, delay: 0.15, duration: 0.3, stiffness: 100, type: 'spring' }}
      >
        {server.description}
      </motion.p>

      <motion.div
        className='mt-8 grid h-max grid-cols-1 gap-8 rounded-xl bg-secondary p-4 py-8 sm:grid-cols-2'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ damping: 10, delay: 0.3, duration: 0.3, stiffness: 100, type: 'spring' }}
      >
        {keys.map(({ key, label, icon, value }, index) => (
          <motion.div
            key={key}
            className='flex h-max items-center gap-x-4'
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ damping: 10, delay: 0.2 + (.05 * index), duration: 0.3, stiffness: 100, type: 'spring' }}
          >
            <div className='rounded-full bg-tertiary p-3 text-secondary'>
              {icon}
            </div>

            <div className='flex flex-col'>
              <h3 className='font-semibold'>
                {label}
              </h3>

              <p className='text-sm text-tertiary'>
                {value}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}