import { BsEye, BsGeoAlt, BsSuitcaseLg } from 'react-icons/bs';
import { FaGenderless } from 'react-icons/fa';
import { IoMdHeartEmpty } from 'react-icons/io';
import { LiaBirthdayCakeSolid } from 'react-icons/lia';
import { MdOutlineFemale, MdOutlineMale } from 'react-icons/md';
import { motion } from 'framer-motion';import { t } from '@/stores/language';

export default function About({ profile }) {
  const keys = [
    {
      icon: <BsSuitcaseLg />,
      key: 'occupation',
      label: t('profilePage.about.labels.occupation'),
      value: profile.occupation || t('profilePage.about.valueUnknown')
    },
    {
      icon: profile.gender === 'Male' ? <MdOutlineMale /> : (profile.gender === 'Female' ? <MdOutlineFemale /> : <FaGenderless />),
      key: 'gender',
      label: t('profilePage.about.labels.gender'),
      value: profile.gender ? t(`profilePage.about.gender.${profile.gender}`) : t('profilePage.about.valueUnknown')
    },
    {
      icon: <BsGeoAlt />,
      key: 'location',
      label: t('profilePage.about.labels.location'),
      value: profile.location || t('profilePage.about.valueUnknown')
    },
    {
      icon: <LiaBirthdayCakeSolid />,
      key: 'birthday',
      label: t('profilePage.about.labels.birthday'),
      value: profile.birthday || t('profilePage.about.valueUnknown')
    },
    {
      icon: <BsEye />,
      key: 'views',
      label: t('profilePage.about.labels.views'),
      value: profile.views
    },
    {
      icon: <IoMdHeartEmpty />,
      key: 'likes',
      label: t('profilePage.about.labels.likes'),
      value: profile.likes
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
        {t('profilePage.about.title')}
      </motion.h2>

      <motion.p className='mt-2 wrap-break-word whitespace-pre-wrap text-tertiary'
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ damping: 10, delay: 0.15, duration: 0.3, stiffness: 100, type: 'spring' }}
      >
        {profile.bio === 'No bio provided.' ? t('profilePage.about.noBio') : profile.bio}
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