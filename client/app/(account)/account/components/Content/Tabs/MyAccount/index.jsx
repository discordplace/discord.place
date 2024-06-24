'use client';

import useAuthStore from '@/stores/auth';
import Image from 'next/image';
import Link from 'next/link';
import { MdOutlineOpenInNew } from 'react-icons/md';
import { GoHeartFill } from 'react-icons/go';
import { useEffect, useState } from 'react';
import getPlans from '@/lib/request/payments/getPlans';
import { toast } from 'sonner';

export default function MyAccount() {
  const user = useAuthStore(state => state.user);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    getPlans()
      .then(data => setPlans(data))
      .catch(toast.error);
  }, []);

  return (
    <div className='flex flex-col px-6 my-16 lg:px-16 gap-y-6'>
      <div className='flex flex-col gap-y-2'>
        <h1 className='text-xl font-bold text-primary'>
          My Account
        </h1>

        <p className='text-sm text-secondary'>
          View your account details.
        </p>
      </div>

      <div className='flex flex-col mt-8 gap-y-2'>
        <h2 className='text-sm font-bold text-secondary'>
          Connected Account
        </h2>

        <p className='text-sm text-tertiary'>
          You can see your Discord account details here.
        </p>

        <div className='flex max-w-[500px] flex-col w-full p-2 mt-2 h-max rounded-3xl bg-secondary'>
          {user?.banner_url ? (
            <Image
              src={user.banner_url}
              alt={`${user.username}'s banner`}
              className='rounded-xl'
              width={500}
              height={150}
            />
          ) : (
            <div className='w-full h-[150px] rounded-2xl bg-quaternary' />
          )}

          <Image
            src={user?.avatar_url}
            alt={`${user?.username}'s avatar`}
            className='relative -mb-20 border-8 border-[rgba(var(--bg-secondary))] rounded-full bottom-10 left-4'
            width={80}
            height={80}
          />

          <div className='mt-2 ml-28'>
            <div className='flex flex-col'>
              <h3 className='text-lg font-bold text-primary'>{user?.global_name}</h3>
              <p className='text-sm font-medium text-tertiary'>@{user?.username}</p>
            </div>
          </div>

          <div className='mx-auto flex flex-col w-[98%] p-4 mb-1.5 mt-4 bg-tertiary h-max rounded-2xl gap-y-4'>
            <div className='flex flex-col'>
              <h3 className='text-sm font-bold text-primary'>Display Name</h3>
              <p className='text-sm font-medium text-tertiary'>{user?.global_name}</p>
            </div>

            <div className='flex flex-col'>
              <h3 className='text-sm font-bold text-primary'>Username</h3>
              <p className='text-sm font-medium text-tertiary'>@{user?.username}</p>
            </div>

            <div className='flex flex-col'>
              <h3 className='text-sm font-bold text-primary'>User ID</h3>
              <p className='text-sm font-medium text-tertiary'>{user?.id}</p>
            </div>
          </div>
        </div>
        
        {user?.premium?.createdAt && (
          <div className='flex flex-col mt-8 gap-y-2'>
            <div className='border-2 border-purple-500 p-2.5 max-w-[500px] rounded-xl relative'>
              <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-500/25 via-purple-500/10 rounded-xl'></div>
            
              <div className='flex items-center gap-x-4'>
                <GoHeartFill className='text-xl' />

                <div className='flex flex-col'>
                  <h2 className='flex flex-wrap items-center font-semibold gap-x-2'>
                    {plans.find(plan => plan.id === user.premium.planId)?.name}

                    <span className='text-xs text-tertiary'>
                      {new Date(user.premium.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </h2>

                  <p className='mt-1.5 text-sm mobile:mt-0 text-tertiary'>
                    Thank you for supporting us!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className='flex flex-col mt-8 gap-y-2'>
          <h2 className='text-sm font-bold text-secondary'>
            Your Profile
          </h2>

          <div className='flex flex-col text-sm text-tertiary gap-y-4'>

            {user?.profile ? (
              <>
                You have a profile! Click the button below to view it.

                <Link
                  className='px-4 py-1.5 flex items-center gap-x-1 font-semibold text-white bg-black w-max rounded-xl dark:text-black dark:bg-white dark:hover:bg-white/70 hover:bg-black/70'
                  href={`/profile/${user.profile.slug}`}
                >
                  View Profile
                  <MdOutlineOpenInNew />
                </Link>
              </>
            ) : (
              <>
                You don{'\''}t have a profile yet. Maybe that{'\''}s sign to create one?

                <Link
                  className='px-4 py-1.5 flex items-center gap-x-1 font-semibold text-white bg-black w-max rounded-xl dark:text-black dark:bg-white dark:hover:bg-white/70 hover:bg-black/70'
                  href='/profiles/create'
                >
                  Create Profile
                  <MdOutlineOpenInNew />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}