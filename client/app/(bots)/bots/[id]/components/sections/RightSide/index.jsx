'use client';

import Actions from '@/app/(bots)/bots/[id]/components/sections/RightSide/Actions';
import Categories from '@/app/(bots)/bots/[id]/components/sections/RightSide/Categories';

export default function RightSide({ bot }) {
  return (
    <div className='w-full lg:w-[30%] flex flex-col'>
      <Actions bot={bot} />
      <Categories bot={bot} />
    </div>
  );
}