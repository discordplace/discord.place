'use client';

import Actions from '@/app/(servers)/servers/[id]/components/sections/RightSide/Actions';
import Keywords from '@/app/(servers)/servers/[id]/components/sections/RightSide/Keywords';

export default function RightSide({ server }) {
  return (
    <div className='w-full lg:w-[30%] flex flex-col'>
      <Actions server={server} />
      <Keywords server={server} />
    </div>
  );
}