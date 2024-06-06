'use client';

import { useState } from 'react';
import redeemPremiumCode from '@/lib/request/auth/redeemPremiumCode';
import { toast } from 'sonner';
import useAuthStore from '@/stores/auth';
import { useRouter } from 'next-nprogress-bar';
import Square from '@/app/components/Background/Square';
import Link from 'next/link';
import config from '@/config';
import { FaLink } from 'react-icons/fa6';
import { LuHeart } from 'react-icons/lu';
import useThemeStore from '@/stores/theme';
import { TbSquareRoundedChevronUp } from 'react-icons/tb';

export default function Page() {
  const theme = useThemeStore(state => state.theme);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const setUser = useAuthStore(state => state.setUser);
  const user = useAuthStore(state => state.user);
  const router = useRouter();

  function redeem() {
    setLoading(true);

    toast.promise(redeemPremiumCode(code), {
      loading: 'Please wait..',
      success: expire_at => {
        setUser({
          ...user,
          premium: true
        });

        setTimeout(() => router.push('/'), 3000);

        return `You have successfully redeemed the code! ${expire_at ? `Your premium will expire at ${new Date(expire_at).toLocaleString()}.` : 'You have premium forever!'}`;
      },
      error: error => {
        setLoading(false);
        return error;
      }
    });
  }

  return (
    <>
      <Square zIndex={8} column='20' row='20' transparentEffectDirection='leftRightBottomTop' blockColor={theme === 'light' ? '#00000021' : '#ffffff21'} />
      <div className="flex flex-col items-center w-full mt-48 relative z-[11] gap-y-6 mb-8 px-4 lg:px-0">
        <h1 className="text-6xl font-bold">
          Redeem
        </h1>
        <p className="font-medium text-tertiary max-w-[500px] text-center">
          Insert the code provided below to access premium features.
        </p>

        <div className="flex max-w-[500px] gap-x-2 w-full">
          <input
            type='text'
            value={code}
            onChange={event => setCode(event.target.value)}
            className='w-full px-2 py-2 text-sm font-medium rounded-lg outline-none bg-secondary hover:bg-tertiary text-secondary placeholder-placeholder focus-visible:text-primary'
          />
          <button 
            className='px-3 py-1 text-sm font-semibold text-white bg-black rounded-lg disabled:pointer-events-none disabled:opacity-70 hover:bg-black/70 dark:bg-white dark:hover:bg-white/70 dark:text-black'
            disabled={loading}
            onClick={redeem}
          >
            Redeem
          </button>
        </div>

        <h2 className='mt-12 text-sm text-center text-tertiary'>
          Don{'\''}t worry if you don{'\''}t have a premium code, buy it now!
        </h2>

        <div className='flex flex-col gap-y-2 p-4 backdrop-blur-lg bg-secondary border border-[rgb(var(--bg-quaternary))] h-max w-[380px] rounded-xl'>
          <h1 className='text-base font-bold'>
            Premium
          </h1>

          <div className='flex items-end gap-x-1'>
            <h2 className='text-lg font-bold'>
              $3
            </h2>
            <span className='text-sm font-medium text-tertiary'>
              per month
            </span>
          </div>

          <Link href={config.supportInviteUrl} className='py-2 text-sm font-semibold text-center text-white bg-black rounded-lg disabled:pointer-events-none disabled:opacity-70 hover:bg-black/70 dark:bg-white dark:hover:bg-white/70 dark:text-black'>
            Purchase Now
          </Link>

          <div className='flex flex-col mt-2 gap-y-2'>
            <div className='flex items-center text-sm font-medium gap-x-2 text-secondary'>
              <FaLink />
              Ability to use custom hostnames for your profile.
            </div>
            <div className='flex items-center text-sm font-medium gap-x-2 text-secondary'>
              <LuHeart />
              Premium badge on your profile.
            </div>
            <div className='flex items-center text-sm font-medium gap-x-2 text-secondary'>
              <TbSquareRoundedChevronUp />
              All your servers/bots will get double the votes!
            </div>
            <span className='text-xs italic font-medium text-tertiary'>
              Stay tuned for upcoming benefits! 
            </span>
          </div>
        </div>
      </div>
    </>
  );
}