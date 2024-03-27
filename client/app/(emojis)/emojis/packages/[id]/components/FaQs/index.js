'use client';

import cn from '@/lib/cn';
import { useState } from 'react';
import { MdChevronLeft } from 'react-icons/md';
import Question1 from '@/app/(emojis)/emojis/packages/[id]/components/FaQs/Questions/1';
import Question2 from '@/app/(emojis)/emojis/packages/[id]/components/FaQs/Questions/2';
import Question3 from '@/app/(emojis)/emojis/packages/[id]/components/FaQs/Questions/3';
import AnimateHeight from 'react-animate-height';

export default function FaQs({ emoji }) {
  const [activeQA, setActiveQA] = useState(0);
  const QA = [
    {
      label: 'How can I download the emoji pack?',
      content: <Question1 emoji={emoji} />
    },
    {
      label: 'How can I add the emoji pack to my Discord server?',
      content: <Question2 emoji={emoji} />
    },
    {
      label: 'This emoji pack is inappropriate. What can I do?',
      content: <Question3 />
    }
  ];

  return QA.map(({ label, content }, index) => (
    <div 
      className={cn(
        'overflow-hidden flex flex-col w-full p-3 rounded-md group',
        activeQA === index ? 'bg-quaternary' : 'cursor-pointer bg-secondary hover:bg-tertiary'
      )}
      key={label}
      onClick={() => setActiveQA(index)}
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
    </div>
  ));
}