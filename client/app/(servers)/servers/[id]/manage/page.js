import getServer from '@/lib/request/servers/getServer';
import getServerMetadata from '@/lib/request/servers/getServerMetadata';
import Content from '@/app/(servers)/servers/[id]/manage/content';
import { redirect } from 'next/navigation';
import AuthProtected from '@/app/components/Providers/Auth/Protected';
import createMetadata from '@/lib/createMetadata';

export async function generateMetadata({ params }) {
  const { id } = await params;

  const metadata = await getServerMetadata(id).catch(error => error);
  if (typeof server === 'string') return;

  return createMetadata({
    title: `Manage ${metadata.name}`
  });
}

export default async function Page({ params }) {
  const { id } = await params;

  const server = await getServer(id).catch(error => error);
  if (typeof server === 'string') return redirect(`/error?message=${encodeURIComponent(server)}`);
  if (server.permissions.canEdit === false) return redirect('/error?code=60001');

  return (
    <AuthProtected>
      <Content server={server} />
    </AuthProtected>
  );
}