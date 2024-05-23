import { usePathname } from 'next/navigation';
import config from '@/config';
import Link from 'next/link';
import { FaDiscord } from 'react-icons/fa';

export default function LoginButton() {
  const pathname = usePathname();

  return (
    <Link
      href={config.getLoginURL(pathname)}
      className='flex gap-x-1.5 items-center justify-center px-4 py-2 mt-4 text-sm font-semibold text-white bg-black rounded-lg dark:text-black dark:bg-white dark:hover:bg-white/70 hover:bg-black/70 disabled:pointer-events-none disabled:opacity-70'
    >
      <FaDiscord className='w-5 h-5' />
      Login with Discord
    </Link>
  );
}