'use client';

import cn from '@/lib/cn';
import { useState } from 'react';
import { MdChevronLeft } from 'react-icons/md';
import AnimateHeight from 'react-animate-height';
import { motion } from 'framer-motion';

export default function FaQs() {
  const [activeQA, setActiveQA] = useState(0);
  const QA = [
    {
      label: 'What is a Premium Membership?',
      content: 'Premium Membership is a subscription-based service that allows you to access exclusive features and content on our platform.'
    },
    {
      label: 'What is the cost of Premium Membership?',
      content: 'The cost of Premium Membership is $3.00 per month. We also offer a discounted annual subscription for $25.00 per year (save $11.00) and a lifetime subscription for $60.00.'
    },
    {
      label: 'How can I subscribe to Premium Membership?',
      content: 'You can subscribe to Premium Membership by clicking on the "Create Checkout" button on this page. You will be redirected to the checkout page where you can complete the payment process. Once the payment is successful, you will be automatically subscribed to Premium Membership.'
    },
    {
      label: 'Can I request a refund for Premium Membership?',
      content: 'We do not offer refunds for Premium Membership. However, you can cancel your subscription at any time, and you will not be charged for the next billing cycle.'
    },
    {
      label: 'Can I transfer my Premium Membership to another account?',
      content: 'No, Premium Membership is non-transferable.'
    }
  ];

  return QA.map(({ label, content }, index) => (
    <motion.div
      className={cn(
        'overflow-hidden flex flex-col w-full p-3 rounded-md group',
        activeQA === index ? 'bg-quaternary' : 'cursor-pointer bg-secondary hover:bg-tertiary'
      )}
      key={label}
      onClick={() => setActiveQA(index)}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.1 + (index * 0.2) }}
    >
      <div className='flex items-center justify-between overflow-clip'>
        <div className='flex items-center gap-x-4'>
          <span className='text-lg font-bold lg:text-xl'>
            {index + 1}.
          </span>
          <h3 className={cn(
            'text-sm lg:text-base font-medium group-hover:text-primary',
            activeQA === index ? 'text-primary' : 'text-secondary group-hover:text-primary'
          )}>
            {label}
          </h3>
        </div>

        <MdChevronLeft className={cn(
          activeQA === index ? 'rotate-[90deg]' : 'rotate-[-90deg]'
        )} size={20} />
      </div>

      <AnimateHeight
        duration={500}
        animateOpacity={true}
        className='text-sm text-secondary'
        height={activeQA === index ? 'auto' : 0}
      >
        {content}
      </AnimateHeight>
    </motion.div>
  ));
}