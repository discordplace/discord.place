import { FaDiscord } from '@/icons';
import { usePathname } from 'next/navigation';
import config from '@/config';
import Link from 'next/link';
export default function LoginButton() {
  const pathname = usePathname();

  return (
    <Link
      href={config.getLoginURL(pathname)}
      className='mt-4 flex items-center justify-center gap-x-1.5 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/70 disabled:pointer-events-none disabled:opacity-70 dark:bg-white dark:text-black dark:hover:bg-white/70'
    >
      <FaDiscord className='size-5' />
      Login with Discord
    </Link>
  );
}