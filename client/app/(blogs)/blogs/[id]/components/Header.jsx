'use client';

import useLanguageStore from '@/stores/language';
import Image from 'next/image';

export default function Header({ data }) {
  const language = useLanguageStore(state => state.language);

  return (
    <>
      <div className='my-8 flex w-full flex-col items-center justify-center gap-y-4'>
        <div className='flex gap-x-2'>
          {data.tags.map(tag => (
            <span
              className='rounded-full bg-tertiary px-4 py-2 text-xs font-medium text-primary'
              key={tag}
            >
              {tag}
            </span>
          ))}
        </div>

        <h1 className='max-w-[400px] text-pretty text-center text-2xl font-semibold text-primary'>
          {data.name}
        </h1>

        <span className='flex items-center gap-x-2 text-center text-sm text-tertiary'>
          {new Date(data.date).toLocaleDateString(language, { day: 'numeric', month: 'long', year: 'numeric' })}

          <span className='size-1.5 rounded-full bg-quaternary' />

          {new Date(data.date).toLocaleTimeString(language, { hour: 'numeric', minute: 'numeric' })}
        </span>
      </div>

      <Image
        alt={data.name}
        className='size-full max-h-[440px] rounded-lg bg-tertiary object-cover'
        height={512}
        src={`/blogs/${data.id}.jpg`}
        width={512}
      />
    </>
  );
}