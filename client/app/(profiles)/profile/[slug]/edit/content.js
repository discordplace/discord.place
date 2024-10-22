'use client';

import DangerZone from '@/app/(profiles)/profile/[slug]/edit/components/DangerZone';
import Edit from '@/app/(profiles)/profile/[slug]/edit/components/Edit';
import PatchVerifyButton from '@/app/(profiles)/profile/[slug]/edit/components/PatchVerifyButton';
import VerifiedBadge from '@/app/(profiles)/profile/[slug]/edit/components/VerifiedBadge';
import UserAvatar from '@/app/components/ImageFromHash/UserAvatar';
import { t } from '@/stores/language';
import Link from 'next/link';
import { MdChevronLeft } from 'react-icons/md';

export default function Content({ profile }) {
  return (
    <div className='mb-8 mt-36 flex w-full justify-center px-4 sm:px-0'>
      <div className='flex w-full max-w-[650px] justify-center'>
        <div className='flex w-full flex-col'>
          <div className='flex items-center gap-x-4'>
            <Link className='rounded-xl bg-secondary p-1.5 hover:bg-tertiary' href={`/profile/${profile.slug}`}>
              <MdChevronLeft size={24} />
            </Link>

            <h1 className='text-3xl font-bold'>
              {t('editProfilePage.title')}
            </h1>
          </div>

          <div className='mt-16 flex flex-wrap items-center gap-x-4'>
            <UserAvatar
              className='size-[64px] rounded-full'
              hash={profile.avatar}
              height={128}
              id={profile.id}
              size={128}
              width={128}
            />

            <div className='flex flex-col'>
              <div className='flex flex-wrap items-center gap-2'>
                <h2 className='text-2xl font-semibold'>
                  @{profile.username}
                </h2>

                {profile.verified && <VerifiedBadge />}
              </div>

              <div className='select-none'>
                <span className='text-sm text-tertiary sm:text-base'>
                  {profile.preferredHost}/
                </span>

                <span className='text-sm font-medium text-primary sm:text-base'>{profile.slug}</span>
              </div>
            </div>

            <PatchVerifyButton profile={profile} />
          </div>

          <Edit profileData={profile} />

          {profile.permissions.canDelete && <DangerZone profile={profile} />}
        </div>
      </div>
    </div>
  );
}
