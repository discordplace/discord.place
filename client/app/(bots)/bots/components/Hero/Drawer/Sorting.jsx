'use client';

import cn from '@/lib/cn';
import { nanoid } from 'nanoid';
import { IoMdCheckmarkCircle } from 'react-icons/io';
import { Drawer } from 'vaul';
import { FaCompass } from "react-icons/fa";
import { TbSquareRoundedChevronUp } from 'react-icons/tb';
import { HiSortAscending, HiSortDescending } from 'react-icons/hi';
import { TiStar } from 'react-icons/ti';

export default function SortingDrawer({ openState, setOpenState, state, setState }) {
  const sortings = {
    'Votes': <TbSquareRoundedChevronUp />,
    'Servers': <FaCompass />,
    'Most Reviewed': <TiStar />,
    'Newest': <HiSortAscending />,
    'Oldest': <HiSortDescending />
  };

  return (
    <Drawer.Root shouldScaleBackground={true} closeThreshold={0.5} open={openState} onOpenChange={setOpenState}>
      <Drawer.Portal>
        <Drawer.Content className='outline-none gap-y-1 p-4 z-[10001] bg-secondary flex flex-col rounded-t-3xl h-[85%] fixed bottom-0 left-0 right-0'>
          <div className='mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-quaternary mb-8' />

          {Object.keys(sortings).map(sort => (
            <button
              key={nanoid()}
              onClick={() => {
                setState(sort);
                setOpenState(false);
              }}
              className={cn(
                'flex items-center justify-between px-4 py-3 text-base font-medium rounded-lg disabled:pointer-events-none',
                state === sort ? 'pointer-events-none bg-quaternary text-primary' : 'hover:bg-quaternary text-tertiary hover:text-primary'
              )}
            >
              <span className='flex items-center gap-x-2'>
                {sortings[sort]}
                {sort}
              </span>
              {state === sort && <IoMdCheckmarkCircle />}
            </button>
          ))}
        </Drawer.Content>
        <Drawer.Overlay className='fixed inset-0 bg-white/40 dark:bg-black/40 z-[10000]' />
      </Drawer.Portal>
    </Drawer.Root>
  );
}