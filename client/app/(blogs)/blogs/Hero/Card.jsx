import Link from 'next/link';
import Image from 'next/image';

export default function BlogCard({ data, loading }) {
  if (loading) return (
    <div className='flex h-[312px] w-full max-w-[calc(33%_-_2rem)] animate-pulse flex-col gap-y-3 rounded-xl bg-secondary' />
  );

  return (
    <Link
      className='flex size-full max-w-full flex-col gap-y-3 transition-opacity hover:opacity-80 sm:max-w-[calc(50%_-_2rem)] lg:max-w-[calc(33%_-_2rem)]'
      href={`/blogs/${data.id}`}
    >
      <div className='relative'>
        <Image
          src={`/blogs/${data.id}.jpg`}
          alt={data.name}
          width={400}
          height={200}
          className='h-[200px] w-full rounded-xl object-cover'
        />

        <div className='absolute left-0 top-0 size-full rounded-xl bg-black/50' />

        <div className='absolute left-4 top-4'>
          {data.tags.map(tag => (
            <span
              key={tag}
              className='rounded-full bg-black/70 px-3 py-1.5 text-xs font-semibold text-white'
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <h2 className='line-clamp-1 whitespace-nowrap text-pretty font-medium text-primary'>
        {data.name}
      </h2>

      <p className='line-clamp-3 whitespace-pre-wrap text-sm text-tertiary'>
        {data.description}
      </p>
    </Link>
  );
}