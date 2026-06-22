import { headers, cookies } from 'next/headers';
import config from '@/config';

export default async function getLocale() {
  const h = await headers();
  const c = await cookies();

  const userLocale = c.get('language')?.value;
  if (userLocale) {
    const locale = config.availableLocales.find(l => l.code === userLocale);
    if (locale) return locale;
  }

  const languages = h.get('accept-language')?.split(',').map(lang => lang.split(';')[0].split('-')[0].toLowerCase()) ?? [];

  const browserLocale = config.availableLocales.find(locale => languages.includes(locale.code));
  if (browserLocale) return browserLocale;

  return config.availableLocales.find(locale => locale.default);
}