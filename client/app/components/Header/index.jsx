'use client';

import NotCollapsedHeader from '@/app/components/Header/NotCollapsedHeader';
import CollapsedHeader from '@/app/components/Header/CollapsedHeader';
import { useMedia } from 'react-use';
import { usePathname } from 'next/navigation';

export default function Header() {
  const collapseHeader = useMedia('(max-width: 1205px)', false);
  const pathname = usePathname();

  if (pathname === '/dashboard') return null;

  return collapseHeader ? <CollapsedHeader pathname={pathname} /> : <NotCollapsedHeader pathname={pathname} />;
}