'use client';

import patchProfileVerify from '@/lib/request/profiles/patchProfileVerify';
import revalidateProfile from '@/lib/revalidate/profile';
import { useState } from 'react';
import { TbLoader } from 'react-icons/tb';
import { toast } from 'sonner';

export default function PatchVerifyButton({ profile }) {
  const [loading, setLoading] = useState(false);

  if (!profile.permissions.canVerify) return null;

  function handleVerify() {
    setLoading(true);

    toast.promise(patchProfileVerify(profile.slug, !profile.verified), {
      loading: profile.verified ? 'Unverifying profile...' : 'Verifying profile...',
      success: () => {
        revalidateProfile(profile.slug);
        setLoading(false);

        return profile.verified ? 'Profile unverified!' : 'Profile verified!';
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
        {profile.verified ? 'Unverify' : 'Verify'}
        {loading && <TbLoader className='animate-spin' />}
      </button>
    </div>
  );
}