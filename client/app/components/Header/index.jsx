'use client';

import CollapsedHeader from '@/app/components/Header/CollapsedHeader';
import NotCollapsedHeader from '@/app/components/Header/NotCollapsedHeader';
import { usePathname } from 'next/navigation';
import { useMedia } from 'react-use';

export default function Header() {
  const collapseHeader = useMedia('(max-width: 1205px)', false);
  const pathname = usePathname();

  const isDashboard = pathname === '/dashboard';
  const isTemplatePreview = pathname.startsWith('/templates/') && pathname.endsWith('/preview');
  const isAccount = pathname === '/account';

  if (isDashboard || isTemplatePreview || isAccount) return null;

  return collapseHeader ? <CollapsedHeader pathname={pathname} /> : <NotCollapsedHeader pathname={pathname} />;
}