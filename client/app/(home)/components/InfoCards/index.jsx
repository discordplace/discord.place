'use client';

import { FaGithub } from '@/icons';
import Square from '@/app/components/Background/Square';
import InfoCard from '@/app/(home)/components/InfoCards/Card';import useAuthStore from '@/stores/auth';
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
    <div className='mt-48 flex w-full max-w-5xl flex-col items-center justify-center gap-y-32 px-4 lg:px-0'>
      <InfoCard
        index={0}
        title={t('home.infoCards.0.title')}
        description={t('home.infoCards.0.description')}
        button={{
          text: t('home.infoCards.0.buttonText'),
          href: 'https://github.com/discordplace/discord.place'
        }}
        content={(
          <div className='relative z-10 flex size-full items-center justify-center overflow-hidden rounded-3xl'>
            <Square
              column='1'
              row='1'
              blockColor='rgb(168 85 247)'
              transparentEffectDirection='leftRightBottomTop'
            />

            <FaGithub className='rounded-full bg-secondary text-9xl text-primary' />
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
          <div className='grid size-full grid-cols-1 gap-x-40 gap-y-8 overflow-hidden rounded-3xl sm:grid-cols-2'>
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
          <div className='grid size-full grid-cols-1 place-items-center overflow-hidden rounded-3xl mobile:grid-cols-2 mobile:gap-x-40 mobile:[place-items:unset]'>
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
          <div className='relative grid size-full grid-rows-2 gap-4 overflow-hidden rounded-3xl mobile:grid-cols-2'>
            <div className='absolute left-0 top-0 z-[1] size-full'
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