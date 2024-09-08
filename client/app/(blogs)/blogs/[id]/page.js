import fs from 'node:fs';
import matter from 'gray-matter';
import config from '@/config';
import Markdown from '@/app/components/Markdown';
import BackButton from '@/app/(blogs)/blogs/[id]/components/BackButton';
import Header from '@/app/(blogs)/blogs/[id]/components/Header';

export async function generateMetadata({ params }) {
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
