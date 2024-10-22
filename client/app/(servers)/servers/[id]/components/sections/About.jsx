'use client';

import { motion } from 'framer-motion';
import { FaUsers } from 'react-icons/fa';
import { TiStar } from 'react-icons/ti';
import { TbSquareRoundedChevronUp } from 'react-icons/tb';
import { ImTrophy } from 'react-icons/im';
import config from '@/config';
import useLanguageStore, { t } from '@/stores/language';
import { FiArrowUpRight } from 'react-icons/fi';

const formatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  compactDisplay: 'short'
});

export default function About({ server }) {
  const language = useLanguageStore(state => state.language);

  const keys = [
    {
      key: 'category',
      label: t('serverPage.about.labels.category'),
      icon: config.serverCategoriesIcons[server.category],
      value: t(`categories.${server.category}`)
    },
    {
      key: 'members',
      label: t('serverPage.about.labels.members'),
      icon: <FaUsers />,
      value: formatter.format(server.total_members)
    },
    {
      key: 'rewards',
      label: t('serverPage.about.labels.rewards'),
      icon: <ImTrophy />,
      value: server.rewards.length > 0 ? t('serverPage.about.availableVoteRewards', { count: server.rewards.length }) : t('serverPage.about.noVoteRewards')
    },
    {
      key: 'boosts',
      label: t('serverPage.about.labels.boosts'),
      icon: <TiStar />,
      value: t('serverPage.about.boostsLabelValue', { level: server.boost_level, count: server.total_boosts })
    },
    {
      key: 'joined_at',
      label: t('serverPage.about.labels.joinedAt'),
      icon: <FiArrowUpRight />,
      value: new Date(server.joined_at).toLocaleDateString(language, { year: 'numeric', month: 'long', day: 'numeric' })
    },
    {
      key: 'votes',
      label: t('serverPage.about.labels.votes'),
      icon: <TbSquareRoundedChevronUp />,
      value: formatter.format(server.votes)
    }
  ];

  return (
    <div className='flex w-full flex-col lg:w-[70%]'>
      <motion.h2
        className='text-xl font-semibold'
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10 }}
      >
        {t('serverPage.about.title')}
      </motion.h2>

      <motion.p className='mt-2 whitespace-pre-wrap text-tertiary'
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10, delay: 0.15 }}
      >
        {server.description}
      </motion.p>

      <motion.div
        className='mt-8 grid h-max grid-cols-1 gap-8 rounded-xl bg-secondary p-4 py-8 sm:grid-cols-2'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10, delay: 0.3 }}
      >
        {keys.map(({ key, label, icon, value }, index) => (
          <motion.div
            key={key}
            className='flex h-max items-center gap-x-4'
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10, delay: 0.20 + (.05 * index) }}
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