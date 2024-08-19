import { motion } from 'framer-motion';
import { FaUsers } from 'react-icons/fa';
import { TiStar } from 'react-icons/ti';
import { MdKeyboardVoice } from 'react-icons/md';
import { TbSquareRoundedChevronUp } from 'react-icons/tb';
import { ImTrophy } from 'react-icons/im';
import config from '@/config';
import { t } from '@/stores/language';

const formatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  compactDisplay: 'short'
});

export default function About({ server }) {
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
      key: 'members_in_voice',
      label: t('serverPage.about.labels.voiceActivity'),
      icon: <MdKeyboardVoice />,
      value: t('serverPage.about.voiceActivityLabelValue', { count: server.total_members_in_voice })
    },
    {
      key: 'votes',
      label: t('serverPage.about.labels.votes'),
      icon: <TbSquareRoundedChevronUp />,
      value: formatter.format(server.votes)
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
        className='grid grid-cols-1 gap-8 p-4 py-8 mt-8 sm:grid-cols-2 h-max rounded-xl bg-secondary'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10, delay: 0.3 }}
      >
        {keys.map(({ key, label, icon, value }, index) => (
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