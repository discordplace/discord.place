'use client';

import ProfileCard from '@/app/(profiles)/profiles/components/Hero/Profiles/Card';
import useAuthStore from '@/stores/auth';
import { t } from '@/stores/language';

export default function MockProfileCard() {
  const loggedIn = useAuthStore(state => state.user);
  const user = useAuthStore(state => state.user);

  return (
    <div className='pointer-events-none relative right-2 bottom-24 rotate-15 select-none'>
      <ProfileCard
        id={loggedIn ? user.id : '1207874300070199356'}
        avatar={loggedIn ? user.avatar : 'a_a20e76287cb0a3316d55995f0126e3e7'}
        colors={{
          primary: null,
          secondary: null
        }}
        badges={loggedIn ? [] : ['verified']}
        views={100_000}
        likes={100_000}
        username={loggedIn ? user.username : 'discordplace'}
        global_name={loggedIn ? user.global_name : 'discord.place'}
        bio={loggedIn ? 'No bio provided.' : t('home.infoCards.2.profileCardBio')}
        createdAt={loggedIn ? Date.now() : '2024-02-16T00:00:00.000Z'}
      />
    </div>
  );
}