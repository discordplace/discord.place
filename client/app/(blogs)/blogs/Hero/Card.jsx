import Link from 'next/link';
import Image from 'next/image';

export default function BlogCard({ data, loading }) {
  if (loading) return (
    <div className='flex flex-col animate-pulse bg-secondary rounded-xl gap-y-3 w-full h-[312px] max-w-[calc(33%_-_2rem)]' />
  );

  return (
    <Link
      className='flex flex-col h-full gap-y-3 w-full max-w-full sm:max-w-[calc(50%_-_2rem)] lg:max-w-[calc(33%_-_2rem)] hover:opacity-80 transition-opacity'
      href={`/blogs/${data.id}`}
    >
      <div className='relative'>
        <Image
          src={`/blogs/${data.id}.jpg`}
          alt={data.name}
          width={400}
          height={200}
          className='object-cover w-full rounded-xl h-[200px]'
        />

        <div className='absolute top-0 left-0 w-full h-full bg-black/50 rounded-xl' />

        <div className='absolute left-4 top-4'>
          {data.tags.map(tag => (
            <span
              key={tag}
              className='px-3 py-1.5 text-xs rounded-full text-white bg-black/70 font-semibold'
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <h2 className='font-medium whitespace-nowrap line-clamp-1 text-pretty text text-primary'>
        {data.name}
      </h2>
      
      <p className='text-sm whitespace-pre-wrap text-tertiary line-clamp-3'>
        {data.description}
      </p>
    </Link>
  );
}