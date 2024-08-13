import { Text } from '@radix-ui/themes';
import Image from 'next/image';

export default function Unauthorized() {
  return (
    <div className='flex items-center justify-center min-h-[100dvh]'>
      <div className='flex flex-col items-center gap-y-8'>
        <Image
          src='/symbol_white.png'
          alt='Logo'
          width={48}
          height={48}
        />

        <div className='flex flex-col items-center gap-y-2'>
          <Text
            size='4'
            weight='bold'
          >
            Whoops!
          </Text>

          <Text
            size='3'
            color='gray'
          >
            You are not authorized to view this page.
          </Text>
        </div>
      </div>
    </div>
  );
}