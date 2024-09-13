'use client';

import Square from '@/app/components/Background/Square';
import InfoCard from '@/app/(home)/components/InfoCards/Card';
import { FaGithub } from 'react-icons/fa';
import useAuthStore from '@/stores/auth';
import config from '@/config';
import { usePathname } from 'next/navigation';
import MockServerCard from '@/app/(home)/components/InfoCards/Mock/ServerCard';
import MockProfileCard from '@/app/(home)/components/InfoCards/Mock/ProfileCard';
import MockReviewCard from '@/app/(home)/components/InfoCards/Mock/ReviewCard';
import { t } from '@/stores/language';

export default function InfoCards() {
  const loggedIn = useAuthStore(state => state.loggedIn);

  const pathname = usePathname();

  return (
    <div className='flex flex-col items-center justify-center w-full max-w-5xl mt-48 gap-y-32'>
      <InfoCard
        index={0}
        title={t('home.infoCards.0.title')}
        description={t('home.infoCards.0.description')}
        button={{
          text: t('home.infoCards.0.buttonText'),
          href: 'https://github.com/discordplace/discord.place'
        }}
        content={(
          <div className='relative z-10 flex items-center justify-center w-full h-full overflow-hidden rounded-3xl'>
            <Square
              column='1'
              row='1'
              blockColor='rgb(168 85 247)'
              transparentEffectDirection='leftRightBottomTop'
            />

            <FaGithub className='rounded-full text-9xl text-primary bg-secondary' />
          </div>
        )}
      />

      <InfoCard
        index={1}
        title={t('home.infoCards.1.title')}
        description={t('home.infoCards.1.description')}
        button={{
          text: loggedIn ? t('home.infoCards.1.buttonTextLoggedIn') : t('home.infoCards.1.buttonTextLoggedOut'),
          href: loggedIn ? '/account' : config.getLoginURL(pathname),
          target: '_self'
        }}
        content={(
          <div className='grid w-full h-full grid-cols-1 overflow-hidden sm:grid-cols-2 gap-x-40 gap-y-8 rounded-3xl'>
            <MockServerCard />
            <MockServerCard />
            <MockServerCard />
            <MockServerCard />
          </div>
        )}
      />

      <InfoCard
        index={2}
        title={t('home.infoCards.2.title')}
        description={t('home.infoCards.2.description')}
        content={(
          <div className='grid w-full h-full grid-cols-1 overflow-hidden place-items-center mobile:[place-items:unset] mobile:grid-cols-2 mobile:gap-x-40 rounded-3xl'>
            <MockProfileCard />
            <MockProfileCard />
          </div>
        )}
      />

      <InfoCard
        index={3}
        title={t('home.infoCards.3.title')}
        description={t('home.infoCards.3.description')}
        content={(
          <div className='relative grid w-full h-full grid-rows-2 gap-4 overflow-hidden mobile:grid-cols-2 rounded-3xl'>
            <div className='z-[1] absolute top-0 left-0 w-full h-full'
              style={{
                background: 'radial-gradient(circle, transparent, rgba(var(--bg-background)) 100%)'
              }}
            />
            
            <MockReviewCard
              username='dylan'
              content={t('home.infoCards.3.reviews.0')}
              rating={5}
            />

            <MockReviewCard
              username='bella'
              content={t('home.infoCards.3.reviews.1')}
              rating={2}
            />

            <div className='hidden mobile:block'>
              <MockReviewCard
                username='smokey'
                content={t('home.infoCards.3.reviews.2')}
                rating={4}
              />
            </div>

            <MockReviewCard
              username='charlie'
              content={t('home.infoCards.3.reviews.3')}
              rating={3}
            />
          </div>
        )}
      />
    </div>
  );
}