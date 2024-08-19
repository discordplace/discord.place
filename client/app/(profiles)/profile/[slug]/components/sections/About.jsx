import { MdOutlineMale, MdOutlineFemale } from 'react-icons/md';
import { LiaBirthdayCakeSolid } from 'react-icons/lia';
import { FaGenderless } from 'react-icons/fa';
import { BsEye, BsGeoAlt, BsSuitcaseLg } from 'react-icons/bs';
import { motion } from 'framer-motion';
import { IoMdHeartEmpty } from 'react-icons/io';
import { t } from '@/stores/language';

export default function About({ profile }) {
  const keys = [
    {
      key: 'occupation',
      label: t('profilePage.about.labels.occupation'),
      icon: <BsSuitcaseLg />,
      value: profile.occupation || t('profilePage.about.valueUnknown')
    },
    {
      key: 'gender',
      label: t('profilePage.about.labels.gender'),
      icon: profile.gender === 'Male' ? <MdOutlineMale /> : profile.gender === 'Female' ? <MdOutlineFemale /> : <FaGenderless />,
      value: profile.gender || t('profilePage.about.valueUnknown')
    },
    {
      key: 'location',
      label: t('profilePage.about.labels.location'),
      icon: <BsGeoAlt />,
      value: profile.location || t('profilePage.about.valueUnknown')
    },
    {
      key: 'birthday',
      label: t('profilePage.about.labels.birthday'),
      icon: <LiaBirthdayCakeSolid />,
      value: profile.birthday || t('profilePage.about.valueUnknown')
    },
    {
      key: 'views',
      label: t('profilePage.about.labels.views'),
      icon: <BsEye />,
      value: profile.views
    },
    {
      key: 'likes',
      label: t('profilePage.about.labels.likes'),
      icon: <IoMdHeartEmpty />,
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
        {t('profilePage.about.title')}
      </motion.h2>

      <motion.p className='mt-2 break-words whitespace-pre-wrap text-tertiary' 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10, delay: 0.15 }}
      >
        {profile.bio === 'No bio provided.' ? t('profilePage.about.noBio') : profile.bio}
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

            <div className='flex flex-col w-full'>
              <h3 className='font-semibold'>
                {label}
              </h3>

              <span className='text-sm truncate text-tertiary max-w-[80%]'>
                {value}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}