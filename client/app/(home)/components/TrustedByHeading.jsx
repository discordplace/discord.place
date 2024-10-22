'use client';

import cn from '@/lib/cn';
import { t } from '@/stores/language';
import { Bricolage_Grotesque } from 'next/font/google';

const BricolageGrotesque = Bricolage_Grotesque({ adjustFontFallback: false, display: 'swap', subsets: ['latin'] });

export default function TrustedByHeading({ totalServers }) {
  return (
    <p
      className={cn(
        'text-sm text-tertiary',
        BricolageGrotesque.className
      )}
    >
      {t('home.trustedByHeading', { totalServers: <strong>{Math.round(totalServers / 10) * 10}+</strong> })}
    </p>
  );
}