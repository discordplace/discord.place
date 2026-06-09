'use client';

import ServerCard from '@/app/(servers)/servers/components/ServerCard';
import { t } from '@/stores/language';

export default function MockServerCard() {
  return (
    <div className='relative flex min-w-[300px] rotate-15 sm:bottom-8'>
      <ServerCard
        server={{
          category: 'Community',
          data: {
            members: 100_000,
            votes: 100_000
          },
          description: t('home.infoCards.1.serverCardDescription'),
          icon: 'e0d586009f0533809078b40357d74597',
          id: '1200254872059121764',
          name: 'discord.place'
        }}
      />
    </div>
  );
}