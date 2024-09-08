import fs from 'node:fs';
import matter from 'gray-matter';
import config from '@/config';
import Markdown from '@/app/components/Markdown';
import BackButton from '@/app/(blogs)/blogs/[id]/components/BackButton';
import Header from '@/app/(blogs)/blogs/[id]/components/Header';
import { redirect } from 'next/navigation';

export async function generateMetadata({ params }) {
  if (!fs.existsSync(process.cwd() + `/blogs/${params.id}.md`)) return;

  const source = fs.readFileSync(process.cwd() + `/blogs/${params.id}.md`, 'utf-8');
  const { data } = matter(source);

  return {
    title: data.name,
    description: data.description,
    keywords: ['blog', 'post', ...data.tags],
    openGraph: {
      title: `Discord Place - ${data.name}`,
      description: data.description,
      images: [
        {
          url: `${config.baseUrl}/api/og?data=${encodeURIComponent(JSON.stringify({ type: 'blog', metadata: data }))}`,
          width: 1200,
          height: 630
        }
      ]
    }
  };
}

export default async function Page({ params }) {
  if (!fs.existsSync(process.cwd() + `/blogs/${params.id}.md`)) return redirect('/error?code=90001');

  const source = fs.readFileSync(process.cwd() + `/blogs/${params.id}.md`, 'utf-8');
  const { data, content } = matter(source);

  return (
    <div className='flex items-center justify-center w-full'>
      <div className='flex flex-col w-full max-w-5xl px-4 my-32 mobile:px-8 lg:px-0'>
        <BackButton />

        <Header data={data} />

        <div className='flex items-center justify-center w-full h-full mt-12'>
          <Markdown>
            {content}
          </Markdown>
        </div>
      </div>
    </div>
  );
}
