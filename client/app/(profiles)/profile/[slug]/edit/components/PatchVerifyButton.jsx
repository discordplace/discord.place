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
    <div className='flex justify-end flex-1 w-full'>
      <button
        onClick={handleVerify}
        disabled={loading}
        className='mobile:w-max mobile:mt-0 mt-4 w-full justify-center select-none px-4 mobile:py-1.5 py-2 flex items-center gap-x-1.5 text-sm font-semibold rounded-full mobile:rounded-lg disabled:opacity-70 disabled:pointer-events-none text-secondary bg-tertiary hover:text-primary hover:bg-quaternary'
      >
        {profile.verified ? t('buttons.unverify') : t('buttons.verify')}
        {loading && <TbLoader className='animate-spin' />}
      </button>
    </div>
  );
}