'use client';

import ServerIcon from '@/app/(servers)/servers/components/ServerIcon';
import { Link } from 'next-view-transitions';

export default function ServerCard({ data, setCurrentlyAddingServer }) {
  return (
    data.is_created ? (
      <Link href={`/servers/${data.id}`} className="flex flex-col bg-tertiary hover:bg-quaternary p-2 rounded-xl w-full h-[180px] items-center cursor-pointer relative overflow-clip">
        <div className='uppercase text-xs absolute py-1 -right-6 top-0 rounded-md rotate-[25deg] font-bold bg-indigo-500 text-white w-[120px] text-center'>
          Listed
        </div>
        
        <ServerIcon width={128} height={128} icon_url={data.icon_url} name={data.name} />

        <h1 className="w-full max-w-full mt-2 text-base font-medium text-center truncate">{data.name}</h1>
      </Link>
    ) : (
      <button className="flex flex-col bg-secondary hover:bg-tertiary p-2 rounded-xl w-full h-[180px] items-center cursor-pointer relative overflow-clip" onClick={() => setCurrentlyAddingServer(data)}>
        <div className='uppercase text-xs absolute py-1 -right-6 top-0 rounded-md rotate-[25deg] font-bold bg-orange-500 text-white w-[120px] text-center'>
          Not Listed
        </div>

        <ServerIcon width={128} height={128} icon_url={data.icon_url} name={data.name} />

        <h1 className="w-full max-w-full mt-2 text-base font-medium text-center truncate">{data.name}</h1>
      </button>
    )
  );
}