'use client';

import '@/lib/i18n';

import i18n from 'i18next';
import { I18nextProvider } from 'react-i18next';

export default function I18nProvider({ children }) {
  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
}