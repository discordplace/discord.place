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
    <div className="flex justify-center w-full px-4 mb-8 mt-36 sm:px-0">
      <div className="w-full flex justify-center max-w-[650px]">
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-4">
            <Link href={`/profile/${profile.slug}`} className="p-1.5 rounded-xl bg-secondary hover:bg-tertiary">
              <MdChevronLeft size={24} />
            </Link>
            
            <h1 className="text-3xl font-bold">
              {t('editProfilePage.title')}
            </h1>
          </div>

          <div className='flex flex-wrap items-center mt-16 gap-x-4'>
            <UserAvatar
              id={profile.id}
              hash={profile.avatar}
              size={128}
              width={128}
              height={128}
              className='rounded-full w-[64px] h-[64px]'
            />

            <div className='flex flex-col'>
              <div className='flex flex-wrap items-center gap-2'>
                <h2 className='text-2xl font-semibold'>
                  @{profile.username}
                </h2>

                {profile.verified && <VerifiedBadge />}
              </div>

              <div className="select-none">
                <span className='text-sm sm:text-base text-tertiary'>
                  {profile.preferredHost}/
                </span>
                
                <span className='text-sm font-medium sm:text-base text-primary'>{profile.slug}</span>
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
