'use client';

import Actions from '@/app/(servers)/servers/[id]/components/sections/RightSide/Actions';
import Keywords from '@/app/(servers)/servers/[id]/components/sections/RightSide/Keywords';

export default function RightSide({ server }) {
  return (
    <div className='flex w-full flex-col lg:w-[30%]'>
      <Actions server={server} />
      <Keywords server={server} />
    </div>
  );
}