'use client';

import cn from '@/lib/cn';
import { Bricolage_Grotesque } from 'next/font/google';
import { useTranslation } from 'react-i18next';

const BricolageGrotesque = Bricolage_Grotesque({ adjustFontFallback: false, display: 'swap', subsets: ['latin'] });

export default function TrustedByHeading({ totalServers }) {
  const { t } = useTranslation();

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