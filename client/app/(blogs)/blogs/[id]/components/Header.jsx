'use client';

import Image from 'next/image';
import useLanguageStore from '@/stores/language';

export default function Header({ data }) {
  const language = useLanguageStore(state => state.language);

  return (
    <>
      <div className='flex flex-col items-center justify-center w-full my-8 gap-y-4'>
        <div className='flex gap-x-2'>
          {data.tags.map(tag => (
            <span
              key={tag}
              className='px-4 py-2 text-xs font-medium rounded-full text-primary bg-tertiary'
            >
              {tag}
            </span>
          ))}
        </div>

        <h1 className='text-2xl font-medium text-center max-w-[400px] text-pretty text-primary'>
          {data.name}
        </h1>

        <span className='flex items-center text-sm text-center text-tertiary gap-x-2'>
          {new Date(data.date).toLocaleDateString(language, { year: 'numeric', month: 'long', day: 'numeric' })}
            
          <span className='w-1.5 h-1.5 rounded-full bg-quaternary' />
            
          {new Date(data.date).toLocaleTimeString(language, { hour: 'numeric', minute: 'numeric'})}
        </span>
      </div>

      <Image
        src={`/blogs/${data.id}.jpg`}
        alt={data.name}
        width={512}
        height={512}
        className='bg-tertiary w-full h-full max-h-[440px] object-cover rounded-lg'
      />
    </>
  );
}