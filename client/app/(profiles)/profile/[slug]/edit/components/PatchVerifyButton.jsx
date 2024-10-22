'use client';

import patchProfileVerify from '@/lib/request/profiles/patchProfileVerify';
import revalidateProfile from '@/lib/revalidate/profile';
import { useState } from 'react';
import { TbLoader } from 'react-icons/tb';
import { toast } from 'sonner';
import { t } from '@/stores/language';

export default function PatchVerifyButton({ profile }) {
  const [loading, setLoading] = useState(false);

  if (!profile.permissions.canVerify) return null;

  function handleVerify() {
    setLoading(true);

    toast.promise(patchProfileVerify(profile.slug, !profile.verified), {
      loading: t(`editProfilePage.toast.${profile.verified ? 'unverifyingProfile' : 'verifyingProfile'}`),
      success: () => {
        revalidateProfile(profile.slug);
        setLoading(false);

        return t(`editProfilePage.toast.${profile.verified ? 'profileUnverified' : 'profileVerified'}`);
      },
      error: error => {
        setLoading(false);

        return error;
      }
    });
  }

  return (
    <div className='flex w-full flex-1 justify-end'>
      <button
        onClick={handleVerify}
        disabled={loading}
        className='mt-4 flex w-full select-none items-center justify-center gap-x-1.5 rounded-full bg-tertiary px-4 py-2 text-sm font-semibold text-secondary hover:bg-quaternary hover:text-primary disabled:pointer-events-none disabled:opacity-70 mobile:mt-0 mobile:w-max mobile:rounded-lg mobile:py-1.5'
      >
        {profile.verified ? t('buttons.unverify') : t('buttons.verify')}
        {loading && <TbLoader className='animate-spin' />}
      </button>
    </div>
  );
}