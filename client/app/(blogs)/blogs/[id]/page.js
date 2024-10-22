import BackButton from '@/app/(blogs)/blogs/[id]/components/BackButton';
import Header from '@/app/(blogs)/blogs/[id]/components/Header';
import Markdown from '@/app/components/Markdown';
import config from '@/config';
import matter from 'gray-matter';
import { redirect } from 'next/navigation';
import fs from 'node:fs';

export async function generateMetadata({ params }) {
  if (!fs.existsSync(`${process.cwd()}/blogs/${params.id}.md`)) return;

  const source = fs.readFileSync(`${process.cwd()}/blogs/${params.id}.md`, 'utf-8');
  const { data } = matter(source);

  return {
    description: data.description,
    keywords: ['blog', 'post', ...data.tags],
    openGraph: {
      description: data.description,
      images: [
        {
          height: 630,
          url: `${config.baseUrl}/api/og?data=${encodeURIComponent(JSON.stringify({ metadata: data, type: 'blog' }))}`,
          width: 1200
        }
      ],
      title: `Discord Place - ${data.name}`
    },
    title: data.name
  };
}

export default async function Page({ params }) {
  if (!fs.existsSync(`${process.cwd()}/blogs/${params.id}.md`)) return redirect('/error?code=90001');

  const source = fs.readFileSync(`${process.cwd()}/blogs/${params.id}.md`, 'utf-8');
  const { content, data } = matter(source);

  return (
    <div className='flex w-full items-center justify-center'>
      <div className='my-32 flex w-full max-w-5xl flex-col px-4 mobile:px-8 lg:px-0'>
        <BackButton />

        <Header data={data} />

        <div className='mt-12 flex size-full items-center justify-center'>
          <Markdown rawEnabled={true}>
            {content}
          </Markdown>
        </div>
      </div>
    </div>
  );
}
