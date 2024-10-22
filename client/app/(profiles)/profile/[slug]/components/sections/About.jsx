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
      value: profile.gender ? t(`profilePage.about.gender.${profile.gender}`) : t('profilePage.about.valueUnknown')
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
    <div className='flex w-full flex-col lg:w-[70%]'>
      <motion.h2
        className='text-xl font-semibold'
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10 }}
      >
        {t('profilePage.about.title')}
      </motion.h2>

      <motion.p className='mt-2 whitespace-pre-wrap break-words text-tertiary'
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10, delay: 0.15 }}
      >
        {profile.bio === 'No bio provided.' ? t('profilePage.about.noBio') : profile.bio}
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

            <div className='flex w-full flex-col'>
              <h3 className='font-semibold'>
                {label}
              </h3>

              <span className='max-w-[80%] truncate text-sm text-tertiary'>
                {value}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}