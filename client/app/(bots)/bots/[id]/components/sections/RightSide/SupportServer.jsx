'use client';

import ServerIcon from '@/app/(servers)/servers/components/ServerIcon';
import MotionLink from '@/app/components/Motion/Link';
import { t } from '@/stores/language';
import { motion } from 'framer-motion';
import { BiSolidCategory } from 'react-icons/bi';

export default function SupportServer({ bot }) {
  return (
    <>
      <motion.h2
        animate={{ opacity: 1, y: 0 }}
        className='mt-4 text-xl font-semibold'
        initial={{ opacity: 0, y: -10 }}
        transition={{ damping: 10, delay: .7, duration: 0.3, stiffness: 100, type: 'spring' }}
      >
        {t('botPage.supportServer.title')}
      </motion.h2>

      <MotionLink
        animate={{ opacity: 1 }}
        className='mt-4 flex w-full gap-x-3 rounded-lg bg-secondary p-2 hover:bg-tertiary'
        href={`/servers/${bot.support_server.id}`}
        initial={{ opacity: 0 }}
        transition={{ damping: 10, delay: .9, duration: 0.3, stiffness: 100, type: 'spring' }}
      >
        <ServerIcon
          className='rounded-full'
          height={50}
          icon_url={bot.support_server.icon_url}
          name={bot.support_server.name}
          width={50}
        />

        <div className='flex w-full max-w-[75%] flex-col justify-center'>
          <h2 className='truncate text-lg font-semibold'>
            {bot.support_server.name}
          </h2>

          <p className='flex items-center gap-x-1.5 text-xs text-tertiary'>
            <BiSolidCategory />
            {bot.support_server.category}
          </p>
        </div>
      </MotionLink>
    </>
  );
}