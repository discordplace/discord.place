'use client';

import cn from '@/lib/cn';
import { Bricolage_Grotesque } from 'next/font/google';
import { t } from '@/stores/language';

const BricolageGrotesque = Bricolage_Grotesque({ subsets: ['latin'], display: 'swap', adjustFontFallback: false });

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