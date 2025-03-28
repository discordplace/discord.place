'use client';

import { BiSolidCategory } from '@/icons';
import ServerIcon from '@/app/(servers)/servers/components/ServerIcon';
import MotionLink from '@/app/components/Motion/Link';
import { motion } from 'framer-motion';import { t } from '@/stores/language';

export default function SupportServer({ bot }) {
  return (
    <>
      <motion.h2
        className='mt-4 text-xl font-semibold'
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10, delay: .7 }}
      >
        {t('botPage.supportServer.title')}
      </motion.h2>

      <MotionLink
        className='mt-4 flex w-full gap-x-3 rounded-lg bg-secondary p-2 hover:bg-tertiary'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10, delay: .9 }}
        href={`/servers/${bot.support_server.id}`}
      >
        <ServerIcon
          width={50}
          height={50}
          icon_url={bot.support_server.icon_url}
          name={bot.support_server.name}
          className='rounded-full'
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