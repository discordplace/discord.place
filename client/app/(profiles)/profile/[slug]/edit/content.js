'use client';

import Link from 'next/link';
import { MdChevronLeft } from 'react-icons/md';
import Edit from '@/app/(profiles)/profile/[slug]/edit/components/Edit';
import DangerZone from '@/app/(profiles)/profile/[slug]/edit/components/DangerZone';
import VerifiedBadge from '@/app/(profiles)/profile/[slug]/edit/components/VerifiedBadge';
import PatchVerifyButton from '@/app/(profiles)/profile/[slug]/edit/components/PatchVerifyButton';
import { t } from '@/stores/language';
import UserAvatar from '@/app/components/ImageFromHash/UserAvatar';

export default function Content({ profile }) {
  return (
    <div className="mb-8 mt-36 flex w-full justify-center px-4 sm:px-0">
      <div className="flex w-full max-w-[650px] justify-center">
        <div className="flex w-full flex-col">
          <div className="flex items-center gap-x-4">
            <Link href={`/profile/${profile.slug}`} className="rounded-xl bg-secondary p-1.5 hover:bg-tertiary">
              <MdChevronLeft size={24} />
            </Link>

            <h1 className="text-3xl font-bold">
              {t('editProfilePage.title')}
            </h1>
          </div>

          <div className='mt-16 flex flex-wrap items-center gap-x-4'>
            <UserAvatar
              id={profile.id}
              hash={profile.avatar}
              size={128}
              width={128}
              height={128}
              className='size-[64px] rounded-full'
            />

            <div className='flex flex-col'>
              <div className='flex flex-wrap items-center gap-2'>
                <h2 className='text-2xl font-semibold'>
                  @{profile.username}
                </h2>

                {profile.verified && <VerifiedBadge />}
              </div>

              <div className="select-none">
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
