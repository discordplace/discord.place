'use client';

import Image from 'next/image';
import { Link } from 'next-view-transitions';

export default function ServerCard({ data }) {
  return (
    data.verified ? (
      <Link href={`/bots/${data.id}`} className="flex flex-col bg-tertiary hover:bg-quaternary p-2 rounded-xl w-full h-[180px] items-center cursor-pointer relative overflow-clip">
        <div className='uppercase text-xs absolute py-1 -right-6 top-0 rounded-md rotate-[25deg] font-bold bg-indigo-500 text-white w-[120px] text-center'>
          Verified
        </div>
        
        <Image
          src={data.avatar_url}
          alt={`${data.username} bot icon`}
          width={128}
          height={128}
          className='rounded-lg'
        />

        <h1 className="w-full max-w-full mt-2 text-base font-medium text-center truncate">{data.username}#{data.discriminator}</h1>
      </Link>
    ) : (
      <Link href={`/bots/${data.id}`} className="flex flex-col bg-tertiary hover:bg-quaternary p-2 rounded-xl w-full h-[180px] items-center cursor-pointer relative overflow-clip">
        <div className='uppercase text-xs absolute py-1 -right-6 top-0 rounded-md rotate-[25deg] font-bold bg-orange-500 text-white w-[120px] text-center'>
          Not Verified
        </div>

        <Image
          src={data.avatar_url}
          alt={`${data.username} bot icon`}
          width={128}
          height={128}
          className='rounded-lg'
        />

        <h1 className="w-full max-w-full mt-2 text-base font-medium text-center truncate">{data.username}#{data.discriminator}</h1>
      </Link>
    )
  );
}