'use client';

import ServerCard from '@/app/(servers)/servers/components/ServerCard';
import ReportableArea from '@/app/components/ReportableArea';
import useAuthStore from '@/stores/auth';
import { t } from '@/stores/language';
import { motion } from 'framer-motion';

export default function Servers({ profile }) {
  const user = useAuthStore(state => state.user);

  return (
    <div className='mt-8 px-8 lg:px-0'>
      <motion.h2
        animate={{ opacity: 1, y: 0 }}
        className='text-xl font-semibold'
        initial={{ opacity: 0, y: -10 }}
        transition={{ damping: 10, delay: 0.7, duration: 0.3, stiffness: 100, type: 'spring' }}
      >
        {t('profilePage.servers.title')}
      </motion.h2>

      <motion.p animate={{ opacity: 1, y: 0 }}
        className='mt-2 whitespace-pre-wrap text-tertiary'
        initial={{ opacity: 0, y: -10 }}
        transition={{ damping: 10, delay: 0.715, duration: 0.3, stiffness: 100, type: 'spring' }}
      >
        {t('profilePage.servers.subtitle')}
      </motion.p>

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className='mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'
        initial={{ opacity: 0, y: -10 }}
        transition={{ damping: 10, delay: 0.785, duration: 0.3, stiffness: 100, type: 'spring' }}
      >
        {profile.servers.map((server, index) => (
          <ReportableArea
            active={user?.id !== server.owner.id}
            identifier={`server-${server.id}`}
            key={server.id}
            metadata={{
              description: server.description,
              icon: server.icon,
              id: server.id,
              name: server.name
            }}
          >
            <div
              animate={{ opacity: 1, y: 0 }}
              className='flex'
              initial={{ opacity: 0, y: -10 }}
              key={server.id}
              transition={{ damping: 10, delay: 0.79 + (index * 0.1), duration: 0.3, stiffness: 100, type: 'spring' }}
            >
              <ServerCard
                overridedSort='Votes'
                server={{
                  banner: server.banner,
                  category: server.category,
                  data: {
                    members: server.total_members,
                    votes: server.votes
                  },
                  description: server.description,
                  icon: server.icon,
                  id: server.id,
                  joined_at: server.joined_at,
                  name: server.name,
                  premium: profile.premium
                }}
              />
            </div>
          </ReportableArea>
        ))}
      </motion.div>
    </div>
  );
}