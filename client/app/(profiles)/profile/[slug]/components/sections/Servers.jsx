'use client';

import { motion } from 'framer-motion';
import ServerCard from '@/app/(servers)/servers/components/ServerCard';
import { t } from '@/stores/language';

export default function Servers({ profile }) {
  return (
    <div className="px-8 mt-8 lg:px-0">
      <motion.h2 
        className='text-xl font-semibold' 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10, delay: 0.7 }}
      >
        {t('profilePage.servers.title')}
      </motion.h2>

      <motion.p className='mt-2 whitespace-pre-wrap text-tertiary' 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10, delay: 0.715 }}
      >
        {t('profilePage.servers.subtitle')}
      </motion.p>

      <motion.div 
        className='grid grid-cols-1 gap-4 mt-8 sm:grid-cols-2 lg:grid-cols-3'
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10, delay: 0.785 }}
      >
        {profile.servers.map((server, index) => (
          <div 
            className='flex'
            key={server.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10, delay: 0.79 + (index * 0.1) }}
          >
            <ServerCard 
              server={{
                premium: profile.premium,
                data: {
                  members: server.total_members,
                  votes: server.votes
                },
                joined_at: server.joined_at,
                id: server.id,
                banner_url: server.banner_url,
                icon_url: server.icon_url,
                name: server.name,
                description: server.description,
                category: server.category
              }}
              overridedSort='Votes'
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}