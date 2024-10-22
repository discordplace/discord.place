'use client';

import Image from 'next/image';
import useLanguageStore from '@/stores/language';

export default function Header({ data }) {
  const language = useLanguageStore(state => state.language);

  return (
    <>
      <div className='my-8 flex w-full flex-col items-center justify-center gap-y-4'>
        <div className='flex gap-x-2'>
          {data.tags.map(tag => (
            <span
              key={tag}
              className='rounded-full bg-tertiary px-4 py-2 text-xs font-medium text-primary'
            >
              {tag}
            </span>
          ))}
        </div>

        <h1 className='max-w-[400px] text-pretty text-center text-2xl font-semibold text-primary'>
          {data.name}
        </h1>

        <span className='flex items-center gap-x-2 text-center text-sm text-tertiary'>
          {new Date(data.date).toLocaleDateString(language, { year: 'numeric', month: 'long', day: 'numeric' })}

          <span className='size-1.5 rounded-full bg-quaternary' />

          {new Date(data.date).toLocaleTimeString(language, { hour: 'numeric', minute: 'numeric' })}
        </span>
      </div>

      <Image
        src={`/blogs/${data.id}.jpg`}
        alt={data.name}
        width={512}
        height={512}
        className='size-full max-h-[440px] rounded-lg bg-tertiary object-cover'
      />
    </>
  );
}