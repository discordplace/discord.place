'use client';

import InfoCard from '@/app/(home)/components/InfoCards/Card';
import MockProfileCard from '@/app/(home)/components/InfoCards/Mock/ProfileCard';
import MockReviewCard from '@/app/(home)/components/InfoCards/Mock/ReviewCard';
import MockServerCard from '@/app/(home)/components/InfoCards/Mock/ServerCard';
import Square from '@/app/components/Background/Square';
import config from '@/config';
import useAuthStore from '@/stores/auth';
import { t } from '@/stores/language';
import { usePathname } from 'next/navigation';
import { FaGithub } from 'react-icons/fa';

export default function InfoCards() {
  const loggedIn = useAuthStore(state => state.loggedIn);

  const pathname = usePathname();

  return (
    <div className='mt-48 flex w-full max-w-5xl flex-col items-center justify-center gap-y-32 px-4 lg:px-0'>
      <InfoCard
        button={{
          href: 'https://github.com/discordplace/discord.place',
          text: t('home.infoCards.0.buttonText')
        }}
        content={(
          <div className='relative z-10 flex size-full items-center justify-center overflow-hidden rounded-3xl'>
            <Square
              blockColor='rgb(168 85 247)'
              column='1'
              row='1'
              transparentEffectDirection='leftRightBottomTop'
            />

            <FaGithub className='rounded-full bg-secondary text-9xl text-primary' />
          </div>
        )}
        description={t('home.infoCards.0.description')}
        index={0}
        title={t('home.infoCards.0.title')}
      />

      <InfoCard
        button={{
          href: loggedIn ? '/account' : config.getLoginURL(pathname),
          target: '_self',
          text: loggedIn ? t('home.infoCards.1.buttonTextLoggedIn') : t('home.infoCards.1.buttonTextLoggedOut')
        }}
        content={(
          <div className='grid size-full grid-cols-1 gap-x-40 gap-y-8 overflow-hidden rounded-3xl sm:grid-cols-2'>
            <MockServerCard />
            <MockServerCard />
            <MockServerCard />
            <MockServerCard />
          </div>
        )}
        description={t('home.infoCards.1.description')}
        index={1}
        title={t('home.infoCards.1.title')}
      />

      <InfoCard
        content={(
          <div className='grid size-full grid-cols-1 place-items-center overflow-hidden rounded-3xl mobile:grid-cols-2 mobile:gap-x-40 mobile:[place-items:unset]'>
            <MockProfileCard />
            <MockProfileCard />
          </div>
        )}
        description={t('home.infoCards.2.description')}
        index={2}
        title={t('home.infoCards.2.title')}
      />

      <InfoCard
        content={(
          <div className='relative grid size-full grid-rows-2 gap-4 overflow-hidden rounded-3xl mobile:grid-cols-2'>
            <div className='absolute left-0 top-0 z-[1] size-full'
              style={{
                background: 'radial-gradient(circle, transparent, rgba(var(--bg-background)) 100%)'
              }}
            />

            <MockReviewCard
              content={t('home.infoCards.3.reviews.0')}
              rating={5}
              username='dylan'
            />

            <MockReviewCard
              content={t('home.infoCards.3.reviews.1')}
              rating={2}
              username='bella'
            />

            <div className='hidden mobile:block'>
              <MockReviewCard
                content={t('home.infoCards.3.reviews.2')}
                rating={4}
                username='smokey'
              />
            </div>

            <MockReviewCard
              content={t('home.infoCards.3.reviews.3')}
              rating={3}
              username='charlie'
            />
          </div>
        )}
        description={t('home.infoCards.3.description')}
        index={3}
        title={t('home.infoCards.3.title')}
      />
    </div>
  );
}