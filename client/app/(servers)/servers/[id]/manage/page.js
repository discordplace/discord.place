import getServer from '@/lib/request/servers/getServer';
import getServerMetadata from '@/lib/request/servers/getServerMetadata';
import Content from '@/app/(servers)/servers/[id]/manage/content';
import { redirect } from 'next/navigation';
import AuthProtected from '@/app/components/Providers/Auth/Protected';

export async function generateMetadata({ params }) {
  const metadata = await getServerMetadata(params.id).catch(error => error);
  if (typeof server === 'string') return;

  return {
    title: `Manage ${metadata.name}`,
    openGraph: {
      title: `Discord Place - Manage ${metadata.name}`
    }
  };
}

export default async function Page({ params }) {
  const server = await getServer(params.id).catch(error => error);
  if (typeof server === 'string') return redirect(`/error?message=${encodeURIComponent(server)}`);
  if (server.permissions.canEdit === false) return redirect('/error?code=60001');

  return (
    <AuthProtected>
      <Content server={server} />
    </AuthProtected>
  );
}