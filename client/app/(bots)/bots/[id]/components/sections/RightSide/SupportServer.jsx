'use client';

import ServerIcon from '@/app/(servers)/servers/components/ServerIcon';
import MotionLink from '@/app/components/Motion/Link';
import { motion } from 'framer-motion';
import { BiSolidCategory } from 'react-icons/bi';
import { t } from '@/stores/language';

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
        className='flex w-full p-2 mt-4 rounded-lg hover:bg-tertiary bg-secondary gap-x-3'
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

        <div className='flex flex-col justify-center w-full max-w-[75%]'>
          <h2 className='text-lg font-semibold truncate'>
            {bot.support_server.name}
          </h2>
          
          <p className='text-xs text-tertiary flex items-center gap-x-1.5'>
            <BiSolidCategory />
            {bot.support_server.category}
          </p>
        </div>
      </MotionLink>
    </>
  );
}