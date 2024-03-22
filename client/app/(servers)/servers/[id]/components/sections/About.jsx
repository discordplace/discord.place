import { motion } from 'framer-motion';
import { BiSolidCategory } from 'react-icons/bi';
import { FaUsers } from 'react-icons/fa';
import { HiOutlineStatusOnline } from 'react-icons/hi';
import { TiStar } from 'react-icons/ti';
import { MdKeyboardVoice } from 'react-icons/md';
import { TbSquareRoundedChevronUp } from 'react-icons/tb';

const formatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  compactDisplay: 'short'
});

export default function About({ server }) {
  const keys = [
    {
      key: 'category',
      label: 'Category',
      icon: <BiSolidCategory />,
      value: server.category || 'Unknown'
    },
    {
      key: 'members',
      label: 'Total Members',
      icon: <FaUsers />,
      value: formatter.format(server.total_members)
    },
    {
      key: 'online',
      label: 'Online Members',
      icon: <HiOutlineStatusOnline />,
      value: formatter.format(server.online_members)
    },
    {
      key: 'boosts',
      label: 'Boost Level',
      icon: <TiStar />,
      value: `${server.boost_level} (${server.total_boosts} boosts)`
    },
    {
      key: 'members_in_voice',
      label: 'Voice Activity',
      icon: <MdKeyboardVoice />,
      value: `${formatter.format(server.total_members_in_voice)} members in voice`
    },
    {
      key: 'votes',
      label: 'Votes',
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
        About
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