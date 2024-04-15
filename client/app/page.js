'use client';

import cn from '@/lib/cn';
import { Source_Serif_4 } from 'next/font/google';
import Square from './components/Background/Square';
import { MdArrowForward } from 'react-icons/md';
import { useRef, useState } from 'react';
import Link from 'next/link';

const SourceSerif4 = Source_Serif_4({ subsets: ['latin'] });

export default function Page() {
  const defaultBlockColor = '#ffffff10';
  const [hoveredBlockColor, setHoveredBlockColor] = useState(defaultBlockColor);

  function Block({ title, desc, to, index, color, disabled }) {
    const blockRef = useRef(null);
    const buttonRef = useRef(null);
    
    return (
      <Link 
        className={cn(
          'w-full sm:h-[200px] bg-secondary/70 flex-col px-4 rounded-lg cursor-pointer transition-colors hover:bg-secondary flex items-center py-3 gap-y-1.5',
          index === 0 && 'rounded-md sm:rounded-l-[2.5rem] sm:rounded-b-md lg:rounded-bl-[2.5rem]',
          index === 1 && 'rounded-md sm:rounded-tr-[2.5rem] lg:rounded-r-md',
          index === 2 && 'rounded-md sm:rounded-bl-[2.5rem] lg:rounded-bl-md',
          index === 3 && 'rounded-md sm:rounded-r-[2.5rem] sm:rounded-t-md lg:rounded-tr-[2.5rem]',
          disabled && 'pointer-events-none bg-secondary/30 select-none'
        )}
        ref={blockRef}
        onMouseEnter={() => {
          setHoveredBlockColor(`${color}15`);
          blockRef.current.style.backgroundColor = `${color}10`;
          buttonRef.current.style.backgroundColor = `${color}80`;
          buttonRef.current.style.color = '#ffffff';
        }}
        onMouseLeave={() => {
          setHoveredBlockColor(defaultBlockColor);
          blockRef.current.style.backgroundColor = 'transparent';
          buttonRef.current.style.backgroundColor = '#ffffff';
          buttonRef.current.style.color = '#000000';
        }}
        href={to}
      >
        <h1 className='mt-3 text-xl font-semibold text-center sm:text-2xl sm:mt-6 text-primary'>{title}</h1>
        <p className='mb-3 text-sm font-medium text-center sm:mb-0 text-tertiary'>{desc}</p>
        <div 
          className={cn(
            'hidden sm:block px-4 py-2 mt-4 text-sm font-semibold text-secondary bg-tertiary rounded-full w-max transition-all duration-200',
            disabled && 'bg-secondary text-tertiary'
          )}
          ref={buttonRef}
        >
          View <MdArrowForward className='inline -rotate-45' />
        </div>
      </Link>
    );
  }

  return (
    <div className="relative z-10 flex flex-col items-center justify-center w-full sm:h-[100dvh] my-8 sm:my-0">      
      <Square column='10' row='10' transparentEffectDirection='bottomToTop' blockColor='rgba(var(--bg-secondary))' />
      
      <h1 className={cn(
        'font-bold cursor-default text-4xl sm:text-7xl mt-32 select-none sm:mt-10',
        SourceSerif4.className
      )}>
        discord.place
      </h1>

      <div className='transition-colors ease-in-out pointer-events-none absolute top-0 max-w-[800px] w-full h-[800px] rounded-full blur-[10rem]' style={{ background: hoveredBlockColor }} />

      <div className='w-full mt-16 max-w-[1000px] px-8 lg:px-0'>
        <div className='grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:flex'>
          <Block 
            title='Profiles' 
            desc='Customized page of Discord profiles.'
            to='/profiles' 
            index={0} 
            color='#3b82f6'
          />
          <Block 
            title='Servers' 
            desc='Best servers and communities on Discord.'
            to='/servers' 
            index={1} 
            color='#7c3aed'
          />
          <Block
            title='Bots'
            desc='This page is currently under development.'
            to='/bots'
            index={2}
            color='#db2777'
            disabled
          />
          <Block
            title='Emojis'
            desc='Perfect emoji for your Discord servers.'
            to='/emojis'
            index={3}
            color='#14b8a6'
          />
        </div>
      </div>

    </div>
  );
}