'use client';

import Square from '@/app/components/Background/Square';
import cn from '@/lib/cn';
import { Bricolage_Grotesque } from 'next/font/google';
import { Source_Serif_4 } from 'next/font/google';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaCheck, FaXmark } from 'react-icons/fa6';
import { FaDiscord } from 'react-icons/fa';
import useAuthStore from '@/stores/auth';
import createCheckout from '@/lib/request/auth/createCheckout';
import { toast } from 'sonner';
import { useRouter } from 'next-nprogress-bar';
import config from '@/config';
import { TbLoader } from 'react-icons/tb';
import fuc from '@/lib/fuc';
import { IoCheckmarkCircle } from 'react-icons/io5';
import FaQs from '@/app/premium/components/FaQs';
import { LuShieldQuestion } from 'react-icons/lu';
import Tooltip from '@/app/components/Tooltip';
import { BiSolidInfoCircle } from 'react-icons/bi';

const BricolageGrotesque = Bricolage_Grotesque({ subsets: ['latin'] });
const SourceSerif4 = Source_Serif_4({ subsets: ['latin'] });

export default function Page({ plans }) {
  const loggedIn = useAuthStore(state => state.loggedIn);
  const user = useAuthStore(state => state.user);

  const sequenceTransition = {
    duration: 0.25,
    type: 'spring',
    stiffness: 260,
    damping: 20
  };

  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.15,
        when: 'beforeChildren',
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: -25
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: sequenceTransition
    }
  };

  const billingCycles = ['monthly', 'annual', 'lifetime'];
  const [preferredBillingCycle, setPreferredBillingCycle] = useState('annual');

  const features = [
    {
      label: 'Exclusive Premium Badge',
      info: 'Show off your Premium status with an exclusive badge on your bots/servers & profile.',
      available_to: [
        {
          id: 'free',
          value: <FaXmark />
        },
        {
          id: 'premium',
          value: <FaCheck />
        }
      ]
    },
    {
      label: 'Exclusive Premium Role',
      info: 'Unlock the exclusive Premium role in our Discord server.',
      available_to: [
        {
          id: 'free',
          value: <FaXmark />
        },
        {
          id: 'premium',
          value: <FaCheck />
        }
      ]
    },
    {
      label: 'Stunning Card Effects',
      info: 'Get a exclusive card effects for your servers/bots/profile cards.',
      available_to: [
        {
          id: 'free',
          value: <FaXmark />
        },
        {
          id: 'premium',
          value: <FaCheck />
        }
      ]
    },
    {
      label: 'Premium Preferred Hosts',
      info: 'Ability to use dsc.wtf, dsc.mom, dsc.dog hostnames for your profile.',
      available_to: [
        {
          id: 'free',
          value: <FaXmark />
        },
        {
          id: 'premium',
          value: <FaCheck />
        }
      ]
    },
    {
      label: 'Profile Card Colors',
      info: 'Customize your profile card with a variety of colors.',
      available_to: [
        {
          id: 'free',
          value: <FaXmark />
        },
        {
          id: 'premium',
          value: <FaCheck />
        }
      ]
    },
    {
      label: 'Doubled Votes',
      info: 'When someone votes for your server/bot, votes will be doubled.',
      available_to: [
        {
          id: 'free',
          value: <FaXmark />
        },
        {
          id: 'premium',
          value: <FaCheck />
        }
      ]
    },
    {
      label: 'Vote Rewards Limit (per server)',
      info: 'Maximum amount of vote rewards you can create per server.',
      available_to: [
        {
          id: 'free',
          value: '5'
        },
        {
          id: 'premium',
          value: '20'
        }
      ]
    },
    {
      label: 'Links Limit',
      info: 'Maximum amount of links you can create.',
      available_to: [
        {
          id: 'free',
          value: '1'
        },
        {
          id: 'premium',
          value: '5'
        }
      ]
    }
  ];

  const currentPlanId = loggedIn ? user.premium?.planId : null;
  const lifetimePlan = plans.find(plan => !plan.price_formatted.includes('month') && !plan.price_formatted.includes('year'));
  const annualPlan = plans.find(plan => plan.price_formatted.includes('year'));
  const monthlyPlan = plans.find(plan => plan.price_formatted.includes('month'));  

  const actualAnnualPrice = monthlyPlan.price * 12;
  const savePercentage = `${(((actualAnnualPrice - annualPlan.price) / actualAnnualPrice) * 100).toFixed(1)}%`;

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function purchase() {
    setLoading(true);

    const planIdToPurchase = preferredBillingCycle === 'monthly' ? monthlyPlan.id : preferredBillingCycle === 'annual' ? annualPlan.id : lifetimePlan.id;

    toast.promise(createCheckout(planIdToPurchase), {
      loading: 'Creating checkout..',
      success: data => {
        setTimeout(() => window.location.href = data.url, 3000);

        return 'Checkout created successfully. You will be redirected to the payment page after a few seconds.';
      },
      error: message => {
        setLoading(false);

        return message;
      }
    });
  }

  return (
    <div className="z-0 relative flex flex-col pt-[14rem] items-center px-4 lg:px-0">
      <Square column='10' row='10' transparentEffectDirection='bottomToTop' blockColor='rgba(var(--bg-secondary))' />
      
      <div className='absolute top-[-15%] max-w-[800px] w-full h-[300px] rounded-[5rem] bg-[#ffffff10] blur-[15rem]' />
      
      <div className='max-w-[800px] flex flex-col w-full'>
        <motion.h1 
          className={cn(
            'text-5xl font-medium max-w-[800px] text-center text-primary',
            BricolageGrotesque.className
          )}
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...sequenceTransition }}
        >
          Premium Membership
        </motion.h1>

        <motion.span className="sm:text-lg max-w-[800px] text-center mt-8 text-neutral-400" initial={{ opacity: 0, y: -25 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sequenceTransition, delay: 0.1 }}>
          Unlock exclusive features and benefits by purchasing Premium. With annual & lifetime plans, you can save more!
        </motion.span>
      </div>

      <motion.div
        className='max-w-[800px] grid grid-cols-1 sm:grid-cols-3 mt-16 gap-4 w-full'
        initial='hidden'
        animate='visible'
        variants={containerVariants}
      >
        {billingCycles.map(cycle => (
          <motion.div 
            key={cycle}
            className={cn(
              'select-none flex items-center w-full gap-x-2 p-4 rounded-lg',
              preferredBillingCycle === cycle ? 'bg-purple-500/5 border-2 border-purple-500/20' : 'border-2 border-primary bg-secondary hover:bg-tertiary cursor-pointer'
            )}
            onClick={() => setPreferredBillingCycle(cycle)}
            variants={itemVariants}
          >
            <span className={cn(
              'w-[15px] h-[15px] rounded-full border-4',
              preferredBillingCycle === cycle ? 'bg-white border-purple-500' : 'border-primary'
            )} />
        
            <div className='flex items-center gap-x-2'>
              <h2 className='text-base font-semibold'>
                {fuc(cycle)}
              </h2>

              <div className='flex flex-col text-xs font-medium gap-y-0.5'>
                {cycle === 'annual' && (
                  <span 
                    className={cn(
                      'text-purple-500',
                      SourceSerif4.className
                    )}
                  >
                    Save {savePercentage}
                  </span>
                )}

                {currentPlanId === (cycle === 'monthly' ? monthlyPlan.id : cycle === 'annual' ? annualPlan.id : lifetimePlan.id) && (
                  <span 
                    className={cn(
                      'text-purple-500 flex items-center gap-x-1',
                      SourceSerif4.className
                    )}
                  >
                    Current Plan <IoCheckmarkCircle />
                  </span>
                )}

                <span className='text-tertiary'>
                  {cycle === 'monthly' ? monthlyPlan.price_formatted : cycle === 'annual' ? annualPlan.price_formatted : lifetimePlan.price_formatted}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className='w-full max-w-[800px] my-12'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...sequenceTransition, delay: 0.8 }}
      >
        <div className='flex flex-col w-full gap-y-2'>
          <div className='flex items-center justify-between'>
            <span className='flex w-full text-sm font-semibold sm:text-lg text-primary'>
              Feature Highlights
            </span>

            <span className='flex justify-center w-full text-sm font-medium text-tertiary'>
              Free
            </span>

            <span className='flex justify-center w-full text-sm font-medium text-yellow-600 dark:text-yellow-500 text-tertiary'>
              Premium
            </span>
          </div>

          <div className='w-full h-[1px] bg-tertiary my-2' />

          <div className='flex flex-col'>
            {features.map((feature, index) => (
              <div
                className='flex items-center justify-between p-4 even:bg-tertiary odd:bg-secondary first:rounded-t-xl last:rounded-b-xl'
                key={index}
              >
                <h2 className='flex items-center w-full text-sm font-semibold gap-x-2 text-tertiary'>
                  {feature.label}

                  {feature.info && (
                    <Tooltip
                      side='left'
                      content={feature.info}
                    >
                      <div>
                        <BiSolidInfoCircle
                          className='text-tertiary'
                          size={18}
                        />
                      </div>
                    </Tooltip>
                  )}
                </h2>
                
                <div className='flex justify-center w-full text-sm font-medium text-tertiary'>
                  {feature.available_to.find(item => item.id === 'free').value}
                </div>

                <div className='flex justify-center w-full text-sm font-medium text-yellow-600 dark:text-yellow-500 text-tertiary'>
                  {feature.available_to.find(item => item.id === 'premium').value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {!currentPlanId && (
          <div
            className={cn(
              'flex items-center justify-center w-full py-2 mt-4 font-semibold text-center text-white bg-purple-500 rounded-lg cursor-pointer hover:bg-purple-600 gap-x-2',
              loading && 'pointer-events-none opacity-70'
            )}
            onClick={loggedIn ? purchase : () => router.push(config.getLoginURL('/premium'))}
          >
            {loading && (
              <TbLoader className='animate-spin' size={20} />
            )}

            {loggedIn ? (
              <>
                Purchase Premium
              </>
            ) : (
              <>
                <FaDiscord size={20} />
                Login to Purchase
              </>
            )}
          </div>
        )}
      </motion.div>

      <motion.div 
        className='flex flex-col w-full mb-12 gap-y-2 max-w-[800px]'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...sequenceTransition, duration: 0.5, delay: 1 }}
      >
        <h2 className='flex items-center mt-4 text-lg font-semibold sm:text-xl gap-x-1'>
          <LuShieldQuestion />
          Frequently Asked Questions
        </h2>

        <p className='mb-4 text-sm text-tertiary'>
          Have a question? Check out our FAQ section below.
        </p>

        <FaQs />
      </motion.div>
    </div>
  );
}