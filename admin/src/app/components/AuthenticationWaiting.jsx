import { Spinner, Text } from '@radix-ui/themes';
import Image from 'next/image';

export default function AuthenticationWaiting() {
  return (
    <div className='flex items-center justify-center min-h-[100dvh]'>
      <div className='flex flex-col items-center gap-y-8'>
        <Image
          src='/symbol_white.png'
          alt='Logo'
          width={48}
          height={48}
        />

        <div className="flex items-center gap-x-4">
          <Spinner />

          <Text
            size='3'
            color='gray'
          >
            Waiting for authentication..
          </Text>
        </div>
      </div>
    </div>
  );
}