import Square from '@/app/components/Background/Square';
import getTopServers from '@/lib/request/getTopServers';
import ServerCard from '@/app/(home)/components/ServerCard';
import InfoCards from '@/app/(home)/components/InfoCards';
import { Suspense } from 'react';
import Heading from '@/app/(home)/components/Heading';
import TrustedByHeading from '@/app/(home)/components/TrustedByHeading';

export default async function Page() {
  const result = await getTopServers().catch(() => null);

  const { data, totalServers } = result || { data: [], totalServers: 0 };

  return (
    <div className="relative z-10 mb-24 flex w-full flex-col items-center">
      <div className='relative flex min-h-[60svh] w-full flex-col items-center'>
        <Square
          column='5'
          row='5'
          transparentEffectDirection='bottomToTop'
          blockColor='rgba(var(--bg-secondary))'
        />

        <div className='absolute left-0 top-0 z-[-1] size-full [background:linear-gradient(180deg,_rgba(168,_85,_247,_0.075)_0%,_transparent_100%)]' />

        <Heading />

        <div className='mt-24 flex w-full max-w-5xl flex-col items-center justify-center gap-y-4'>
          <TrustedByHeading totalServers={totalServers} />

          <div className='flex flex-col flex-wrap justify-center gap-4 sm:flex-row'>
            {data?.map(server => (
              <ServerCard data={server} key={server.id} />
            ))}
          </div>
        </div>
      </div>

      <Suspense fallback={<></>}>
        <InfoCards />
      </Suspense>
    </div>
  );
}