'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import deleteProfile from '@/lib/request/profiles/deleteProfile';
import { RiErrorWarningFill } from 'react-icons/ri';
import { TbLoader } from 'react-icons/tb';

export default function DangerZone({ profile }) {
  const [areYouSure, setAreYouSure] = useState(false);
  const [loading, setLoading] = useState(false);

  function continueDeleteProfile() {
    setLoading(true);
    
    toast.promise(deleteProfile(profile.slug), {
      loading: 'Deleting profile..',
      success: () => {
        window.location.href = '/profiles';
        return 'Profile has been deleted! We are redirecting you to the homepage..';
      },
      error: message => {
        setLoading(false);
        return message;
      }
    });
  }

  return (
    <div className='flex flex-col p-4 border border-red-500 gap-y-2 bg-red-500/10 rounded-xl'>
      <h1 className='text-lg text-primary flex items-center font-semibold gap-x-1.5'>
        <RiErrorWarningFill />
        Danger Zone
      </h1>
      <p className='text-sm font-medium text-tertiary'>
        {areYouSure ? (
          <>
            Are you sure you really want to delete your profile?
          </>
        ) : (
          <>
            You can delete the your profile using the button below, but be careful not to delete it by mistake :)
          </>
        )}
      </p>
    
      <div className='flex mt-1 gap-x-2'>
        {areYouSure ? (
          <>
            <button className='flex items-center gap-x-1.5 px-3 py-1 text-sm font-medium text-white bg-black rounded-lg w-max dark:bg-white dark:text-black dark:hover:bg-white/70 hover:bg-black/70 disabled:pointer-events-none disabled:opacity-70' onClick={continueDeleteProfile} disabled={loading}>
              {loading && (
                <TbLoader className='animate-spin' />
              )}
              Confirm
            </button>

            <button className='px-3 py-1 text-sm font-medium text-white bg-black rounded-lg w-max dark:bg-white dark:text-black dark:hover:bg-white/70 hover:bg-black/70 disabled:pointer-events-none disabled:opacity-70' onClick={() => setAreYouSure(false)} disabled={loading}>
              Cancel
            </button>
          </>
        ) : (
          <button className='px-3 py-1 text-sm font-medium text-white bg-black rounded-lg w-max dark:bg-white dark:text-black dark:hover:bg-white/70 hover:bg-black/70' onClick={() => setAreYouSure(true)}>
            Delete
          </button>
        )}
      </div>
    </div>
  );
}