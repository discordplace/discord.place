'use client';

import NotCollapsedHeader from '@/app/components/Header/NotCollapsedHeader';
import CollapsedHeader from '@/app/components/Header/CollapsedHeader';
import { useMedia } from 'react-use';

export default function Header() {
  const collapseHeader = useMedia('(max-width: 815px)', false);

  return collapseHeader ? <CollapsedHeader /> : <NotCollapsedHeader />;
}