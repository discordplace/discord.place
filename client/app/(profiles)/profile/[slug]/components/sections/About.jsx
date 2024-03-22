import { MdOutlineMale, MdOutlineFemale } from 'react-icons/md';
import { LiaBirthdayCakeSolid } from 'react-icons/lia';
import { FaGenderless } from 'react-icons/fa';
import { BsEye, BsGeoAlt, BsHeartFill, BsSuitcaseLg } from 'react-icons/bs';
import { motion } from 'framer-motion';

export default function About({ profile }) {
  const keys = [
    {
      key: 'occupation',
      label: 'Occupation',
      icon: <BsSuitcaseLg />,
      value: profile.occupation || 'Unknown'
    },
    {
      key: 'gender',
      label: 'Gender',
      icon: profile.gender === 'Male' ? <MdOutlineMale /> : profile.gender === 'Female' ? <MdOutlineFemale /> : <FaGenderless />,
      value: profile.gender || 'Unknown'
    },
    {
      key: 'location',
      label: 'Location',
      icon: <BsGeoAlt />,
      value: profile.location || 'Unknown'
    },
    {
      key: 'birthday',
      label: 'Birthday',
      icon: <LiaBirthdayCakeSolid />,
      value: profile.birthday || 'Unknown'
    },
    {
      key: 'views',
      label: 'Views',
      icon: <BsEye />,
      value: profile.views
    },
    {
      key: 'likes',
      label: 'Likes',
      icon: <BsHeartFill />,
      value: profile.likes
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
        {profile.bio}
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