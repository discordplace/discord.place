'use client';

import { MdChevronLeft } from 'react-icons/md';
import cn from '@/lib/cn';
import { useState } from 'react';import AnimateHeight from 'react-animate-height';
import { motion } from 'framer-motion';
import { t } from '@/stores/language';

export default function FaQs() {
  const [activeQA, setActiveQA] = useState(0);
  const QA = [
    {
      content: t('premiumPage.frequentlyAskedQuestions.items.0.content'),
      label: t('premiumPage.frequentlyAskedQuestions.items.0.label')
    },
    {
      content: t('premiumPage.frequentlyAskedQuestions.items.1.content'),
      label: t('premiumPage.frequentlyAskedQuestions.items.1.label')
    },
    {
      content: t('premiumPage.frequentlyAskedQuestions.items.2.content'),
      label: t('premiumPage.frequentlyAskedQuestions.items.2.label')
    },
    {
      content: t('premiumPage.frequentlyAskedQuestions.items.3.content'),
      label: t('premiumPage.frequentlyAskedQuestions.items.3.label')
    },
    {
      content: t('premiumPage.frequentlyAskedQuestions.items.4.content'),
      label: t('premiumPage.frequentlyAskedQuestions.items.4.label')
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
      transition={{ delay: 1.1 + (index * 0.2), duration: 0.5 }}
    >
      <div className='flex items-center justify-between text-clip'>
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
          activeQA === index ? 'rotate-90' : '-rotate-90'
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