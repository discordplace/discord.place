'use client';

import ServerCard from '@/app/(servers)/servers/components/ServerCard';
import { t } from '@/stores/language';

export default function MockServerCard() {
  return (
    <div className='relative flex min-w-[300px] rotate-[15deg] sm:bottom-8'>
      <ServerCard
        server={{
          data: {
            members: 100000,
            votes: 100000
          },
          id: '1200254872059121764',
          name: 'discord.place',
          description: t('home.infoCards.1.serverCardDescription'),
          icon: 'e0d586009f0533809078b40357d74597',
          category: 'Community'
        }}
      />
    </div>
  );
}